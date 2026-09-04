"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  detail?: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, detail?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons = { success: Check, error: AlertTriangle, info: Info };

const iconStyles = {
  success: "bg-teal-soft text-teal",
  error: "bg-rose-100 text-rose-600",
  info: "bg-brand-soft text-brand",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info", detail?: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, detail, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed right-6 bottom-6 z-[100] flex flex-col gap-3"
        aria-live="polite"
        aria-label="Notificaciones"
      >
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              role="alert"
              className="slide-in-from-bottom flex items-center gap-3 rounded-xl border border-line/30 bg-surface/95 px-4 py-3 shadow-[0_10px_15px_-3px_rgba(15,23,42,0.08),0_4px_6px_-4px_rgba(15,23,42,0.04)] backdrop-blur-md"
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  iconStyles[t.type],
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              </div>
              <div className="flex min-w-0 flex-col pr-2">
                <span className="text-body-md text-ink font-sans font-semibold">{t.message}</span>
                {t.detail && (
                  <span className="text-body-sm text-ink-muted mt-0.5 font-mono">{t.detail}</span>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-ink-subtle hover:bg-surface-mid hover:text-ink rounded-md p-1 transition-colors"
                aria-label="Cerrar notificación"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
