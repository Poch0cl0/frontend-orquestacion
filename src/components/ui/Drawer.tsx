"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

export function Drawer({ open, onClose, title, eyebrow, children, className }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="animate-in absolute inset-0 bg-slate-900/35 backdrop-blur-[4px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "slide-in-from-right relative flex h-full w-full max-w-lg flex-col border-l border-line/40 bg-surface shadow-[0_20px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.04)]",
          className,
        )}
      >
        <div className="flex h-topbar shrink-0 items-center justify-between border-b border-line/20 px-5">
          <div className="flex flex-col">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className="text-headline-sm text-ink font-sans">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-subtle hover:bg-surface-low hover:text-ink focus-visible:ring-brand rounded-md p-1.5 transition-colors focus-visible:ring-2"
            aria-label="Cerrar panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
