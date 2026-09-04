"use client";

import { CheckCircle2, Layers, LoaderCircle, RefreshCw, ShieldX, type LucideIcon } from "lucide-react";
import { useMetrics } from "@/hooks/useMetrics";
import { KpiSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

interface Kpi {
  label: string;
  value: string;
  icon: LucideIcon;
  chipClass: string;
  valueClass: string;
  spin?: boolean;
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.icon;
  return (
    <div className="surface-card flex flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="eyebrow font-semibold">{kpi.label}</span>
        <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", kpi.chipClass)}>
          <Icon className={cn("h-4 w-4", kpi.spin && "animate-spin")} aria-hidden="true" />
        </span>
      </div>
      <p className={cn("text-display mt-3 font-sans tabular-nums", kpi.valueClass)}>{kpi.value}</p>
    </div>
  );
}

export function DashboardStats() {
  const { metrics, loading } = useMetrics();

  if (loading || !metrics) {
    return (
      <section aria-label="Indicadores clave" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </section>
    );
  }

  const kpis: Kpi[] = [
    {
      label: "Tareas procesadas",
      value: String(metrics.tasksProcessed),
      icon: Layers,
      chipClass: "bg-surface-low text-ink-muted",
      valueClass: "text-ink",
    },
    {
      label: "Tareas aprobadas",
      value: String(metrics.tasksApproved),
      icon: CheckCircle2,
      chipClass: "bg-emerald-50 text-emerald-700",
      valueClass: "text-emerald-800",
    },
    {
      label: "Tareas rechazadas",
      value: String(metrics.tasksRejected),
      icon: ShieldX,
      chipClass: "bg-rose-50 text-rose-700",
      valueClass: "text-rose-800",
    },
    {
      label: "En ejecución",
      value: String(metrics.tasksInExecution),
      icon: LoaderCircle,
      chipClass: "bg-surface-high text-brand",
      valueClass: "text-brand-strong",
      spin: metrics.tasksInExecution > 0,
    },
    {
      label: "Iteraciones promedio",
      value: metrics.avgIterations.toFixed(1),
      icon: RefreshCw,
      chipClass: "bg-teal-dim/30 text-teal",
      valueClass: "text-teal",
    },
  ];

  return (
    <section aria-label="Indicadores clave" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </section>
  );
}
