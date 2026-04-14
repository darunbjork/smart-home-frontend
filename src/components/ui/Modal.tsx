import { type ReactNode, useEffect } from "react";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[var(--space-4)]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--space-4)] shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-[var(--space-4)] border-b border-[var(--border)]">
          <h2 className="font-[var(--weight-bold)] text-[var(--text-lg)]">{title}</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">✕</button>
        </div>
        <div className="p-[var(--space-6)]">
          {children}
        </div>
      </div>
    </div>
  );
};
