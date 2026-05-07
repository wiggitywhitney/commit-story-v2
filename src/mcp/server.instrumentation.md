# Instrumentation Report: src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.0K
- **Output tokens**: 3.0K

## Schema Extensions
- `span.commit_story.mcp.start_server`
- `commit_story.mcp.server.name`
- `commit_story.mcp.server.version`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- createServer() is a synchronous function with no async I/O — it creates the server object and registers tools but never awaits anything. It is skipped per RST-001 (no spans on synchronous utilities) and its logic is fully covered by the parent span on main().
- main() is the CLI entry point for the MCP server process — it gets a root span per COV-001, which covers the full server startup and connection lifecycle. The span ends when server.connect() resolves (which for a stdio transport is when the connection closes), making this span accurately represent the server's active lifetime.
- The @modelcontextprotocol/sdk import triggers a librariesNeeded entry for @traceloop/instrumentation-mcp (MCPInstrumentation), which covers the low-level MCP protocol messages automatically. The manual span on main() provides the application-level root context that those auto-instrumented child spans will attach to.
- Added commit_story.mcp.server.name and commit_story.mcp.server.version as schema extensions — no existing registry keys capture MCP server identity. The closest registered keys are all domain-specific (commit, journal, ai, context) and do not semantically match the server name/version of an MCP process. These two attributes give the span its minimum required diagnostic value per COV-005.
