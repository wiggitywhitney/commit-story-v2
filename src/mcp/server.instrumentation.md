# Instrumentation Report: src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.1K
- **Output tokens**: 2.5K
- **Cached tokens**: 24.6K

## Schema Extensions
- `span.commit_story.mcp.main`
- `commit_story.mcp.transport_type`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- createServer is a synchronous unexported function with no I/O that simply constructs an object and registers tools — it does not need a span (RST-001: no spans on synchronous non-I/O utilities; RST-004: unexported with an exported orchestrator covering its execution path).
- main() is the COV-001 async entry point. process.exit(1) appears only in the .catch() callback at the call site outside main()'s own body, so RST-006 does not apply and main() is safely spanned.
- New span name 'commit_story.mcp.main' declared as a schema extension — no existing registry span matches this MCP server startup operation.
- New attribute 'commit_story.mcp.transport_type' captures the transport mechanism ('stdio') used by the MCP server. No registered attribute key in the schema covers transport type for MCP server connections — the closest registered attributes are context source types, which are semantically distinct from server transport configuration.
- @modelcontextprotocol/sdk is in the auto-instrumentation allowlist (MCPInstrumentation) — recorded in librariesNeeded. Manual span on main() is still added as the COV-001 entry point; MCP tool calls become child spans via auto-instrumentation.
- pino is in the auto-instrumentation allowlist (@opentelemetry/instrumentation-pino) — recorded in librariesNeeded.
