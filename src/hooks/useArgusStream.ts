"use client";

import { useArgus } from "@/providers/ArgusProvider";

export function useArgusStream() {
  const { state, connect, disconnect, reset } = useArgus();

  return {
    ...state,
    connect,
    disconnect,
    reset,
    isConnected: state.connectionStatus === "connected",
    isReconnecting: state.connectionStatus === "reconnecting",
    isOffline: state.connectionStatus === "disconnected",
  };
}
