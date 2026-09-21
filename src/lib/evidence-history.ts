import type { EvidencePayload } from "./evidence";
import { downloadEvidencePdf, parseEvidenceExtras } from "./evidence";

const STORAGE_KEY = "argus.evidence.history.v2";

export interface EvidenceHistoryItem {
  id: string;
  objective: string;
  decision: string;
  timestamp: string;
  commit?: string;
  files: string[];
  summary: string;
  payload: EvidencePayload;
}

function readAll(): EvidenceHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as EvidenceHistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: EvidenceHistoryItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/** Historial ordenado: más reciente primero. */
export function listEvidenceHistory(): EvidenceHistoryItem[] {
  return readAll().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export function listEvidenceHistoryInRange(dateFrom?: string, dateTo?: string): EvidenceHistoryItem[] {
  const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
  const to = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;

  return listEvidenceHistory().filter((item) => {
    const ts = new Date(item.timestamp).getTime();
    if (from && ts < from.getTime()) return false;
    if (to && ts > to.getTime()) return false;
    return true;
  });
}

export function upsertEvidenceHistory(payload: EvidencePayload): EvidenceHistoryItem {
  const extras = parseEvidenceExtras(payload.finalResult);
  const commit = payload.commit ?? extras.commit;
  const files = payload.files?.length ? payload.files : extras.files;
  const item: EvidenceHistoryItem = {
    id: payload.id,
    objective: payload.objective,
    decision: payload.decision,
    timestamp: payload.timestamp,
    commit,
    files,
    summary: payload.finalResult || `${payload.decision} · ${payload.objective.slice(0, 80)}`,
    payload: {
      ...payload,
      commit: commit ?? payload.commit,
      files,
    },
  };

  const rest = readAll().filter((e) => e.id !== item.id);
  writeAll([item, ...rest]);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("argus:evidence-updated"));
  }
  return item;
}

export function downloadStoredEvidence(item: EvidenceHistoryItem): void {
  downloadEvidencePdf(item.payload);
}
