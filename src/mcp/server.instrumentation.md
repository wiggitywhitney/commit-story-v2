# Instrumentation Report: src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 0.8K
- **Output tokens**: 2.8K
- **Cached tokens**: 21.2K

## Schema Extensions
- `span.commit_story.mcp.server.start`
- `commit_story.mcp.transport`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- createServer is a synchronous, unexported factory function with no I/O — it was skipped (RST-001: no spans on synchronous utilities; RST-004: unexported internal functions are skipped when an exported orchestrator covers the path). main() is the orchestrator that calls it and already gets a span.
- main() receives a span as the async service entry point for the MCP server process (COV-001: entry points must have spans). It does not call process.exit() directly in its body — only the outer .catch() handler does — so RST-006 does not apply.
- A new attribute commit_story.mcp.transport was invented (schema extension) to satisfy COV-005 (every span must have at least one attribute). No registered attribute captures MCP server transport type — commit_story.context.source has an 'mcp' member but describes context collection source, not server transport configuration.
- The span name commit_story.mcp.server.start is a schema extension because no existing schema span definition matches MCP server initialization. The nearest existing spans cover journal generation and context collection, which are semantically distinct from server startup.
- @modelcontextprotocol/sdk is present in imports and has a corresponding auto-instrumentation library (@traceloop/instrumentation-mcp / MCPInstrumentation) that covers MCP tool calls and protocol messages at the framework level. The manual span on main() provides the root entry-point context that auto-instrumented child spans will attach to.
