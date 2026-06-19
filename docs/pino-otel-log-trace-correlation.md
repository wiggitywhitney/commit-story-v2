# Pino + OTel Log-Trace Correlation Setup

**Context**: This documents what was discovered during the commit-story-v2 observability triangle verification (June 2026). Intended for the spinybacked-orbweaver team — this is the exact configuration that makes pino log records show up in Datadog Logs Explorer with `trace_id`/`span_id` fields that link to APM traces.

---

## The Goal

When commit-story runs with OTel instrumentation active, pino log lines emitted within active spans should carry `trace_id` and `span_id` fields. In Datadog, this enables:
- Clicking "View related logs" from an APM trace to jump to correlated log lines
- Filtering logs by trace ID to see what was logged during a specific request

## The Stack

- **pino** v10.3.1 — structured JSON logger (`"type": "module"` ESM project)
- **@opentelemetry/instrumentation-pino** v0.65.0 — hooks into pino to inject trace context
- **@opentelemetry/sdk-node** v0.213.0 — OTel SDK
- **import-in-the-middle** v3.0.0 — ESM module loader hook library (IITM)
- **Node.js** v22+ (critical — behavior differs from v20)
- **otelcol-contrib** v0.154.0 — OTel Collector receiving OTLP logs on port 4318, forwarding to Datadog

## The Critical Problem: Silent Failure on Node v22+

`PinoInstrumentation` works by intercepting pino's module load to patch the logger factory. It does this via `require-in-the-middle` (RITM) for CJS and `import-in-the-middle` (IITM) for ESM contexts.

**On Node v22+**, ESM-imported CJS modules like pino do NOT automatically route through RITM hooks. The IITM ESM loader hook must be registered via `module.register()` **before** `sdk.start()` creates any Hook instances. Without this, `PinoInstrumentation` initializes but silently does nothing — log records have no `trace_id` or `span_id`, with no error thrown.

This is an IITM v3.x API change. In earlier versions the hook was auto-wired. In v3.x it must be registered explicitly.

## The Fix

In the `--import` bootstrap file (loaded via `node --import ./examples/instrumentation.js`), add this block **before** `sdk.start()`:

```js
import { register } from 'node:module';
import { createAddHookMessageChannel } from 'import-in-the-middle';

// Register the IITM ESM loader hook before sdk.start() so PinoInstrumentation
// can intercept pino when it loads. On Node.js v22+, ESM-imported CJS modules
// do not route through require-in-the-middle's hooks without this registration.
// Must run before any application code imports pino.
const { registerOptions, waitForAllMessagesAcknowledged } = createAddHookMessageChannel();
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);
await waitForAllMessagesAcknowledged();

// sdk.start() must come AFTER the hook is registered
sdk.start();
```

Also add `import-in-the-middle@^3.0.0` as an explicit devDependency in `package.json`. It is already a transitive dependency via `@opentelemetry/instrumentation-pino`, but declaring it explicitly makes the version constraint visible and prevents silent upgrades from breaking this.

## The Log Pipeline

```
pino (logger.info('message'))
  → PinoInstrumentation patches pino factory
  → LogRecord created with active span's traceId + spanId injected
  → OTel LoggerProvider (SimpleLogRecordProcessor)
  → OTLPLogExporter → http://localhost:4318/v1/logs
  → otelcol-contrib (OTLP receiver)
  → datadog exporter → Datadog Logs Explorer
```

The `LoggerProvider` must be set up and registered globally **before** `sdk.start()`, because the SDK initialization may set up the pino hook at that point. Order in the bootstrap file:

1. Register IITM hook (`createAddHookMessageChannel` + `register` + `await`)
2. Create `LoggerProvider` with `OTLPLogExporter`
3. Call `logs.setGlobalLoggerProvider(loggerProvider)`
4. Call `sdk.start()`

## otelcol-config.yaml: Logs Pipeline

The OTel Collector must have an OTLP receiver on port 4318 and a logs pipeline:

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318

exporters:
  datadog:
    api:
      key: ${env:DD_API_KEY}
      site: datadoghq.com

service:
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [datadog]
```

The `trace_id` and `span_id` fields in log records are recognized natively by Datadog — no custom mapping needed. Datadog accepts both the `dd.trace_id`/`dd.span_id` Datadog-SDK convention AND the OTel-standard `trace_id`/`span_id` with 32-char hex format.

## Verifying It Works

Run the app with instrumentation active:
```bash
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4318/v1/traces node --import ./examples/instrumentation.js ./bin/commit-story.js --dry-run
```

In Datadog Logs Explorer, filter by `service:commit-story`. Log records from within active spans should have:
- `trace_id`: 32-char lowercase hex string
- `span_id`: 16-char lowercase hex string

In APM, open the trace and click "Logs (N)" tab — the correlated log lines appear there.

## Traceloop Gating (spiny-orb Finding)

The instrument branch generated by spiny-orb includes `src/traceloop-init.js`, which conditionally initializes `@traceloop/instrumentation-langchain` and `@traceloop/instrumentation-mcp`:

```js
if (process.env.COMMIT_STORY_TRACELOOP === 'true') {
  const { LangChainInstrumentation } = await import('@traceloop/instrumentation-langchain');
  const { McpInstrumentation } = await import('@traceloop/instrumentation-mcp');
  new LangChainInstrumentation().manuallyInstrument();
  new McpInstrumentation().manuallyInstrument();
}
```

**IS scoring does not set `COMMIT_STORY_TRACELOOP=true`**, so those instrumentations are inactive during scoring runs. LangGraph orchestration and journal operation spans (added directly by spiny-orb to source files) still appear — only the traceloop-specific LangChain and MCP call spans are absent.

**Recommendation for spinybacked-orbweaver**: Evaluate whether IS scoring commands should set `COMMIT_STORY_TRACELOOP=true` to get coverage of traceloop-instrumented code paths. Without it, the traceloop instrumentation layer is untested during scoring.

## Relevant Files

- `examples/instrumentation.js` — OTel SDK bootstrap with IITM fix applied
- `src/logger.js` — shared pino logger (stdout for CLI, stderr for MCP server)
- `~/.claude/rules/pino-gotchas.md` — global rules file with the IITM pattern documented
- `spinybacked-orbweaver-eval/evaluation/is/otelcol-config.yaml` — collector config with logs pipeline
