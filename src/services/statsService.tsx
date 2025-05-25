// statsService.tsx
import axios from 'axios';
import config from '../config/config';

const BASE_URL = `${config.api.baseUrl}`;
const USE_MOCK_DATA = config.features.useMockData;

// Function to get the token from local storage
const getAccessToken = () => {
  return localStorage.getItem(config.auth.tokenStorageKey);
};

// Function to fetch all stats at once (for more efficient fetching)
export const fetchAllStats = async () => {
  // If using mock data, return all mock values
  if (USE_MOCK_DATA) {
    return {
      deliveredOrders: 183,
      activeCustomers: 333,
      activeBranches: 1
    };
  }
  
  try {
    // Execute all requests in parallel for better performance
    const [deliveredOrders, activeCustomers, activeBranches] = await Promise.all([
      fetchDeliveredOrders(),
      fetchActiveCustomers(),
      fetchActiveBranches()
    ]);
    
    return {
      deliveredOrders,
      activeCustomers,
      activeBranches
    };
  } catch (error) {
    console.error('Error fetching all stats:', error);
    return {
      deliveredOrders: 0,
      activeCustomers: 0,
      activeBranches: 0
    };
  }
};

// Function to fetch delivered orders
export const fetchDeliveredOrders = async () => {
  // Return mock data if feature flag is enabled
  if (USE_MOCK_DATA) {
    return 183; // Mock delivered orders count
  }

  const token = getAccessToken();
  if (!token) {
    console.warn('No access token found for stats service');
    return 0; // Return default value instead of throwing error
  }

  try {
    const response = await axios.get(`${BASE_URL}${config.api.stats.deliveredOrders}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    return 0; // Return default value on error to prevent UI breaks
  }
};

// Function to fetch active customers
export const fetchActiveCustomers = async () => {
  // Return mock data if feature flag is enabled
  if (USE_MOCK_DATA) {
    return 333; // Mock active customers count
  }

  const token = getAccessToken();
  if (!token) {
    console.warn('No access token found for stats service');
    return 0; // Return default value instead of throwing error
  }

  try {
    const response = await axios.get(`${BASE_URL}${config.api.stats.activeCustomers}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching active customers:', error);
    return 0; // Return default value on error to prevent UI breaks
  }
};

// Function to fetch active branches
export const fetchActiveBranches = async () => {
  // Return mock data if feature flag is enabled
  if (USE_MOCK_DATA) {
    return 1; // Mock active branches count
  }

  const token = getAccessToken();
  if (!token) {
    console.warn('No access token found for stats service');
    return 0; // Return default value instead of throwing error
  }

  try {
    const response = await axios.get(`${BASE_URL}${config.api.stats.activeBranches}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching active branches:', error);
    return 0; // Return default value on error to prevent UI breaks
  }
};