import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import EditProductModal from '../components/EditProductModal';
import ImportProductModal from '../components/ImportProductModal';
import { inventoryService, Product, CreateProductData } from '../services/inventoryService';

const ProductsScreen = () => {
  const { branchId, categoryId } = useParams<{ branchId: string; categoryId: string; }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCustomCategory, defaultCategoryId } = location.state || { isCustomCategory: false, defaultCategoryId: null };
  const [activeTab, setActiveTab] = useState<'default' | 'custom'>(isCustomCategory ? 'custom' : 'default');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductData, setNewProductData] = useState<CreateProductData>({ name: '', description: '', price: 0, quantity: 1, unit: '', isPacket: false });
  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    if (branchId && categoryId) {
      fetchProducts(branchId, categoryId);
    }
  }, [branchId, categoryId]);

  const fetchProducts = async (bId: string, cId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await inventoryService.getProductsForCategory(bId, cId);
      setProducts(fetchedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products.');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultProducts = products.filter(p => p.createdFromTemplate);
  const customProducts = products.filter(p => !p.createdFromTemplate);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      // When isPacket is toggled, reset the unit to the first valid option
      const newUnit = checked ? 'kg' : 'kg'; 
      setNewProductData({ ...newProductData, [name]: checked, unit: newUnit });
    } else {
      setNewProductData({ ...newProductData, [name]: value });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewProductImage(event.target.files[0]);
    }
  };

  const handleCreateProduct = async () => {
    const { name, description, price, quantity, unit } = newProductData;

    if (!name.trim() || !description.trim() || price <= 0 || quantity <= 0 || !unit.trim() || !newProductImage) {
      setCreateError('All fields are required and must have valid values. Please also upload an image.');
      return;
    }

    if (!branchId || !categoryId) {
        setCreateError('Branch or Category ID is missing. Cannot create product.');
        return;
    }
    setIsCreating(true);
    setCreateError(null);
    try {
      await inventoryService.createCustomProduct(branchId, categoryId, newProductData, newProductImage);
      setIsModalOpen(false);
      // Reset form
      setNewProductData({ name: '', description: '', price: 0, quantity: 1, unit: '', isPacket: false });
      setNewProductImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchProducts(branchId, categoryId); // Refresh list
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create product.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!branchId) return;

    if (window.confirm('Are you sure you want to remove this imported product?')) {
      try {
        await inventoryService.removeImportedProduct(branchId, productId);
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
      } catch (err: any) {
        alert(`Failed to remove product: ${err.message}`);
      }
    }
  };

  const handleDeleteCustomProduct = async (productId: string) => {
    if (!branchId) return;

    if (window.confirm('Are you sure you want to permanently delete this custom product? This action cannot be undone.')) {
      try {
        await inventoryService.deleteCustomProduct(branchId, productId);
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
      } catch (err: any) {
        alert(`Failed to delete product: ${err.message}`);
      }
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p)
    );
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (editingProduct) {
      if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        const newUnit = checked ? 'kg' : 'kg';
        setEditingProduct({ ...editingProduct, [name]: checked, unit: newUnit });
      } else {
        setEditingProduct({ ...editingProduct, [name]: value });
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="p-6 text-center">Loading products...</div>;
    }

    if (error) {
      return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    }

    const productsToDisplay = activeTab === 'default' ? defaultProducts : customProducts;

    const productGrid = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productsToDisplay.map(product => (
          <div key={product._id} className="relative bg-white rounded-lg shadow-md overflow-hidden group">
            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover"/>
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 truncate">{product.description}</p>
              <div className="mt-2 font-bold text-lg">₹{product.price} / {product.quantity}{product.unit}</div>
            </div>
            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingProduct(product)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <Edit className="h-5 w-5 text-gray-600" />
              </button>
              {activeTab === 'default' && (
                <button onClick={() => handleRemoveProduct(product._id)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              )}
              {activeTab === 'custom' && (
                <button onClick={() => handleDeleteCustomProduct(product._id)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <div className="p-6 bg-gray-50 rounded-b-lg">
        <div className="flex justify-end mb-4">
          {activeTab === 'default' && !isCustomCategory && defaultCategoryId && (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dokirana-primary hover:bg-dokirana-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dokirana-primary"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
              Import Default Products
            </button>
          )}
          {activeTab === 'custom' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dokirana-primary hover:bg-dokirana-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dokirana-primary"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
              Create Custom Product
            </button>
          )}
        </div>

        {productsToDisplay.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {activeTab === 'default'
              ? 'No default products in this category. Use the button above to import them.'
              : 'No custom products created yet. Use the button above to create one.'}
          </div>
        ) : productGrid}
      </div>
    );
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center overflow-y-auto p-4">
          <div className="bg-white rounded-lg p-8 z-50 w-full max-w-2xl my-8">
            <h2 className="text-2xl font-bold mb-6">Create Custom Product</h2>
            {createError && <p className="text-red-500 mb-4 text-center">{createError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" id="name" value={newProductData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price <span className="text-red-500">*</span></label>
                  <input type="number" name="price" id="price" value={newProductData.price} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required min="0.01" step="0.01" />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                  <input type="number" name="quantity" id="quantity" value={newProductData.quantity} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required min="1" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit <span className="text-red-500">*</span></label>
                  <select
                    name="unit"
                    id="unit"
                    value={newProductData.unit}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    {newProductData.isPacket ? (
                      <>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="L">Liter (L)</option>
                        <option value="ml">Milliliter (ml)</option>
                        <option value="pc">Piece (pc)</option>
                      </>
                    ) : (
                      <>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="L">Liter (L)</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                  <textarea name="description" id="description" value={newProductData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" name="isPacket" id="isPacket" checked={newProductData.isPacket} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="isPacket" className="ml-2 block text-sm text-gray-900">Is this a packet?</label>
                </div>
                <div>
                  <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">Product Image <span className="text-red-500">*</span></label>
                  <input type="file" id="productImage" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" required />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleCreateProduct} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(`/admin/manage-branch/${branchId}/inventory`)}
            className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            &larr; Back to Categories
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-600">Managing products for category ID: {categoryId}</p>

          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {!isCustomCategory && (
                  <button
                    onClick={() => setActiveTab('default')}
                    className={`${activeTab === 'default' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Default Products
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`${activeTab === 'custom' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Custom Products
                </button>
              </nav>
            </div>
            {renderContent()}
          </div>
          {editingProduct && (
            <EditProductModal 
              product={editingProduct}
              onClose={() => setEditingProduct(null)}
              onSave={handleUpdateProduct}
            />
          )}
          {branchId && categoryId && defaultCategoryId && (
            <ImportProductModal 
              isOpen={isImportModalOpen}
              onClose={() => setIsImportModalOpen(false)}
              branchId={branchId}
              categoryId={categoryId}
              defaultCategoryId={defaultCategoryId}
              existingDefaultProductIds={defaultProducts.map(p => p.defaultProductId).filter((id): id is string => !!id)}
              onImportSuccess={() => fetchProducts(branchId, categoryId)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsScreen;
