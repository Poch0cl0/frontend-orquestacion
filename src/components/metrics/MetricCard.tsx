import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  chipClass?: string;
  valueClass?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  chipClass = "bg-surface-high text-brand",
  valueClass = "text-ink",
}: MetricCardProps) {
  return (
    <div className="surface-card flex flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="eyebrow font-semibold">{title}</span>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", chipClass)}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
      </div>
      <p className={cn("text-display mt-3 font-sans tabular-nums", valueClass)}>{value}</p>
      {subtitle && <p className="text-body-sm text-ink-subtle mt-1">{subtitle}</p>}
    </div>
  );
}
