# Instrumentation Report: src/mcp/tools/context-capture-tool.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.5K
- **Output tokens**: 5.7K

## Schema Extensions
- `span.commit_story.context.save_context`
- `span.commit_story.mcp.capture_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveContext is an async function performing file I/O (mkdir, appendFile) — instrumented as a COV-004 async I/O operation with span 'commit_story.context.save_context'. The commit_story.journal.file_path registered attribute captures the output path.
- The anonymous async callback passed to server.tool() is the application-level MCP tool handler — MCPInstrumentation covers the MCP protocol layer but NOT application handlers, so a manual span 'commit_story.mcp.capture_context' is added. commit_story.context.source is set to 'mcp' as an input attribute before any branching.
- The anonymous handler's catch block returns an error content object instead of rethrowing — this is a graceful-degradation catch per NDS-007. No recordException or setStatus was added to it. span.end() is placed in the finally block so the span always closes regardless of the catch path.
- getContextPath, formatTimestamp, formatContextEntry are pure synchronous helpers with no I/O — skipped per RST-001. registerContextCaptureTool is synchronous — skipped per RST-001.
- Both commit_story.journal.file_path and commit_story.context.source are already registered in the schema — no new attribute keys were created (attributesCreated: 0).
- span.commit_story.context.save_context: new span for the async file-writing operation inside saveContext. No existing schema span matches this file-append operation. Type: internal, stability: development.
- span.commit_story.mcp.capture_context: new span for the MCP tool handler callback. No existing schema span matches an MCP tool invocation handler at the application level. Type: internal, stability: development.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):77: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):117: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
