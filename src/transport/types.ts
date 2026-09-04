import type { ArgusEvent, ConnectionStatus } from "@/types";

export type TransportEventHandler = (event: ArgusEvent) => void;
export type ConnectionHandler = (status: ConnectionStatus) => void;

export interface ArgusTransport {
  connect(taskId?: string): void;
  disconnect(): void;
  send(data: unknown): void;
  onEvent(handler: TransportEventHandler): () => void;
  onConnectionChange(handler: ConnectionHandler): () => void;
  getConnectionStatus(): ConnectionStatus;
}

export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_ARGUS_MODE !== "live";
}
