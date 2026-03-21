// ABOUTME: OTel SDK bootstrap — loaded via Node.js --import flag before application code
// ABOUTME: Configures tracing with OTLP HTTP exporter for local Datadog Agent on port 4318

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LangChainInstrumentation } from '@traceloop/instrumentation-langchain';
import { McpInstrumentation } from '@traceloop/instrumentation-mcp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Read version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

// Disable auto-metrics — SDK 2.x auto-instantiates a Metrics SDK
if (!process.env.OTEL_METRICS_EXPORTER) {
  process.env.OTEL_METRICS_EXPORTER = 'none';
}

const resource = resourceFromAttributes({
  'service.name': 'commit-story',
  'service.version': pkg.version,
  'deployment.environment': process.env.NODE_ENV || 'development',
});

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
});

const sdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [
    new LangChainInstrumentation(),
    new McpInstrumentation(),
  ],
});

sdk.start();

// Graceful shutdown — flush pending spans before exit
let isShuttingDown = false;

const shutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  process.exitCode = 0;
  try {
    await sdk.shutdown();
  } catch (err) {
    console.error('OTel SDK shutdown error:', err);
    process.exitCode = 1;
  }

  // Force exit if shutdown hangs (e.g., exporter can't reach collector)
  setTimeout(() => process.exit(1), 30_000).unref();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
