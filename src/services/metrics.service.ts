import type { ComparisonMetrics, MetricsSummary } from "@/types";
import { delay } from "./api";
import { isMockMode } from "@/transport/types";
import { mockComparison, mockMetrics } from "@/mocks/metrics";

export async function getMetrics(): Promise<MetricsSummary> {
  if (isMockMode()) {
    await delay(400);
    return mockMetrics;
  }

  const { apiFetch } = await import("./api");
  return apiFetch<MetricsSummary>("/metrics");
}

export async function getComparisonMetrics(): Promise<ComparisonMetrics> {
  if (isMockMode()) {
    await delay(300);
    return mockComparison;
  }

  const { apiFetch } = await import("./api");
  return apiFetch<ComparisonMetrics>("/metrics/comparison");
}
