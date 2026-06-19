# Instrumentation Report: src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.1K
- **Output tokens**: 2.3K
- **Cached tokens**: 25.2K

## Schema Extensions
- `span.commit_story.mcp.server_start`
- `commit_story.mcp.transport`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- commit_story.mcp.transport is a new attribute capturing the IPC transport type used by the MCP server ('stdio'). No registered attribute in the schema describes MCP transport type — the closest registered keys are context.source and context.sessions_count, which describe collected context rather than server configuration.
- createServer is a synchronous, unexported factory function with no I/O — skipped (RST-001: no spans on synchronous utilities; RST-004: unexported helpers covered by the exported orchestrator's span).
- The .catch() handler at the bottom of the file calls process.exit(1) — this is outside main()'s function body, so RST-006 does not apply to main() itself. The process.exit(1) path runs after main()'s span has already ended (via finally), so no leak risk.
- @modelcontextprotocol/sdk is imported — MCPInstrumentation (@traceloop/instrumentation-mcp) will cover the server.connect() and tool call protocol messages as child spans.
- pino is in the auto-instrumentation allowlist (core @opentelemetry/auto-instrumentations-node) but is used as a logger here, not an outbound call target — no librariesNeeded entry added for pino.
