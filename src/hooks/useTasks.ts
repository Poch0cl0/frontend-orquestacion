"use client";

import { useCallback, useState } from "react";
import type { CreateTaskInput, Task } from "@/types";
import { createTask } from "@/services/tasks.service";

export function useTasks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<Task | null>(null);

  const submitTask = useCallback(async (input: CreateTaskInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createTask(input);
      setTask(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear la tarea";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { task, loading, error, submitTask };
}
