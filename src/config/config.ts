/**
 * Application configuration
 * Central place to manage environment-specific settings
 */

const defaultApiBaseUrl = '/api';
const envApiBaseUrl = import.meta.env.DEV ? (import.meta.env.VITE_API_BASE_URL || '').trim() : '';
const apiBaseUrl = (envApiBaseUrl || defaultApiBaseUrl).replace(/\/$/, '');

// Environment detection
const isDevelopment = import.meta.env.DEV;

// API configuration
const config = {
  // API base URLs
  api: {
    baseUrl: apiBaseUrl,
    auth: {
      admin: {
        login: '/auth/admin/login',
        profile: '/admin/profile',
        loginImage: '/admin/login-image',
      },
      branch: {
        loginInitiate: '/auth/branch/login/initiate',
        loginComplete: '/auth/branch/login/complete',
      }
    },
    admin: {
      updateBranchStatus: '/admin/branch/{branchId}/status',
    },
    affiliate: {
      products: '/affiliate/products',
      uploadUrl: '/affiliate/upload-url',
      createProduct: '/affiliate/products',
      updateProduct: '/affiliate/products/{productId}',
      deleteProduct: '/affiliate/products/{productId}',
    },
    stats: {
      deliveredOrders: '/stats/orders/delivered',
      activeCustomers: '/stats/customers',
      activeBranches: '/stats/branches',
    }
  },

  // Authentication
  auth: {
    tokenStorageKey: 'accessToken',
    tokenExpiryKey: 'tokenExpiry',
    adminInfoKey: 'adminData',
    defaultTokenExpiry: 30, // days
  },

  // Feature flags
  features: {
    useMockData: false // Disable mock mode
  }
};

export default config;