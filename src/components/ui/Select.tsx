import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, options, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="eyebrow text-ink-muted font-semibold">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "text-body-md text-ink h-9 w-full appearance-none rounded-lg border border-transparent bg-surface-low pl-3 pr-9 transition-colors",
              "focus-visible:border-brand focus-visible:bg-surface focus-visible:ring-brand/20 focus-visible:ring-2",
              className,
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="text-ink-subtle pointer-events-none absolute right-3 h-4 w-4"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  },
);
Select.displayName = "Select";
