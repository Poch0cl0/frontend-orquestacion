"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import type { AuditorVerdict, ExecutorProposal, TimelineEntry } from "@/types";
import { DebateTimeline, isDetailEntry } from "./DebateTimeline";
import { ExecutorCard } from "./ExecutorCard";
import { AuditorCard } from "./AuditorCard";
import { Button } from "@/components/ui/Button";

interface AgentDebateProps {
  timeline: TimelineEntry[];
  executorProposal: ExecutorProposal | null;
  auditorVerdict: AuditorVerdict | null;
  live?: boolean;
}

export function AgentDebate({ timeline, executorProposal, auditorVerdict, live }: AgentDebateProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedEntry = useMemo(
    () => timeline.find((entry) => entry.id === selectedId) ?? null,
    [timeline, selectedId],
  );

  // Si el evento seleccionado desaparece (reset de stream), vuelve al estado vivo.
  useEffect(() => {
    if (selectedId && !timeline.some((entry) => entry.id === selectedId)) {
      setSelectedId(null);
    }
  }, [timeline, selectedId]);

  const viewingHistorical = selectedEntry != null && isDetailEntry(selectedEntry);

  const displayedProposal = viewingHistorical
    ? (selectedEntry.proposal ?? null)
    : executorProposal;
  const displayedVerdict = viewingHistorical
    ? (selectedEntry.verdict ?? null)
    : auditorVerdict;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <section aria-label="Debate multi-agente" className="surface-card flex flex-col p-6 lg:col-span-7">
        <div className="flex items-center justify-between gap-3 border-b border-line/20 pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-headline-sm text-ink font-sans">Debate multi-agente</h3>
              <span className="text-label-micro text-ink-subtle rounded bg-surface-low px-2 py-0.5 font-sans font-medium">
                {timeline.length} {timeline.length === 1 ? "evento" : "eventos"}
              </span>
            </div>
            <p className="text-body-sm text-ink-muted">
              Haz clic en un plan o veredicto del timeline para ver su detalle a la derecha.
            </p>
          </div>
          {live && (
            <span className="text-label-micro text-teal flex items-center gap-1.5 font-sans font-semibold tracking-[0.08em] uppercase">
              <span className="bg-teal h-1.5 w-1.5 animate-ping rounded-full" aria-hidden="true" />
              Live feed
            </span>
          )}
        </div>
        <DebateTimeline
          entries={timeline}
          selectedId={selectedId}
          onSelect={(entry) => setSelectedId(entry.id)}
        />
      </section>

      <div className="flex flex-col lg:col-span-5">
        {viewingHistorical && (
          <div className="mb-3 flex items-start justify-between gap-3 rounded-xl border border-line/40 bg-surface-low px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-label-micro text-ink-muted font-sans font-semibold tracking-[0.08em] uppercase">
                Detalle del evento
              </p>
              <p className="text-body-sm text-ink mt-0.5 font-medium">
                {selectedEntry.title}
                {selectedEntry.iteration != null ? ` · Iteración ${selectedEntry.iteration}` : ""}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedId(null)}
              aria-label="Volver al estado actual"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Actual
            </Button>
          </div>
        )}

        <ExecutorCard proposal={displayedProposal} />

        <div className="my-3 flex justify-center" aria-hidden="true">
          <span className="text-ink-subtle flex h-8 w-8 items-center justify-center rounded-full border border-line/50 bg-surface shadow-xs">
            <ArrowDown className="h-4 w-4" />
          </span>
        </div>

        <AuditorCard verdict={displayedVerdict} />
      </div>
    </div>
  );
}
