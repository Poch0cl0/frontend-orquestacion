export type TaskStatus =
  | "PENDING"
  | "DEBATING"
  | "APPROVED"
  | "REJECTED"
  | "EXECUTING"
  | "COMPLETED"
  | "HUMAN_ESCALATION"
  | "ERROR";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface TaskLimits {
  maxIterations: number;
  tokenLimit: number;
}

export interface Task {
  id: string;
  objective: string;
  status: TaskStatus;
  limits: TaskLimits;
  iterationCount: number;
  maxIterations: number;
  startedAt: string;
  completedAt?: string;
  result?: string;
}

export interface CreateTaskInput {
  objective: string;
  maxIterations: number;
  tokenLimit: number;
}

export interface TaskSummary {
  id: string;
  objective: string;
  status: TaskStatus;
  iterationCount: number;
  startedAt: string;
}
