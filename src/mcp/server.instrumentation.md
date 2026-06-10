# Instrumentation Report: src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.0K
- **Output tokens**: 2.9K
- **Cached tokens**: 24.5K

## Schema Extensions
- `span.commit_story.mcp.server.start`
- `commit_story.mcp.transport_type`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- createServer is a synchronous unexported helper that only calls constructors and synchronous registration functions — no I/O, no async work, so it is skipped (RST-001 no spans on synchronous utilities, RST-004 unexported helper covered by its caller's span).
- main() is the async entry point and receives a span (COV-001). The process.exit(1) at the bottom is inside the .catch() callback at module scope, not inside main()'s body, so RST-006 does not apply.
- The @modelcontextprotocol/sdk import triggers MCPInstrumentation — recorded in librariesNeeded. main() still gets a manual entry-point span as its orchestrator span; the MCP protocol-level calls become child spans via auto-instrumentation.
- span.commit_story.mcp.server.start is a new span name — no schema entry matched 'starting the MCP server process'. Declared in schemaExtensions.
- commit_story.mcp.transport_type is a new attribute capturing the transport mechanism used ('stdio'). No registered key in the schema matches this concept. Declared in schemaExtensions with type string, brief 'The transport type used by the MCP server', stability development.
- The span attribute commit_story.mcp.transport_type is set before the await server.connect(transport) call so it is present on all execution paths including error paths (COV-005 input-before-guard requirement).
