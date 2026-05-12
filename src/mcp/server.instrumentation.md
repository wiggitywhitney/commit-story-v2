# Instrumentation Report: src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 0.9K
- **Output tokens**: 2.5K
- **Cached tokens**: 21.5K

## Schema Extensions
- `span.commit_story.mcp.start`
- `commit_story.mcp.transport`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- createServer is a synchronous unexported factory function with no I/O — it was skipped (RST-001: no spans on synchronous utilities; RST-004: unexported functions are only instrumented when no exported orchestrator covers the path, and main() covers it).
- main() is the async entry point for the MCP server process — it gets a span per COV-001. No registry span matched this operation, so 'commit_story.mcp.start' was invented as a schema extension with the required namespace prefix.
- commit_story.mcp.transport was invented as a schema extension to satisfy COV-005 (every span must have at least one attribute). No registered key captures transport type; the closest, commit_story.context.source, describes context collection source rather than the server's wire transport. The value 'stdio' is hardcoded from StdioServerTransport, which is statically determined in this file.
- The process.exit(1) in the .catch() at the call site (outside main()) does not trigger RST-006 — RST-006 applies only when process.exit() is called directly inside the function body itself. The span's finally block runs correctly before the catch handler at the call site executes.
- @modelcontextprotocol/sdk is imported — MCPInstrumentation (@traceloop/instrumentation-mcp) will auto-instrument the MCP protocol calls (server.connect, tool invocations). These become child spans of the manual main() span.
