"use client";

import { Search } from "lucide-react";
import type { AuditFilters } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface AuditFiltersBarProps {
  filters: AuditFilters;
  onChange: (filters: AuditFilters) => void;
}

export function AuditFiltersBar({ filters, onChange }: AuditFiltersBarProps) {
  return (
    <div className="surface-card grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        name="search"
        label="Buscar"
        placeholder="ID u objetivo..."
        value={filters.search || ""}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        adornment={<Search className="h-4 w-4" />}
        className="font-body"
      />
      <Select
        name="status"
        label="Estado"
        value={filters.status || "all"}
        onChange={(e) => onChange({ ...filters, status: e.target.value as AuditFilters["status"] })}
        options={[
          { value: "all", label: "Todos" },
          { value: "APPROVED", label: "Aprobado" },
          { value: "REJECTED", label: "Rechazado" },
          { value: "EXECUTED", label: "Ejecutado" },
          { value: "HUMAN_ESCALATION", label: "Escalado a humano" },
          { value: "ERROR", label: "Error" },
        ]}
      />
      <Select
        name="risk"
        label="Riesgo"
        value={filters.risk || "all"}
        onChange={(e) => onChange({ ...filters, risk: e.target.value as AuditFilters["risk"] })}
        options={[
          { value: "all", label: "Todos" },
          { value: "LOW", label: "Bajo" },
          { value: "MEDIUM", label: "Medio" },
          { value: "HIGH", label: "Alto" },
        ]}
      />
      <Input
        name="dateFrom"
        label="Desde"
        type="date"
        value={filters.dateFrom || ""}
        onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
      />
    </div>
  );
}
