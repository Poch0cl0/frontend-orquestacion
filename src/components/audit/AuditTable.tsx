"use client";

import { Eye } from "lucide-react";
import type { AuditLog } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DECISION_LABELS, DECISION_VARIANT, RISK_CONFIG } from "@/lib/status";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const COLUMNS = ["ID", "Objetivo", "Estado", "Iteraciones", "Riesgo", "Fecha"];

export function AuditTable({ records, onView }: { records: AuditLog[]; onView: (id: string) => void }) {
  const ordered = [...records].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <>
      <div className="surface-card hidden overflow-hidden md:block">
        <table className="w-full" aria-label="Historial de auditoría">
          <thead>
            <tr className="border-b border-line/30 bg-surface-low">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="text-label-micro text-ink-subtle px-3 py-2.5 text-left font-sans font-semibold tracking-[0.08em] uppercase"
                >
                  {column}
                </th>
              ))}
              <th
                scope="col"
                className="text-label-micro text-ink-subtle px-3 py-2.5 text-right font-sans font-semibold tracking-[0.08em] uppercase"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/20">
            {ordered.map((record) => (
              <tr key={record.id} className="hover:bg-surface-low/70 transition-colors">
                <td className="text-code text-ink-subtle px-3 py-2.5 font-mono tabular-nums">
                  #{record.id}
                </td>
                <td className="text-body-md text-ink max-w-xs truncate px-3 py-2.5 font-medium">
                  {record.objective}
                </td>
                <td className="px-3 py-2.5">
                  <Badge variant={DECISION_VARIANT[record.decision]}>
                    {DECISION_LABELS[record.decision]}
                  </Badge>
                </td>
                <td className="text-body-md text-ink-muted px-3 py-2.5 tabular-nums">
                  {record.iterations}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "text-label-micro inline-flex items-center rounded border px-2 py-0.5 font-sans font-semibold",
                      RISK_CONFIG[record.risk].className,
                    )}
                  >
                    {RISK_CONFIG[record.risk].label}
                  </span>
                </td>
                <td className="text-body-sm text-ink-subtle px-3 py-2.5 tabular-nums">
                  {formatDate(record.timestamp)}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(record.id)}
                    aria-label={`Ver detalle de la auditoría ${record.id}`}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {ordered.map((record) => (
          <article key={record.id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-code text-ink-subtle font-mono tabular-nums">#{record.id}</span>
              <Badge variant={DECISION_VARIANT[record.decision]}>
                {DECISION_LABELS[record.decision]}
              </Badge>
            </div>
            <p className="text-body-md text-ink mt-2 font-medium">{record.objective}</p>
            <div className="text-body-sm text-ink-subtle mt-2 flex flex-wrap items-center gap-2">
              <span className="tabular-nums">{record.iterations} iteraciones</span>
              <span
                className={cn(
                  "text-label-micro inline-flex items-center rounded border px-2 py-0.5 font-sans font-semibold",
                  RISK_CONFIG[record.risk].className,
                )}
              >
                {RISK_CONFIG[record.risk].label}
              </span>
              <span className="tabular-nums">{formatDate(record.timestamp)}</span>
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => onView(record.id)}>
              Ver detalle
            </Button>
          </article>
        ))}
      </div>
    </>
  );
}

export function AuditPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Paginación del historial">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Anterior
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "primary" : "outline"}
          size="sm"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className="w-8 px-0 tabular-nums"
        >
          {p}
        </Button>
      ))}
      {totalPages > 5 && (
        <span className="text-body-sm text-ink-subtle px-1 tabular-nums">… {totalPages}</span>
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </Button>
    </nav>
  );
}
