import { createContext, useState, useContext, type ReactNode, useCallback, useEffect } from "react";
import { setToastFunction } from "../services/toast.service";
import type { ToastType, Toast } from "./ToastContextTypes";

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    setToastFunction(showToast);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed flex flex-col gap-3 pointer-events-none bottom-6 right-6 z-100">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-slide-in-right
              ${toast.type === "success" ? "bg-green-900/20 border-(--success) text-(--success)" : ""}
              ${toast.type === "error" ? "bg-red-900/20 border-(--error) text-(--error)" : ""}
              ${toast.type === "info" ? "bg-(--bg-surface) border-(--border) text-(--text-primary)" : ""}
            `}
          >
            <span className="text-lg">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "info" && "ℹ️"}
            </span>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
