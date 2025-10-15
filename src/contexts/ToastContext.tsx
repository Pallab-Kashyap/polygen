"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Alert from "@/components/shared/Alert";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      hideToast(id);
    }, 10000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{
  toasts: Toast[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-5 right-2 left-2 sm:left-auto sm:right-5 w-auto sm:w-full sm:max-w-sm z-[99999]">
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          message={toast.message}
          type={
            toast.type === "success" || toast.type === "error"
              ? toast.type
              : "error"
          }
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};
