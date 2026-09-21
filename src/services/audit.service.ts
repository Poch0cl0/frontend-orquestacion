import type { AuditFilters, AuditLog, PaginatedResult } from "@/types";
import { delay } from "./api";
import { isMockMode } from "@/transport/types";
import { mockAuditLogs } from "@/mocks/audit";

function filterLogs(logs: AuditLog[], filters: AuditFilters): AuditLog[] {
  return logs
    .filter((log) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!log.objective.toLowerCase().includes(q) && !log.id.includes(q)) return false;
      }
      if (filters.status && filters.status !== "all" && log.decision !== filters.status) return false;
      if (filters.risk && filters.risk !== "all" && log.risk !== filters.risk) return false;
      if (filters.dateFrom && new Date(log.timestamp) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(log.timestamp) > new Date(filters.dateTo)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getAuditHistory(
  filters: AuditFilters = {},
  page = 1,
  pageSize = 10,
): Promise<PaginatedResult<AuditLog>> {
  if (isMockMode()) {
    await delay(400);
    const filtered = filterLogs(mockAuditLogs, filters);
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    return {
      data: filtered.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  const { apiFetch } = await import("./api");
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.risk) params.set("risk", filters.risk);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  return apiFetch<PaginatedResult<AuditLog>>(`/audit/history?${params}`);
}

export async function getAuditById(id: string): Promise<AuditLog | null> {
  if (isMockMode()) {
    await delay(300);
    return mockAuditLogs.find((l) => l.id === id) ?? null;
  }

  const { apiFetch } = await import("./api");
  return apiFetch<AuditLog>(`/audit/history/${id}`);
}
