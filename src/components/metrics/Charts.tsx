"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MetricPoint } from "@/types";

const AXIS_STYLE = { fontSize: 11, fontFamily: "var(--font-inter)" } as const;
const AXIS_COLOR = "#747686";
const GRID_COLOR = "#c4c5d7";

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid #c4c5d7",
  boxShadow: "0 10px 15px -3px rgba(15,23,42,0.06)",
  fontSize: 12,
  fontFamily: "var(--font-inter)",
  color: "#0b1c30",
};

interface TrendChartProps {
  title: string;
  data: MetricPoint[];
  color: string;
  unit?: string;
  domain?: [number, number];
  seriesName: string;
  ariaLabel: string;
}

function TrendChart({ title, data, color, unit, domain, seriesName, ariaLabel }: TrendChartProps) {
  const gradientId = `gradient-${seriesName.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section className="surface-card flex flex-col p-5">
      <h3 className="eyebrow font-semibold">{title}</h3>
      <div className="mt-4 h-60" role="img" aria-label={ariaLabel}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} strokeOpacity={0.4} vertical={false} />
            <XAxis dataKey="label" tick={AXIS_STYLE} stroke={AXIS_COLOR} tickLine={false} axisLine={false} />
            <YAxis
              domain={domain ?? ["auto", "auto"]}
              tick={AXIS_STYLE}
              stroke={AXIS_COLOR}
              tickLine={false}
              axisLine={false}
              unit={unit}
              width={52}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => [`${Number(value)}${unit ?? ""}`, seriesName]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={{ r: 2.5, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function TsrChart({ data }: { data: MetricPoint[] }) {
  return (
    <TrendChart
      title="Task Success Rate"
      data={data}
      color="#2a4edb"
      unit="%"
      domain={[80, 100]}
      seriesName="TSR"
      ariaLabel="Evolución del Task Success Rate"
    />
  );
}

export function UarChart({ data }: { data: MetricPoint[] }) {
  return (
    <TrendChart
      title="Unauthorized Action Rate"
      data={data}
      color="#e11d48"
      unit="%"
      domain={[0, 10]}
      seriesName="UAR"
      ariaLabel="Evolución del Unauthorized Action Rate"
    />
  );
}

export function IterationsChart({ data }: { data: MetricPoint[] }) {
  return (
    <TrendChart
      title="Internal Conflict Resolution"
      data={data}
      color="#006a69"
      seriesName="Iteraciones"
      ariaLabel="Iteraciones promedio hasta alcanzar consenso"
    />
  );
}
