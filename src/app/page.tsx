"use client";

import Link from "next/link";
import { Plus, ShieldCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ActiveOperation } from "@/components/dashboard/ActiveOperation";
import { AgentDebate } from "@/components/dashboard/AgentDebate";
import { ConnectionAlert } from "@/components/dashboard/ConnectionAlert";
import { Button } from "@/components/ui/Button";
import { useArgusStream } from "@/hooks/useArgusStream";

export default function DashboardPage() {
  const { timeline, executorProposal, auditorVerdict, executionResult, status, isConnected } =
    useArgusStream();

  const inFlight = status === "DEBATING" || status === "EXECUTING";

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

        {executionResult && status === "COMPLETED" && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <p className="text-label-micro font-sans font-bold tracking-[0.08em] text-emerald-700 uppercase">
                Resultado de ejecución
              </p>
              <p className="text-body-md mt-1 text-emerald-900">{executionResult}</p>
            </div>
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
