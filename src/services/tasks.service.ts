import type { CreateTaskInput, Task } from "@/types";
import { delay } from "./api";
import { isMockMode } from "@/transport/types";
import { getMockTransport } from "@/transport";
import { mockAuditLogs } from "@/mocks/audit";

export interface RepoEntry {
  id: string;
  name: string;
  path: string;
  isDefault?: boolean;
}

export interface ValidateRepoResult {
  ok: boolean;
  path: string;
  exists: boolean;
  isGit: boolean;
  writable: boolean;
  message: string;
}

/** Continúa la numeración del historial de auditoría para que los IDs de la demo sean coherentes. */
let nextMockId = Math.max(...mockAuditLogs.map((log) => Number(log.id))) + 1;

const mockRepos: RepoEntry[] = [
  {
    id: "demo",
    name: "Demo ARGUS (local)",
    path: "./demo-target-repo",
    isDefault: true,
  },
];

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

export async function listRepos(): Promise<RepoEntry[]> {
  if (isMockMode()) {
    await delay(120);
    return mockRepos;
  }
  const { apiFetch } = await import("./api");
  return apiFetch<RepoEntry[]>("/repos");
}

export async function validateRepo(path: string): Promise<ValidateRepoResult> {
  if (isMockMode()) {
    await delay(150);
    return {
      ok: true,
      path,
      exists: true,
      isGit: true,
      writable: true,
      message: "Repositorio válido (mock)",
    };
  }
  const { apiFetch } = await import("./api");
  return apiFetch<ValidateRepoResult>("/repos/validate", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export async function registerRepo(name: string, path: string): Promise<RepoEntry> {
  if (isMockMode()) {
    await delay(150);
    const entry: RepoEntry = {
      id: `mock-${Date.now()}`,
      name: name || path,
      path,
      isDefault: false,
    };
    mockRepos.push(entry);
    return entry;
  }
  const { apiFetch } = await import("./api");
  return apiFetch<RepoEntry>("/repos", {
    method: "POST",
    body: JSON.stringify({ name, path }),
  });
}
