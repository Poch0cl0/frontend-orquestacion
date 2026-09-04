import { cn } from "@/lib/cn";

export interface StatusDotProps {
  className?: string;
  pulse?: boolean;
  label?: string;
}

export function StatusDot({ className, pulse, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-label={label}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", className)}
          />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", className)} />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </span>
  );
}
