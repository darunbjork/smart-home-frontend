import React from 'react';

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive"
type ButtonSize    = "sm" | "md" | "lg"

interface ButtonProps {
  variant?:  ButtonVariant
  size?:     ButtonSize
  disabled?: boolean
  loading?:  boolean
  onClick?:  () => void
  children:  React.ReactNode
  type?: "button" | "submit"
  className?: string // Add className prop
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:     "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]",
  secondary:   "bg-transparent border border-[var(--border)] hover:border-[var(--brand)]",
  ghost:       "bg-transparent text-[var(--text-secondary)] hover:text-white",
  destructive: "bg-[var(--error)] text-white hover:opacity-90",
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-[var(--space-3)] py-[var(--space-1)] text-[var(--text-sm)]",
  md: "px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-base)]",
  lg: "px-[var(--space-6)] py-[var(--space-3)] text-[var(--text-lg)]",
}

export const Button = ({ 
  variant = "primary", 
  size = "md", 
  disabled, 
  loading, 
  onClick, 
  children,
  type = "button",
  className = "" // Initialize className
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-(--space-1) font-(--weight-medium) transition-all duration-(--duration-small) flex items-center justify-center gap-(--space-2) active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} 
    >
      {loading ? <span className="animate-pulse">...</span> : children}
    </button>
  );
};