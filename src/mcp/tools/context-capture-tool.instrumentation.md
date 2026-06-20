# Instrumentation Report: src/mcp/tools/context-capture-tool.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.5K
- **Output tokens**: 3.1K

## Schema Extensions
- `span.commit_story.context.save_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getContextPath is a pure synchronous helper with no I/O — skipped (RST-001: no spans on synchronous utilities).
- formatTimestamp is a pure synchronous helper with no I/O — skipped (RST-001: no spans on synchronous utilities).
- formatContextEntry is a pure synchronous helper with no I/O — skipped (RST-001: no spans on synchronous utilities).
- registerContextCaptureTool is a synchronous exported function that only registers a handler — it performs no I/O itself, so it is skipped per RST-001.
- The inline async MCP tool handler inside registerContextCaptureTool is an unexported function. Its entire execution path flows through saveContext, which now has its own span. Skipped per RST-004 — the orchestrator (saveContext) covers this path.
- saveContext performs async file I/O (mkdir, appendFile) and is the natural service boundary for the MCP tool's write operation. It receives a span named commit_story.context.save_context (new, not in schema — declared in schemaExtensions). The commit_story.journal.file_path registered attribute is used to capture the output path.
- The catch block in the inline MCP tool handler swallows the error (returns a content response rather than rethrowing). No recordException or setStatus was added to it per NDS-007 — it is a graceful-degradation catch that does not propagate the error.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):85: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
