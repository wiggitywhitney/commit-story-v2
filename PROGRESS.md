# Progress Log

Development progress log for commit-story-v2. Tracks implementation milestones across PRD work.

Entry format: `- (YYYY-MM-DD) Description of feature-level change (PRD #X, milestone)`

## [Unreleased]

### Added
- (2026-06-18) Replaced all `console.log`/`console.error`/`console.warn` calls in `src/` with pino structured logging. Created a shared `src/logger.js` that outputs JSON to stdout for the main CLI; the MCP server gets its own pino instance pointed at stderr (stdout is reserved for JSON-RPC). Added `pino` and `@opentelemetry/instrumentation-pino` as dependencies. When the OTel SDK is active, the pino bridge will automatically inject `trace_id` and `span_id` into log records — this is the logs leg of the observability triangle that makes log-trace correlation in Datadog possible without any application-level span.spanContext() calls.
- (2026-06-18) Wired the OTLP log pipeline into the OTel SDK bootstrap (`examples/instrumentation.js`): added a `LoggerProvider` with `SimpleLogRecordProcessor` + `OTLPLogExporter` pointed at `http://localhost:4318/v1/logs`, registered it globally via `logs.setGlobalLoggerProvider`, and added `PinoInstrumentation` to the SDK's `instrumentations` array. When a spiny-orb instrument branch is active, pino log records emitted within active spans will carry `trace_id`/`span_id` fields and flow to Datadog via OTLP — completing the log-trace correlation link without any application code changes.
- (2026-06-18) Created PRD #77 (Observability Triangle Foundation) to establish structured logging infrastructure on main: pino migration, @opentelemetry/instrumentation-pino bridge, OTLP log exporter in bootstrap, and filelog→OTLP logs pipeline update in otelcol-config.yaml. This makes every spiny-orb eval run automatically inherit log-trace correlation for the Datadog observability triangle demo.

### Fixed
- (2026-06-18) Fixed acceptance gate (`tests/acceptance-gate.test.js`) failing in the pre-PR hook with "env: node: No such file or directory". The `vals exec` command was missing the `-i` flag, so it ran in a stripped environment where `/opt/homebrew/bin` (where node lives) was not on PATH. Also stripped gateway env vars from the command so the LangGraph API call goes directly to the API rather than routing through the enterprise gateway (which rejects subprocess calls).
- (2026-05-05) Added `service.instance.id: randomUUID()` to `resourceFromAttributes` in `examples/instrumentation.js` so RES-001 passes in IS scoring runs.

### Added
- (2026-06-16) Added `commit_story.context.messages_filtered` and `commit_story.context.substantial_messages` to the Weaver registry context attribute group. These two attributes support the traces-to-logs correlation demo: `messages_filtered` captures how many messages were dropped as noise during context collection, and `substantial_messages` tracks how many were substantive enough to gate whether the `dialogue` and `technical_decisions` journal sections run. Both are emitted in structured log bodies alongside the LLM generation span to give the log line context color beyond just trace correlation.
- (2026-03-21) Installed OTel SDK, OTLP exporter, and Traceloop auto-instrumentation packages for local telemetry (PRD #51, milestone 1)
- (2026-03-21) Created OTel SDK bootstrap with OTLP exporter, resource attributes, LangChain/MCP auto-instrumentation, and graceful shutdown (PRD #51, milestone 2)
- (2026-03-21) Added Datadog Agent Docker setup/teardown scripts with vals-based secret injection and port/container safety checks (PRD #51, milestone 3)
- (2026-03-21) Added "files" whitelist to package.json — tarball drops from 181 files (1.5 MB) to 38 files (218 KB), instrumentation.js excluded from distribution (PRD #51, milestone 4)
- (2026-03-21) Updated git hook to load OTel SDK via NODE_OPTIONS --import flag, with symlink-aware path resolution for npm-linked dev mode (PRD #51, milestone 5)
- (2026-03-21) End-to-end validation: OTel SDK exports traces successfully to local DD Agent via OTLP HTTP, service name commit-story confirmed in resource attributes (PRD #51, milestone 6)
- (2026-03-21) Moved @opentelemetry/sdk-node from peerDependencies to devDependencies in eval repo, PR #27 (PRD #51, milestone 7)
- (2026-03-21) Added spiny-orb.yaml config and semconv/ telemetry schema for spiny-orb agent compatibility (PRD #51, milestone 8)
