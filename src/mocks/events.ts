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

  const isExifTask =
    !objective ||
    /exif|imagen|catalogo|catálogo|redimension|resize/i.test(objective);

  const displayObjective = isExifTask
    ? "Redimensionar imágenes del catálogo preservando metadatos EXIF"
    : objective;

  return [
    {
      delay: 400,
      event: {
        type: "task_started",
        payload: {
          taskId,
          objective: displayObjective,
          maxIterations,
          tokenLimit,
          timestamp: ts(400),
        },
      },
    },
    {
      delay: 1400,
      event: {
        type: "node_start",
        payload: {
          taskId,
          node: "executor",
          message: "Agente Ejecutor analizando repositorio y especificación del catálogo...",
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
              max_dimension: "2048px",
              preserve_exif: "false (strip_metadata para optimizar peso)",
              quality_level: "85%",
              has_backup: "false",
            },
            reason:
              "Propuesta inicial de resize masivo eliminando metadatos para minimizar tamaño de transferencia y acelerar carga web.",
            tools: ["ImageMagick CLI", "Catalog-Storage-API"],
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
          message: "Evaluación de cumplimiento frente al marco COBIT 2019 (DSS05 - Seguridad / BAI06 - Gestión de Cambios)...",
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
              "Incumplimiento crítico de directiva COBIT 2019 (DSS05 - Protección de Activos / BAI06 - Control de Cambios): El plan intenta sobreescribir las imágenes del catálogo corporativo con 'preserve_exif = false' y sin respaldo previo. Esto eliminaría irreversiblemente las etiquetas EXIF de autoría legal, derechos de copyright y georreferencia requeridas por la política de gobernanza digital.",
            feedback:
              "Acciones correctivas requeridas antes de autorizar ejecución: 1) Crear snapshot de respaldo en 'catalog/backups/'. 2) Habilitar explícitamente 'preserve_exif = true' en el pipeline. 3) Configurar punto de restauración (rollback) verificado.",
            iteration: 1,
            timestamp: ts(5800),
            framework: "COBIT 2019 / DSS05 & BAI06",
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
          message: "Agente Ejecutor aplicando remediación COBIT: generando snapshot y reconfigurando preservación EXIF...",
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
            action: "resize_images_governed",
            parameters: {
              target_format: '"webp"',
              max_dimension: "2048px",
              preserve_exif: "true (retención estricta: Copyright, Author, CameraProfile)",
              quality_level: "85%",
              backup_snapshot: "catalog/backups/snapshot_pre_resize.tar.gz",
              rollback_enabled: "true",
            },
            reason:
              "Se reformuló el plan incorporando snapshot de respaldo previo, rollback asegurado y retención estricta de metadatos EXIF de autoría según directiva COBIT DSS05.",
            tools: ["ImageMagick CLI", "ExifTool Validator", "Catalog-Storage-API"],
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
          message: "Revalidación de integridad, respaldo y tags EXIF bajo COBIT 2019...",
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
            reason:
              "Conformidad validada satisfactoriamente (COBIT 2019 / BAI06 & DSS05). Se verificó la creación del snapshot de respaldo en catalog/backups/, mecanismo de rollback habilitado y retención íntegra de metadatos EXIF de autoría legal.",
            feedback:
              "Consenso alcanzado. Plan autorizado para procesar las 120 imágenes del catálogo corporativo.",
            iteration: 2,
            timestamp: ts(11600),
            framework: "COBIT 2019 / BAI06",
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
          message: "Ejecutando pipeline de procesamiento seguro en repositorio de destino...",
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
          result:
            "120 imágenes del catálogo redimensionadas a 2048px (WebP). Metadatos EXIF preservados al 100%, respaldo creado en catalog/backups/ y hash SHA-256 verificado.",
          status: "COMPLETED",
        },
      },
    },
  ];
}
