"use client";

import { Radar } from "lucide-react";
import { useArgusStream } from "@/hooks/useArgusStream";
import { ConsensusIndicator } from "./ConsensusIndicator";
import { formatTime } from "@/lib/format";

function MetaColumn({
  label,
  value,
  divider,
  mono,
}: {
  label: string;
  value: string;
  divider?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={divider ? "flex flex-col sm:border-l sm:border-line/20 sm:pl-4" : "flex flex-col"}>
      <span className="eyebrow font-semibold">{label}</span>
      <span
        className={`mt-0.5 tabular-nums ${
          mono ? "text-code text-brand font-mono font-semibold" : "text-body-md text-ink font-semibold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function ActiveOperation() {
  const { objective, status, iterationCount, maxIterations, taskId, timeline } = useArgusStream();
  const startedAt = timeline[0]?.timestamp;

  if (!objective && !taskId) {
    return (
      <section className="surface-card border-dashed" aria-label="Operación actual">
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <span className="bg-surface-low text-ink-subtle mb-3 flex h-11 w-11 items-center justify-center rounded-full">
            <Radar className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-body-lg text-ink font-sans font-semibold">Sin operación activa</p>
          <p className="text-body-md text-ink-subtle mt-1 max-w-sm">
            Crea una nueva tarea para ver el debate Ejecutor ↔ Auditor desplegarse en tiempo real.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Operación actual"
      className="surface-card border-l-4 border-l-brand bg-gradient-to-r from-surface-low/60 via-surface to-surface p-5"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-label-micro text-brand font-sans font-bold tracking-[0.12em] uppercase">
            Operación actual
          </span>
          <ConsensusIndicator status={status} />
        </div>

        <h2 className="text-headline-md text-ink font-sans">{objective}</h2>

        <div className="grid grid-cols-1 gap-4 border-t border-line/20 pt-3 sm:grid-cols-3">
          <MetaColumn label="Iteración" value={`${iterationCount} / ${maxIterations}`} />
          <MetaColumn label="Inicio" value={startedAt ? formatTime(startedAt) : "—"} divider />
          <MetaColumn label="ID de tarea" value={`#${taskId ?? "—"}`} divider mono />
        </div>
      </div>
    </section>
  );
}
