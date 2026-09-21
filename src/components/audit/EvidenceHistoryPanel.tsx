"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/format";
import { downloadHistoryRangePdf } from "@/lib/evidence";
import {
  downloadStoredEvidence,
  listEvidenceHistory,
  listEvidenceHistoryInRange,
  type EvidenceHistoryItem,
} from "@/lib/evidence-history";
import { getAuditHistory } from "@/services/audit.service";
import { evidenceFromAuditLog } from "@/lib/evidence";

export function EvidenceHistoryPanel() {
  const { toast } = useToast();
  const [items, setItems] = useState<EvidenceHistoryItem[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const refresh = () => setItems(listEvidenceHistory());
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("argus.evidence.history")) refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    window.addEventListener("argus:evidence-updated", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("argus:evidence-updated", refresh);
    };
  }, []);

  const filtered = useMemo(
    () => listEvidenceHistoryInRange(dateFrom || undefined, dateTo || undefined),
    [items, dateFrom, dateTo],
  );

  async function handleDownloadRange() {
    if (!dateFrom && !dateTo) {
      toast("Selecciona un rango", "error", "Indica al menos fecha desde o hasta");
      return;
    }
    setExporting(true);
    try {
      // Une evidencias locales + historial del orquestador en ese rango
      const localPayloads = listEvidenceHistoryInRange(dateFrom || undefined, dateTo || undefined).map(
        (i) => i.payload,
      );

      const remote = await getAuditHistory(
        {
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        },
        1,
        100,
      );
      const remotePayloads = remote.data.map(evidenceFromAuditLog);

      const byId = new Map<string, (typeof localPayloads)[number]>();
      for (const p of [...remotePayloads, ...localPayloads]) {
        byId.set(p.id, p);
      }
      const merged = [...byId.values()].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      downloadHistoryRangePdf(merged, dateFrom, dateTo);
      toast(
        "Historial PDF descargado",
        "success",
        `${merged.length} registro(s) en el rango`,
      );
    } catch (err) {
      toast(
        "No se pudo exportar",
        "error",
        err instanceof Error ? err.message : "Error al generar el PDF",
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <section aria-label="Historial de evidencias" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-headline-sm text-ink font-sans">Evidencias PDF</h2>
          <p className="text-body-sm text-ink-muted mt-0.5">
            Descarga individual o un historial completo por rango de fechas (más recientes primero).
          </p>
        </div>
        <span className="text-label-micro text-ink-subtle rounded bg-surface-low px-2 py-1 font-sans font-medium">
          {items.length} {items.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      <div className="surface-card flex flex-col gap-3 p-4">
        <p className="text-label-micro text-ink-muted font-sans font-semibold tracking-[0.08em] uppercase">
          Exportar historial por fechas
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
          <Input
            id="evidenceDateFrom"
            type="date"
            label="Desde"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            id="evidenceDateTo"
            type="date"
            label="Hasta"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <Button type="button" loading={exporting} onClick={handleDownloadRange}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Descargar historial PDF
          </Button>
        </div>
        {(dateFrom || dateTo) && (
          <p className="text-body-sm text-ink-muted">
            Coincidencias locales en el rango: <strong>{filtered.length}</strong>
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="Sin evidencias aún"
          description="Cuando completes una tarea o descargues evidencia, aparecerán aquí ordenadas de la más reciente a la más antigua."
        />
      ) : (
        <ul className="surface-card divide-y divide-line/20">
          {(dateFrom || dateTo ? filtered : items).map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-code text-ink-subtle font-mono tabular-nums">#{item.id}</span>
                  <span className="text-label-micro rounded border border-line/40 bg-surface-low px-2 py-0.5 font-sans font-semibold">
                    {item.decision}
                  </span>
                  <span className="text-body-sm text-ink-subtle tabular-nums">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="text-body-md text-ink mt-1 truncate font-medium">{item.objective}</p>
                <p className="text-body-sm text-ink-muted mt-0.5">
                  {item.commit ? (
                    <>
                      Commit <code className="text-code text-brand font-mono">{item.commit}</code>
                      {item.files.length > 0 ? ` · ${item.files.length} archivo(s)` : ""}
                    </>
                  ) : (
                    item.summary.slice(0, 120)
                  )}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  downloadStoredEvidence(item);
                  toast("Evidencia PDF descargada", "success", `argus-evidencia-${item.id}.pdf`);
                }}
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Descargar PDF
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
