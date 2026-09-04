import type { AuditEvent, TimelineEntry } from "@/types";
import { DebateTimeline } from "@/components/dashboard/DebateTimeline";

/** Normaliza la trayectoria persistida del audit log al modelo del timeline en vivo. */
function toTimelineEntries(events: AuditEvent[]): TimelineEntry[] {
  return events.map((event) => ({
    id: event.id,
    timestamp: event.timestamp,
    agent: event.agent,
    type: event.type as TimelineEntry["type"],
    title: event.title,
    description: event.description,
    iteration: event.iteration,
  }));
}

export function AuditTimeline({ events }: { events: AuditEvent[] }) {
  return <DebateTimeline entries={toTimelineEntries(events)} />;
}
