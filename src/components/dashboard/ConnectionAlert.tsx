"use client";

import { WifiOff } from "lucide-react";
import { useArgusStream } from "@/hooks/useArgusStream";

export function ConnectionAlert() {
  const { connectionStatus, reconnectAttempt, maxReconnectAttempts } = useArgusStream();

  if (connectionStatus === "connected" || connectionStatus === "connecting") return null;

  const reconnecting = connectionStatus === "reconnecting";

  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
    >
      <WifiOff className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
      <div>
        <p className="text-body-md font-sans font-semibold text-amber-900">
          {reconnecting ? "Conexión perdida — ARGUS está reconectando..." : "Sistema desconectado"}
        </p>
        <p className="text-body-sm mt-0.5 text-amber-700 tabular-nums">
          {reconnecting
            ? `Reintento ${reconnectAttempt}/${maxReconnectAttempts}`
            : "No se reciben eventos del orquestador."}
        </p>
      </div>
    </div>
  );
}
