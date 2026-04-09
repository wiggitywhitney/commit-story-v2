# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/server.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 7.0K
- **Output tokens**: 3.7K

## Schema Extensions
- `span.commit_story.mcp.main`
- `commit_story.mcp.server_name`
- `commit_story.mcp.server_version`

## Validation Journey
1. **Attempt 1**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
2. **Attempt 2**: 0 errors

## Notes
- service.name and service.version are standard OTel resource semantic conventions but are not in this project's registry; replaced with project-namespaced keys commit_story.mcp.server_name and commit_story.mcp.server_version to satisfy SCH-002. No existing registered key captures MCP server identity metadata.
- commit_story.mcp.server_name captures the MCP server's configured name ('commit-story') to identify which server instance is running; no registered key is a semantic match.
- commit_story.mcp.server_version captures the MCP server's version string ('2.0.0') for deployment identification; no registered key is a semantic match.
- createServer() skipped per RST-004 (unexported) and RST-003 (thin wrapper with no async I/O).
- main() instrumented despite being unexported because COV-001 overrides RST-004 for CLI/server entry points.

## Advisory Findings
- SCH-004 (No Redundant Schema Entries):54: Attribute key "commit_story.mcp.server_name" at line 54 appears to be a semantic duplicate of an existing registry entry (judge confidence: 85%). The attribute 'commit_story.mcp.server_name' is a semantic duplicate of 'gen_ai.provider.name'. Both capture the identity of the AI/MCP service provider being used. Migrate to 'gen_ai.provider.name' to align with OpenTelemetry semantic conventions.
