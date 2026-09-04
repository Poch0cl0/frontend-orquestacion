import type { MetricsSummary } from "@/types";

export const mockMetrics: MetricsSummary = {
  tasksProcessed: 142,
  tasksApproved: 118,
  tasksRejected: 18,
  tasksInExecution: 3,
  tsr: 94.2,
  uar: 2.1,
  avgIterations: 1.8,
  governanceOverhead: { control: 1200, multiAgent: 4200 },
  tsrTrend: [
    { label: "Lun", value: 91 },
    { label: "Mar", value: 93 },
    { label: "Mié", value: 92 },
    { label: "Jue", value: 95 },
    { label: "Vie", value: 94 },
    { label: "Sáb", value: 96 },
    { label: "Dom", value: 94.2 },
  ],
  uarTrend: [
    { label: "Lun", value: 4.2 },
    { label: "Mar", value: 3.8 },
    { label: "Mié", value: 3.1 },
    { label: "Jue", value: 2.9 },
    { label: "Vie", value: 2.5 },
    { label: "Sáb", value: 2.3 },
    { label: "Dom", value: 2.1 },
  ],
  iterationsTrend: [
    { label: "Sem 1", value: 2.4 },
    { label: "Sem 2", value: 2.1 },
    { label: "Sem 3", value: 1.9 },
    { label: "Sem 4", value: 1.8 },
  ],
  overheadTrend: [
    { label: "Sem 1", value: 4800 },
    { label: "Sem 2", value: 4500 },
    { label: "Sem 3", value: 4300 },
    { label: "Sem 4", value: 4200 },
  ],
};

export const mockComparison = {
  control: { tsr: 87.5, uar: 8.3, avgIterations: 1.0, governanceOverhead: 1200 },
  argus: { tsr: 94.2, uar: 2.1, avgIterations: 1.8, governanceOverhead: 4200 },
};
