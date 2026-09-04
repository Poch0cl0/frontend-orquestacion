import type { AuditorVerdict, ExecutorProposal } from "./agent";
import type { RiskLevel, TaskStatus } from "./task";

export type AuditDecision = "APPROVED" | "REJECTED" | "EXECUTED" | "HUMAN_ESCALATION" | "ERROR";

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: string;
  agent: "executor" | "auditor" | "system";
  title: string;
  description?: string;
  iteration?: number;
}

export interface AuditLog {
  id: string;
  objective: string;
  status: TaskStatus;
  decision: AuditDecision;
  iterations: number;
  risk: RiskLevel;
  timestamp: string;
  trajectory: AuditEvent[];
  proposals: ExecutorProposal[];
  verdicts: AuditorVerdict[];
  finalResult?: string;
}

export interface AuditFilters {
  search?: string;
  status?: AuditDecision | "all";
  risk?: RiskLevel | "all";
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
