import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line/50 bg-surface/60 px-6 py-16 text-center">
      <div className="bg-surface-low text-ink-subtle mb-4 flex h-11 w-11 items-center justify-center rounded-full">
        {icon || <Inbox className="h-5 w-5" aria-hidden="true" />}
      </div>
      <h3 className="text-headline-sm text-ink font-sans">{title}</h3>
      <p className="text-body-md text-ink-subtle mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
