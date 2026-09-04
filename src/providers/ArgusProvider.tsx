"use client";

import { createContext, useCallback, useContext, useEffect, useReducer, type ReactNode } from "react";
import type { ArgusStreamState } from "@/types";
import { createTransport } from "@/transport";
import { initialStreamState, streamReducer } from "./argus-reducer";

interface ArgusContextValue {
  state: ArgusStreamState;
  connect: (taskId?: string) => void;
  disconnect: () => void;
  reset: () => void;
}

const ArgusContext = createContext<ArgusContextValue | null>(null);

export function ArgusProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(streamReducer, initialStreamState);

  useEffect(() => {
    const transport = createTransport();

    const unsubEvent = transport.onEvent((event) => {
      dispatch({ type: "PROCESS_EVENT", event });
    });

    const unsubConnection = transport.onConnectionChange((status) => {
      dispatch({ type: "SET_CONNECTION", status });
    });

    transport.connect();

    return () => {
      unsubEvent();
      unsubConnection();
      transport.disconnect();
    };
  }, []);

  useEffect(() => {
    if (state.timeline.some((t) => t.isNew)) {
      const timer = setTimeout(() => dispatch({ type: "CLEAR_NEW_FLAGS" }), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.timeline]);

  const connect = useCallback((taskId?: string) => {
    createTransport().connect(taskId);
  }, []);

  const disconnect = useCallback(() => {
    createTransport().disconnect();
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <ArgusContext.Provider value={{ state, connect, disconnect, reset }}>
      {children}
    </ArgusContext.Provider>
  );
}

export function useArgus() {
  const ctx = useContext(ArgusContext);
  if (!ctx) throw new Error("useArgus must be used within ArgusProvider");
  return ctx;
}
