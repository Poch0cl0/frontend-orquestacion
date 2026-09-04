import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-shell p-6", className)}>{children}</div>;
}

export function Breadcrumb({ path, id }: { path: string; id?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow tracking-[0.12em]">{path}</span>
      {id && (
        <>
          <span className="text-line" aria-hidden="true">
            •
          </span>
          <span className="text-label-micro text-teal font-mono font-medium tracking-wide">{id}</span>
        </>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  action,
}: {
  title: string;
  description?: string;
  breadcrumb?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 pb-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1.5">
        {breadcrumb}
        <div>
          <h1 className="text-headline-lg text-ink font-sans">{title}</h1>
          {description && <p className="text-body-md text-ink-subtle mt-1">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0 self-start md:self-auto">{action}</div>}
    </header>
  );
}
