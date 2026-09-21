"use client";

import { useCallback, useEffect, useState } from "react";
import { Cable, FolderGit2, Radio, ServerCog } from "lucide-react";
import { Breadcrumb, PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { FieldLabel } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  listRepos,
  registerRepo,
  validateRepo,
  type RepoEntry,
  type ValidateRepoResult,
} from "@/services/tasks.service";

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
  const { toast } = useToast();
  const [repos, setRepos] = useState<RepoEntry[]>([]);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [validation, setValidation] = useState<ValidateRepoResult | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setRepos(await listRepos());
    } catch {
      setRepos([]);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleValidate() {
    if (!path.trim()) return;
    setBusy(true);
    try {
      const result = await validateRepo(path.trim());
      setValidation(result);
      toast(result.ok ? "Repo válido" : "Repo inválido", result.ok ? "success" : "error", result.message);
    } catch {
      toast("No se pudo validar", "error", "Revisa la conexión con el orquestador");
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister() {
    if (!path.trim()) return;
    setBusy(true);
    try {
      const entry = await registerRepo(name.trim() || path.trim(), path.trim());
      toast("Repo enlazado", "success", entry.path);
      setName("");
      setPath("");
      setValidation(null);
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo registrar el repo";
      toast("Error al enlazar", "error", message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageContainer>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <PageHeader
          title="Configuración"
          description="Parámetros de conexión y repositorios locales de destino."
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

        <section className="surface-card flex flex-col gap-4 p-5">
          <div className="flex items-center gap-2">
            <FolderGit2 className="text-brand h-4 w-4" aria-hidden="true" />
            <h2 className="text-headline-sm text-ink font-sans">Repositorios destino</h2>
          </div>
          <p className="text-body-sm text-ink-muted">
            Enlaza una carpeta Git local. Tras aprobar una tarea, ARGUS escribirá archivos y hará commit ahí.
          </p>

          <ul className="flex flex-col gap-2">
            {repos.map((repo) => (
              <li
                key={repo.id}
                className="flex flex-col gap-0.5 rounded-lg border border-line/30 bg-surface-low px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-body-md text-ink font-semibold">{repo.name}</span>
                  {repo.isDefault && <Badge variant="info">default</Badge>}
                </div>
                <code className="text-code text-ink-muted font-mono break-all">{repo.path}</code>
              </li>
            ))}
            {repos.length === 0 && (
              <li className="text-body-sm text-ink-subtle">No hay repos registrados todavía.</li>
            )}
          </ul>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              id="repoName"
              label="Nombre (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mi proyecto"
            />
            <Input
              id="repoPath"
              label="Ruta local del repo"
              value={path}
              onChange={(e) => {
                setPath(e.target.value);
                setValidation(null);
              }}
              placeholder="C:\ruta\a\tu\repo"
            />
          </div>

          {validation && (
            <p className={`text-body-sm ${validation.ok ? "text-emerald-700" : "text-rose-700"}`}>
              {validation.message}
              {validation.ok ? ` · ${validation.path}` : ""}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" loading={busy} onClick={handleValidate}>
              Validar
            </Button>
            <Button type="button" loading={busy} onClick={handleRegister}>
              Enlazar repo
            </Button>
          </div>
        </section>

        <aside className="surface-card flex flex-col gap-2 p-5">
          <FieldLabel>Modo live</FieldLabel>
          <p className="text-body-md text-ink-muted leading-relaxed">
            Con <code className="text-code text-brand font-mono">NEXT_PUBLIC_ARGUS_MODE=live</code> la UI
            habla con el orquestador. Pega tu{" "}
            <code className="text-code text-brand font-mono">GEMINI_API_KEY</code> en el{" "}
            <code className="text-code text-brand font-mono">.env</code> del backend para enriquecer el
            debate con Gemini.
          </p>
        </aside>
      </div>
    </PageContainer>
  );
}
