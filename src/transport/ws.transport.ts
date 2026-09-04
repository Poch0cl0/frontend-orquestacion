import type { ArgusEvent } from "@/types";
import type { ArgusTransport, ConnectionHandler, TransportEventHandler } from "./types";

const MAX_RECONNECT = 5;
const BASE_DELAY = 1000;

export class WebSocketTransport implements ArgusTransport {
  private ws: WebSocket | null = null;
  private eventHandlers = new Set<TransportEventHandler>();
  private connectionHandlers = new Set<ConnectionHandler>();
  private status: "connected" | "connecting" | "reconnecting" | "disconnected" = "disconnected";
  private reconnectAttempt = 0;
  private taskId: string | null = null;
  private intentionalClose = false;

  connect(taskId?: string): void {
    this.taskId = taskId ?? null;
    this.intentionalClose = false;
    this.createConnection();
  }

  disconnect(): void {
    this.intentionalClose = true;
    this.ws?.close();
    this.ws = null;
    this.setStatus("disconnected");
  }

  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  onEvent(handler: TransportEventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  getConnectionStatus() {
    return this.status;
  }

  getReconnectAttempt() {
    return this.reconnectAttempt;
  }

  getMaxReconnectAttempts() {
    return MAX_RECONNECT;
  }

  private createConnection(): void {
    const url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
    const wsUrl = this.taskId ? `${url}?taskId=${this.taskId}` : url;
    this.setStatus(this.reconnectAttempt > 0 ? "reconnecting" : "connecting");

    try {
      this.ws = new WebSocket(wsUrl);
    } catch {
      this.handleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempt = 0;
      this.setStatus("connected");
    };

    this.ws.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data as string) as ArgusEvent;
        this.eventHandlers.forEach((h) => h(event));
      } catch {
        // ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      if (!this.intentionalClose) this.handleReconnect();
      else this.setStatus("disconnected");
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private handleReconnect(): void {
    if (this.reconnectAttempt >= MAX_RECONNECT) {
      this.setStatus("disconnected");
      return;
    }
    this.reconnectAttempt++;
    const delay = BASE_DELAY * Math.pow(2, this.reconnectAttempt - 1);
    setTimeout(() => this.createConnection(), delay);
  }

  private setStatus(status: typeof this.status): void {
    this.status = status;
    this.connectionHandlers.forEach((h) => h(status));
  }
}
