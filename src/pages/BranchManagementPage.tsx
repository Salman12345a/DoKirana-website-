import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import config from '../config/config';

// Define the structure of the branch data
interface Branch {
  _id: string;
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    area?: string;
  };
  ownerName: string;
  branchEmail: string;
  status: 'pending' | 'approved' | 'rejected';
}

const BranchManagementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // The branch data is passed in the location state from AdminDashboard
    if (location.state && location.state.branch) {
      setBranch(location.state.branch);
    } else {
      // If no branch data is found, redirect back to the dashboard
      navigate('/admin/dashboard');
    }
  }, [location, navigate]);

  const handleBranchAction = async (action: 'approve' | 'reject') => {
    if (!branch) return;

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const adminToken = localStorage.getItem(config.auth.tokenStorageKey);
      if (!adminToken) {
        setError('Authentication expired. Please log in again.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${config.api.baseUrl}/api/admin/branches/${branch._id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setBranch(data.data.branch);
        setSuccessMessage(`Branch has been successfully ${action === 'approve' ? 'approved' : 'rejected'}.`);
      } else {
        setError(data.message || 'An unknown error occurred.');
      }
    } catch (err) {
      console.error(`Failed to ${action} branch:`, err);
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!branch) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading branch details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-dokirana-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">Branch Management</h1>
            <p className="text-gray-600 mt-1">Manage details and approval status for {branch.name}.</p>
          </div>

          <div className="p-6">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Branch Details</h2>
                <p><strong>ID:</strong> {branch._id}</p>
                <p><strong>Name:</strong> {branch.name}</p>
                <p><strong>Phone:</strong> {branch.phone}</p>
                <p><strong>Status:</strong> 
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${branch.status === 'approved' ? 'bg-green-100 text-green-800' : branch.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {branch.status}
                  </span>
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Owner Information</h2>
                <p><strong>Name:</strong> {branch.ownerName}</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Address</h2>
              <p>
                {[branch.address.street, branch.address.city, branch.address.state, branch.address.pincode, branch.address.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Branch Actions</h2>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => navigate(`/admin/manage-branch/${branch._id}/inventory`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Inventory Management
                </button>
              </div>
            </div>

            {branch.status === 'pending' && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => handleBranchAction('reject')}
                  disabled={isLoading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  {isLoading ? 'Rejecting...' : 'Reject Branch'}
                </button>
                <button 
                  onClick={() => handleBranchAction('approve')}
                  disabled={isLoading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {isLoading ? 'Approving...' : 'Approve Branch'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchManagementPage;
