import type { ArgusEvent } from "@/types";

interface ScriptStep {
  delay: number;
  event: ArgusEvent;
}

const EXECUTOR_MODEL = "Claude-3.5-Sonnet";
const AUDIT_FRAMEWORK = "COBIT 2019 / DSS05";

/**
 * Guion de demostración: reproduce el ciclo completo Ejecutor <-> Auditor con
 * los mismos eventos tipados que emitirá el orquestador real.
 */
export function buildDemoScript(
  taskId: string,
  objective: string,
  maxIterations: number,
  tokenLimit: number,
): ScriptStep[] {
  const now = Date.now();
  const ts = (offset: number) => new Date(now + offset).toISOString();

  return [
    {
      delay: 400,
      event: {
        type: "task_started",
        payload: { taskId, objective, maxIterations, tokenLimit, timestamp: ts(400) },
      },
    },
    {
      delay: 1400,
      event: {
        type: "node_start",
        payload: {
          taskId,
          node: "executor",
          message: "Agente Executor-Alpha cargó políticas de compresión",
          timestamp: ts(1400),
        },
      },
    },
    {
      delay: 2800,
      event: {
        type: "executor_proposal",
        payload: {
          taskId,
          timestamp: ts(2800),
          proposal: {
            action: "resize_images",
            parameters: {
              target_format: '"webp"',
              max_dimension: "2048",
              preserve_exif: "false",
              quality_level: "85",
            },
            reason: "Propuesta inicial de resize masivo y remoción de metadatos para reducir peso.",
            tools: ["ImageMagick CLI", "AWS-S3-Uploader"],
            iteration: 1,
            timestamp: ts(2800),
            model: EXECUTOR_MODEL,
          },
        },
      },
    },
    {
      delay: 4200,
      event: {
        type: "node_start",
        payload: {
          taskId,
          node: "auditor",
          message: "Evaluación de compliance frente al marco COBIT / ITIL",
          timestamp: ts(4200),
        },
      },
    },
    {
      delay: 5800,
      event: {
        type: "audit_rejected",
        payload: {
          taskId,
          timestamp: ts(5800),
          verdict: {
            decision: "REJECTED",
            risk: "HIGH",
            reason:
              "Intento de eliminación no autorizada de metadatos de procedencia sin consentimiento registrado.",
            feedback:
              "Activar bandera preserve_exif = true y verificar hash SHA-256 antes del almacenamiento definitivo.",
            iteration: 1,
            timestamp: ts(5800),
            framework: AUDIT_FRAMEWORK,
          },
        },
      },
    },
    {
      delay: 7400,
      event: {
        type: "node_start",
        payload: {
          taskId,
          node: "executor",
          message: "Ajuste de parámetros para preservar metadatos de copyright",
          timestamp: ts(7400),
        },
      },
    },
    {
      delay: 8800,
      event: {
        type: "executor_revision",
        payload: {
          taskId,
          timestamp: ts(8800),
          proposal: {
            action: "resize_images",
            parameters: {
              target_format: '"webp"',
              max_dimension: "2048",
              preserve_exif: "true",
              quality_level: "85",
            },
            reason:
              "Se ajustó la configuración para preservar etiquetas EXIF de autoría cumpliendo la directiva de auditoría.",
            tools: ["ImageMagick CLI", "AWS-S3-Uploader"],
            iteration: 2,
            timestamp: ts(8800),
            model: EXECUTOR_MODEL,
          },
        },
      },
    },
    {
      delay: 10200,
      event: {
        type: "node_start",
        payload: {
          taskId,
          node: "auditor",
          message: "Revalidación de integridad y conformidad",
          timestamp: ts(10200),
        },
      },
    },
    {
      delay: 11600,
      event: {
        type: "audit_approved",
        payload: {
          taskId,
          timestamp: ts(11600),
          verdict: {
            decision: "APPROVED",
            risk: "LOW",
            reason: "Validación satisfactoria de integridad y conformidad.",
            feedback: "Consenso alcanzado. Operación dentro del alcance autorizado.",
            iteration: 2,
            timestamp: ts(11600),
            framework: AUDIT_FRAMEWORK,
          },
        },
      },
    },
    {
      delay: 13000,
      event: {
        type: "node_start",
        payload: {
          taskId,
          node: "execution",
          message: "Despliegue de la trayectoria aprobada sobre el gateway zero-trust",
          timestamp: ts(13000),
        },
      },
    },
    {
      delay: 16200,
      event: {
        type: "execution_result",
        payload: {
          taskId,
          timestamp: ts(16200),
          success: true,
          result: "120 archivos procesados y verificados en bucket S3 · SHA-256 verificado",
          status: "COMPLETED",
        },
      },
    },
  ];
}
