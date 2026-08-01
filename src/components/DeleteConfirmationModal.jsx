import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "./Modal";
import { useState } from "react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onDelete,
  itemName,
  title = "Confirm Deletion",
  description,
  cancelText = "Cancel",
  confirmText = "Delete"
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onDelete(); // Expecting a promise or async function
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width="w-full max-w-md" centered={true}>
      <div className="text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {description ? title : `Delete ${itemName}?`}
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          {description || (
            <>
              Are you sure you want to delete <span className="font-semibold text-gray-800">"{itemName}"</span>? This action cannot be undone and all associated data will be removed.
            </>
          )}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-[8px] border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2.5 rounded-[8px] bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg shadow-red-200 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
