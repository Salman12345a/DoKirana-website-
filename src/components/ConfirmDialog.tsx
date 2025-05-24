import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isProcessing = false
}: ConfirmDialogProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? 'Processing...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
