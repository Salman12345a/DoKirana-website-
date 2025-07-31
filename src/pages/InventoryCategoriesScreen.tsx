import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inventoryService, Category } from '../services/inventoryService';
import { Trash2, PlusCircle } from 'lucide-react';
import ImportCategoryModal from '../components/ImportCategoryModal';

const InventoryCategoriesScreen = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'default' | 'custom'>('default');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    if (branchId) {
      fetchCategories(branchId);
    }
  }, [branchId]);

  const fetchCategories = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCategories = await inventoryService.getBranchCategories(id);
      setCategories(fetchedCategories);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories.');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultCategories = categories.filter(c => c.createdFromTemplate);
  const customCategories = categories.filter(c => !c.createdFromTemplate);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewCategoryImage(event.target.files[0]);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName || !newCategoryImage || !branchId) {
      setCreateError('Name and image are required.');
      return;
    }
    setIsCreating(true);
    setCreateError(null);
    try {
      await inventoryService.createCustomCategory(branchId, newCategoryName, newCategoryImage);
      setIsCreateModalOpen(false);
      setNewCategoryName('');
      setNewCategoryImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchCategories(branchId); // Refresh the list
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create category.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    if (!branchId) return;

    try {
      const products = await inventoryService.getProductsForCategory(branchId, categoryId);
      if (products.length > 0) {
        alert('This category cannot be removed because it contains products. Please empty the category first.');
        return;
      }

      const isConfirmed = window.confirm('Are you sure you want to remove this category?');
      if (isConfirmed) {
        await inventoryService.removeImportedCategory(branchId, categoryId);
        await fetchCategories(branchId); // Refresh the list
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove category.');
    }
  };

  const handleDeleteCustomCategory = async (categoryId: string) => {
    if (!branchId) return;

    try {
      const products = await inventoryService.getProductsForCategory(branchId, categoryId);
      if (products.length > 0) {
        alert('This category cannot be removed because it contains products. Please empty the category first.');
        return;
      }

      const isConfirmed = window.confirm('Are you sure you want to delete this custom category?');
      if (isConfirmed) {
        await inventoryService.deleteCustomCategory(branchId, categoryId);
        await fetchCategories(branchId); // Refresh the list
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete custom category.');
    }
  };

  const renderContent = () => {
    const categoriesToDisplay = activeTab === 'default' ? defaultCategories : customCategories;

    if (isLoading) {
      return <p className="text-center mt-8">Loading categories...</p>;
    }

    if (error) {
      return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    return (
      <div className="mt-6">
        <div className="flex justify-end mb-4">
          {activeTab === 'custom' && (
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dokirana-primary hover:bg-dokirana-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dokirana-primary"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
              Create Custom Category
            </button>
          )}
          {activeTab === 'default' && (
            <button 
              onClick={() => setIsImportModalOpen(true)} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dokirana-primary hover:bg-dokirana-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dokirana-primary"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
              Import Default Categories
            </button>
          )}
        </div>

        {categoriesToDisplay.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {activeTab === 'default' ? 'No default categories found.' : 'No custom categories created yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categoriesToDisplay.map(category => (
              <div 
                key={category._id} 
                className="relative bg-white rounded-lg shadow-md overflow-hidden group"
              >
                <div className="cursor-pointer" onClick={() => navigate(`/admin/manage-branch/${branchId}/inventory/${category._id}`, { state: { isCustomCategory: !category.createdFromTemplate, defaultCategoryId: category.defaultCategoryId } })}>
                  <img src={category.imageUrl} alt={category.name} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <h3 className="font-semibold text-center truncate">{category.name}</h3>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeTab === 'default') {
                      handleRemoveCategory(category._id);
                    } else {
                      handleDeleteCustomCategory(category._id);
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label={activeTab === 'default' ? 'Remove category' : 'Delete custom category'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 z-50 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Custom Category</h2>
            {createError && <p className="text-red-500 mb-4">{createError}</p>}
            <div className="space-y-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">Category Image</label>
                <input
                  type="file"
                  id="categoryImage"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button 
                onClick={handleCreateCategory} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {branchId && (
        <ImportCategoryModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          branchId={branchId}
          existingDefaultCategoryIds={defaultCategories.map(c => c.defaultCategoryId).filter((id): id is string => !!id)}
          onImportSuccess={() => fetchCategories(branchId)}
        />
      )}

      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <button
                onClick={() => navigate(`/admin/manage-branch`)}
                className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                &larr; Back to Branch Management
            </button>

            <h1 className="text-3xl font-bold text-gray-900">Inventory Categories</h1>
            <p className="mt-2 text-sm text-gray-600">Managing inventory for branch ID: {branchId}</p>

            <div className="mt-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('default')}
                            className={`${activeTab === 'default' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Default Categories
                        </button>
                        <button
                            onClick={() => setActiveTab('custom')}
                            className={`${activeTab === 'custom' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Custom Categories
                        </button>
                    </nav>
                </div>
                {renderContent()}
            </div>
        </div>
    </div>
    </>
  );
};

export default InventoryCategoriesScreen;
