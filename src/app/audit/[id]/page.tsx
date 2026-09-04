"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { AuditDetail } from "@/components/audit/AuditDetail";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useAuditDetail } from "@/hooks/useAuditHistory";

export default function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { record, loading, error } = useAuditDetail(id);

  return (
    <PageContainer>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <PageHeader
          title={`Auditoría #${id}`}
          breadcrumb={<Breadcrumb path="Gobernanza / Evidencia" id={`GET /audit/history/${id}`} />}
          action={
            <Link href="/audit">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Volver al historial
              </Button>
            </Link>
          }
        />

        {loading && <Spinner label="Reconstruyendo trayectoria..." />}

        {error && (
          <div
            role="alert"
            className="text-body-md rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700"
          >
            {error}
          </div>
        )}

        {!loading && !error && !record && (
          <EmptyState
            title="Registro no encontrado"
            description={`No existe ninguna auditoría con el identificador #${id}.`}
            action={
              <Link href="/audit">
                <Button variant="outline" size="sm">
                  Volver al historial
                </Button>
              </Link>
            }
          />
        )}

        {record && (
          <div className="surface-card p-6">
            <AuditDetail record={record} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
