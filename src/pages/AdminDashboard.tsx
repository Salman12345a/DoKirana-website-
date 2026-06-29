import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import affiliateService, { AffiliateProduct } from '../services/affiliateService';
import EditAffiliateProductModal from '../components/EditAffiliateProductModal';
import ConfirmDialog from '../components/ConfirmDialog';
import config from '../config/config';
import { fetchDeliveredOrders, fetchActiveCustomers, fetchActiveBranches } from '../services/statsService';

const MOCK_ADMIN_DATA = {
  _id: '6737ab0a645a90de3fbb1a',
  name: 'Syed Salman',
  email: 'syedsalman186org@gmail.com',
  role: 'Admin'
};

const USE_MOCK_DATA = config.features.useMockData;

interface AdminData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'affiliatesDashboard' | 'inactiveAffiliateProducts'>('dashboard');

  // Branch verification states
  const [branchId, setBranchId] = useState('');
  const [isVerifyingBranch, setIsVerifyingBranch] = useState(false);
  const [branchVerificationError, setBranchVerificationError] = useState('');

  // Affiliate products state
  const [activeAffiliateProducts, setActiveAffiliateProducts] = useState<AffiliateProduct[]>([]);
  const [inactiveAffiliateProducts, setInactiveAffiliateProducts] = useState<AffiliateProduct[]>([]);
  const [isLoadingAffiliateProducts, setIsLoadingAffiliateProducts] = useState(false);
  const [affiliateProductsError, setAffiliateProductsError] = useState('');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<AffiliateProduct | null>(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<AffiliateProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Stats state
  const [deliveredOrders, setDeliveredOrders] = useState<number>(0);
  const [activeCustomers, setActiveCustomers] = useState<number>(0);
  const [activeBranches, setActiveBranches] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
      const tokenExpiry = localStorage.getItem(config.auth.tokenExpiryKey);

      if (!accessToken || !tokenExpiry) {
        navigate('/admin/login');
        return;
      }

      const expiryDate = new Date(tokenExpiry);
      if (expiryDate <= new Date()) {
        navigate('/admin/login');
        return;
      }

      fetchAdminData();
      fetchStats();
    };

    checkAuth();
  }, [navigate]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const storedAdminData = localStorage.getItem(config.auth.adminInfoKey);
      if (storedAdminData) {
        setAdminData(JSON.parse(storedAdminData));
      } else {
        const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
        const response = await fetch(`${config.api.baseUrl}${config.api.auth.admin.profile}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (!response.ok) throw new Error('Failed to fetch admin data');
        const data = await response.json();
        setAdminData(data.data.admin);
        localStorage.setItem(config.auth.adminInfoKey, JSON.stringify(data.data.admin));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      if (USE_MOCK_DATA) {
        setAdminData(MOCK_ADMIN_DATA);
      } else {
        setError('Failed to load admin data. Please try logging in again.');
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError('');
    try {
      const [orders, customers, branches] = await Promise.all([
        fetchDeliveredOrders(),
        fetchActiveCustomers(),
        fetchActiveBranches()
      ]);
      setDeliveredOrders(orders);
      setActiveCustomers(customers);
      setActiveBranches(branches);
    } catch (err) {
      console.error('Error fetching stats:', err);
      if (!USE_MOCK_DATA) setStatsError('Could not load stats.');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(config.auth.tokenStorageKey);
    localStorage.removeItem(config.auth.tokenExpiryKey);
    localStorage.removeItem(config.auth.adminInfoKey);
    navigate('/admin/login');
  };

  const handleVerifyAndManageBranch = async () => {
    if (!branchId) {
      setBranchVerificationError('Please enter a Branch ID.');
      return;
    }
    setIsVerifyingBranch(true);
    setBranchVerificationError('');
    try {
      const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
      if (!adminToken) {
        setError('Admin authentication token not found. Please log in again.');
        setIsVerifyingBranch(false);
        return;
      }

      const response = await fetch(`${config.api.baseUrl}/api/admin/auth/login-as-branch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ branchId })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        navigate('/admin/manage-branch', { state: { branch: data.data.branch } });
      } else {
        setBranchVerificationError(data.message || 'Failed to verify branch. Please check the ID and try again.');
      }
    } catch (error) {
      console.error('Branch verification failed:', error);
      setBranchVerificationError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsVerifyingBranch(false);
    }
  };

  const handleEditProduct = (product: AffiliateProduct) => {
    setProductToEdit(product);
    setEditModalOpen(true);
  };

  const handleProductUpdated = (updatedProduct: AffiliateProduct) => {
    if (updatedProduct.isActive) {
      setActiveAffiliateProducts(prev => 
        prev.map(p => p._id === updatedProduct._id ? updatedProduct : p)
      );
      setInactiveAffiliateProducts(prev => prev.filter(p => p._id !== updatedProduct._id));
    } else {
      setInactiveAffiliateProducts(prev => 
        prev.map(p => p._id === updatedProduct._id ? updatedProduct : p)
      );
      setActiveAffiliateProducts(prev => prev.filter(p => p._id !== updatedProduct._id));
    }
    setEditModalOpen(false);
    setProductToEdit(null);
  };

  const handleDeleteProduct = (product: AffiliateProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await affiliateService.deleteProduct(productToDelete._id);
      setActiveAffiliateProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      setInactiveAffiliateProducts(prev => [...prev, { ...productToDelete, isActive: false }]);
    } catch (error) {
      console.error('Failed to deactivate product:', error);
      setAffiliateProductsError('Failed to deactivate product. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const fetchAffiliateProducts = async () => {
    setIsLoadingAffiliateProducts(true);
    setAffiliateProductsError('');
    try {
      const products = await affiliateService.getProducts();
      setActiveAffiliateProducts(products.filter(p => p.isActive));
      setInactiveAffiliateProducts(products.filter(p => !p.isActive));
    } catch (error) {
      console.error('Failed to fetch affiliate products:', error);
      setAffiliateProductsError('Failed to load affiliate products.');
    } finally {
      setIsLoadingAffiliateProducts(false);
    }
  };

  const renderAffiliatesDashboardView = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Affiliate Products</h2>
        <div>
          <button
            onClick={() => setCurrentView('inactiveAffiliateProducts')}
            className="text-sm text-dokirana-primary hover:underline mr-4"
          >
            View Inactive Products ({inactiveAffiliateProducts.length})
          </button>
          <button
            onClick={() => navigate('/create-affiliate-product')}
            className="bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors"
          >
            Create New Product
          </button>
        </div>
      </div>

      {isLoadingAffiliateProducts ? (
        <p>Loading products...</p>
      ) : affiliateProductsError ? (
        <p className="text-red-500">{affiliateProductsError}</p>
      ) : activeAffiliateProducts.length === 0 ? (
        <p>No active affiliate products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeAffiliateProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-dokirana-primary hover:underline">
                      <ExternalLink className="h-4 w-4 inline-block" /> View Link
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEditProduct(product)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDeleteProduct(product)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={() => setCurrentView('dashboard')} className="mt-4 text-sm text-dokirana-primary hover:underline">Back to Dashboard</button>
    </div>
  );

  const renderInactiveAffiliateProductsView = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Inactive Affiliate Products</h2>
      {isLoadingAffiliateProducts ? (
        <p>Loading products...</p>
      ) : affiliateProductsError ? (
        <p className="text-red-500">{affiliateProductsError}</p>
      ) : inactiveAffiliateProducts.length === 0 ? (
        <p>No inactive affiliate products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inactiveAffiliateProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-dokirana-primary hover:underline">
                      <ExternalLink className="h-4 w-4 inline-block" /> View Link
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEditProduct(product)} className="text-indigo-600 hover:text-indigo-900"><Edit className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={() => setCurrentView('affiliatesDashboard')} className="mt-4 text-sm text-dokirana-primary hover:underline">Back to Active Products</button>
    </div>
  );

  const renderDashboardView = () => {
    if (isLoading) return <p>Loading dashboard...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!adminData) return <p>No admin data found.</p>;

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Admin Profile</h3>
            <p><strong>Name:</strong> {adminData.name}</p>
            <p><strong>Email:</strong> {adminData.email}</p>
            <p><strong>Role:</strong> {adminData.role}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Branch Management</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="branch-id" className="block text-sm font-medium text-gray-700">Branch ID</label>
                <input
                  type="text"
                  id="branch-id"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-dokirana-primary focus:border-dokirana-primary sm:text-sm"
                  placeholder="Enter Branch ID to manage"
                />
              </div>
              <button
                onClick={handleVerifyAndManageBranch}
                disabled={isVerifyingBranch}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dokirana-primary hover:bg-dokirana-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dokirana-primary disabled:opacity-50"
              >
                {isVerifyingBranch ? 'Verifying...' : 'Verify & Manage Branch'}
              </button>
              {branchVerificationError && <p className="mt-2 text-sm text-red-600">{branchVerificationError}</p>}
            </div>
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
        {currentView === 'affiliatesDashboard' && renderAffiliatesDashboardView()}
        {currentView === 'inactiveAffiliateProducts' && renderInactiveAffiliateProductsView()}
      </main>
      
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