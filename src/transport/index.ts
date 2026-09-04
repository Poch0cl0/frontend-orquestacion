import type { ArgusTransport } from "./types";
import { isMockMode } from "./types";
import { MockTransport } from "./mock.transport";
import { WebSocketTransport } from "./ws.transport";

let transportInstance: ArgusTransport | null = null;
let mockInstance: MockTransport | null = null;

export function createTransport(): ArgusTransport {
  if (transportInstance) return transportInstance;

  if (isMockMode()) {
    mockInstance = new MockTransport();
    transportInstance = mockInstance;
  } else {
    transportInstance = new WebSocketTransport();
  }

  return transportInstance;
}

export function getMockTransport(): MockTransport | null {
  if (!mockInstance && isMockMode()) {
    createTransport();
  }
  return mockInstance;
}

export function resetTransport(): void {
  transportInstance?.disconnect();
  transportInstance = null;
  mockInstance = null;
}
