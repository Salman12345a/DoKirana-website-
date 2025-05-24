import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import affiliateService, { AffiliateProduct } from '../services/affiliateService';

interface EditAffiliateProductModalProps {
  product: AffiliateProduct;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProduct: AffiliateProduct) => void;
}

const EditAffiliateProductModal = ({
  product,
  isOpen,
  onClose,
  onSuccess
}: EditAffiliateProductModalProps) => {
  const [name, setName] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setName(product.name);
      setAffiliateLink(product.affiliateLink);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const updatedProduct = await affiliateService.updateProduct(product._id, {
        name,
        affiliateLink
      });

      onSuccess(updatedProduct);
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Affiliate Product</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="border rounded-lg overflow-hidden h-40 flex items-center justify-center bg-gray-50 mb-2">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 truncate">Image URL: {product.imageUrl}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dokirana-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="affiliateLink" className="block text-gray-700 font-medium mb-2">
                Affiliate Link
              </label>
              <input
                type="url"
                id="affiliateLink"
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dokirana-primary"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-dokirana-primary text-white rounded-md hover:bg-dokirana-secondary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAffiliateProductModal;
