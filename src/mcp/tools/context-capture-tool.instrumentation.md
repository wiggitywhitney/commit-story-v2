# Instrumentation Report: src/mcp/tools/context-capture-tool.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.7K
- **Output tokens**: 3.4K

## Schema Extensions
- `span.commit_story.context.save_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveContext is unexported but is the only async I/O function in the file — no exported async orchestrator covers its execution path (RST-004 exception: instrument when no exported orchestrator spans the path). It performs directory creation and file append, making it the right instrumentation target.
- registerContextCaptureTool is synchronous (RST-001) — it only registers the tool handler with the MCP server and returns immediately. The anonymous async callback inside it is the actual entry point, but MCP auto-instrumentation (MCPInstrumentation) covers the protocol-level invocation. saveContext's span provides application-level visibility into the I/O work.
- The anonymous async callback's catch block swallows the error and returns an error-response object instead of throwing — this is a graceful-degradation catch (NDS-007), so no recordException/setStatus was added there.
- span.commit_story.context.save_context is a new span name — no matching entry exists in the registry for the file-write operation that persists captured context. The closest existing spans (collect_chat_messages, gather_context_for_commit) cover different operations (reading/aggregating context, not persisting it).
- commit_story.journal.file_path is a registered schema attribute for output file paths. The value here is a project-relative path (journal/context/YYYY-MM/YYYY-MM-DD.md), matching the schema's documented examples — CDQ-007 raw-path concern does not apply.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):85: CDQ-007: setAttribute value "filePath" at line 85 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.context.save_context" may be a semantic duplicate of existing registry operation "commit_story.context.gather_context_for_commit". If these operations are equivalent, reuse "commit_story.context.gather_context_for_commit" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
