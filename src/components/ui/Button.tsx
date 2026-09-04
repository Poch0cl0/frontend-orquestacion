import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-strong",
  secondary: "bg-surface-mid text-ink hover:bg-surface-high",
  outline: "border border-line/40 bg-surface text-ink hover:border-line hover:bg-surface-low",
  ghost: "text-ink-muted hover:bg-surface-low hover:text-ink",
  danger: "border border-rose-200 bg-surface text-rose-600 hover:bg-rose-50 hover:text-rose-700",
};

const sizes = {
  sm: "h-7 px-3 text-label-md",
  md: "h-9 px-4 text-label-md",
  lg: "h-11 px-6 text-body-md font-medium",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-sans font-medium transition-colors",
        "focus-visible:ring-brand focus-visible:ring-offset-canvas focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
