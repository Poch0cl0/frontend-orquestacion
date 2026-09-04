"use client";

import { useEffect, useState } from "react";
import type { ComparisonMetrics, MetricsSummary } from "@/types";
import { getComparisonMetrics, getMetrics } from "@/services/metrics.service";

export function useMetrics() {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [comparison, setComparison] = useState<ComparisonMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [m, c] = await Promise.all([getMetrics(), getComparisonMetrics()]);
        if (!cancelled) {
          setMetrics(m);
          setComparison(c);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar métricas");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { metrics, comparison, loading, error };
}
