import React, { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';
import { DefaultCategory } from '../services/inventoryService';

interface ImportCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  existingDefaultCategoryIds: string[];
  onImportSuccess: () => void;
}

const ImportCategoryModal: React.FC<ImportCategoryModalProps> = ({ isOpen, onClose, branchId, existingDefaultCategoryIds, onImportSuccess }) => {
  const [availableCategories, setAvailableCategories] = useState<DefaultCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchDefaultCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const allDefaultCategories = await inventoryService.getAllDefaultCategories();
          const filteredCategories = allDefaultCategories.filter(
            (cat) => !existingDefaultCategoryIds.includes(cat._id)
          );
          setAvailableCategories(filteredCategories);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch categories.');
        }
        setIsLoading(false);
      };

      fetchDefaultCategories();
    }
  }, [isOpen, existingDefaultCategoryIds]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryIds((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleImport = async () => {
    if (selectedCategoryIds.length === 0) return;

    setIsImporting(true);
    setError(null);
    try {
      await inventoryService.importDefaultCategories(branchId, selectedCategoryIds);
      onImportSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to import categories.');
    }
    setIsImporting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Import Default Categories</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
          {isLoading ? (
            <p>Loading categories...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : availableCategories.length === 0 ? (
            <p>All default categories have already been imported.</p>
          ) : (
            <div className="space-y-2">
              {availableCategories.map((category) => (
                <div key={category._id} className="flex items-center p-2 border rounded-md">
                  <input
                    type="checkbox"
                    id={category._id}
                    checked={selectedCategoryIds.includes(category._id)}
                    onChange={() => handleSelectCategory(category._id)}
                    className="h-5 w-5 rounded border-gray-300 text-dokirana-primary focus:ring-dokirana-primary"
                  />
                  <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-cover rounded-md ml-4" />
                  <label htmlFor={category._id} className="ml-3 text-sm font-medium text-gray-700">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={selectedCategoryIds.length === 0 || isImporting}
            className="px-4 py-2 bg-dokirana-primary text-white rounded-md hover:bg-dokirana-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isImporting ? 'Importing...' : `Import (${selectedCategoryIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportCategoryModal;
