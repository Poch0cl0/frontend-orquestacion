import type { ArgusEvent, ArgusStreamState, TimelineEntry } from "@/types";

export const initialStreamState: ArgusStreamState = {
  taskId: null,
  objective: null,
  status: "PENDING",
  iterationCount: 0,
  maxIterations: 5,
  connectionStatus: "disconnected",
  reconnectAttempt: 0,
  maxReconnectAttempts: 5,
  executorProposal: null,
  auditorVerdict: null,
  timeline: [],
  executionResult: null,
  error: null,
};

type StreamAction =
  | { type: "SET_CONNECTION"; status: ArgusStreamState["connectionStatus"]; attempt?: number }
  | { type: "PROCESS_EVENT"; event: ArgusEvent }
  | { type: "RESET" }
  | { type: "CLEAR_NEW_FLAGS" };

function push(timeline: TimelineEntry[], entry: Omit<TimelineEntry, "id" | "isNew">): TimelineEntry[] {
  return [
    ...timeline.map((t) => ({ ...t, isNew: false })),
    { ...entry, id: crypto.randomUUID(), isNew: true },
  ];
}

function applyEvent(state: ArgusStreamState, event: ArgusEvent): ArgusStreamState {
  const ts = event.payload.timestamp;

  if (event.type === "task_started") {
    const { taskId, objective, maxIterations } = event.payload;
    return {
      ...state,
      taskId,
      objective,
      maxIterations,
      status: "PENDING",
      iterationCount: 0,
      executorProposal: null,
      auditorVerdict: null,
      executionResult: null,
      error: null,
      timeline: push([], {
        timestamp: ts,
        agent: "system",
        type: "task_started",
        title: "Tarea recibida",
        description: objective,
        iteration: 1,
      }),
    };
  }

  if (event.type === "node_start") {
    const { node, message } = event.payload;
    const isExecution = node === "execution";
    return {
      ...state,
      status: isExecution ? "EXECUTING" : "DEBATING",
      timeline: push(state.timeline, {
        timestamp: ts,
        agent: node === "auditor" ? "auditor" : node === "executor" ? "executor" : "system",
        type: isExecution ? "execution_start" : "node_start",
        title: isExecution
          ? "Ejecución iniciada"
          : node === "executor"
            ? "Ejecutor iniciado"
            : "Auditor revisando",
        description: message,
        iteration: Math.max(state.iterationCount, 1),
      }),
    };
  }

  if (event.type === "executor_proposal" || event.type === "executor_revision") {
    const { proposal } = event.payload;
    const isRevision = event.type === "executor_revision";
    return {
      ...state,
      status: "DEBATING",
      iterationCount: proposal.iteration,
      executorProposal: proposal,
      timeline: push(state.timeline, {
        timestamp: ts,
        agent: "executor",
        type: event.type,
        title: isRevision ? "Plan actualizado" : "Plan generado",
        description: proposal.reason,
        iteration: proposal.iteration,
        proposal,
      }),
    };
  }

  if (event.type === "audit_rejected") {
    const { verdict } = event.payload;
    const relatedProposal =
      [...state.timeline]
        .reverse()
        .find((e) => e.proposal && (e.iteration ?? 0) <= verdict.iteration)?.proposal ??
      state.executorProposal ??
      undefined;
    return {
      ...state,
      status: "DEBATING",
      iterationCount: verdict.iteration,
      auditorVerdict: verdict,
      timeline: push(state.timeline, {
        timestamp: ts,
        agent: "auditor",
        type: "audit_rejected",
        title: "Plan rechazado",
        description: verdict.reason,
        iteration: verdict.iteration,
        risk: verdict.risk,
        verdict,
        proposal: relatedProposal,
      }),
    };
  }

  if (event.type === "audit_approved") {
    const { verdict } = event.payload;
    const relatedProposal =
      [...state.timeline]
        .reverse()
        .find((e) => e.proposal && (e.iteration ?? 0) <= verdict.iteration)?.proposal ??
      state.executorProposal ??
      undefined;
    return {
      ...state,
      status: "APPROVED",
      iterationCount: verdict.iteration,
      auditorVerdict: verdict,
      timeline: push(state.timeline, {
        timestamp: ts,
        agent: "auditor",
        type: "audit_approved",
        title: "Plan aprobado",
        description: verdict.reason,
        iteration: verdict.iteration,
        risk: verdict.risk,
        verdict,
        proposal: relatedProposal,
      }),
    };
  }

  if (event.type === "execution_result") {
    const { success, result } = event.payload;
    return {
      ...state,
      status: success ? "COMPLETED" : "ERROR",
      executionResult: result,
      timeline: push(state.timeline, {
        timestamp: ts,
        agent: "system",
        type: "execution_result",
        title: success ? "Ejecución completada" : "Ejecución fallida",
        description: result,
        iteration: state.iterationCount,
      }),
    };
  }

  if (event.type === "human_escalation") {
    return {
      ...state,
      status: "HUMAN_ESCALATION",
      timeline: push(state.timeline, {
        timestamp: ts,
        agent: "system",
        type: "human_escalation",
        title: "Escalado a intervención humana",
        description: event.payload.reason,
        iteration: state.iterationCount,
      }),
    };
  }

  if (event.type === "error") {
    return {
      ...state,
      status: "ERROR",
      error: event.payload.message,
      timeline: push(state.timeline, {
        timestamp: ts,
        agent: "system",
        type: "error",
        title: "Error del sistema",
        description: event.payload.message,
        iteration: state.iterationCount,
      }),
    };
  }

  return state;
}

export function streamReducer(state: ArgusStreamState, action: StreamAction): ArgusStreamState {
  switch (action.type) {
    case "SET_CONNECTION":
      return {
        ...state,
        connectionStatus: action.status,
        reconnectAttempt: action.attempt ?? state.reconnectAttempt,
      };

    case "RESET":
      return { ...initialStreamState, connectionStatus: state.connectionStatus };

    case "CLEAR_NEW_FLAGS":
      return { ...state, timeline: state.timeline.map((t) => ({ ...t, isNew: false })) };

    case "PROCESS_EVENT":
      return applyEvent(state, action.event);

    default:
      return state;
  }
}
