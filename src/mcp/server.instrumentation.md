# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 12.8K
- **Output tokens**: 8.5K
- **Cached tokens**: 96.1K

## Schema Extensions
- `span.commit_story.mcp.main`
- `commit_story.mcp.transport_type`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| createServer | instrumented | 0 |
| main | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 1 blocking error (SCH-001 (Span Names Match Registry):1)
2. **Attempt 2**: 1 blocking error (SCH-001 (Span Names Match Registry):1)
3. **Attempt 3**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
4. **Attempt 4**: function-level: 2/2 functions instrumented

## Notes
- span.commit_story.mcp.main is a schema extension — no existing registry span covers MCP server startup/initialization. The closest existing spans are CLI entry points (commit_story.cli.main), but this is a distinct transport protocol (stdio/MCP) entry point.
- createServer() is skipped per RST-003 (thin wrapper/unexported internal) and RST-004 (unexported function). Its logic runs inside main()'s span.
- server.name and server.transport are invented attributes (not in registry) to satisfy COV-005 — the schema has no MCP server metadata keys. These provide basic service identity context for the root span.
- @modelcontextprotocol/sdk is detected in imports — MCPInstrumentation covers the MCP protocol-level tool calls; the manual span on main() covers application-level orchestration.
- Function-level fallback: 2/2 functions instrumented
-   instrumented: createServer (0 spans)
-   instrumented: main (1 spans)
