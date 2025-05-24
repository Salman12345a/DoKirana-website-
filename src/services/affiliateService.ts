/**
 * Affiliate Service
 * 
 * Handles all API operations related to affiliate products
 */

import config from '../config/config';

export interface AffiliateProduct {
  _id: string;
  name: string;
  imageUrl: string;
  affiliateLink: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface UploadUrlData {
  uploadUrl: string;
  key: string;
  imageUrl: string;
  tempId: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface AffiliateProductsResponse {
  total: number;
  count: number;
  affiliateProducts: AffiliateProduct[];
}

class AffiliateService {
  /**
   * Get all affiliate products
   */
  async getProducts(): Promise<AffiliateProduct[]> {
    try {
      const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
      if (!accessToken) {
        throw new Error('Unauthorized');
      }
      
      // Try real API call
      try {
        const response = await fetch(`${config.api.baseUrl}${config.api.affiliate.products}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            this.clearAuth();
            throw new Error('Unauthorized');
          }
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.data.affiliateProducts) {
          return data.data.affiliateProducts;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (apiError) {
        console.error('Error calling affiliate products API:', apiError);
        
        // Only use mock data as fallback if real API call fails and USE_MOCK_DATA is true
        if (config.features.useMockData) {
          console.log('Falling back to mock data for affiliate products');
          return this.getMockProducts();
        } else {
          throw apiError;
        }
      }
    } catch (error) {
      console.error('Error fetching affiliate products:', error);
      throw error;
    }
  }
  
  /**
   * Get a presigned upload URL for affiliate product image
   */
  async getUploadUrl(): Promise<UploadUrlData> {
    try {
      const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
      
      if (!accessToken) {
        throw new Error('Unauthorized');
      }
      
      // Try real API call
      try {
        const response = await fetch(`${config.api.baseUrl}${config.api.affiliate.uploadUrl}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            this.clearAuth();
            throw new Error('Unauthorized');
          }
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
          return data.data;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (apiError) {
        console.error('Error calling upload URL API:', apiError);
        
        if (config.features.useMockData) {
          console.log('Falling back to mock data for upload URL');
          return this.getMockUploadUrl();
        } else {
          throw apiError;
        }
      }
    } catch (error) {
      console.error('Error getting upload URL:', error);
      throw error;
    }
  }
  
  /**
   * Create a new affiliate product
   */
  async createProduct(productData: { name: string; imageUrl: string; affiliateLink: string; }): Promise<AffiliateProduct> {
    try {
      const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
      
      if (!accessToken) {
        throw new Error('Unauthorized');
      }
      
      // Use mock data for testing if USE_MOCK_DATA is true
      if (config.features.useMockData) {
        console.log('Using mock data for create product:', productData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock product
        return {
          ...productData,
          _id: `mock-${Date.now()}`,
          isActive: true,
          createdBy: '6737ab0a645a90de3fbb1a',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      // Make real API call
      const response = await fetch(`${config.api.baseUrl}${config.api.affiliate.createProduct}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuth();
          throw new Error('Unauthorized');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data;
      } else {
        throw new Error(data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error creating affiliate product:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing affiliate product
   */
  async updateProduct(productId: string, updateData: { name?: string; affiliateLink?: string; }): Promise<AffiliateProduct> {
    try {
      const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
      
      if (!accessToken) {
        throw new Error('Unauthorized');
      }
      
      // Use mock data for testing if USE_MOCK_DATA is true
      if (config.features.useMockData) {
        console.log('Using mock data for update product:', updateData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get existing mock products
        const products = await this.getProducts();
        const productToUpdate = products.find(p => p._id === productId);
        
        if (!productToUpdate) {
          throw new Error('Product not found');
        }
        
        // Return updated mock product
        return {
          ...productToUpdate,
          ...updateData,
          updatedAt: new Date().toISOString()
        };
      }
      
      // Make real API call
      const url = config.api.affiliate.updateProduct.replace('{productId}', productId);
      const response = await fetch(`${config.api.baseUrl}${url}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuth();
          throw new Error('Unauthorized');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data;
      } else {
        throw new Error(data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error updating affiliate product:', error);
      throw error;
    }
  }
  
  /**
   * Delete (deactivate) an affiliate product
   */
  async deleteProduct(productId: string): Promise<AffiliateProduct> {
    try {
      const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
      
      if (!accessToken) {
        throw new Error('Unauthorized');
      }
      
      // Use mock data for testing if USE_MOCK_DATA is true
      if (config.features.useMockData) {
        console.log('Using mock data for delete product:', productId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get existing mock products
        const products = await this.getProducts();
        const productToDelete = products.find(p => p._id === productId);
        
        if (!productToDelete) {
          throw new Error('Product not found');
        }
        
        // Return deactivated mock product
        return {
          ...productToDelete,
          isActive: false,
          updatedAt: new Date().toISOString()
        };
      }
      
      // Make real API call
      const url = config.api.affiliate.deleteProduct.replace('{productId}', productId);
      const response = await fetch(`${config.api.baseUrl}${url}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuth();
          throw new Error('Unauthorized');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data;
      } else {
        throw new Error(data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error deleting affiliate product:', error);
      throw error;
    }
  }
  
  /**
   * Helper method to clear authentication when unauthorized
   */
  private clearAuth() {
    localStorage.removeItem(config.auth.tokenStorageKey);
    localStorage.removeItem(config.auth.tokenExpiryKey);
    localStorage.removeItem('adminData');
  }
  
  /**
   * Mock data for testing
   */
  private getMockProducts(): AffiliateProduct[] {
    return [
      {
        _id: '6831d57ae6afc9a89397c5e3',
        name: 'Dry Season Scented Candles',
        imageUrl: 'https://dokirana-affiliate-bucket.s3.ap-south-1.amazonaws.com/third/affiliate-products/6831d4c0e6afc9a89397c5e2.jpg',
        affiliateLink: 'https://amzn.to/4mwJar4',
        isActive: true,
        createdBy: '6737ab0a645a90de3fbb1a',
        createdAt: '2025-05-24T14:19:38.842Z',
        updatedAt: '2025-05-24T14:19:38.842Z'
      },
      {
        _id: '6831c561471eeba0289efq6',
        name: 'Aromatherapy Diffuser',
        imageUrl: 'https://dokirana-affiliate-bucket.s3.ap-south-1.amazonaws.com/third/affiliate-products/6831c7e1472ebb289efq7.jpg',
        affiliateLink: 'https://amzn.to/3b2Kxyz',
        isActive: true,
        createdBy: '6737ab0a645a90de3fbb1a',
        createdAt: '2025-05-24T13:45:22.123Z',
        updatedAt: '2025-05-24T13:45:22.123Z'
      },
      {
        _id: '6831c50147eba0289ef66',
        name: 'Amazon Echo Dot (4th Gen)',
        imageUrl: 'https://dokirana-affiliate-bucket.s3.ap-south-1.amazonaws.com/third/affiliate-products/6831c2e5baa272f5f55a2091.jpg',
        affiliateLink: 'https://www.amazon.in/dp/B07PFFMP9P?tag=updated-associate-id',
        isActive: false,
        createdBy: '6737ab0a645a90de3fbb1a',
        createdAt: '2025-05-24T13:09:21.369Z',
        updatedAt: '2025-05-24T14:22:10.946Z'
      }
    ];
  }
  
  /**
   * Mock upload URL for testing
   */
  private getMockUploadUrl(): UploadUrlData {
    return {
      uploadUrl: 'https://dokirana-affiliate-bucket.s3.ap-south-1.amazonaws.com/third/affiliate-products/mock-upload.jpg',
      key: 'third/affiliate-products/mock-upload.jpg',
      imageUrl: 'https://dokirana-affiliate-bucket.s3.ap-south-1.amazonaws.com/third/affiliate-products/mock-upload.jpg',
      tempId: `mock-${Date.now()}`
    };
  }
}

// Export a singleton instance
const affiliateService = new AffiliateService();
export default affiliateService;
