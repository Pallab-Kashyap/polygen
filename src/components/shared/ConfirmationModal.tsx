import Modal from './Modal';
import { Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    loading: boolean;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, loading }: ConfirmationModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                Cancel
            </button>
            <button 
                onClick={onConfirm} 
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:bg-red-400"
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm
            </button>
        </div>
    </Modal>
);

export default ConfirmationModal;
