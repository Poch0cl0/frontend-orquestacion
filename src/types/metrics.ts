export interface MetricPoint {
  label: string;
  value: number;
}

export interface GovernanceOverhead {
  control: number;
  multiAgent: number;
}

export interface MetricsSummary {
  tsr: number;
  uar: number;
  avgIterations: number;
  governanceOverhead: GovernanceOverhead;
  tasksProcessed: number;
  tasksApproved: number;
  tasksRejected: number;
  tasksInExecution: number;
  tsrTrend: MetricPoint[];
  uarTrend: MetricPoint[];
  iterationsTrend: MetricPoint[];
  overheadTrend: MetricPoint[];
}

export interface ComparisonMetrics {
  control: {
    tsr: number;
    uar: number;
    avgIterations: number;
    governanceOverhead: number;
  };
  argus: {
    tsr: number;
    uar: number;
    avgIterations: number;
    governanceOverhead: number;
  };
}
