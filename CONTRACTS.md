# ARGUS Frontend — Extensiones de contrato

Este documento describe las extensiones propuestas por el frontend sobre los contratos base del orquestador.

## Eventos WebSocket

### Base (contrato original)

| Tipo | Descripción |
|------|-------------|
| `node_start` | Un nodo del grafo inicia su ejecución |
| `audit_rejected` | El auditor COBIT rechaza la propuesta |
| `audit_approved` | El auditor COBIT aprueba la propuesta |
| `execution_result` | Resultado final de la ejecución |

### Extensiones propuestas (frontend)

| Tipo | Descripción |
|------|-------------|
| `task_started` | Tarea recibida por el orquestador |
| `executor_proposal` | Primera propuesta del ejecutor |
| `executor_revision` | Propuesta revisada tras rechazo |
| `human_escalation` | Escalamiento a intervención humana |
| `error` | Error inesperado en el flujo |

## Estructura de evento

```json
{
  "type": "audit_rejected",
  "payload": {
    "taskId": "string",
    "timestamp": "ISO-8601"
  }
}
```

## Campos opcionales sobre las entidades base

La interfaz los muestra si el backend los envía y los omite silenciosamente si no.

| Entidad | Campo | Tipo | Uso en la UI |
|---------|-------|------|--------------|
| `ExecutorProposal` | `model` | `string` | Chip del modelo en la tarjeta del Ejecutor (p. ej. `Claude-3.5-Sonnet`) |
| `AuditorVerdict` | `framework` | `string` | Chip del control aplicado en la tarjeta del Auditor (p. ej. `COBIT 2019 / DSS05`) |
