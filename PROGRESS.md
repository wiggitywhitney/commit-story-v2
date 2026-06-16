# Progress Log

Development progress log for commit-story-v2. Tracks implementation milestones across PRD work.

Entry format: `- (YYYY-MM-DD) Description of feature-level change (PRD #X, milestone)`

## [Unreleased]

### Fixed
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
