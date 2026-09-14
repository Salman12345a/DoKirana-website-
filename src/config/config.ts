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
    },

    // ── Operator API ──
    operator: {
      apply: '/api/operator/apply',
      uploadDoc: '/api/operator/upload-document',
      sendOtp: '/api/operator/send-otp',
      verifyOtp: '/api/operator/verify-otp',
      authInitiate: '/api/operator/auth/initiate-login',
      authVerify: '/api/operator/auth/verify-login',
      authRefresh: '/api/operator/auth/refresh-token',
      dashboard: '/api/operator/me/dashboard',
      partners: '/api/operator/me/partners',
      linkPartner: '/api/operator/me/link-partner',
      earnings: '/api/operator/me/earnings',
      riders: '/api/operator/me/riders',
      profile: '/api/operator/me/profile',
      activeOrders: '/api/operators-club/dispatch/active-orders',
      assignRider: '/api/operators-club/dispatch/assign-rider',
    },
  },
  
  // Authentication
  auth: {
    // Admin auth
    tokenStorageKey: 'accessToken',
    tokenExpiryKey: 'tokenExpiry',
    adminInfoKey: 'adminData',
    defaultTokenExpiry: 30, // days

    // Operator auth - completely separate keys, zero collision with admin
    operatorTokenKey: 'operatorAccessToken',
    operatorTokenExpiryKey: 'operatorTokenExpiry',
    operatorDataKey: 'operatorData',
  },
  
  // Feature flags
  features: {
    useMockData: false
  }
};

export default config;