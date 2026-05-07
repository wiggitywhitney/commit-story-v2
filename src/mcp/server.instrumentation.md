# Instrumentation Report: src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.2K
- **Output tokens**: 2.4K

## Schema Extensions
- `span.commit_story.mcp.server_start`
- `commit_story.mcp.transport_type`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- createServer is a synchronous unexported helper that registers tools and returns a configured server object — no I/O, no async operations, skipped on both RST-001 (pure synchronous) and RST-004 (unexported, covered by the main() entry-point span).
- main() is the sole entry point and receives a span per COV-001. The @modelcontextprotocol/sdk import triggers MCPInstrumentation in librariesNeeded — server.connect() and any MCP protocol messages will be covered by auto-instrumentation as child spans.
- Invented commit_story.mcp.transport_type (value: 'stdio') to satisfy COV-005 — every span needs at least one attribute. No registered attribute in the schema covers MCP transport type or server startup metadata. Reported as a schemaExtension.
- Invented span name commit_story.mcp.server_start — no schema-defined span matches an MCP server startup operation. The closest existing span commit_story.cli.run is already taken and semantically distinct (CLI command execution vs. MCP server lifecycle). Reported as a schemaExtension.
