import Modal from "./Modal";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}: ConfirmationModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <p className="text-gray-600 mb-6 text-sm sm:text-base">{message}</p>
    <div className="flex flex-col sm:flex-row justify-end gap-3">
      <button
        onClick={onClose}
        className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition order-2 sm:order-1"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:bg-red-400 order-1 sm:order-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Confirm
      </button>
    </div>
  </Modal>
);

export default ConfirmationModal;
