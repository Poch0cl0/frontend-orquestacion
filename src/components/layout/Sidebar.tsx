"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  History,
  LayoutGrid,
  ListChecks,
  Settings,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ArgusLogo } from "./ArgusLogo";
import { ConnectionBadge } from "./ConnectionBadge";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/new-task", label: "Nueva tarea", icon: ListChecks },
  { href: "/audit", label: "Historial", icon: History, group: "Auditoría" },
  { href: "/metrics", label: "Métricas", icon: TrendingUp },
  { href: "/settings", label: "Configuración", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[2px] lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-line/30 bg-surface transition-all duration-200",
          collapsed ? "w-sidebar-rail" : "w-sidebar",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col">
          <div
            className={cn(
              "flex h-topbar items-center gap-3 border-b border-line/20 px-5",
              collapsed && "justify-center px-0",
            )}
          >
            <ArgusLogo className="h-8 w-8 shrink-0" />
            {!collapsed && (
              <div className="flex min-w-0 flex-col">
                <span className="text-headline-sm text-ink font-sans leading-tight">ARGUS</span>
                <span className="text-label-micro text-teal font-sans leading-tight tracking-[0.14em] uppercase">
                  AI Governance
                </span>
              </div>
            )}
            {mobileOpen && (
              <button
                onClick={onMobileClose}
                className="text-ink-subtle hover:bg-surface-low ml-auto rounded-md p-1.5 lg:hidden"
                aria-label="Cerrar menú"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Navegación principal">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <div key={item.href}>
                  {item.group && !collapsed && (
                    <div className="px-3 pt-4 pb-1.5">
                      <span className="eyebrow tracking-[0.1em]">{item.group}</span>
                    </div>
                  )}
                  {item.group && collapsed && <div className="my-2 border-t border-line/20" />}
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      "focus-visible:ring-brand focus-visible:ring-2",
                      active
                        ? "bg-surface-low text-brand font-medium shadow-sm"
                        : "text-ink-muted hover:bg-surface-low hover:text-ink",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" strokeWidth={1.75} />
                    {!collapsed && <span className="text-label-md font-sans">{item.label}</span>}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className={cn("border-t border-line/20 p-4", collapsed && "flex justify-center px-2")}>
          <ConnectionBadge collapsed={collapsed} />
        </div>

        <button
          onClick={onToggle}
          className="text-ink-subtle hover:text-ink absolute top-1/2 -right-3 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-line/50 bg-surface shadow-sm transition-colors lg:flex"
          aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
        >
          <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>
    </>
  );
}
