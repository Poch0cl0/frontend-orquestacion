"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { Breadcrumb, PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { AuditFiltersBar } from "@/components/audit/AuditFilters";
import { AuditPagination, AuditTable } from "@/components/audit/AuditTable";
import { AuditDetail } from "@/components/audit/AuditDetail";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useAuditDetail, useAuditHistory } from "@/hooks/useAuditHistory";

export default function AuditPage() {
  const { result, loading, error, filters, setFilters, page, setPage } = useAuditHistory();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { record, loading: detailLoading } = useAuditDetail(selectedId);

  const isEmpty = !loading && !error && result?.data.length === 0;

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-5">
        <PageHeader
          title="Auditoría"
          description="Consulta el historial de ejecuciones y la trazabilidad de cada decisión."
          breadcrumb={<Breadcrumb path="Gobernanza / Evidencia" id="GET /audit/history" />}
        />

        <AuditFiltersBar
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        {loading && <Spinner label="Cargando historial de auditoría..." />}

        {error && (
          <div
            role="alert"
            className="text-body-md rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700"
          >
            {error}
          </div>
        )}

        {isEmpty && (
          <EmptyState
            icon={<History className="h-5 w-5" />}
            title="Sin registros de auditoría"
            description="Cuando ARGUS procese tu primera tarea, el historial de decisiones aparecerá aquí."
          />
        )}

        {!loading && result && result.data.length > 0 && (
          <>
            <AuditTable records={result.data} onView={setSelectedId} />
            <AuditPagination page={page} totalPages={result.totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <Drawer
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        eyebrow="Registro de auditoría"
        title={record ? `Auditoría #${record.id}` : "Cargando detalle"}
      >
        {detailLoading && <Spinner label="Reconstruyendo trayectoria..." />}
        {record && <AuditDetail record={record} />}
      </Drawer>
    </PageContainer>
  );
}
