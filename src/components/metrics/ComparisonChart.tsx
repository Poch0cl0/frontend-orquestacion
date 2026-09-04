"use client";

import type { ComparisonMetrics } from "@/types";
import { formatDuration } from "@/lib/format";

interface ComparisonRow {
  key: keyof ComparisonMetrics["control"];
  label: string;
  format: (value: number) => string;
  note: string;
}

const ROWS: ComparisonRow[] = [
  { key: "tsr", label: "Task Success Rate", format: (v) => `${v}%`, note: "Mayor es mejor" },
  { key: "uar", label: "Unauthorized Action Rate", format: (v) => `${v}%`, note: "Menor es mejor" },
  {
    key: "avgIterations",
    label: "Iteraciones promedio",
    format: (v) => v.toFixed(1),
    note: "Coste del debate",
  },
  {
    key: "governanceOverhead",
    label: "Governance Overhead",
    format: (v) => formatDuration(v),
    note: "Coste del consenso",
  },
];

function Bar({
  label,
  value,
  max,
  format,
  variant,
}: {
  label: string;
  value: number;
  max: number;
  format: (value: number) => string;
  variant: "control" | "argus";
}) {
  const isArgus = variant === "argus";
  return (
    <div className="flex items-center gap-3">
      <span
        className={`text-label-md w-16 shrink-0 font-sans ${isArgus ? "text-brand font-semibold" : "text-ink-subtle"}`}
      >
        {label}
      </span>
      <div className="h-6 flex-1 overflow-hidden rounded bg-surface-low">
        <div
          className={`flex h-full items-center rounded px-2 ${isArgus ? "bg-brand" : "bg-ink-subtle"}`}
          style={{ width: `${Math.max((value / max) * 100, 14)}%` }}
        >
          <span className="text-label-micro font-sans font-semibold text-white tabular-nums">
            {format(value)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ComparisonChart({ data }: { data: ComparisonMetrics }) {
  return (
    <section className="surface-card flex flex-col p-6" aria-label="Comparación entre grupo control y ARGUS">
      <h3 className="eyebrow font-semibold">Control vs ARGUS — Comparación experimental</h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line/30 bg-surface-low p-4 text-center">
          <p className="text-label-micro text-ink-subtle font-sans font-bold tracking-[0.12em] uppercase">
            Control
          </p>
          <p className="text-body-md text-ink-muted mt-1">Single Agent + Static Rules</p>
        </div>
        <div className="border-brand-dim/60 bg-brand-soft/30 rounded-lg border p-4 text-center">
          <p className="text-label-micro text-brand font-sans font-bold tracking-[0.12em] uppercase">
            ARGUS
          </p>
          <p className="text-body-md text-ink-muted mt-1">Multi-Agent Consensus</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {ROWS.map((row) => {
          const control = data.control[row.key];
          const argus = data.argus[row.key];
          const max = Math.max(control, argus) * 1.15 || 1;

          return (
            <div key={row.key}>
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span className="text-body-md text-ink font-medium">{row.label}</span>
                <span className="text-label-micro text-ink-subtle font-sans">{row.note}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Bar label="Control" value={control} max={max} format={row.format} variant="control" />
                <Bar label="ARGUS" value={argus} max={max} format={row.format} variant="argus" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
