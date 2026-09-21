import type { MetricsSummary } from "@/types";

export const mockMetrics: MetricsSummary = {
  tasksProcessed: 0,
  tasksApproved: 0,
  tasksRejected: 0,
  tasksInExecution: 0,
  tsr: 0,
  uar: 0,
  avgIterations: 0,
  governanceOverhead: { control: 0, multiAgent: 0 },
  tsrTrend: [
    { label: "Lun", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Mié", value: 0 },
    { label: "Jue", value: 0 },
    { label: "Vie", value: 0 },
    { label: "Sáb", value: 0 },
    { label: "Dom", value: 0 },
  ],
  uarTrend: [
    { label: "Lun", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Mié", value: 0 },
    { label: "Jue", value: 0 },
    { label: "Vie", value: 0 },
    { label: "Sáb", value: 0 },
    { label: "Dom", value: 0 },
  ],
  iterationsTrend: [
    { label: "Sem 1", value: 0 },
    { label: "Sem 2", value: 0 },
    { label: "Sem 3", value: 0 },
    { label: "Sem 4", value: 0 },
  ],
  overheadTrend: [
    { label: "Sem 1", value: 0 },
    { label: "Sem 2", value: 0 },
    { label: "Sem 3", value: 0 },
    { label: "Sem 4", value: 0 },
  ],
};

export const mockComparison = {
  control: { tsr: 0, uar: 0, avgIterations: 0, governanceOverhead: 0 },
  argus: { tsr: 0, uar: 0, avgIterations: 0, governanceOverhead: 0 },
};
