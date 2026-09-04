import {
  CheckCircle2,
  Clock,
  Loader2,
  Scale,
  ShieldCheck,
  ShieldX,
  UserCog,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { TaskStatus } from "@/types";

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  /** Clases del chip completo: fondo + borde + texto. */
  chipClass: string;
  dotClass: string;
  accentClass: string;
}

export const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  PENDING: {
    label: "Pendiente",
    icon: Clock,
    chipClass: "bg-surface-low text-ink-muted border-line/30",
    dotClass: "bg-ink-subtle",
    accentClass: "border-l-line",
  },
  DEBATING: {
    label: "En debate",
    icon: Scale,
    chipClass: "bg-amber-50 text-amber-900 border-amber-200",
    dotClass: "bg-amber-500",
    accentClass: "border-l-amber-400",
  },
  APPROVED: {
    label: "Aprobado",
    icon: CheckCircle2,
    chipClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
    accentClass: "border-l-emerald-500",
  },
  REJECTED: {
    label: "Rechazado",
    icon: ShieldX,
    chipClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
    accentClass: "border-l-rose-500",
  },
  EXECUTING: {
    label: "Ejecutando",
    icon: Loader2,
    chipClass: "bg-blue-50 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
    accentClass: "border-l-blue-500",
  },
  COMPLETED: {
    label: "Completado",
    icon: ShieldCheck,
    chipClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-600",
    accentClass: "border-l-emerald-600",
  },
  HUMAN_ESCALATION: {
    label: "Escalado a humano",
    icon: UserCog,
    chipClass: "bg-violet-50 text-violet-700 border-violet-200",
    dotClass: "bg-violet-500",
    accentClass: "border-l-violet-500",
  },
  ERROR: {
    label: "Error",
    icon: XCircle,
    chipClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-600",
    accentClass: "border-l-rose-600",
  },
};

export const RISK_CONFIG = {
  LOW: { label: "Riesgo Bajo", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  MEDIUM: { label: "Riesgo Medio", className: "bg-amber-50 text-amber-900 border-amber-200" },
  HIGH: { label: "Riesgo Alto", className: "bg-rose-100 text-rose-900 border-rose-200" },
} as const;

export const CONNECTION_CONFIG = {
  connected: { label: "Conectado", dotClass: "bg-teal", textClass: "text-ink-muted" },
  connecting: { label: "Conectando", dotClass: "bg-amber-500", textClass: "text-amber-700" },
  reconnecting: { label: "Reconectando", dotClass: "bg-amber-500", textClass: "text-amber-700" },
  disconnected: { label: "Desconectado", dotClass: "bg-rose-500", textClass: "text-rose-700" },
} as const;

export const DECISION_LABELS: Record<string, string> = {
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  EXECUTED: "Ejecutado",
  HUMAN_ESCALATION: "Escalado a humano",
  ERROR: "Error",
};

export const DECISION_VARIANT = {
  APPROVED: "success",
  EXECUTED: "success",
  REJECTED: "danger",
  HUMAN_ESCALATION: "violet",
  ERROR: "danger",
} as const;

export function getStatusConfig(status: TaskStatus): StatusConfig {
  return STATUS_CONFIG[status];
}
