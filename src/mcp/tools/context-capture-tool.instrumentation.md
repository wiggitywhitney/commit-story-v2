# Instrumentation Report: src/mcp/tools/context-capture-tool.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.4K
- **Output tokens**: 4.7K

## Schema Extensions
- `span.commit_story.context.save_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveContext is an unexported async function that performs filesystem I/O (mkdir + appendFile). No exported orchestrator wraps it, so RST-004 does not exempt it — it is the effective entry point for context persistence and receives a COV-004 span (commit_story.context.save_context).
- getContextPath, formatTimestamp, and formatContextEntry are all pure synchronous helpers with no I/O — they are skipped per RST-001.
- registerContextCaptureTool is a synchronous exported function that registers a tool handler — it is skipped per RST-001. The anonymous async callback it registers is not exported and delegates entirely to saveContext, which is now instrumented, so no separate span is needed for the callback.
- The anonymous async callback's catch block returns content without rethrowing — this is a graceful degradation path (NDS-007). No recordException or setStatus was added to that catch.
- commit_story.journal.entry_date and commit_story.journal.file_path are both registered schema attributes used on the saveContext span. No new attribute schema extensions were required.
- The file path written to commit_story.journal.file_path is project-relative (starts with 'journal/context/...'), not an absolute filesystem path, so no CDQ-007 basename transformation is needed.
- span.commit_story.context.save_context is a new span name not present in the schema registry. It follows the commit_story namespace and context category consistent with existing registered spans. No existing schema span matched the 'save to filesystem' operation semantically.

## Advisory Findings
- CDQ-006 (isRecording Guard):77: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):86: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
