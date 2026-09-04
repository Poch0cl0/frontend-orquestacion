"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Cpu, RotateCw, ShieldCheck, Zap } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/components/ui/Toast";

const OBJECTIVE_MAX = 500;
const OBJECTIVE_MIN = 10;
const ITERATIONS_RANGE = { min: 1, max: 20 };
const TOKENS_RANGE = { min: 1000, max: 32000 };

interface FormErrors {
  objective?: string;
  maxIterations?: string;
  tokenLimit?: string;
}

export function NewTaskForm() {
  const router = useRouter();
  const { submitTask, loading } = useTasks();
  const { toast } = useToast();

  const [objective, setObjective] = useState("");
  const [maxIterations, setMaxIterations] = useState("5");
  const [tokenLimit, setTokenLimit] = useState("4000");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (!objective.trim()) {
      next.objective = "El objetivo es obligatorio";
    } else if (objective.trim().length < OBJECTIVE_MIN) {
      next.objective = `El objetivo debe tener al menos ${OBJECTIVE_MIN} caracteres`;
    }

    const iterations = Number(maxIterations);
    if (!Number.isInteger(iterations) || iterations < ITERATIONS_RANGE.min || iterations > ITERATIONS_RANGE.max) {
      next.maxIterations = `Debe ser un entero entre ${ITERATIONS_RANGE.min} y ${ITERATIONS_RANGE.max}`;
    }

    const tokens = Number(tokenLimit);
    if (!Number.isFinite(tokens) || tokens < TOKENS_RANGE.min || tokens > TOKENS_RANGE.max) {
      next.tokenLimit = `Debe estar entre ${TOKENS_RANGE.min.toLocaleString("es-ES")} y ${TOKENS_RANGE.max.toLocaleString("es-ES")}`;
    }

    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);

    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    try {
      const task = await submitTask({
        objective: objective.trim(),
        maxIterations: Number(maxIterations),
        tokenLimit: Number(tokenLimit),
      });
      toast("Tarea creada exitosamente", "success", `ID #${task.id} · En cola de análisis`);
      router.push("/");
    } catch {
      toast("No se pudo crear la tarea", "error", "Revisa la conexión con el orquestador");
    }
  }

  function handleReset() {
    setObjective("");
    setMaxIterations("5");
    setTokenLimit("4000");
    setErrors({});
    setTouched(false);
  }

  const objectiveError = touched ? errors.objective : undefined;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="surface-card flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="objective" className="text-headline-sm text-ink font-sans">
                Objetivo
              </label>
              <span className="text-label-micro text-ink-muted rounded bg-surface-high px-1.5 py-0.5 font-sans font-semibold">
                Requerido
              </span>
            </div>
            <span className="eyebrow font-semibold">Especificación NL</span>
          </div>

          <Textarea
            id="objective"
            name="objective"
            rows={5}
            maxLength={OBJECTIVE_MAX}
            placeholder="Describe la directiva operativa o cambio de infraestructura..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            onBlur={() => setTouched(true)}
            error={objectiveError}
            aria-describedby="objective-counter"
          />

          <div className="flex items-center justify-between gap-3 pt-0.5">
            {objectiveError ? (
              <span className="text-label-md flex items-center gap-1.5 font-medium text-rose-600" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {objectiveError}
              </span>
            ) : (
              <span />
            )}
            <span id="objective-counter" className="text-code text-ink-subtle font-mono tabular-nums">
              {objective.length} / {OBJECTIVE_MAX} caracteres
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <Input
            id="maxIterations"
            name="maxIterations"
            type="number"
            label="Máximo de iteraciones"
            hint="Límite de presupuesto de debate multi-agente"
            min={ITERATIONS_RANGE.min}
            max={ITERATIONS_RANGE.max}
            value={maxIterations}
            onChange={(e) => setMaxIterations(e.target.value)}
            error={touched ? errors.maxIterations : undefined}
            adornment={<RotateCw className="h-4 w-4" />}
          />
          <Input
            id="tokenLimit"
            name="tokenLimit"
            type="number"
            label="Límite de tokens"
            hint="Presupuesto máximo de contexto LLM por ciclo"
            min={TOKENS_RANGE.min}
            max={TOKENS_RANGE.max}
            step={500}
            value={tokenLimit}
            onChange={(e) => setTokenLimit(e.target.value)}
            error={touched ? errors.tokenLimit : undefined}
            adornment={<Cpu className="h-4 w-4" />}
          />
        </div>

        <aside className="flex items-start gap-3 rounded-lg bg-surface-low p-4">
          <span className="bg-brand/10 text-brand flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-label-micro text-brand font-sans font-semibold tracking-[0.08em] uppercase">
              Protocolo de consenso activo
            </span>
            <p className="text-body-md text-ink leading-relaxed">
              ARGUS evaluará esta tarea mediante consenso{" "}
              <strong className="text-brand font-semibold">Ejecutor ↔ Auditor COBIT</strong> antes de
              ejecutar cualquier acción.
            </p>
          </div>
        </aside>

        <div className="flex items-center justify-between gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleReset} disabled={loading}>
            Descartar
          </Button>
          <Button type="submit" loading={loading} className="px-6">
            {!loading && <Zap className="h-4 w-4" aria-hidden="true" />}
            Ejecutar con ARGUS
          </Button>
        </div>
      </div>

      <footer className="text-ink-subtle flex flex-col gap-2 px-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="eyebrow flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Framework de seguridad: COBIT 2019 / NIST CSF
        </span>
        <span className="text-label-micro font-mono tracking-[0.08em] uppercase">
          Gateway: zero-trust proxy
        </span>
      </footer>
    </form>
  );
}
