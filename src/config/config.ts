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
    baseUrl: isDevelopment ? 'http://localhost:3000' : 'http://dokirana-env.eba-a4dkw2tt.ap-south-1.elasticbeanstalk.com',
    auth: {
      admin: {
        login: '/api/auth/admin/login',
        profile: '/api/admin/profile',
        loginImage: '/api/admin/login-image',
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
    defaultTokenExpiry: 30, // days
  },
  
  // Feature flags
  features: {
    useMockData: false, // Set to false to make real API calls
  }
};

export default config;