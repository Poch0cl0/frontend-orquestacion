import type { RiskLevel } from "./task";

export type AgentRole = "executor" | "auditor";

export type AgentStatus =
  | "idle"
  | "analyzing"
  | "proposing"
  | "revising"
  | "reviewing"
  | "approved"
  | "rejected"
  | "executing"
  | "completed"
  | "error";

export interface ExecutorProposal {
  action: string;
  parameters: Record<string, string>;
  reason: string;
  tools: string[];
  iteration: number;
  timestamp: string;
  /** Modelo que generó la propuesta. Extensión propuesta al contrato. */
  model?: string;
}

export interface AuditorVerdict {
  decision: "APPROVED" | "REJECTED" | "WARNING";
  risk: RiskLevel;
  reason: string;
  feedback?: string;
  iteration: number;
  timestamp: string;
  /** Control COBIT aplicado, p. ej. "COBIT 2019 / DSS05". Extensión propuesta al contrato. */
  framework?: string;
}

export interface AgentState {
  role: AgentRole;
  status: AgentStatus;
  currentAction?: string;
  proposal?: ExecutorProposal;
  verdict?: AuditorVerdict;
}

export interface AgentStateSnapshot {
  task: string;
  plan?: ExecutorProposal;
  audit_feedback?: AuditorVerdict;
  iteration_count: number;
  status: string;
}
