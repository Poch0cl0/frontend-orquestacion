"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Download, Plus, ShieldCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ActiveOperation } from "@/components/dashboard/ActiveOperation";
import { AgentDebate } from "@/components/dashboard/AgentDebate";
import { ConnectionAlert } from "@/components/dashboard/ConnectionAlert";
import { Button } from "@/components/ui/Button";
import { useArgusStream } from "@/hooks/useArgusStream";
import { useToast } from "@/components/ui/Toast";
import { downloadEvidenceMarkdown } from "@/lib/evidence";
import { upsertEvidenceHistory } from "@/lib/evidence-history";

export default function DashboardPage() {
  const {
    timeline,
    executorProposal,
    auditorVerdict,
    executionResult,
    status,
    isConnected,
    taskId,
    objective,
    iterationCount,
  } = useArgusStream();
  const { toast } = useToast();

  const inFlight = status === "DEBATING" || status === "EXECUTING";
  const completed = Boolean(executionResult && status === "COMPLETED" && taskId);

  useEffect(() => {
    if (!completed || !taskId || !objective) return;
    upsertEvidenceHistory({
      id: taskId,
      objective,
      decision: "APPROVED",
      status,
      iterations: iterationCount,
      timestamp: new Date().toISOString(),
      proposal: executorProposal,
      verdict: auditorVerdict,
      finalResult: executionResult,
      timeline: timeline.map((e) => ({
        title: e.title,
        description: e.description,
        type: e.type,
        timestamp: e.timestamp,
        iteration: e.iteration,
      })),
    });
  }, [
    completed,
    taskId,
    objective,
    status,
    iterationCount,
    executorProposal,
    auditorVerdict,
    executionResult,
    timeline,
  ]);

  function handleDownloadEvidence() {
    if (!taskId || !objective) return;
    const payload = {
      id: taskId,
      objective,
      decision: "APPROVED",
      status,
      iterations: iterationCount,
      timestamp: new Date().toISOString(),
      proposal: executorProposal,
      verdict: auditorVerdict,
      finalResult: executionResult,
      timeline: timeline.map((e) => ({
        title: e.title,
        description: e.description,
        type: e.type,
        timestamp: e.timestamp,
        iteration: e.iteration,
      })),
    };
    downloadEvidenceMarkdown(payload);
    upsertEvidenceHistory(payload);
    toast("Evidencia PDF descargada", "success", `argus-evidencia-${taskId}.pdf`);
  }

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-5">
        <PageHeader
          title="Dashboard"
          description="Supervisa las decisiones y ejecuciones gobernadas por ARGUS."
          action={
            <Link href="/new-task">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Nueva tarea
              </Button>
            </Link>
          }
        />

        <ConnectionAlert />
        <DashboardStats />
        <ActiveOperation />

        {completed && (
          <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
              <div>
                <p className="text-label-micro font-sans font-bold tracking-[0.08em] text-emerald-700 uppercase">
                  Resultado de ejecución
                </p>
                <p className="text-body-md mt-1 text-emerald-900">{executionResult}</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={handleDownloadEvidence}>
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Descargar evidencia PDF
            </Button>
          </div>
        )}

        <AgentDebate
          timeline={timeline}
          executorProposal={executorProposal}
          auditorVerdict={auditorVerdict}
          live={isConnected && (inFlight || timeline.length > 0)}
        />
      </div>
    </PageContainer>
  );
}
