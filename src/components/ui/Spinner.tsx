import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function Spinner({ className, label = "Cargando..." }: { className?: string; label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-10"
      role="status"
      aria-label={label}
    >
      <Loader2 className={cn("text-brand h-6 w-6 animate-spin", className)} aria-hidden="true" />
      <span className="text-body-sm text-ink-subtle">{label}</span>
    </div>
  );
}
