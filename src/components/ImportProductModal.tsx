import { useState, useEffect } from 'react';
import { inventoryService, DefaultProduct } from '../services/inventoryService';

interface ImportProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  categoryId: string;
  defaultCategoryId: string; // The ID of the default category template
  existingDefaultProductIds: string[];
  onImportSuccess: () => void;
}

const ImportProductModal = ({ 
  isOpen, 
  onClose, 
  branchId, 
  categoryId, 
  defaultCategoryId,
  existingDefaultProductIds, 
  onImportSuccess 
}: ImportProductModalProps) => {
  const [products, setProducts] = useState<DefaultProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && defaultCategoryId) {
      setIsLoading(true);
      setError(null);
      inventoryService.getDefaultProductsForCategory(defaultCategoryId)
        .then(data => {
          // Filter out products that are already imported
          const availableProducts = data.filter(p => !existingDefaultProductIds.includes(p._id));
          setProducts(availableProducts);
        })
        .catch(err => {
          setError(err.message || 'Failed to fetch default products.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, defaultCategoryId, existingDefaultProductIds]);

  const handleToggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleImport = async () => {
    if (selectedProducts.length === 0) {
      setError('Please select at least one product to import.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await inventoryService.importDefaultProducts(branchId, categoryId, selectedProducts);
      onImportSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to import products.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 z-50 w-full max-w-lg max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Import Default Products</h2>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="overflow-y-auto flex-grow">
          {isLoading && !products.length ? (
            <p className="text-center">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No new default products available to import.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(product => (
                <div key={product._id} className="flex items-center p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id={`product-${product._id}`}
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleToggleProduct(product._id)}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor={`product-${product._id}`} className="ml-3 flex items-center cursor-pointer">
                    <img src={product.imageUrl} alt={product.name} className="h-12 w-12 object-cover rounded-md mr-3"/>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">Price: ₹{product.suggestedPrice}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-4 border-t pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
          <button 
            onClick={handleImport} 
            className="px-4 py-2 bg-dokirana-primary text-white rounded-md hover:bg-dokirana-primary-dark disabled:bg-indigo-300"
            disabled={isLoading || selectedProducts.length === 0}
          >
            {isLoading ? 'Importing...' : `Import ${selectedProducts.length} Product(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportProductModal;
