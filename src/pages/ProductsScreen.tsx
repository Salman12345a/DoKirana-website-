import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Edit3, PlusCircle, Search, ArrowLeft, Package } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductData, setNewProductData] = useState<CreateProductData>({ name: '', description: '', price: 0, quantity: 1, unit: 'kg', isPacket: false });
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

  const baseProducts = activeTab === 'default' ? defaultProducts : customProducts;
  const filteredProducts = baseProducts.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      const newUnit = checked ? 'kg' : 'kg'; 
      setNewProductData({ ...newProductData, [name]: checked, unit: newUnit });
    } else if (name === 'price' || name === 'quantity') {
      setNewProductData({ ...newProductData, [name]: Number(value) });
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
      setNewProductData({ name: '', description: '', price: 0, quantity: 1, unit: 'kg', isPacket: false });
      setNewProductImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchProducts(branchId, categoryId);
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create product.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p)
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-12 text-center text-gray-500">
          <div className="inline-block w-8 h-8 border-4 border-dokirana-primary border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-medium">Loading products...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center">
          <div className="inline-block p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-200">
            Error: {error}
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 bg-gray-50/60 rounded-b-2xl border border-t-0 border-gray-200">
        {/* Controls: Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeTab === 'default' ? 'default' : 'custom'} products...`}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary shadow-xs transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'default' && !isCustomCategory && defaultCategoryId && (
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl shadow-xs text-white bg-dokirana-primary hover:bg-dokirana-light transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Import Default Products
              </button>
            )}
            {activeTab === 'custom' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl shadow-xs text-white bg-dokirana-primary hover:bg-dokirana-light transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Create Custom Product
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-500">
            {searchQuery.trim() ? (
              <p>No products match "{searchQuery}". Try a different keyword.</p>
            ) : activeTab === 'default' ? (
              'No default products in this category. Use the button above to import them.'
            ) : (
              'No custom products created yet. Use the button above to create one.'
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product._id} 
                className="bg-white rounded-xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-[260px] group"
              >
                {/* Fixed-size uniform image container */}
                <div className="relative h-32 w-full bg-white flex items-center justify-center p-2.5 overflow-hidden border-b border-gray-100 shrink-0">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100/95 text-gray-700 border border-gray-200 shadow-2xs">
                      <Package className="w-2.5 h-2.5 text-dokirana-primary" />
                      {product.isPacket ? 'Packaged' : 'Loose'}
                    </span>
                  </div>
                </div>

                {/* Card content without description */}
                <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm truncate" title={product.name}>
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="flex items-baseline gap-1 truncate">
                        {product.discountPrice && product.discountPrice < product.price ? (
                          <>
                            <span className="text-base font-extrabold text-dokirana-primary">
                              ₹{product.discountPrice}
                            </span>
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-extrabold text-gray-900">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-gray-500 shrink-0">
                        {product.quantity} {product.unit}
                      </span>
                    </div>

                    {/* Dedicated Update Button on Card */}
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="w-full py-1.5 px-3 bg-dokirana-primary hover:bg-dokirana-light active:scale-98 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 z-50 w-full max-w-2xl my-8 border border-gray-100 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Custom Product</h2>
            <p className="text-sm text-gray-500 mb-6">Add a custom product to this branch category</p>
            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4 text-sm">
                {createError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={newProductData.name} 
                    onChange={handleInputChange} 
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary" 
                    placeholder="Product name"
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="price" 
                    id="price" 
                    value={newProductData.price || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary" 
                    required 
                    min="0.01" 
                    step="0.01" 
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="quantity" 
                    id="quantity" 
                    value={newProductData.quantity || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary" 
                    required 
                    min="1" 
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="unit" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit"
                    id="unit"
                    value={newProductData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary"
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
                        <option value="g">Gram (g)</option>
                        <option value="pc">Piece (pc)</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="description" 
                    id="description" 
                    value={newProductData.description} 
                    onChange={handleInputChange} 
                    rows={3} 
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary resize-none" 
                    placeholder="Details about product"
                    required
                  ></textarea>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <input 
                    type="checkbox" 
                    name="isPacket" 
                    id="isPacket" 
                    checked={newProductData.isPacket} 
                    onChange={handleInputChange} 
                    className="h-4 w-4 text-dokirana-primary focus:ring-dokirana-primary border-gray-300 rounded" 
                  />
                  <label htmlFor="isPacket" className="text-xs font-medium text-gray-800 cursor-pointer">Is this a packaged item?</label>
                </div>
                <div>
                  <label htmlFor="productImage" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Product Image <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" 
                    id="productImage" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-dokirana-lighter file:text-dokirana-primary hover:file:bg-purple-100" 
                    required 
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleCreateProduct} 
                className="px-6 py-2.5 bg-dokirana-primary text-white text-sm font-semibold rounded-xl hover:bg-dokirana-light transition-all shadow-sm disabled:opacity-50" 
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Top navigation */}
          <button
            onClick={() => navigate(`/admin/manage-branch/${branchId}/inventory`)}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Products Management</h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Managing products for category ID: <span className="font-mono text-gray-700">{categoryId}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-white px-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {!isCustomCategory && (
                  <button
                    onClick={() => setActiveTab('default')}
                    className={`${activeTab === 'default' ? 'border-dokirana-primary text-dokirana-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2`}
                  >
                    Default Products
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'default' ? 'bg-dokirana-lighter text-dokirana-primary' : 'bg-gray-100 text-gray-600'}`}>
                      {defaultProducts.length}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`${activeTab === 'custom' ? 'border-dokirana-primary text-dokirana-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2`}
                >
                  Custom Products
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'custom' ? 'bg-dokirana-lighter text-dokirana-primary' : 'bg-gray-100 text-gray-600'}`}>
                    {customProducts.length}
                  </span>
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
