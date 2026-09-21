import {
  Bot,
  CheckCircle2,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  UserCog,
  Workflow,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { TimelineEntry } from "@/types";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";

interface EventVisual {
  icon: LucideIcon;
  nodeClass: string;
  titleClass?: string;
  descriptionClass?: string;
  chipClass?: string;
}

const NEUTRAL_NODE = "bg-surface-high border-line/50 text-ink-subtle";
const EXECUTOR_NODE = "bg-brand-soft border-brand/20 text-brand";
const AUDITOR_NODE = "bg-teal-soft border-teal/20 text-teal";

const VISUALS: Record<string, EventVisual> = {
  task_started: { icon: Terminal, nodeClass: NEUTRAL_NODE },
  node_start: { icon: Bot, nodeClass: EXECUTOR_NODE },
  executor_proposal: { icon: Workflow, nodeClass: EXECUTOR_NODE },
  executor_revision: { icon: RefreshCcw, nodeClass: EXECUTOR_NODE },
  audit_rejected: {
    icon: ShieldAlert,
    nodeClass: "bg-rose-100 border-rose-200 text-rose-700",
    titleClass: "text-rose-900",
    descriptionClass: "text-rose-800",
    chipClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
  audit_approved: {
    icon: CheckCircle2,
    nodeClass: "bg-emerald-100 border-emerald-200 text-emerald-800",
    titleClass: "text-emerald-900",
    descriptionClass: "text-emerald-800",
    chipClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  execution_start: { icon: Workflow, nodeClass: "bg-blue-50 border-blue-200 text-blue-700" },
  execution_result: { icon: CheckCircle2, nodeClass: "bg-brand border-brand text-white" },
  human_escalation: {
    icon: UserCog,
    nodeClass: "bg-violet-100 border-violet-200 text-violet-700",
    titleClass: "text-violet-900",
    chipClass: "bg-violet-50 text-violet-700 border-violet-200",
  },
  error: {
    icon: XCircle,
    nodeClass: "bg-rose-100 border-rose-200 text-rose-700",
    titleClass: "text-rose-900",
    descriptionClass: "text-rose-800",
  },
};

const AGENT_FALLBACK: Record<TimelineEntry["agent"], EventVisual> = {
  executor: { icon: Bot, nodeClass: EXECUTOR_NODE },
  auditor: { icon: ShieldCheck, nodeClass: AUDITOR_NODE },
  system: { icon: Terminal, nodeClass: NEUTRAL_NODE },
};

function resolveVisual(entry: TimelineEntry): EventVisual {
  if (entry.type === "node_start") {
    return entry.agent === "auditor"
      ? { icon: ShieldCheck, nodeClass: AUDITOR_NODE }
      : { icon: Bot, nodeClass: EXECUTOR_NODE };
  }
  return VISUALS[entry.type] ?? AGENT_FALLBACK[entry.agent];
}

export function isDetailEntry(entry: TimelineEntry): boolean {
  return Boolean(entry.proposal || entry.verdict);
}

interface DebateTimelineProps {
  entries: TimelineEntry[];
  selectedId?: string | null;
  onSelect?: (entry: TimelineEntry) => void;
}

export function DebateTimeline({ entries, selectedId = null, onSelect }: DebateTimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="text-body-md text-ink-subtle py-10 text-center">
        El debate entre Ejecutor y Auditor aparecerá aquí en tiempo real.
      </p>
    );
  }

  return (
    <div className="relative pt-5">
      <div
        aria-hidden="true"
        className="absolute top-5 bottom-5 left-4 w-px -translate-x-1/2 bg-line/40"
      />
      <ol
        className="flex flex-col gap-5"
        role="log"
        aria-label="Debate multi-agente"
        aria-live="polite"
      >
        {entries.map((entry, index) => {
          const visual = resolveVisual(entry);
          const Icon = visual.icon;
          const isLatest = index === entries.length - 1;
          const selectable = isDetailEntry(entry);
          const selected = selectedId === entry.id;

          return (
            <li key={entry.id} className={cn("relative", entry.isNew && "animate-in")}>
              {selectable ? (
                <button
                  type="button"
                  onClick={() => onSelect?.(entry)}
                  aria-pressed={selected}
                  aria-label={`Ver detalle de ${entry.title}`}
                  className={cn(
                    "relative flex w-full items-start gap-4 rounded-xl border p-3 text-left transition-colors duration-200",
                    selected
                      ? "border-brand bg-brand-soft/40 shadow-xs"
                      : isLatest
                        ? "border-brand-dim/60 bg-brand-soft/20 hover:border-brand/50"
                        : entry.type === "audit_rejected"
                          ? "border-rose-200/80 bg-rose-50/40 hover:border-rose-300 hover:bg-rose-50"
                          : "border-transparent hover:border-line/40 hover:bg-surface-low/80",
                  )}
                >
                  <TimelineRow
                    entry={entry}
                    visual={visual}
                    Icon={Icon}
                    isLatest={isLatest}
                    selected={selected}
                    showHint
                  />
                </button>
              ) : (
                <div
                  className={cn(
                    "relative flex items-start gap-4 transition-colors duration-500",
                    isLatest && "-mx-3 rounded-xl border border-brand-dim/60 bg-brand-soft/20 p-3",
                  )}
                >
                  <TimelineRow
                    entry={entry}
                    visual={visual}
                    Icon={Icon}
                    isLatest={isLatest}
                    selected={false}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function TimelineRow({
  entry,
  visual,
  Icon,
  isLatest,
  selected,
  showHint,
}: {
  entry: TimelineEntry;
  visual: EventVisual;
  Icon: LucideIcon;
  isLatest: boolean;
  selected: boolean;
  showHint?: boolean;
}) {
  return (
    <>
      <span
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-xs",
          visual.nodeClass,
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
      </span>

      <div className="flex min-w-0 flex-1 flex-col pt-0.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={cn(
              "text-label-md text-ink font-sans font-semibold",
              visual.titleClass,
              (isLatest || selected) && !visual.titleClass && "text-brand",
            )}
          >
            {entry.title}
          </span>
          <time
            dateTime={entry.timestamp}
            className={cn(
              "text-code text-ink-subtle font-mono tabular-nums",
              (isLatest || selected) && "text-brand",
            )}
          >
            {formatTime(entry.timestamp)}
          </time>
        </div>

        {entry.description && (
          <p
            className={cn(
              "text-body-sm text-ink-muted mt-0.5",
              visual.descriptionClass,
              (isLatest || selected) && "text-ink font-medium",
            )}
          >
            {entry.description}
          </p>
        )}

        {entry.type === "audit_rejected" && entry.verdict?.feedback && (
          <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50/90 p-2.5 text-body-xs text-rose-900 shadow-xs">
            <span className="mb-0.5 flex items-center gap-1 font-sans font-bold text-rose-950">
              ⚠️ Instrucción correctiva del Auditor:
            </span>
            <p className="leading-relaxed">{entry.verdict.feedback}</p>
          </div>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {entry.iteration != null && (
            <span
              className={cn(
                "text-label-micro text-ink-muted inline-block rounded border border-transparent bg-surface-low px-1.5 py-0.5 font-sans font-medium",
                visual.chipClass,
                (isLatest || selected) && !visual.chipClass && "bg-brand-soft text-brand-ink",
              )}
            >
              Iteración {entry.iteration}
            </span>
          )}
          {showHint && (
            <span
              className={cn(
                "text-label-micro font-sans font-semibold tracking-[0.04em]",
                selected ? "text-brand" : "text-ink-subtle",
              )}
            >
              {selected ? "Detalle activo →" : "Click para ver detalle →"}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
