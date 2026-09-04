"use client";

import Link from "next/link";
import { Menu, Plus, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConnectionBadge } from "./ConnectionBadge";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "v1.0.0";
const APP_ENV = process.env.NEXT_PUBLIC_ARGUS_MODE === "live" ? "prod" : "demo";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-topbar items-center justify-between border-b border-line/20 bg-surface/90 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-ink-muted hover:bg-surface-low rounded-lg p-2 lg:hidden"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="lg:hidden">
          <ConnectionBadge />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/new-task">
          <Button size="md">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Nueva tarea</span>
          </Button>
        </Link>
        <div className="hidden h-5 w-px bg-line/30 sm:block" />
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-mid text-brand ring-1 ring-line/40"
            role="img"
            aria-label="Perfil de usuario"
          >
            <UserRound className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="hidden flex-col text-left md:flex">
            <span className="text-label-md text-ink font-sans font-semibold leading-tight">
              Security Ops
            </span>
            <span className="text-label-micro text-ink-subtle font-sans leading-tight">
              Lead Auditor
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
