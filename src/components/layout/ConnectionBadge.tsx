"use client";

import { useArgusStream } from "@/hooks/useArgusStream";
import { CONNECTION_CONFIG } from "@/lib/status";
import { cn } from "@/lib/cn";

export function ConnectionBadge({ collapsed }: { collapsed?: boolean }) {
  const { connectionStatus, reconnectAttempt, maxReconnectAttempts } = useArgusStream();
  const config = CONNECTION_CONFIG[connectionStatus];
  const live = connectionStatus === "connecting" || connectionStatus === "reconnecting";

  const label =
    connectionStatus === "reconnecting"
      ? `Reconectando ${reconnectAttempt}/${maxReconnectAttempts}`
      : config.label;

  const dot = (
    <span className="relative flex h-2 w-2 shrink-0">
      {(live || connectionStatus === "connected") && (
        <span
          className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", config.dotClass)}
        />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", config.dotClass)} />
    </span>
  );

  if (collapsed) {
    return (
      <span title={label} role="status" aria-label={`Estado de conexión: ${label}`}>
        {dot}
      </span>
    );
  }

  return (
    <div
      role="status"
      aria-label={`Estado de conexión: ${label}`}
      className="inline-flex items-center gap-2 rounded-full border border-line/30 bg-surface-low px-3 py-1.5"
    >
      {dot}
      <span className={cn("text-label-md font-sans font-medium", config.textClass)}>{label}</span>
    </div>
  );
}
