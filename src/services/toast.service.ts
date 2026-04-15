import type { ToastContextValue } from "../context/ToastContext"; 

let showToast: ToastContextValue['showToast'] | undefined;

export const setToastFunction = (toastFunction: ToastContextValue['showToast']) => {
  showToast = toastFunction;
};

export const globalShowToast = (message: string, type: 'success' | 'error' | 'info') => {
  if (showToast) {
    showToast(message, type);
  } else {
    console.warn("showToast function not set in toast.service.ts. Toast message not displayed:", message);
  }
};
