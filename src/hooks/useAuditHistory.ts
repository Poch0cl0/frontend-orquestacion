"use client";

import { useEffect, useState } from "react";
import type { AuditFilters, AuditLog, PaginatedResult } from "@/types";
import { getAuditById, getAuditHistory } from "@/services/audit.service";

export function useAuditHistory(initialFilters: AuditFilters = {}) {
  const [filters, setFilters] = useState<AuditFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResult<AuditLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAuditHistory(filters, page);
        if (!cancelled) setResult(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar auditoría");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const refetch = () => {
    setPage((p) => p);
  };

  return { result, loading, error, filters, setFilters, page, setPage, refetch };
}

export function useAuditDetail(id: string | null) {
  const [record, setRecord] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAuditById(id!);
        if (!cancelled) setRecord(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { record: id ? record : null, loading, error };
}
