import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "violet" | "teal" | "mono";
}

const variants = {
  default: "bg-surface-low text-ink-muted border-line/20",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-brand-soft text-brand-ink border-brand-dim/60",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  teal: "bg-teal-soft/40 text-teal border-teal-dim/50",
  mono: "bg-surface-low text-ink-subtle border-line/20 font-mono",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 font-sans text-label-micro font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
