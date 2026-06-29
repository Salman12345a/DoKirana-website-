import config from '../config/config';

export interface DefaultCategory {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
}

export interface DefaultProduct {
  _id: string;
  name: string;
  imageUrl: string;
  suggestedPrice: number;
  unit: string;
  defaultCategory: {
    _id: string;
    name: string;
    imageUrl: string;
  };
  isPacket: boolean;
  description: string;
  isActive: boolean;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  branchId: string;
  imageUrl: string;
  createdFromTemplate: boolean;
  createdBy: string;
  isActive: boolean;
  defaultCategoryId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  isPacket: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  quantity?: string;
  unit?: string;
  isPacket?: boolean;
  isAvailable?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  quantity?: string;
  unit?: string;
  isPacket?: boolean;
  createdFromTemplate: boolean;
  isAvailable: boolean;
  defaultProductId?: string;
}

const createCustomCategory = async (branchId: string, name: string, imageFile: File): Promise<Category> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('categoryImage', imageFile);

  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create custom category');
  }

  return response.json();
};

const createCustomProduct = async (branchId: string, categoryId: string, productData: CreateProductData, productImage: File): Promise<Product> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const formData = new FormData();
  Object.keys(productData).forEach(key => {
        formData.append(key, String((productData as any)[key]));
  });
  formData.append('productImage', productImage);
  formData.append('branchId', branchId);
  formData.append('categoryId', categoryId);


  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create custom product');
  }

  return response.json();
};

const getProductsForCategory = async (branchId: string, categoryId: string): Promise<Product[]> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/categories/${categoryId}/products`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch products for category');
  }

  const data = await response.json();
  // The actual product list is nested inside the 'data' object in the response
  return data.data.products || [];
};

const getBranchCategories = async (branchId: string): Promise<Category[]> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/categories`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch branch categories');
  }

  const data = await response.json();
  return data;
};

const removeImportedCategory = async (branchId: string, categoryId: string): Promise<any> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/categories/remove-imported`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryIds: [categoryId] }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove imported category');
  }

  return response.json();
};

const deleteCustomCategory = async (branchId: string, categoryId: string): Promise<any> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/categories/custom`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryIds: [categoryId] }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete custom category');
  }

  return response.json();
};

const updateProductDetails = async (productId: string, productData: UpdateProductData): Promise<Product> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/branch/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update product details');
  }

  return response.json();
};

const removeImportedProduct = async (branchId: string, productId: string): Promise<any> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/products/remove-imported`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productIds: [productId] }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove imported product');
  }

  return response.json();
};

const deleteCustomProduct = async (branchId: string, productId: string): Promise<any> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/products/custom`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productIds: [productId] }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete custom product');
  }

  return response.json();
};

const getAllDefaultCategories = async (): Promise<DefaultCategory[]> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/admin/default-categories`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch default categories');
  }

  return response.json();
};

const importDefaultCategories = async (branchId: string, categoryIds: string[]): Promise<any> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/categories/import-default`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to import default categories');
  }

  return response.json();
};

const getDefaultProductsForCategory = async (defaultCategoryId: string): Promise<DefaultProduct[]> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/admin/default-categories/${defaultCategoryId}/products`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch default products');
  }

  return response.json();
};

const importDefaultProducts = async (branchId: string, categoryId: string, productIds: string[]): Promise<any> => {
  const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
  if (!adminToken) {
    throw new Error('Admin authentication token not found.');
  }

  const response = await fetch(`${config.api.baseUrl}/branch/${branchId}/categories/${categoryId}/import-products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to import products');
  }

  return response.json();
};

export const inventoryService = {
  getBranchCategories,
  getProductsForCategory,
  createCustomCategory,
  createCustomProduct,
  removeImportedCategory,
  deleteCustomCategory,
  updateProductDetails,
  removeImportedProduct,
  deleteCustomProduct,
  getAllDefaultCategories,
  importDefaultCategories,
  getDefaultProductsForCategory,
  importDefaultProducts,
};
