"use client";

import { useState } from "react";
import { Bot, Check, Copy } from "lucide-react";
import type { ExecutorProposal } from "@/types";
import { FieldLabel } from "@/components/ui/Card";
import { formatTime } from "@/lib/format";

function CopyAction({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      title="Copiar comando"
      aria-label={`Copiar acción ${value}`}
      onClick={() => {
        void navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-ink-subtle hover:text-ink focus-visible:ring-brand rounded transition-colors focus-visible:ring-2"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

export function ExecutorCard({ proposal }: { proposal: ExecutorProposal | null }) {
  return (
    <article className="surface-card flex flex-col gap-4 border-l-4 border-l-brand p-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-high text-brand">
            <Bot className="h-4 w-4" aria-hidden="true" />
          </span>
          <h3 className="text-headline-sm text-ink font-sans">Ejecutor</h3>
        </div>
        {proposal?.model && (
          <span className="text-code text-ink-subtle rounded bg-surface-low px-2 py-0.5 font-mono font-medium">
            {proposal.model}
          </span>
        )}
      </header>

      {!proposal ? (
        <p className="text-body-md text-ink-subtle">Esperando propuesta del ejecutor...</p>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <FieldLabel>Acción</FieldLabel>
            <div className="flex items-center justify-between gap-2 rounded border border-line/30 bg-surface-low px-3 py-1.5">
              <code className="text-code text-brand font-mono font-medium">{proposal.action}</code>
              <CopyAction value={proposal.action} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Parámetros</FieldLabel>
            <pre className="text-code text-ink overflow-x-auto rounded border border-line/30 bg-surface-low p-3 font-mono leading-relaxed">
              <code>
                {Object.entries(proposal.parameters)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("\n")}
              </code>
            </pre>
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Justificación</FieldLabel>
            <p className="text-body-sm text-ink-muted leading-normal">{proposal.reason}</p>
          </div>

          {proposal.tools.length > 0 && (
            <div className="flex flex-col gap-1">
              <FieldLabel>Herramientas</FieldLabel>
              <div className="flex flex-wrap items-center gap-2">
                {proposal.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-label-micro text-ink rounded border border-line/20 bg-surface-low px-2 py-1 font-sans font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          <footer className="flex items-center justify-between border-t border-line/20 pt-3">
            <span className="text-label-micro text-ink-muted rounded bg-surface-low px-2 py-0.5 font-sans font-medium">
              Iteración {proposal.iteration}
            </span>
            <time dateTime={proposal.timestamp} className="text-code text-ink-subtle font-mono tabular-nums">
              {formatTime(proposal.timestamp)}
            </time>
          </footer>
        </>
      )}
    </article>
  );
}
