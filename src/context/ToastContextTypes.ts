import { createContext, type ReactNode } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextValue {
  id: string;
  type: string;
  message: ReactNode;
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
