import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, id, ...props }, ref) => (
    <textarea
      ref={ref}
      id={id || props.name}
      className={cn(
        "text-body-md text-ink placeholder:text-ink-subtle w-full resize-y rounded-lg border border-transparent bg-surface-low p-3 leading-relaxed transition-colors",
        "focus-visible:border-brand focus-visible:bg-surface focus-visible:ring-brand/20 focus-visible:ring-2",
        error && "border-rose-200 bg-rose-50/40",
        className,
      )}
      aria-invalid={!!error}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
