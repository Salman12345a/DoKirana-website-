import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Edit, Trash2, ExternalLink } from 'lucide-react';
import affiliateService, { AffiliateProduct } from '../services/affiliateService';
import EditAffiliateProductModal from '../components/EditAffiliateProductModal';
import ConfirmDialog from '../components/ConfirmDialog';
import config from '../config/config';

// Mock data for testing purposes
const MOCK_ADMIN_DATA = {
  _id: '6737ab0a645a90de3fbb1a',
  name: 'Syed Salman',
  email: 'syedsalman186org@gmail.com',
  role: 'Admin'
};

// Use mock data feature flag from config
const USE_MOCK_DATA = config.features.useMockData;

interface AdminData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface BranchLocation {
  type: string;
  coordinates: number[];
}

interface BranchAddress {
  street: string;
  area: string;
  city: string;
  pincode: string;
}

interface Branch {
  _id: string;
  phone: string;
  name: string;
  branchEmail: string;
  openingTime: string;
  closingTime: string;
  ownerName: string;
  govId: string;
  deliveryServiceAvailable: boolean;
  selfPickup: boolean;
  branchfrontImage: string;
  ownerIdProof: string;
  ownerPhoto: string;
  deliveryPartners: any[];
  storeStatus: string;
  status: string;
  isOpen: boolean;
  isManuallyClosed: boolean;
  canReopen: boolean;
  createdAt: string;
  lastStatusUpdate: string;
  statusHistory: any[];
  updatedAt: string;
  location: BranchLocation;
  address: BranchAddress;
}

// Using AffiliateProduct interface from affiliateService

// Using response interfaces from affiliateService

interface BranchResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    branch: Branch;
  };
}

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'branchApproval' | 'branchDetails' | 'affiliatesDashboard'>('dashboard');
  
  // Branch approval states
  const [branchPhone, setBranchPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [branchDetails, setBranchDetails] = useState<Branch | null>(null);
  
  // Affiliate products state
  const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProduct[]>([]);
  const [isLoadingAffiliateProducts, setIsLoadingAffiliateProducts] = useState(false);
  const [affiliateProductsError, setAffiliateProductsError] = useState('');
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<AffiliateProduct | null>(null);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<AffiliateProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
      const tokenExpiry = localStorage.getItem(config.auth.tokenExpiryKey);
      
      console.log('AdminDashboard: Checking authentication...');
      
      // Check if token exists
      if (!accessToken) {
        console.log('AdminDashboard: No access token found, redirecting to login');
        navigate('/admin/login');
        return false;
      }
      
      // Check if token is expired (if remember me was used)
      if (tokenExpiry) {
        const expiryDate = new Date(tokenExpiry);
        console.log('AdminDashboard: Token expiry date:', expiryDate.toLocaleString());
        console.log('AdminDashboard: Current date:', new Date().toLocaleString());
        
        if (expiryDate < new Date()) {
          // Token expired
          console.log('AdminDashboard: Token expired, redirecting to login');
          localStorage.removeItem(config.auth.tokenStorageKey);
          localStorage.removeItem(config.auth.tokenExpiryKey);
          navigate('/admin/login');
          return false;
        }
      }
      
      console.log('AdminDashboard: Authentication successful');
      return true;
    };
    
    const fetchAdminData = async () => {
      try {
        // Check if we have stored admin data from login
        const storedAdminData = localStorage.getItem('adminData');
        
        if (storedAdminData) {
          console.log('Using stored admin data from login');
          setAdminData(JSON.parse(storedAdminData));
          setIsLoading(false);
          return;
        }
        
        // Fallback to mock data for testing if USE_MOCK_DATA is true and no stored data
        if (USE_MOCK_DATA) {
          console.log('No stored admin data found. Using mock admin data for testing');
          setAdminData(MOCK_ADMIN_DATA);
          setIsLoading(false);
          return;
        }
        
        const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
        
        if (!accessToken) {
          navigate('/admin/login');
          return;
        }
        
        try {
          const response = await fetch(`${config.api.baseUrl}${config.api.auth.admin.profile}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (!response.ok) {
            if (response.status === 401) {
              // Unauthorized, token invalid
              localStorage.removeItem(config.auth.tokenStorageKey);
              localStorage.removeItem(config.auth.tokenExpiryKey);
              navigate('/admin/login');
              return;
            }
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          setAdminData(data.data.admin);
        } catch (fetchError) {
          console.error('Error fetching admin data:', fetchError);
          // Fallback to mock data if API call fails
          console.log('Falling back to mock data due to API failure');
          setAdminData(MOCK_ADMIN_DATA);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error in admin dashboard:', err);
        setError('Failed to load admin data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    checkAuth();
    fetchAdminData();
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem(config.auth.tokenStorageKey);
    localStorage.removeItem(config.auth.tokenExpiryKey);
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };
  
  const handleUpdateBranchStatus = async (branchId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // For demo purposes in mock mode, just update the UI without API call
      if (USE_MOCK_DATA) {
        console.log('Mock mode: Simulating branch status update');
        if (branchDetails) {
          setBranchDetails({
            ...branchDetails,
            status: newStatus
          });
        }
        alert(`Branch status updated to ${newStatus} successfully! (Mock mode)`);
        return;
      }
      
      // In real mode, make the API call with proper token
      const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
      
      if (!accessToken) {
        alert('You must be logged in to perform this action');
        navigate('/admin/login');
        return;
      }
      
      const url = `${config.api.baseUrl}${config.api.admin.updateBranchStatus.replace('{branchId}', branchId)}`;
      console.log('Making API request to:', url);
      
      // Make sure the token is valid and properly formatted
      if (!accessToken.startsWith('ey')) {
        console.error('Invalid token format:', accessToken.substring(0, 10) + '...');
        alert('Invalid authentication token. Please log in again.');
        localStorage.removeItem(config.auth.tokenStorageKey);
        navigate('/admin/login');
        return;
      }

      // Log headers and request details for debugging
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      };
      
      console.log('Request details:', {
        url,
        method: 'PATCH',
        headers: { ...headers, 'Authorization': 'Bearer ' + accessToken.substring(0, 10) + '...' },
        body: { status: newStatus }
      });
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        // Update branch details in state
        if (branchDetails) {
          setBranchDetails({
            ...branchDetails,
            status: newStatus
          });
        }
        
        // Show success message
        alert(`Branch status updated to ${newStatus} successfully!`);
      } else {
        // Handle specific error cases
        if (data.message?.includes('token')) {
          console.error('Token error detected:', data.message);
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem(config.auth.tokenStorageKey);
          navigate('/admin/login');
        } else {
          alert(`Failed to update branch status: ${data.message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('Error updating branch status:', err);
      alert('Connection error. Please try again later.');
    }
  };
  
  const handleSendOTP = async () => {
    if (!branchPhone) {
      setVerificationError('Please enter a branch phone number');
      return;
    }
    
    setVerificationLoading(true);
    setVerificationError('');
    
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.auth.branch.loginInitiate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(config.auth.tokenStorageKey)}`
        },
        body: JSON.stringify({ phone: branchPhone })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOtpSent(true);
      } else {
        setVerificationError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      // For demo purposes, simulate success
      if (USE_MOCK_DATA) {
        setOtpSent(true);
      } else {
        setVerificationError('Connection error. Please try again.');
      }
    } finally {
      setVerificationLoading(false);
    }
  };
  
  const handleVerifyOTP = async () => {
    if (!otp) {
      setVerificationError('Please enter the OTP');
      return;
    }
    
    setVerificationLoading(true);
    setVerificationError('');
    
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.auth.branch.loginComplete}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(config.auth.tokenStorageKey)}`
        },
        body: JSON.stringify({ phoneNumber: branchPhone, otp })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setBranchDetails(data.data.branch);
        setCurrentView('branchDetails');
      } else {
        setVerificationError(data.message || 'Failed to verify OTP');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      // For demo purposes, simulate success with mock data
      if (USE_MOCK_DATA) {
        const mockBranchData = {
          location: {
            type: "Point",
            coordinates: [
              78.49902166666666,
              17.389406666666666
            ]
          },
          address: {
            street: "nimboli",
            area: "kachigr",
            city: "ds",
            pincode: "234343"
          },
          _id: "680616db0b3f8961c1eb3adf",
          phone: "+916302675240",
          name: "Salman ki Dukan",
          branchEmail: "as@gm.c",
          openingTime: "3:30 PM",
          closingTime: "3:30 PM",
          ownerName: "Salman",
          govId: "sasasasa",
          deliveryServiceAvailable: false,
          selfPickup: false,
          branchfrontImage: "https://syncmart.s3.eu-north-1.amazonaws.com/branches/sal/front-image-1745229399333.jpeg",
          ownerIdProof: "https://syncmart.s3.eu-north-1.amazonaws.com/branches/sal/id-proof-1745229399333.jpeg",
          ownerPhoto: "https://syncmart.s3.eu-north-1.amazonaws.com/branches/sal/owner-photo-1745229399333.jpeg",
          deliveryPartners: [],
          storeStatus: "open",
          status: "approved",
          isOpen: true,
          isManuallyClosed: false,
          canReopen: true,
          createdAt: "2025-04-21T09:58:51.092Z",
          lastStatusUpdate: "2025-04-21T09:58:51.093Z",
          statusHistory: [],
          updatedAt: "2025-05-21T13:38:39.091Z"
        };
        setBranchDetails(mockBranchData as Branch);
        setCurrentView('branchDetails');
      } else {
        setVerificationError('Connection error. Please try again.');
      }
    } finally {
      setVerificationLoading(false);
    }
  };
  
  const renderBranchApprovalView = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Branch Approval</h2>
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className="text-dokirana-primary hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
        
        {verificationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {verificationError}
          </div>
        )}
        
        {!otpSent ? (
          <div>
            <p className="mb-4">Enter the registered branch phone number to verify and approve:</p>
            <div className="mb-4">
              <label htmlFor="branchPhone" className="block text-gray-700 font-medium mb-2">
                Branch Phone Number
              </label>
              <input
                type="tel"
                id="branchPhone"
                value={branchPhone}
                onChange={(e) => setBranchPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dokirana-primary"
                placeholder="+91XXXXXXXXXX"
                required
              />
            </div>
            <button
              onClick={handleSendOTP}
              disabled={verificationLoading}
              className={`bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors ${verificationLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {verificationLoading ? "Sending..." : "Verify"}
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4">Enter the OTP sent to {branchPhone}:</p>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 font-medium mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dokirana-primary"
                placeholder="Enter OTP"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleVerifyOTP}
                disabled={verificationLoading}
                className={`bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors ${verificationLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {verificationLoading ? "Verifying..." : "Submit"}
              </button>
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                }}
                className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderBranchDetailsView = () => {
    if (!branchDetails) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Branch Details</h2>
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className="text-dokirana-primary hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-lg font-semibold mb-3">{branchDetails.name}</h3>
            <div className="flex items-center mb-2">
              <span className="text-gray-600 w-32">Status:</span>
              <span className={`inline-block px-2 py-1 rounded-full text-sm ${branchDetails.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {branchDetails.status}
              </span>
            </div>
            <div className="flex items-center mb-2">
              <span className="text-gray-600 w-32">Store Status:</span>
              <span className={`inline-block px-2 py-1 rounded-full text-sm ${branchDetails.storeStatus === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {branchDetails.storeStatus}
              </span>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h4 className="font-semibold mb-2">Contact Information</h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2">{branchDetails.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2">{branchDetails.branchEmail}</span>
              </div>
              <div>
                <span className="text-gray-600">Owner:</span>
                <span className="ml-2">{branchDetails.ownerName}</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h4 className="font-semibold mb-2">Address</h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Street:</span>
                <span className="ml-2">{branchDetails.address.street}</span>
              </div>
              <div>
                <span className="text-gray-600">Area:</span>
                <span className="ml-2">{branchDetails.address.area}</span>
              </div>
              <div>
                <span className="text-gray-600">City:</span>
                <span className="ml-2">{branchDetails.address.city}</span>
              </div>
              <div>
                <span className="text-gray-600">Pincode:</span>
                <span className="ml-2">{branchDetails.address.pincode}</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h4 className="font-semibold mb-2">Operation Details</h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Opening Time:</span>
                <span className="ml-2">{branchDetails.openingTime}</span>
              </div>
              <div>
                <span className="text-gray-600">Closing Time:</span>
                <span className="ml-2">{branchDetails.closingTime}</span>
              </div>
              <div>
                <span className="text-gray-600">Delivery:</span>
                <span className="ml-2">{branchDetails.deliveryServiceAvailable ? 'Available' : 'Not Available'}</span>
              </div>
              <div>
                <span className="text-gray-600">Self Pickup:</span>
                <span className="ml-2">{branchDetails.selfPickup ? 'Available' : 'Not Available'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="border rounded-md p-4">
            <h4 className="font-semibold mb-2">Branch Front Image</h4>
            <img 
              src={branchDetails.branchfrontImage} 
              alt="Branch Front" 
              className="w-full h-48 object-cover rounded-md" 
            />
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Branch Status Actions</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 border rounded-md bg-gray-50">
              <h4 className="font-semibold mb-4 text-center">Current Status: 
                <span className={`inline-block px-3 py-1 rounded-full text-sm ml-2 ${branchDetails.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {branchDetails.status.toUpperCase()}
                </span>
              </h4>
              
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => handleUpdateBranchStatus(branchDetails._id, 'approved')}
                  disabled={branchDetails.status === 'approved'}
                  className={`flex items-center px-4 py-2 rounded-md ${branchDetails.status === 'approved' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  <CheckCircle size={18} className="mr-2" />
                  Approve Branch
                </button>
                
                <button
                  onClick={() => handleUpdateBranchStatus(branchDetails._id, 'rejected')}
                  disabled={branchDetails.status === 'rejected'}
                  className={`flex items-center px-4 py-2 rounded-md ${branchDetails.status === 'rejected' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  <XCircle size={18} className="mr-2" />
                  Reject Branch
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                {branchDetails.status === 'approved' 
                  ? 'This branch is currently approved and operational.' 
                  : 'This branch is pending approval or has been rejected.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-dokirana-primary">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const fetchUploadUrl = async () => {
    setIsCreatingProduct(true);
    setAffiliateProductsError('');

    try {
      // Use the affiliate service to get upload URL
      const uploadData = await affiliateService.getUploadUrl();
      
      // Navigate to create affiliate product page with upload data
      navigate('/create-affiliate-product', { 
        state: { 
          uploadData: uploadData 
        } 
      });
    } catch (error) {
      console.error('Error preparing to create affiliate product:', error);
      
      // Handle unauthorized error
      if (error instanceof Error && error.message === 'Unauthorized') {
        navigate('/admin/login');
        return;
      }
      
      setAffiliateProductsError('Failed to prepare for product creation. Please try again later.');
    } finally {
      setIsCreatingProduct(false);
    }
  };
  
  // Handle editing a product
  const handleEditProduct = (product: AffiliateProduct) => {
    setProductToEdit(product);
    setEditModalOpen(true);
  };
  
  // Handle successful product update
  const handleProductUpdated = (updatedProduct: AffiliateProduct) => {
    // Update the product in the local state
    setAffiliateProducts(prevProducts => 
      prevProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p)
    );
  };
  
  // Handle deleting a product
  const handleDeleteProduct = (product: AffiliateProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };
  
  // Confirm product deletion
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Use the affiliate service to delete (deactivate) the product
      const deactivatedProduct = await affiliateService.deleteProduct(productToDelete._id);
      
      // Update the product in the local state
      setAffiliateProducts(prevProducts => 
        prevProducts.map(p => p._id === deactivatedProduct._id ? deactivatedProduct : p)
      );
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      
      // Handle unauthorized error
      if (error instanceof Error && error.message === 'Unauthorized') {
        navigate('/admin/login');
        return;
      }
      
      setAffiliateProductsError('Failed to delete product. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchAffiliateProducts = async () => {
    setIsLoadingAffiliateProducts(true);
    setAffiliateProductsError('');
    
    try {
      // Use the affiliate service to get products
      const products = await affiliateService.getProducts();
      setAffiliateProducts(products);
    } catch (error) {
      console.error('Error fetching affiliate products:', error);
      // Handle unauthorized error
      if (error instanceof Error && error.message === 'Unauthorized') {
        navigate('/admin/login');
        return;
      }
      setAffiliateProductsError('Failed to load affiliate products. Please try again later.');
    } finally {
      setIsLoadingAffiliateProducts(false);
    }
  };

// ... (rest of the code remains the same)
  
  const renderAffiliatesDashboardView = () => {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Affiliate Products Dashboard</h2>
          <div className="flex space-x-2">
            <button
              onClick={fetchUploadUrl}
              disabled={isCreatingProduct}
              className={`bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors ${isCreatingProduct ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isCreatingProduct ? 'Preparing...' : 'Create Affiliate Product'}
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        
        {isLoadingAffiliateProducts ? (
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
            <p className="text-gray-600">Loading affiliate products...</p>
          </div>
        ) : affiliateProductsError ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {affiliateProductsError}
            </div>
            <button
              onClick={fetchAffiliateProducts}
              className="bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : affiliateProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center py-12">
            <p className="text-gray-600 mb-4">No affiliate products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affiliateProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-gray-500 hover:text-dokirana-primary p-1"
                        title="Edit product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="text-gray-500 hover:text-red-600 p-1"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Updated: {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <a 
                    href={product.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center w-full bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors"
                  >
                    Visit Affiliate Link
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };
  
  const renderDashboardView = () => {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {adminData?.name || 'Admin'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <p className="text-gray-600 mb-1">Email</p>
              <p className="font-medium">{adminData?.email}</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-gray-600 mb-1">Role</p>
              <p className="font-medium">{adminData?.role}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-medium">245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-medium">1,204</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Stores</span>
                <span className="font-medium">37</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">New store onboarded (2 hours ago)</li>
              <li className="text-sm text-gray-600">User complaint resolved (4 hours ago)</li>
              <li className="text-sm text-gray-600">System update completed (1 day ago)</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Admin Actions</h3>
            <button
              onClick={() => setCurrentView('branchApproval')}
              className="w-full bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors mb-2"
            >
              Approve Branch
            </button>
            <button
              onClick={() => {
                fetchAffiliateProducts();
                setCurrentView('affiliatesDashboard');
              }}
              className="w-full bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors"
            >
              Affiliate Management
            </button>
          </div>
        </div>
      </>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dokirana-primary text-white py-4 px-6 shadow-md">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-dokirana-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="container-custom py-8">
        {currentView === 'dashboard' && renderDashboardView()}
        {currentView === 'branchApproval' && renderBranchApprovalView()}
        {currentView === 'branchDetails' && renderBranchDetailsView()}
        {currentView === 'affiliatesDashboard' && renderAffiliatesDashboardView()}
      </main>
      
      {/* Edit Product Modal */}
      {productToEdit && (
        <EditAffiliateProductModal
          product={productToEdit}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setProductToEdit(null);
          }}
          onSuccess={handleProductUpdated}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <ConfirmDialog
          isOpen={deleteDialogOpen}
          title="Deactivate Affiliate Product"
          message={`Are you sure you want to deactivate the affiliate product "${productToDelete.name}"? This will make it unavailable on the platform.`}
          confirmLabel="Deactivate"
          cancelLabel="Cancel"
          onConfirm={confirmDeleteProduct}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
          }}
          isProcessing={isDeleting}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
