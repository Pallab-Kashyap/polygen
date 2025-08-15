import { X } from 'lucide-react';

interface AlertProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Alert = ({ message, type = 'error', onClose }: AlertProps) => {
  if (!message) return null;
  const colors = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
  };
  return (
    <div className={`border rounded-lg p-4 my-4 relative ${colors[type]}`} role="alert">
      <span className="block sm:inline">{message}</span>
      <button onClick={onClose} className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Alert;
