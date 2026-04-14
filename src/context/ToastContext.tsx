import { useState, type ReactNode } from "react";
import { ToastContext, type ToastContextValue, type ToastType, type Toast } from "../context/ToastContextTypes"; 

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const contextValue: ToastContextValue = {
    showToast,
    id: "",
    type: "",
    message: undefined
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Portal */}
      <div className="fixed flex flex-col gap-3 bottom-6 right-6 z-100"> 
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-slide-in-right
              ${toast.type === "success" ? "bg-green-900/20 border-green-500 text-green-400" : ""}
              ${toast.type === "error" ? "bg-red-900/20 border-red-500 text-red-400" : ""}
              ${toast.type === "info" ? "bg-(--bg-surface) border-(--border) text-(--text-primary)" : ""} {/* Changed bg-[var(--bg-surface)], border-[var(--border)], text-[var(--text-primary)] */}
            `}
          >
            <span className="text-lg">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "info" && "ℹ️"}
            </span>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
