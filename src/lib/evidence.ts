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

/** Paleta formal institucional */
const C = {
  ink: [28, 35, 45] as [number, number, number],
  muted: [90, 100, 112] as [number, number, number],
  line: [210, 216, 224] as [number, number, number],
  brand: [15, 76, 92] as [number, number, number],
  brandSoft: [232, 242, 245] as [number, number, number],
  accent: [180, 140, 70] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  success: [30, 100, 70] as [number, number, number],
  danger: [140, 40, 40] as [number, number, number],
};

const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

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
      type: e.type as TimelineEntry["type"],
      timestamp: e.timestamp,
      iteration: e.iteration,
    })),
  };
}

function formatFormalDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

class FormalPdf {
  doc: jsPDF;
  y: number;
  page = 1;

  constructor() {
    this.doc = new jsPDF({ unit: "mm", format: "a4" });
    this.y = MARGIN;
  }

  ensureSpace(needed: number) {
    if (this.y + needed > PAGE_H - 22) {
      this.drawFooter();
      this.doc.addPage();
      this.page += 1;
      this.drawPageChrome();
      this.y = 28;
    }
  }

  drawPageChrome() {
    // Franja superior sutil en páginas siguientes
    this.doc.setFillColor(...C.brand);
    this.doc.rect(0, 0, PAGE_W, 6, "F");
    this.doc.setDrawColor(...C.accent);
    this.doc.setLineWidth(0.4);
    this.doc.line(0, 6, PAGE_W, 6);
  }

  drawCoverHeader(subtitle: string, docId: string) {
    this.doc.setFillColor(...C.brand);
    this.doc.rect(0, 0, PAGE_W, 36, "F");

    this.doc.setDrawColor(...C.accent);
    this.doc.setLineWidth(1.2);
    this.doc.line(0, 36, PAGE_W, 36);

    this.doc.setTextColor(...C.white);
    this.doc.setFont("times", "bold");
    this.doc.setFontSize(18);
    this.doc.text("ARGUS", MARGIN, 14);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.setTextColor(200, 220, 225);
    this.doc.text("AI GOVERNANCE  ·  CONTROL DE AGENTES AUTÓNOMOS", MARGIN, 20);

    this.doc.setFont("times", "bold");
    this.doc.setFontSize(12);
    this.doc.setTextColor(...C.white);
    this.doc.text(subtitle, MARGIN, 29);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.text(`Ref. ${docId}`, PAGE_W - MARGIN, 14, { align: "right" });

    this.y = 46;
  }

  drawFooter() {
    const totalHint = this.page;
    this.doc.setDrawColor(...C.line);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGIN, PAGE_H - 14, PAGE_W - MARGIN, PAGE_H - 14);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(...C.muted);
    this.doc.text(
      "Documento de evidencia — uso interno · ARGUS AI Governance",
      MARGIN,
      PAGE_H - 9,
    );
    this.doc.text(`Página ${totalHint}`, PAGE_W - MARGIN, PAGE_H - 9, { align: "right" });
  }

  sectionTitle(number: string, title: string) {
    this.ensureSpace(16);
    this.y += 4;

    // Número en círculo / bloque
    this.doc.setFillColor(...C.brand);
    this.doc.roundedRect(MARGIN, this.y - 4.2, 10, 8, 1, 1, "F");
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.white);
    this.doc.text(number, MARGIN + 5, this.y + 1.1, { align: "center" });

    this.doc.setFillColor(...C.brandSoft);
    this.doc.rect(MARGIN + 12, this.y - 4.2, CONTENT_W - 12, 8, "F");

    this.doc.setFont("times", "bold");
    this.doc.setFontSize(11);
    this.doc.setTextColor(...C.brand);
    this.doc.text(title, MARGIN + 16, this.y + 1.2);
    this.y += 11;
  }

  subSection(code: string, title: string) {
    this.ensureSpace(10);
    this.y += 1.5;
    this.doc.setDrawColor(...C.accent);
    this.doc.setLineWidth(0.6);
    this.doc.line(MARGIN, this.y - 3, MARGIN, this.y + 3);

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(...C.accent);
    this.doc.text(code, MARGIN + 3, this.y + 1);

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.ink);
    this.doc.text(title, MARGIN + 14, this.y + 1);
    this.y += 6;
  }

  /** Barras horizontales simples (sin librería extra). */
  barChart(
    title: string,
    bars: Array<{ label: string; value: number; color?: [number, number, number] }>,
  ) {
    const max = Math.max(1, ...bars.map((b) => b.value));
    const barMaxW = CONTENT_W - 48;
    this.ensureSpace(14 + bars.length * 9);

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.muted);
    this.doc.text(title.toUpperCase(), MARGIN, this.y);
    this.y += 5;

    this.doc.setDrawColor(...C.line);
    this.doc.setLineWidth(0.2);
    this.doc.setFillColor(252, 253, 254);
    const boxH = bars.length * 8.5 + 4;
    this.doc.roundedRect(MARGIN, this.y - 2, CONTENT_W, boxH, 1.5, 1.5, "FD");
    this.y += 2;

    for (const bar of bars) {
      const color = bar.color ?? C.brand;
      const w = Math.max(2, (bar.value / max) * barMaxW);

      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(...C.muted);
      this.doc.text(bar.label, MARGIN + 3, this.y + 2.5);

      this.doc.setFillColor(230, 235, 240);
      this.doc.roundedRect(MARGIN + 42, this.y - 0.5, barMaxW, 4.5, 0.8, 0.8, "F");
      this.doc.setFillColor(...color);
      this.doc.roundedRect(MARGIN + 42, this.y - 0.5, w, 4.5, 0.8, 0.8, "F");

      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.ink);
      this.doc.text(String(bar.value), MARGIN + 42 + barMaxW + 2, this.y + 2.8);
      this.y += 8.5;
    }
    this.y += 5;
  }

  progressMeter(label: string, value: number, maxValue: number) {
    const max = Math.max(1, maxValue);
    const pct = Math.min(1, value / max);
    this.ensureSpace(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.muted);
    this.doc.text(label.toUpperCase(), MARGIN, this.y);
    this.y += 4;

    this.doc.setFillColor(230, 235, 240);
    this.doc.roundedRect(MARGIN, this.y, CONTENT_W, 5, 1, 1, "F");
    this.doc.setFillColor(...C.brand);
    this.doc.roundedRect(MARGIN, this.y, CONTENT_W * pct, 5, 1, 1, "F");
    this.y += 8;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.ink);
    this.doc.text(`${value} de ${max} (${Math.round(pct * 100)}%)`, MARGIN, this.y);
    this.y += 6;
  }

  kv(label: string, value: string) {
    this.ensureSpace(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.muted);
    this.doc.text(label.toUpperCase(), MARGIN, this.y);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...C.ink);
    const lines = this.doc.splitTextToSize(value || "—", CONTENT_W) as string[];
    this.y += 4.2;
    for (const line of lines) {
      this.ensureSpace(6);
      this.doc.text(line, MARGIN, this.y);
      this.y += 4.6;
    }
    this.y += 1.5;
  }

  body(text: string) {
    this.ensureSpace(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...C.ink);
    const lines = this.doc.splitTextToSize(text || "—", CONTENT_W) as string[];
    for (const line of lines) {
      this.ensureSpace(6);
      this.doc.text(line, MARGIN, this.y);
      this.y += 4.8;
    }
    this.y += 2;
  }

  bullet(text: string) {
    this.ensureSpace(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...C.ink);
    const bullet = "•  ";
    const lines = this.doc.splitTextToSize(text, CONTENT_W - 6) as string[];
    lines.forEach((line, i) => {
      this.ensureSpace(6);
      this.doc.text(i === 0 ? `${bullet}${line}` : `   ${line}`, MARGIN, this.y);
      this.y += 4.8;
    });
  }

  decisionBadge(decision: string) {
    this.ensureSpace(14);
    const approved = /APPROVED|APROBAD|EXECUTED/i.test(decision);
    const color = approved ? C.success : C.danger;
    this.doc.setFillColor(...color);
    this.doc.roundedRect(MARGIN, this.y - 4, 42, 8, 1, 1, "F");
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.white);
    this.doc.text(decision.toUpperCase(), MARGIN + 21, this.y + 1.2, { align: "center" });
    this.y += 10;
  }

  metaGrid(rows: Array<[string, string]>) {
    this.ensureSpace(8 + rows.length * 8);
    const col1 = MARGIN;
    const col2 = MARGIN + 42;

    this.doc.setDrawColor(...C.line);
    this.doc.setLineWidth(0.2);
    this.doc.setFillColor(248, 249, 251);
    const boxH = rows.length * 7.2 + 4;
    this.doc.roundedRect(MARGIN, this.y - 3, CONTENT_W, boxH, 1.5, 1.5, "FD");

    for (const [label, value] of rows) {
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(...C.muted);
      this.doc.text(label.toUpperCase(), col1 + 3, this.y + 1.5);

      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(9);
      this.doc.setTextColor(...C.ink);
      const clipped = this.doc.splitTextToSize(value || "—", CONTENT_W - 48) as string[];
      this.doc.text(clipped[0] ?? "—", col2, this.y + 1.5);
      this.y += 7.2;
    }
    this.y += 6;
  }

  divider() {
    this.ensureSpace(6);
    this.doc.setDrawColor(...C.line);
    this.doc.setLineWidth(0.25);
    this.doc.line(MARGIN, this.y, PAGE_W - MARGIN, this.y);
    this.y += 5;
  }

  finish() {
    this.drawFooter();
    // Actualizar pies en todas las páginas con total
    const total = this.doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      this.doc.setPage(i);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(...C.muted);
      this.doc.setFillColor(...C.white);
      this.doc.rect(PAGE_W - MARGIN - 28, PAGE_H - 12, 28, 6, "F");
      this.doc.text(`Página ${i} de ${total}`, PAGE_W - MARGIN, PAGE_H - 9, { align: "right" });
    }
  }
}

function countTimelineTypes(
  timeline: EvidencePayload["timeline"],
): Array<{ label: string; value: number; color: [number, number, number] }> {
  const map = new Map<string, number>();
  for (const step of timeline ?? []) {
    const key = step.title || step.type || "Evento";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const palette: [number, number, number][] = [
    C.brand,
    C.accent,
    C.success,
    [70, 110, 150],
    C.danger,
    [100, 90, 140],
  ];
  return [...map.entries()].map(([label, value], i) => ({
    label: label.length > 18 ? `${label.slice(0, 16)}…` : label,
    value,
    color: palette[i % palette.length],
  }));
}

function countDecisions(
  items: EvidencePayload[],
): Array<{ label: string; value: number; color: [number, number, number] }> {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = item.decision || "N/A";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const colorFor = (d: string): [number, number, number] => {
    if (/APPROVED|APROBAD|EXECUTED/i.test(d)) return C.success;
    if (/REJECT|RECHAZ/i.test(d)) return C.danger;
    if (/ESCALAT|HUMAN/i.test(d)) return C.accent;
    return C.brand;
  };
  return [...map.entries()].map(([label, value]) => ({
    label,
    value,
    color: colorFor(label),
  }));
}

function renderEvidenceBody(pdf: FormalPdf, payload: EvidencePayload, sectionOffset = 0) {
  const extras = parseEvidenceExtras(payload.finalResult);
  const commit = payload.commit ?? extras.commit;
  const files = payload.files?.length ? payload.files : extras.files;
  const n = (x: number) => String(sectionOffset + x);

  pdf.decisionBadge(payload.decision);

  pdf.metaGrid([
    ["Identificador", `#${payload.id}`],
    ["Fecha", formatFormalDate(payload.timestamp)],
    ["Estado", payload.status],
    ["Iteraciones", String(payload.iterations)],
    ...(payload.risk ? [["Riesgo", payload.risk] as [string, string]] : []),
    ...(commit ? [["Commit", commit] as [string, string]] : []),
  ]);

  pdf.sectionTitle(n(1), "Resumen gráfico");
  pdf.subSection(`${n(1)}.1`, "Consumo de iteraciones");
  const iterMax = Math.max(payload.iterations, 3);
  pdf.progressMeter("Iteraciones del debate", payload.iterations, iterMax);

  const typeBars = countTimelineTypes(payload.timeline);
  if (typeBars.length > 0) {
    pdf.subSection(`${n(1)}.2`, "Distribución de eventos del debate");
    pdf.barChart("Eventos por tipo", typeBars.slice(0, 6));
  }

  pdf.sectionTitle(n(2), "Objetivo operativo");
  pdf.body(payload.objective);

  if (payload.proposal) {
    pdf.sectionTitle(n(3), "Plan del Ejecutor");
    pdf.subSection(`${n(3)}.1`, "Acción propuesta");
    pdf.body(payload.proposal.action);
    pdf.subSection(`${n(3)}.2`, "Motivo / justificación");
    pdf.body(payload.proposal.reason);
    pdf.subSection(`${n(3)}.3`, "Modelo y herramientas");
    pdf.kv("Modelo", payload.proposal.model ?? "N/A");
    pdf.kv("Herramientas", (payload.proposal.tools ?? []).join(", ") || "N/A");
  }

  if (payload.verdict) {
    pdf.sectionTitle(n(4), "Dictamen del Auditor COBIT");
    pdf.subSection(`${n(4)}.1`, "Veredicto");
    pdf.kv("Decisión", payload.verdict.decision);
    pdf.kv("Nivel de riesgo", payload.verdict.risk);
    pdf.kv("Marco de control", payload.verdict.framework ?? "COBIT 2019");
    pdf.subSection(`${n(4)}.2`, "Motivo de conformidad / no conformidad");
    pdf.body(payload.verdict.reason);
    if (payload.verdict.feedback) {
      pdf.subSection(`${n(4)}.3`, "Instrucción correctiva / nota");
      pdf.body(payload.verdict.feedback);
    }
  }

  if (payload.timeline?.length) {
    pdf.sectionTitle(n(5), "Trayectoria de eventos");
    for (const step of payload.timeline) {
      const iter = step.iteration != null ? ` · Iteración ${step.iteration}` : "";
      pdf.bullet(`${step.title}${iter}: ${step.description ?? step.type}`);
    }
  }

  if (files.length) {
    pdf.sectionTitle(n(6), "Artefactos aplicados al repositorio");
    for (const f of files) pdf.bullet(f);
  }

  if (payload.finalResult) {
    pdf.sectionTitle(n(7), "Resultado de ejecución");
    pdf.body(payload.finalResult);
  }

  pdf.divider();
  pdf.doc.setFont("times", "italic");
  pdf.doc.setFontSize(8.5);
  pdf.doc.setTextColor(...C.muted);
  pdf.ensureSpace(10);
  pdf.doc.text(
    "El presente documento constituye evidencia formal del ciclo de gobernanza multi-agente ARGUS.",
    MARGIN,
    pdf.y,
  );
  pdf.y += 8;
}

export function downloadEvidencePdf(payload: EvidencePayload): void {
  const pdf = new FormalPdf();
  pdf.drawCoverHeader("Acta de evidencia de gobernanza", `EVD-${payload.id}`);
  renderEvidenceBody(pdf, payload, 0);
  pdf.finish();
  pdf.doc.save(`argus-evidencia-${payload.id}.pdf`);
}

export function downloadHistoryRangePdf(
  items: EvidencePayload[],
  dateFrom: string,
  dateTo: string,
): void {
  const pdf = new FormalPdf();
  const rangeLabel = `${dateFrom || "inicio"} — ${dateTo || "hoy"}`;
  pdf.drawCoverHeader("Informe histórico de evidencias", `HIST-${Date.now().toString(36).toUpperCase()}`);

  pdf.metaGrid([
    ["Rango temporal", rangeLabel],
    ["Registros incluidos", String(items.length)],
    ["Generado", formatFormalDate(new Date().toISOString())],
  ]);

  if (items.length === 0) {
    pdf.sectionTitle("0", "Contenido");
    pdf.body("No existen registros de evidencia dentro del rango de fechas seleccionado.");
  } else {
    pdf.sectionTitle("0", "Resumen del periodo");
    pdf.subSection("0.1", "Distribución de decisiones");
    pdf.barChart("Cantidad por decisión", countDecisions(items));

    const avgIter =
      items.reduce((acc, i) => acc + (i.iterations || 0), 0) / Math.max(1, items.length);
    pdf.subSection("0.2", "Intensidad media del debate");
    pdf.progressMeter(
      "Promedio de iteraciones",
      Math.round(avgIter * 10) / 10,
      Math.max(3, ...items.map((i) => i.iterations || 0)),
    );

    items.forEach((item, index) => {
      pdf.ensureSpace(24);
      pdf.sectionTitle(String(index + 1), `Registro #${item.id}`);
      renderEvidenceBody(pdf, item, 0);
      if (index < items.length - 1) {
        pdf.divider();
        pdf.y += 2;
      }
    });
  }

  pdf.finish();
  const fromTag = (dateFrom || "inicio").replace(/[:/\\]/g, "-");
  const toTag = (dateTo || "hoy").replace(/[:/\\]/g, "-");
  pdf.doc.save(`argus-historial-${fromTag}_${toTag}.pdf`);
}

/** Compatibilidad con llamadas existentes */
export function downloadEvidenceMarkdown(payload: EvidencePayload): void {
  downloadEvidencePdf(payload);
}
