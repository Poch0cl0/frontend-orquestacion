import { ArrowDown } from "lucide-react";
import type { AuditorVerdict, ExecutorProposal, TimelineEntry } from "@/types";
import { DebateTimeline } from "./DebateTimeline";
import { ExecutorCard } from "./ExecutorCard";
import { AuditorCard } from "./AuditorCard";

interface AgentDebateProps {
  timeline: TimelineEntry[];
  executorProposal: ExecutorProposal | null;
  auditorVerdict: AuditorVerdict | null;
  live?: boolean;
}

export function AgentDebate({ timeline, executorProposal, auditorVerdict, live }: AgentDebateProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <section aria-label="Debate multi-agente" className="surface-card flex flex-col p-6 lg:col-span-7">
        <div className="flex items-center justify-between gap-3 border-b border-line/20 pb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-headline-sm text-ink font-sans">Debate multi-agente</h3>
            <span className="text-label-micro text-ink-subtle rounded bg-surface-low px-2 py-0.5 font-sans font-medium">
              {timeline.length} {timeline.length === 1 ? "evento" : "eventos"}
            </span>
          </div>
          {live && (
            <span className="text-label-micro text-teal flex items-center gap-1.5 font-sans font-semibold tracking-[0.08em] uppercase">
              <span className="bg-teal h-1.5 w-1.5 animate-ping rounded-full" aria-hidden="true" />
              Live feed
            </span>
          )}
        </div>
        <DebateTimeline entries={timeline} />
      </section>

      <div className="flex flex-col lg:col-span-5">
        <ExecutorCard proposal={executorProposal} />

        <div className="my-3 flex justify-center" aria-hidden="true">
          <span className="text-ink-subtle flex h-8 w-8 items-center justify-center rounded-full border border-line/50 bg-surface shadow-xs">
            <ArrowDown className="h-4 w-4" />
          </span>
        </div>

        <AuditorCard verdict={auditorVerdict} />
      </div>
    </div>
  );
}
