import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-surface-mid", className)} aria-hidden="true" />;
}

export function KpiSkeleton() {
  return (
    <div className="surface-card flex flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-8 w-16" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="surface-card p-5">
      <Skeleton className="mb-3 h-3 w-28" />
      <Skeleton className="h-8 w-20" />
    </div>
  );
}
