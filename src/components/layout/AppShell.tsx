"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/cn";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-canvas min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={cn("transition-all duration-200", collapsed ? "lg:pl-sidebar-rail" : "lg:pl-sidebar")}>
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="min-h-[calc(100vh-var(--spacing-topbar))]">{children}</main>
      </div>
    </div>
  );
}
