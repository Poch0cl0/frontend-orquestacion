import { CheckCircle2, Megaphone, ShieldAlert, ShieldQuestion, XOctagon } from "lucide-react";
import type { AuditorVerdict } from "@/types";
import { FieldLabel } from "@/components/ui/Card";
import { RISK_CONFIG } from "@/lib/status";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";

const DECISION = {
  APPROVED: {
    label: "APROBADO",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-50 border-emerald-200 text-emerald-700",
    accentClass: "border-l-emerald-500",
    iconChipClass: "bg-emerald-50 text-emerald-600",
  },
  REJECTED: {
    label: "RECHAZADO",
    icon: XOctagon,
    badgeClass: "bg-rose-50 border-rose-200 text-rose-700",
    accentClass: "border-l-rose-500",
    iconChipClass: "bg-rose-50 text-rose-600",
  },
  WARNING: {
    label: "ADVERTENCIA",
    icon: ShieldAlert,
    badgeClass: "bg-amber-50 border-amber-200 text-amber-800",
    accentClass: "border-l-amber-400",
    iconChipClass: "bg-amber-50 text-amber-600",
  },
} as const;

export function AuditorCard({ verdict }: { verdict: AuditorVerdict | null }) {
  const decision = verdict ? DECISION[verdict.decision] : null;
  const DecisionIcon = decision?.icon ?? ShieldQuestion;

  return (
    <article
      className={cn(
        "surface-card flex flex-col gap-4 border-l-4 p-5",
        decision ? decision.accentClass : "border-l-teal",
      )}
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              decision ? decision.iconChipClass : "bg-teal-soft/50 text-teal",
            )}
          >
            <ShieldQuestion className="h-4 w-4" aria-hidden="true" />
          </span>
          <h3 className="text-headline-sm text-ink font-sans">Auditor COBIT</h3>
        </div>
        {verdict?.framework && (
          <span className="text-code text-ink-subtle rounded bg-surface-low px-2 py-0.5 font-mono font-medium">
            {verdict.framework}
          </span>
        )}
      </header>

      {!verdict || !decision ? (
        <p className="text-body-md text-ink-subtle">Esperando evaluación del auditor...</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "text-label-micro inline-flex items-center gap-1 rounded border px-2 py-1 font-sans font-bold",
                decision.badgeClass,
              )}
            >
              <DecisionIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {decision.label}
            </span>
            <span
              className={cn(
                "text-label-micro inline-flex items-center rounded border px-2 py-1 font-sans font-semibold",
                RISK_CONFIG[verdict.risk].className,
              )}
            >
              {RISK_CONFIG[verdict.risk].label}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>
              {verdict.decision === "APPROVED" ? "Dictamen de conformidad" : "Motivo de no conformidad"}
            </FieldLabel>
            <p className="text-body-sm text-ink font-medium leading-normal">{verdict.reason}</p>
          </div>

          {verdict.feedback && (
            <div className="flex flex-col gap-1 rounded-lg border border-line/30 bg-surface-low p-3">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-label-micro font-sans font-semibold tracking-[0.08em] uppercase">
                  {verdict.decision === "APPROVED" ? "Nota de consenso" : "Instrucción correctiva"}
                </span>
              </span>
              <p className="text-code text-ink font-mono leading-relaxed">{verdict.feedback}</p>
            </div>
          )}

          <footer className="flex items-center justify-between border-t border-line/20 pt-3">
            <span className="text-label-micro text-ink-muted rounded bg-surface-low px-2 py-0.5 font-sans font-medium">
              Iteración {verdict.iteration}
            </span>
            <time dateTime={verdict.timestamp} className="text-code text-ink-subtle font-mono tabular-nums">
              {formatTime(verdict.timestamp)}
            </time>
          </footer>
        </>
      )}
    </article>
  );
}
