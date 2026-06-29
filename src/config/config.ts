/**
 * Application configuration
 * Central place to manage environment-specific settings
 */

// Environment detection (can be expanded with proper env variables)
const isDevelopment = process.env.NODE_ENV !== 'production';

// API configuration
const config = {
  // API base URLs
  api: {
    baseUrl: 'https://dokirana-api-47864120198.asia-south1.run.app',
    auth: {
      admin: {
        login: '/api/auth/admin/login',
        profile: '/api/admin/profile',
      },
      branch: {
        loginInitiate: '/api/auth/branch/login/initiate',
        loginComplete: '/api/auth/branch/login/complete',
      }
    },
    admin: {
      updateBranchStatus: '/api/admin/branch/{branchId}/status',
    },
    affiliate: {
      products: '/api/affiliate/products',
      uploadUrl: '/api/affiliate/upload-url',
      createProduct: '/api/affiliate/products',
      updateProduct: '/api/affiliate/products/{productId}',
      deleteProduct: '/api/affiliate/products/{productId}',
    },
    stats: {
      deliveredOrders: '/api/stats/orders/delivered',
      activeCustomers: '/api/stats/customers',
      activeBranches: '/api/stats/branches',
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
    useMockData: false // Disable mock mode are you sure?
  }
};

export default config;