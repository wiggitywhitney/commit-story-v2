# OTel JS SDK 2.x Gotchas

Adopted in PRD #51. These are non-obvious changes from 1.x patterns that training data may get wrong.

## Resource API Changed

- `new Resource({...})` is gone. Use `resourceFromAttributes({...})` from `@opentelemetry/resources`.
- `Resource.default()` → `defaultResource()`, `Resource.empty()` → `emptyResource()`.
- Resource detectors unified: `envDetectorSync` → `envDetector`, `hostDetectorSync` → `hostDetector`.

## Version Numbering

- Stable packages: `>=2.0.0` (e.g., `@opentelemetry/resources` v2.6.0).
- Unstable packages: `>=0.200.0` (e.g., `@opentelemetry/sdk-node` v0.213.0).
- `@opentelemetry/api` and `@opentelemetry/semantic-conventions` follow their own versioning, NOT the SDK 2.0 scheme.

## NodeSDK Auto-Metrics

- `NodeSDK` automatically instantiates a Metrics SDK in 2.x. Set `OTEL_METRICS_EXPORTER=none` to disable if only tracing.

## TracerProvider Changes

- `BasicTracerProvider#addSpanProcessor()` removed — use constructor options.
- `BasicTracerProvider#register()` removed.
- Env var handling (`OTEL_TRACES_EXPORTER`, `OTEL_PROPAGATORS`) moved exclusively to `NodeSDK`.

## Peer Dependency Constraint

- `@opentelemetry/sdk-node` requires `@opentelemetry/api` `>=1.3.0 <1.10.0`. Current latest API is 1.9.0.
