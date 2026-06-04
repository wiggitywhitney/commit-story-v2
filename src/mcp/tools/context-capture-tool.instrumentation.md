# Instrumentation Report: src/mcp/tools/context-capture-tool.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.5K
- **Output tokens**: 4.2K

## Schema Extensions
- `span.commit_story.context.save_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveContext is an unexported async function that performs file I/O (mkdir + appendFile). No exported orchestrator span covers its execution path, so it is instrumented as a COV-004 async I/O target with span name 'commit_story.context.save_context'.
- registerContextCaptureTool is a synchronous exported function (it returns void after registering a tool callback) — skipped per RST-001 (no spans on synchronous operations with no I/O in the function body itself).
- The anonymous async MCP tool callback inside registerContextCaptureTool catches errors and returns an error content object without rethrowing — this is a graceful-degradation catch (NDS-007), so no recordException/setStatus was added to it. The saveContext call inside it gains observability through its own span.
- getContextPath, formatTimestamp, and formatContextEntry are pure synchronous helpers with no I/O — skipped per RST-001.
- The @modelcontextprotocol/sdk import triggers MCPInstrumentation (covers MCP protocol messages and tool calls at the framework level, not the application handler).
- 'span.commit_story.context.save_context' is a new span name not present in the schema registry. It represents the async file-write operation that persists a captured context entry to disk.
- commit_story.journal.file_path and commit_story.journal.entry_date are already registered schema attributes — no schemaExtension declarations needed for those.
- entry_date uses now.toISOString().split('T')[0] which produces UTC date; this may differ from the local-time date used in the file path (constructed by getContextPath). This is a known minor discrepancy acceptable for telemetry purposes — the original path computation was not modified.

## Advisory Findings
- CDQ-006 (isRecording Guard):86: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):85: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
