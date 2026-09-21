import { jsPDF } from "jspdf";
import type { AuditLog, AuditorVerdict, ExecutorProposal, TimelineEntry } from "@/types";

export interface EvidencePayload {
  id: string;
  objective: string;
  decision: string;
  status: string;
  iterations: number;
  risk?: string;
  timestamp: string;
  proposal?: ExecutorProposal | null;
  verdict?: AuditorVerdict | null;
  finalResult?: string | null;
  timeline?: Array<Pick<TimelineEntry, "title" | "description" | "type" | "timestamp" | "iteration">>;
  commit?: string | null;
  files?: string[];
}

const COMMIT_RE = /commit\s+`([^`]+)`/i;
const FILES_RE = /archivos escritos[^:]*:\s*([^·]+)/i;

export function parseEvidenceExtras(finalResult?: string | null): { commit?: string; files: string[] } {
  if (!finalResult) return { files: [] };
  const commit = finalResult.match(COMMIT_RE)?.[1];
  const filesChunk = finalResult.match(FILES_RE)?.[1] ?? "";
  const files = [...filesChunk.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  return { commit, files };
}

export function evidenceFromAuditLog(record: AuditLog): EvidencePayload {
  return {
    id: record.id,
    objective: record.objective,
    decision: record.decision,
    status: record.status,
    iterations: record.iterations,
    risk: record.risk,
    timestamp: record.timestamp,
    proposal: record.proposals.at(-1) ?? null,
    verdict: record.verdicts.at(-1) ?? null,
    finalResult: record.finalResult,
    timeline: record.trajectory.map((e) => ({
      title: e.title,
      description: e.description,
      type: e.type,
      timestamp: e.timestamp,
      iteration: e.iteration,
    })),
  };
}

function evidenceLines(payload: EvidencePayload): string[] {
  const extras = parseEvidenceExtras(payload.finalResult);
  const commit = payload.commit ?? extras.commit;
  const files = payload.files?.length ? payload.files : extras.files;
  const lines: string[] = [
    `Evidencia ARGUS — #${payload.id}`,
    `Fecha: ${payload.timestamp}`,
    `Objetivo: ${payload.objective}`,
    `Decision: ${payload.decision}`,
    `Estado: ${payload.status}`,
    `Iteraciones: ${payload.iterations}`,
  ];
  if (payload.risk) lines.push(`Riesgo: ${payload.risk}`);
  if (commit) lines.push(`Commit: ${commit}`);
  if (files.length) {
    lines.push("", "Archivos aplicados:");
    for (const f of files) lines.push(`- ${f}`);
  }
  if (payload.proposal) {
    lines.push(
      "",
      "Plan del Ejecutor:",
      `- Accion: ${payload.proposal.action}`,
      `- Motivo: ${payload.proposal.reason}`,
      `- Modelo: ${payload.proposal.model ?? "N/A"}`,
      `- Herramientas: ${(payload.proposal.tools ?? []).join(", ") || "N/A"}`,
    );
  }
  if (payload.verdict) {
    lines.push(
      "",
      "Dictamen del Auditor:",
      `- Decision: ${payload.verdict.decision}`,
      `- Riesgo: ${payload.verdict.risk}`,
      `- Framework: ${payload.verdict.framework ?? "COBIT 2019"}`,
      `- Motivo: ${payload.verdict.reason}`,
    );
    if (payload.verdict.feedback) lines.push(`- Feedback: ${payload.verdict.feedback}`);
  }
  if (payload.timeline?.length) {
    lines.push("", "Trayectoria:");
    for (const step of payload.timeline) {
      const iter = step.iteration != null ? ` (iter. ${step.iteration})` : "";
      lines.push(`- ${step.title}${iter}: ${step.description ?? step.type}`);
    }
  }
  if (payload.finalResult) {
    lines.push("", "Resultado de ejecucion:", payload.finalResult);
  }
  lines.push("", "Generado por ARGUS AI Governance");
  return lines;
}

function writeLinesToPdf(doc: jsPDF, lines: string[], startY = 16): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const maxWidth = pageWidth - margin * 2;
  let y = startY;
  const lineHeight = 5.5;

  for (const raw of lines) {
    const isTitle = raw.startsWith("Evidencia ARGUS") || raw.startsWith("Historial ARGUS");
    const isSection =
      raw.endsWith(":") &&
      !raw.startsWith("-") &&
      (raw.includes("Plan") ||
        raw.includes("Dictamen") ||
        raw.includes("Trayectoria") ||
        raw.includes("Archivos") ||
        raw.includes("Resultado") ||
        raw.includes("Rango"));

    if (isTitle) doc.setFont("helvetica", "bold");
    else if (isSection) doc.setFont("helvetica", "bold");
    else doc.setFont("helvetica", "normal");

    doc.setFontSize(isTitle ? 13 : isSection ? 11 : 9.5);

    const wrapped = doc.splitTextToSize(raw || " ", maxWidth) as string[];
    for (const part of wrapped) {
      if (y > doc.internal.pageSize.getHeight() - 16) {
        doc.addPage();
        y = 16;
      }
      doc.text(part, margin, y);
      y += lineHeight;
    }
    if (raw === "") y += 1.5;
  }
}

export function downloadEvidencePdf(payload: EvidencePayload): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  writeLinesToPdf(doc, evidenceLines(payload));
  doc.save(`argus-evidencia-${payload.id}.pdf`);
}

export function downloadHistoryRangePdf(
  items: EvidencePayload[],
  dateFrom: string,
  dateTo: string,
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const header = [
    "Historial ARGUS — reporte por rango de fechas",
    `Rango: ${dateFrom || "inicio"} → ${dateTo || "hoy"}`,
    `Total de registros: ${items.length}`,
    `Generado: ${new Date().toISOString()}`,
    "",
  ];
  writeLinesToPdf(doc, header);

  if (items.length === 0) {
    writeLinesToPdf(doc, ["No hay registros en el rango seleccionado."], 42);
  } else {
    const allLines: string[] = [];
    items.forEach((item, index) => {
      allLines.push("", `—— Registro ${index + 1} / ${items.length} ——`, "");
      allLines.push(...evidenceLines(item));
    });
    writeLinesToPdf(doc, allLines, 42);
  }

  const fromTag = (dateFrom || "inicio").replace(/[:/\\]/g, "-");
  const toTag = (dateTo || "hoy").replace(/[:/\\]/g, "-");
  doc.save(`argus-historial-${fromTag}_${toTag}.pdf`);
}

/** @deprecated use downloadEvidencePdf */
export function downloadEvidenceMarkdown(payload: EvidencePayload): void {
  downloadEvidencePdf(payload);
}
