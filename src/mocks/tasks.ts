import type { Task } from "@/types";

export const mockActiveTask: Task = {
  id: "1043",
  objective: "Procesar lote de imágenes corporativas",
  status: "DEBATING",
  limits: { maxIterations: 5, tokenLimit: 4000 },
  iterationCount: 2,
  maxIterations: 5,
  startedAt: new Date().toISOString(),
};
