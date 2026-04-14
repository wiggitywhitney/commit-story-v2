# Instrumentation Report: src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 6.3K
- **Output tokens**: 3.6K

## Schema Extensions
- `span.commit_story.mcp.server_start`

## Validation Journey
1. **Attempt 1**: 1 blocking error (NDS-003 (Code Preserved):1)
2. **Attempt 2**: 0 errors

## Notes
- Restored the original comment '// Log to stderr (stdout is reserved for JSON-RPC)' that was incorrectly removed in the previous output, fixing NDS-003.
- createServer() skipped: unexported synchronous function with no I/O — RST-001 and RST-004 both apply.
- @modelcontextprotocol/sdk detected — MCPInstrumentation recorded in librariesNeeded.
- span.commit_story.mcp.server_start is a new span not defined in the schema — no existing schema entry matches MCP server startup.
- commit_story.context.source set to 'mcp' to satisfy COV-005; this key is already registered in the schema so attributesCreated remains 0.
