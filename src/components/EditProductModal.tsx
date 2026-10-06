import { useState, useEffect } from 'react';
import { Product, UpdateProductData, inventoryService } from '../services/inventoryService';

interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const EditProductModal = ({ product, onClose, onSave }: EditProductModalProps) => {
  const [formData, setFormData] = useState<UpdateProductData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice ?? undefined,
        quantity: product.quantity,
        unit: product.unit,
        isPacket: product.isPacket,
      });
    } else {
      setFormData({});
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      if (name === 'isPacket') {
        const newUnit = checked ? 'kg' : 'kg';
        setFormData(prev => ({ ...prev, isPacket: checked, unit: newUnit }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else if (name === 'price' || name === 'discountPrice') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveChanges = async () => {
    if (!product) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedProduct = await inventoryService.updateProductDetails(product._id, formData);
      onSave(updatedProduct);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update product.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh] border border-gray-100">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Update Product</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Edit pricing, details, and packaging</p>
          </div>
          {product.imageUrl && (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-14 h-14 object-cover rounded-xl border border-gray-200 shadow-xs"
            />
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Product Name
            </label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formData.name || ''} 
              onChange={handleInputChange} 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary transition-all" 
              placeholder="e.g. Aashirvaad Whole Wheat Atta"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                Selling Price (₹)
              </label>
              <input 
                type="number" 
                name="price" 
                id="price" 
                value={formData.price !== undefined ? formData.price : ''} 
                onChange={handleInputChange} 
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary transition-all" 
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="discountPrice" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                Discount Price (₹) <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <input 
                type="number" 
                name="discountPrice" 
                id="discountPrice" 
                value={formData.discountPrice !== undefined ? formData.discountPrice : ''} 
                onChange={handleInputChange} 
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary transition-all" 
                placeholder="Optional"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                Quantity / Pack Size
              </label>
              <input 
                type="text" 
                name="quantity" 
                id="quantity" 
                value={formData.quantity || ''} 
                onChange={handleInputChange} 
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary transition-all" 
                placeholder="e.g. 1 or 500"
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                Unit
              </label>
              <select 
                name="unit" 
                id="unit" 
                value={formData.unit || ''} 
                onChange={handleInputChange} 
                className="w-full px-3.5 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary transition-all"
              >
                {formData.isPacket ? (
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
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <span className="text-sm font-semibold text-gray-800 block">Packaged Product</span>
              <span className="text-xs text-gray-500">Toggle if this item is sold pre-packaged vs loose</span>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isPacket" 
                checked={formData.isPacket || false} 
                onChange={handleInputChange} 
                className="sr-only peer" 
              />
              <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-dokirana-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dokirana-primary"></div>
            </label>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Description
            </label>
            <textarea 
              name="description" 
              id="description" 
              value={formData.description || ''} 
              onChange={handleInputChange} 
              rows={3} 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dokirana-primary focus:border-dokirana-primary transition-all resize-none"
              placeholder="Product description and details"
            ></textarea>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button"
            onClick={onClose} 
            className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSaveChanges} 
            className="px-6 py-2.5 bg-dokirana-primary text-white text-sm font-semibold rounded-xl hover:bg-dokirana-light transition-all shadow-sm disabled:opacity-50" 
            disabled={isSaving}
          >
            {isSaving ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
