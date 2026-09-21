"use client";

import { Download, ShieldCheck } from "lucide-react";
import type { AuditLog } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/Card";
import { ConsensusIndicator } from "@/components/dashboard/ConsensusIndicator";
import { ExecutorCard } from "@/components/dashboard/ExecutorCard";
import { AuditorCard } from "@/components/dashboard/AuditorCard";
import { AuditTimeline } from "./AuditTimeline";
import { DECISION_LABELS, DECISION_VARIANT, RISK_CONFIG } from "@/lib/status";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { downloadEvidenceMarkdown, evidenceFromAuditLog } from "@/lib/evidence";
import { upsertEvidenceHistory } from "@/lib/evidence-history";
import { useToast } from "@/components/ui/Toast";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-headline-sm text-ink font-sans">{title}</h3>
      {children}
    </section>
  );
}

export function AuditDetail({ record }: { record: AuditLog }) {
  const { toast } = useToast();
  const lastProposal = record.proposals.at(-1) ?? null;
  const lastVerdict = record.verdicts.at(-1) ?? null;

  function handleDownload() {
    const payload = evidenceFromAuditLog(record);
    downloadEvidenceMarkdown(payload);
    upsertEvidenceHistory(payload);
    toast("Evidencia PDF descargada", "success", `argus-evidencia-${record.id}.pdf`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <FieldLabel>Objetivo</FieldLabel>
          <p className="text-body-lg text-ink font-medium">{record.objective}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Descargar evidencia PDF
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ConsensusIndicator status={record.status} size="sm" showPulse={false} />
        <Badge variant={DECISION_VARIANT[record.decision]}>{DECISION_LABELS[record.decision]}</Badge>
        <span
          className={cn(
            "text-label-micro inline-flex items-center rounded border px-2 py-0.5 font-sans font-semibold",
            RISK_CONFIG[record.risk].className,
          )}
        >
          {RISK_CONFIG[record.risk].label}
        </span>
        <span className="text-body-sm text-ink-subtle tabular-nums">
          {record.iterations} {record.iterations === 1 ? "iteración" : "iteraciones"}
        </span>
      </div>

      <Section title="Timeline de ejecución">
        <AuditTimeline events={record.trajectory} />
      </Section>

      {lastProposal && (
        <Section title="Última propuesta del Ejecutor">
          <ExecutorCard proposal={lastProposal} />
        </Section>
      )}

      {lastVerdict && (
        <Section title="Decisión del Auditor">
          <AuditorCard verdict={lastVerdict} />
        </Section>
      )}

      {record.finalResult && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <span className="text-label-micro font-sans font-bold tracking-[0.08em] text-emerald-700 uppercase">
              Resultado final
            </span>
            <p className="text-body-md mt-1 text-emerald-900">{record.finalResult}</p>
          </div>
        </div>
      )}

      <p className="text-body-sm text-ink-subtle border-t border-line/20 pt-4 tabular-nums">
        Registrado el {formatDate(record.timestamp)}
      </p>
    </div>
  );
}
