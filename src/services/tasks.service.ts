import type { CreateTaskInput, Task } from "@/types";
import { delay } from "./api";
import { isMockMode } from "@/transport/types";
import { getMockTransport } from "@/transport";
import { mockAuditLogs } from "@/mocks/audit";

/** Continúa la numeración del historial de auditoría para que los IDs de la demo sean coherentes. */
let nextMockId = Math.max(...mockAuditLogs.map((log) => Number(log.id))) + 1;

export async function createTask(input: CreateTaskInput): Promise<Task> {
  if (isMockMode()) {
    await delay(280);

    const task: Task = {
      id: String(nextMockId++),
      objective: input.objective,
      status: "PENDING",
      limits: { maxIterations: input.maxIterations, tokenLimit: input.tokenLimit },
      iterationCount: 0,
      maxIterations: input.maxIterations,
      startedAt: new Date().toISOString(),
    };

    getMockTransport()?.startDemo(task.id, input.objective, input.maxIterations, input.tokenLimit);

    return task;
  }

  const { apiFetch } = await import("./api");
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
