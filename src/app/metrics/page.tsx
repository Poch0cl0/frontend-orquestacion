"use client";

import { Clock, RefreshCw, ShieldAlert, Target } from "lucide-react";
import { Breadcrumb, PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { MetricCard } from "@/components/metrics/MetricCard";
import { IterationsChart, TsrChart, UarChart } from "@/components/metrics/Charts";
import { ComparisonChart } from "@/components/metrics/ComparisonChart";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { useMetrics } from "@/hooks/useMetrics";
import { formatDuration, formatPercent } from "@/lib/format";

export default function MetricsPage() {
  const { metrics, comparison, loading, error } = useMetrics();

  const header = (
    <PageHeader
      title="Métricas"
      description="Indicadores de evaluación científica del sistema ARGUS."
      breadcrumb={<Breadcrumb path="Gobernanza / Evaluación" id="GET /metrics" />}
    />
  );

  if (loading) {
    return (
      <PageContainer>
        <div className="flex w-full flex-col gap-5">
          {header}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <Spinner label="Calculando indicadores..." />
        </div>
      </PageContainer>
    );
  }

  if (error || !metrics || !comparison) {
    return (
      <PageContainer>
        <div className="flex w-full flex-col gap-5">
          {header}
          <div
            role="alert"
            className="text-body-md rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700"
          >
            {error ?? "No fue posible cargar las métricas del sistema."}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-5">
        {header}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Task Success Rate"
            value={formatPercent(metrics.tsr)}
            subtitle="Tareas completadas exitosamente"
            icon={Target}
          />
          <MetricCard
            title="Unauthorized Action Rate"
            value={formatPercent(metrics.uar)}
            subtitle="Secuencias peligrosas que llegaron a ejecución"
            icon={ShieldAlert}
            chipClass="bg-rose-50 text-rose-600"
            valueClass="text-rose-800"
          />
          <MetricCard
            title="Conflict Resolution"
            value={metrics.avgIterations.toFixed(1)}
            subtitle="Iteraciones promedio hasta consenso"
            icon={RefreshCw}
            chipClass="bg-teal-dim/30 text-teal"
            valueClass="text-teal"
          />
          <MetricCard
            title="Governance Overhead"
            value={formatDuration(metrics.governanceOverhead.multiAgent)}
            subtitle={`Grupo control: ${formatDuration(metrics.governanceOverhead.control)}`}
            icon={Clock}
            chipClass="bg-amber-50 text-amber-600"
            valueClass="text-amber-800"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TsrChart data={metrics.tsrTrend} />
          <UarChart data={metrics.uarTrend} />
        </div>

        <IterationsChart data={metrics.iterationsTrend} />

        <ComparisonChart data={comparison} />
      </div>
    </PageContainer>
  );
}
