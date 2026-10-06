import config from '../config/config';

export interface PortionVariant {
  label: string;
  price: number;
  isAvailable?: boolean;
}

export interface AddonOption {
  _id?: string;
  label: string;
  price: number;
  isAvailable?: boolean;
}

export interface AddonGroup {
  _id?: string;
  groupName: string;
  isRequired?: boolean;
  allowMultiple?: boolean;
  maxSelectable?: number;
  options: AddonOption[];
}

export interface RestaurantDish {
  _id: string;
  restaurant?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  vegFlag: 'veg' | 'non_veg' | 'egg';
  category: string;
  basePrice: number;
  variants: PortionVariant[];
  addonGroups?: AddonGroup[];
  isAvailable: boolean;
  inStock?: boolean;
  isBestseller?: boolean;
  isRecommended?: boolean;
  preparationTimeMinutes?: number;
  tags?: string[];
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantProfile {
  _id: string;
  name: string;
  phone: string;
  ownerName: string;
  type?: string;
  cuisineTypes?: string[];
  branchEmail?: string;
  restaurantFrontImage?: string;
  ownerPhoto?: string;
  openingTime?: string;
  closingTime?: string;
  fssaiNumber?: string;
  fssaiVerified?: boolean;
  status: 'pending' | 'approved' | 'rejected' | string;
  isOpen?: boolean;
  isLive?: boolean;
  storeStatus?: string;
  deliveryMode?: string;
  address: {
    street?: string;
    area?: string;
    city?: string;
    pincode?: string;
    state?: string;
  };
}

export interface CreateRestaurantDishData {
  name: string;
  description?: string;
  category: string;
  vegFlag: 'veg' | 'non_veg' | 'egg';
  basePrice: number;
  variants?: PortionVariant[];
  preparationTimeMinutes?: number;
  isBestseller?: boolean;
  isRecommended?: boolean;
  imageUrl?: string;
}

export interface AdminMenuCategory {
  _id?: string;
  name: string;
  image?: string;
  cuisineType?: string;
  sortOrder?: number;
}

/**
 * Verify Restaurant ID and obtain session/menu access.
 * Validates the restaurant directly against the DoKirana Eats catalog,
 * ensuring no "Branch not found" error is ever displayed.
 */
export const verifyAndLoginAsRestaurant = async (restaurantId: string): Promise<{
  restaurant: RestaurantProfile;
  accessToken: string;
  refreshToken?: string;
}> => {
  const cleanId = restaurantId.trim();
  if (!cleanId) {
    throw new Error('Please enter a valid Restaurant ID.');
  }

  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);

  // 1. First, verify the restaurant exists via the Eats restaurant catalog
  let restaurantDoc: RestaurantProfile | null = null;
  try {
    const checkRes = await fetch(`${config.api.baseUrl}/api/eats/customer/restaurants/${cleanId}/menu`);
    const checkData = await checkRes.json();
    if (checkRes.ok && (checkData.status === 'SUCCESS' || checkData.status === 'success') && checkData.restaurant) {
      restaurantDoc = checkData.restaurant;
    }
  } catch (err) {
    console.warn('[RestaurantService] Public restaurant verification probe error:', err);
  }

  // 2. Attempt login-as-restaurant / login-as-branch for impersonation tokens
  let sessionToken = adminToken || '';
  let refreshToken: string | undefined = undefined;

  if (adminToken) {
    try {
      let loginRes = await fetch(`${config.api.baseUrl}/api/admin/auth/login-as-restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ branchId: cleanId, restaurantId: cleanId }),
      });

      if (!loginRes.ok && loginRes.status === 404) {
        loginRes = await fetch(`${config.api.baseUrl}/api/admin/auth/login-as-branch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ branchId: cleanId }),
        });
      }

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        if (loginData.data) {
          if (!restaurantDoc) {
            restaurantDoc = loginData.data.branch || loginData.data.restaurant;
          }
          if (loginData.data.accessToken) {
            sessionToken = loginData.data.accessToken;
            refreshToken = loginData.data.refreshToken;
          }
        }
      }
    } catch (loginErr) {
      console.warn('[RestaurantService] Impersonation login attempt:', loginErr);
    }
  }

  // 3. If restaurant could not be found anywhere, throw Restaurant ID error
  if (!restaurantDoc) {
    throw new Error(`Restaurant not found for Restaurant ID "${cleanId}". Please check the ID in AdminJS under "Restaurants & Hotels" and try again.`);
  }

  // Store active restaurant session credentials
  if (sessionToken) {
    localStorage.setItem('eats_accessToken', sessionToken);
  }
  localStorage.setItem('current_managed_restaurant_id', restaurantDoc._id);
  localStorage.setItem('current_managed_restaurant', JSON.stringify(restaurantDoc));

  return {
    restaurant: restaurantDoc,
    accessToken: sessionToken,
    refreshToken,
  };
};

/**
 * Fetch restaurant details by ID (using public menu endpoint or cached profile)
 */
export const getRestaurantDetails = async (restaurantId: string): Promise<RestaurantProfile> => {
  const cleanId = restaurantId.trim();

  // 1. Check local session cache if available
  try {
    const cached = localStorage.getItem('current_managed_restaurant');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && (parsed._id === cleanId || parsed.id === cleanId)) {
        return parsed;
      }
    }
  } catch (_) {}

  // 2. Fetch from reliable public customer menu endpoint (contains full restaurant details without CORS issues)
  try {
    const res = await fetch(`${config.api.baseUrl}/api/eats/customer/restaurants/${cleanId}/menu`);
    if (res.ok) {
      const data = await res.json();
      if (data.restaurant) {
        localStorage.setItem('current_managed_restaurant', JSON.stringify(data.restaurant));
        return data.restaurant;
      }
    }
  } catch (err) {
    console.warn('[RestaurantService] Customer menu profile endpoint error:', err);
  }

  // 3. Fallback to authenticated restaurant profile (standard headers only, no custom X-Restaurant-Id header)
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  const eatsToken = localStorage.getItem('eats_accessToken');
  const token = eatsToken || adminToken;

  if (token) {
    try {
      const res = await fetch(`${config.api.baseUrl}/api/eats/restaurant/profile?restaurantId=${cleanId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        const profile = json.restaurant || json.data?.restaurant || json.data;
        if (profile) return profile;
      }
    } catch (err) {
      console.warn('[RestaurantService] Authenticated profile fetch failed:', err);
    }
  }

  throw new Error(`Could not load restaurant details for Restaurant ID "${cleanId}".`);
};

/**
 * Get all dishes for a restaurant, grouped by category (Standard DkEats implementation)
 */
export const getRestaurantMenu = async (restaurantId: string): Promise<{
  menu: Record<string, RestaurantDish[]>;
  totalItems: number;
  availableItems: number;
}> => {
  const cleanId = restaurantId.trim();
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  const eatsToken = localStorage.getItem('eats_accessToken');
  const token = eatsToken || adminToken;

  let menu: Record<string, RestaurantDish[]> = {};

  // 1. First, fetch from public customer menu endpoint (guaranteed available, no CORS issues)
  try {
    const publicRes = await fetch(`${config.api.baseUrl}/api/eats/customer/restaurants/${cleanId}/menu`);
    if (publicRes.ok) {
      const publicData = await publicRes.json();
      if (publicData.menu && typeof publicData.menu === 'object') {
        menu = publicData.menu;
      }
    }
  } catch (fbErr) {
    console.warn('[RestaurantService] Public menu fetch attempt:', fbErr);
  }

  // 2. If empty or partner token is available, check direct menu items endpoint
  if (Object.keys(menu).length === 0 && token) {
    try {
      const res = await fetch(`${config.api.baseUrl}/api/eats/menu/items?restaurantId=${cleanId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.menu) {
          menu = data.menu;
        }
      }
    } catch (err) {
      console.warn('[RestaurantService] Direct menu items endpoint failed:', err);
    }
  }

  const allItems: RestaurantDish[] = Object.values(menu).flat();
  const totalItems = allItems.length;
  const availableItems = allItems.filter(item => item.isAvailable).length;

  return {
    menu,
    totalItems,
    availableItems,
  };
};

/**
 * Update dish details (Product Update Access Only - No delete access)
 */
export const updateRestaurantDish = async (
  dishId: string,
  updates: Partial<RestaurantDish>,
  restaurantId?: string
): Promise<RestaurantDish> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  const eatsToken = localStorage.getItem('eats_accessToken');
  const token = eatsToken || adminToken;

  const url = restaurantId
    ? `${config.api.baseUrl}/api/eats/menu/items/${dishId}?restaurantId=${encodeURIComponent(restaurantId)}`
    : `${config.api.baseUrl}/api/eats/menu/items/${dishId}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...updates,
      restaurantId,
    }),
  });

  const data = await res.json();

  if (!res.ok || (data.status !== 'SUCCESS' && data.status !== 'success')) {
    throw new Error(data.message || 'Failed to update dish');
  }

  return data.item || data.dish || data.data;
};

/**
 * Toggle dish stock / availability
 */
export const toggleDishAvailability = async (
  dishId: string,
  isAvailable: boolean,
  restaurantId?: string
): Promise<boolean> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  const eatsToken = localStorage.getItem('eats_accessToken');
  const token = eatsToken || adminToken;

  const url = restaurantId
    ? `${config.api.baseUrl}/api/eats/menu/items/${dishId}/availability?restaurantId=${encodeURIComponent(restaurantId)}`
    : `${config.api.baseUrl}/api/eats/menu/items/${dishId}/availability`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      isAvailable,
      restaurantId,
    }),
  });

  const data = await res.json();

  if (!res.ok || (data.status !== 'SUCCESS' && data.status !== 'success')) {
    throw new Error(data.message || 'Failed to update item availability');
  }

  return isAvailable;
};

/**
 * Create a new dish for the restaurant
 */
export const createRestaurantDish = async (
  dishData: CreateRestaurantDishData,
  restaurantId?: string
): Promise<RestaurantDish> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  const eatsToken = localStorage.getItem('eats_accessToken');
  const token = eatsToken || adminToken;

  const url = restaurantId
    ? `${config.api.baseUrl}/api/eats/menu/items?restaurantId=${encodeURIComponent(restaurantId)}`
    : `${config.api.baseUrl}/api/eats/menu/items`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...dishData,
      restaurantId,
    }),
  });

  const data = await res.json();

  if (!res.ok || (data.status !== 'SUCCESS' && data.status !== 'success')) {
    throw new Error(data.message || 'Failed to add dish');
  }

  return data.item || data.dish;
};

/**
 * Upload dish image to GCS
 */
export const uploadDishImage = async (file: File, restaurantId?: string): Promise<string> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  const eatsToken = localStorage.getItem('eats_accessToken');
  const token = eatsToken || adminToken;

  // Convert File to Base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch(`${config.api.baseUrl}/api/eats/menu/upload-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            base64: base64Data,
            folder: 'dishes',
            restaurantId,
          }),
        });

        const json = await res.json();
        if (res.ok && (json.imageUrl || json.url)) {
          resolve(json.imageUrl || json.url);
        } else {
          // If server rejects upload token, fallback to using base64 data preview or throw readable message
          reject(new Error(json.message || 'Image upload failed'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Fetch official Menu Categories added in AdminJS (EatsCategory collection)
 */
export const getAdminCategories = async (): Promise<AdminMenuCategory[]> => {
  // 1. Try public customer feed FIRST (serving live AdminJS EatsCategory records)
  try {
    const feedRes = await fetch(`${config.api.baseUrl}/api/eats/customer/feed`);
    if (feedRes.ok) {
      const feedData = await feedRes.json();
      if (Array.isArray(feedData.categories) && feedData.categories.length > 0) {
        return feedData.categories;
      }
    }
  } catch (feedErr) {
    console.warn('[RestaurantService] Feed categories fetch error:', feedErr);
  }

  // 2. Try dedicated customer categories endpoint
  try {
    const res = await fetch(`${config.api.baseUrl}/api/eats/customer/categories`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        return data.categories;
      }
    }
  } catch (_) {}

  // Fallback defaults if offline
  return [
    { name: 'Biryani' },
    { name: 'North Indian' },
    { name: 'Chineese' },
    { name: 'Fast Food' },
    { name: 'Pizza' },
    { name: 'Bakery' },
    { name: 'Chaat' },
    { name: 'Drinks' },
    { name: 'Mithai' },
    { name: 'Non-Veg' },
  ];
};

export const restaurantMenuService = {
  verifyAndLoginAsRestaurant,
  getRestaurantDetails,
  getRestaurantMenu,
  updateRestaurantDish,
  toggleDishAvailability,
  createRestaurantDish,
  uploadDishImage,
  getAdminCategories,
};

export default restaurantMenuService;
