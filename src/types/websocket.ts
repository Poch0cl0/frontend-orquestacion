import type { AuditorVerdict, ExecutorProposal } from "./agent";
import type { RiskLevel, TaskStatus } from "./task";

export type ArgusEventType =
  | "node_start"
  | "audit_rejected"
  | "audit_approved"
  | "execution_result"
  | "task_started"
  | "executor_proposal"
  | "executor_revision"
  | "human_escalation"
  | "error";

export type ConnectionStatus = "connected" | "connecting" | "reconnecting" | "disconnected";

export interface BaseEventPayload {
  taskId: string;
  timestamp: string;
}

export interface TaskStartedPayload extends BaseEventPayload {
  objective: string;
  maxIterations: number;
  tokenLimit: number;
}

export interface NodeStartPayload extends BaseEventPayload {
  node: "executor" | "auditor" | "execution";
  message?: string;
}

export interface ExecutorProposalPayload extends BaseEventPayload {
  proposal: ExecutorProposal;
}

export interface AuditRejectedPayload extends BaseEventPayload {
  verdict: AuditorVerdict;
}

export interface AuditApprovedPayload extends BaseEventPayload {
  verdict: AuditorVerdict;
}

export interface ExecutionResultPayload extends BaseEventPayload {
  success: boolean;
  result: string;
  status: TaskStatus;
}

export interface HumanEscalationPayload extends BaseEventPayload {
  reason: string;
}

export interface ErrorPayload extends BaseEventPayload {
  message: string;
  code?: string;
}

export type ArgusEventPayloadMap = {
  task_started: TaskStartedPayload;
  node_start: NodeStartPayload;
  executor_proposal: ExecutorProposalPayload;
  executor_revision: ExecutorProposalPayload;
  audit_rejected: AuditRejectedPayload;
  audit_approved: AuditApprovedPayload;
  execution_result: ExecutionResultPayload;
  human_escalation: HumanEscalationPayload;
  error: ErrorPayload;
};

export type ArgusEvent =
  | { type: "task_started"; payload: TaskStartedPayload }
  | { type: "node_start"; payload: NodeStartPayload }
  | { type: "executor_proposal"; payload: ExecutorProposalPayload }
  | { type: "executor_revision"; payload: ExecutorProposalPayload }
  | { type: "audit_rejected"; payload: AuditRejectedPayload }
  | { type: "audit_approved"; payload: AuditApprovedPayload }
  | { type: "execution_result"; payload: ExecutionResultPayload }
  | { type: "human_escalation"; payload: HumanEscalationPayload }
  | { type: "error"; payload: ErrorPayload };

export interface ArgusStreamState {
  taskId: string | null;
  objective: string | null;
  status: TaskStatus;
  iterationCount: number;
  maxIterations: number;
  connectionStatus: ConnectionStatus;
  reconnectAttempt: number;
  maxReconnectAttempts: number;
  executorProposal: ExecutorProposal | null;
  auditorVerdict: AuditorVerdict | null;
  timeline: TimelineEntry[];
  executionResult: string | null;
  error: string | null;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  agent: "executor" | "auditor" | "system";
  type: ArgusEventType | "consensus" | "execution_start" | "execution_complete";
  title: string;
  description?: string;
  iteration?: number;
  risk?: RiskLevel;
  isNew?: boolean;
}
