import { X } from "lucide-react";
import React from "react";
import BackgroundLayout from "../BackgroundLayout";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <BackgroundLayout z="9998" />
      <div
        className="fixed inset-0 flex justify-center items-center p-4"
        style={{ zIndex: 9999 }}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative"
          style={{ zIndex: 10000 }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
