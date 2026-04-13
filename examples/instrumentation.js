// ABOUTME: OTel SDK bootstrap — loaded via Node.js --import flag before application code
// ABOUTME: Configures tracing with OTLP HTTP exporter for local Datadog Agent on port 4318

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Read version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

// Disable auto-metrics — SDK 2.x auto-instantiates a Metrics SDK.
// For IS scoring runs: set IS_SCORING_RUN=1 to enable the metrics exporter so
// MET rules can be evaluated. MET rules will fail because spiny-orb produces no
// OTel metrics by design — this is honest signal, not an instrumentation failure.
if (!process.env.OTEL_METRICS_EXPORTER && !process.env.IS_SCORING_RUN) {
  process.env.OTEL_METRICS_EXPORTER = 'none';
}

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    'service.name': 'commit-story',
    'service.version': pkg.version,
    'deployment.environment': process.env.NODE_ENV || 'development',
  }),
  // SimpleSpanProcessor exports each span immediately on span.end() — better
  // for CLI apps where process.exit() can kill the event loop before a
  // BatchSpanProcessor flushes. Performance overhead is negligible for the
  // handful of spans a CLI invocation produces.
  spanProcessors: [new SimpleSpanProcessor(traceExporter)],
  // NOTE: @traceloop auto-instrumentation (LangChain, MCP) must be initialized
  // inside index.js, not here. The --import ESM loader conflicts with traceloop's
  // import-in-the-middle hooks. See commit-story-v2#53.
});

sdk.start();

// Graceful shutdown — flush pending spans before exit
let isShuttingDown = false;
const originalExit = process.exit;

// Flush spans and exit with the given exit code.
const shutdownAndExit = (exitCode) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  process.exitCode = exitCode;
  sdk.shutdown()
    .catch((err) => console.error('OTel SDK shutdown error:', err))
    .finally(() => originalExit.call(process, process.exitCode));
};

// Custom signal handlers disable Node's default signal behavior, so the
// process must exit explicitly or it will hang.
process.on('SIGTERM', () => {
  if (isShuttingDown) return originalExit.call(process, 143);
  shutdownAndExit(143);
});
process.on('SIGINT', () => {
  if (isShuttingDown) return originalExit.call(process, 130);
  shutdownAndExit(130);
});

// Intercept process.exit() so the OTLP exporter can flush pending spans.
// CLI apps call process.exit() directly, which kills the event loop before
// the span processor can export. This wrapper flushes first, then exits.
process.exit = (code) => {
  const exitCode = code !== undefined ? code : (process.exitCode ?? 0);
  if (isShuttingDown) return originalExit.call(process, exitCode);
  shutdownAndExit(exitCode);
};
