import { Cable, Radio, ServerCog } from "lucide-react";
import { Breadcrumb, PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { FieldLabel } from "@/components/ui/Card";

export const metadata = {
  title: "Configuración — ARGUS",
};

const MODE = process.env.NEXT_PUBLIC_ARGUS_MODE ?? "mock";
const IS_LIVE = MODE === "live";

const ROWS = [
  {
    icon: ServerCog,
    label: "Modo de operación",
    description: "Determina si la interfaz consume datos simulados o el backend real",
    value: MODE,
    badge: true,
  },
  {
    icon: Cable,
    label: "API URL",
    description: "Endpoint HTTP del orquestador",
    value: process.env.NEXT_PUBLIC_API_URL || "—",
  },
  {
    icon: Radio,
    label: "WebSocket URL",
    description: "Canal de eventos en tiempo real",
    value: process.env.NEXT_PUBLIC_WS_URL || "—",
  },
];

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <PageHeader
          title="Configuración"
          description="Parámetros de conexión con el orquestador y los agentes."
          breadcrumb={<Breadcrumb path="Gobernanza / Entorno" id={IS_LIVE ? "LIVE" : "DEMO"} />}
        />

        <div className="surface-card divide-y divide-line/20">
          {ROWS.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-start gap-3">
                  <span className="bg-surface-low text-ink-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-body-md text-ink font-sans font-semibold">{row.label}</p>
                    <p className="text-body-sm text-ink-subtle mt-0.5">{row.description}</p>
                  </div>
                </div>
                {row.badge ? (
                  <Badge variant={IS_LIVE ? "success" : "info"}>{row.value}</Badge>
                ) : (
                  <code className="text-code text-ink-muted max-w-[45%] truncate rounded bg-surface-low px-2 py-1 font-mono">
                    {row.value}
                  </code>
                )}
              </div>
            );
          })}
        </div>

        <aside className="surface-card flex flex-col gap-2 p-5">
          <FieldLabel>Cómo conectar el backend real</FieldLabel>
          <p className="text-body-md text-ink-muted leading-relaxed">
            Cambia <code className="text-code text-brand font-mono">NEXT_PUBLIC_ARGUS_MODE</code> a{" "}
            <code className="text-code text-brand font-mono">live</code> y apunta las URLs al
            orquestador. Ningún componente visual necesita modificarse: la capa de transporte
            selecciona automáticamente el WebSocket real en lugar del simulador.
          </p>
        </aside>
      </div>
    </PageContainer>
  );
}
