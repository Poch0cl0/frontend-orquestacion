import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  adornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, adornment, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="eyebrow text-ink-muted font-semibold" >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "text-body-md text-ink placeholder:text-ink-subtle h-9 w-full rounded-lg border border-transparent bg-surface-low px-3 font-mono tabular-nums transition-colors",
              "focus-visible:border-brand focus-visible:bg-surface focus-visible:ring-brand/20 focus-visible:ring-2",
              adornment && "pr-9",
              error && "border-rose-300 bg-rose-50/40",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {adornment && (
            <span className="text-ink-subtle pointer-events-none absolute right-3 flex items-center" aria-hidden="true">
              {adornment}
            </span>
          )}
        </div>
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-body-sm text-ink-subtle">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-label-md font-medium text-rose-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
