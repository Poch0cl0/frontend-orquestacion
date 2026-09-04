import type { TaskStatus } from "@/types";
import { getStatusConfig } from "@/lib/status";
import { cn } from "@/lib/cn";

interface ConsensusIndicatorProps {
  status: TaskStatus;
  size?: "sm" | "md";
  showPulse?: boolean;
}

export function ConsensusIndicator({ status, size = "md", showPulse = true }: ConsensusIndicatorProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  const active = status === "DEBATING" || status === "EXECUTING";

  return (
    <span
      role="status"
      aria-label={`Estado del consenso: ${config.label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-sans font-semibold shadow-xs",
        config.chipClass,
        size === "sm" ? "text-label-micro px-2.5 py-1" : "text-label-md px-3 py-1",
      )}
    >
      {showPulse && (
        <span
          aria-hidden="true"
          className={cn("h-2 w-2 rounded-full", config.dotClass, active && "animate-pulse")}
        />
      )}
      <Icon
        className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5", status === "EXECUTING" && "animate-spin")}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
