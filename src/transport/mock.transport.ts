import type { ArgusEvent } from "@/types";
import { buildDemoScript } from "@/mocks/events";
import type { ArgusTransport, ConnectionHandler, TransportEventHandler } from "./types";

export class MockTransport implements ArgusTransport {
  private eventHandlers = new Set<TransportEventHandler>();
  private connectionHandlers = new Set<ConnectionHandler>();
  private status: "connected" | "connecting" | "reconnecting" | "disconnected" = "disconnected";
  private timers: ReturnType<typeof setTimeout>[] = [];
  private taskId: string | null = null;

  connect(taskId?: string): void {
    this.clearTimers();
    this.taskId = taskId ?? `task-${Date.now()}`;
    this.setStatus("connecting");

    const connectTimer = setTimeout(() => {
      this.setStatus("connected");
    }, 300);
    this.timers.push(connectTimer);
  }

  startDemo(taskId: string, objective: string, maxIterations = 5, tokenLimit = 4000): void {
    this.clearTimers();
    this.taskId = taskId;
    this.setStatus("connecting");

    const connectTimer = setTimeout(() => {
      this.setStatus("connected");
      const script = buildDemoScript(this.taskId!, objective, maxIterations, tokenLimit);
      script.forEach(({ delay, event }) => {
        const timer = setTimeout(() => {
          this.emit(event);
        }, delay);
        this.timers.push(timer);
      });
    }, 300);
    this.timers.push(connectTimer);
  }

  disconnect(): void {
    this.clearTimers();
    this.setStatus("disconnected");
  }

  send(): void {
    // mock transport does not send upstream
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

  private emit(event: ArgusEvent): void {
    this.eventHandlers.forEach((h) => h(event));
  }

  private setStatus(status: typeof this.status): void {
    this.status = status;
    this.connectionHandlers.forEach((h) => h(status));
  }

  private clearTimers(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}
