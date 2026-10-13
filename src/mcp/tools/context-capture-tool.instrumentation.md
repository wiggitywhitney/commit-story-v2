# Instrumentation Report: src/mcp/tools/context-capture-tool.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.7K
- **Output tokens**: 2.9K
- **Cached tokens**: 32.1K

## Schema Extensions
- `span.commit_story.context.save_context`
- `commit_story.context.text_length`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveContext is unexported but performs filesystem I/O (mkdir, appendFile) and no exported async orchestrator in this file covers its execution path (registerContextCaptureTool is synchronous and only registers the handler), so it receives a span (RST-004 exception, COV-004).
- No schema span matched saving MCP-captured context, so a new span name commit_story.context.save_context was declared; it is distinct from the already-used names in this run.
- getContextPath, formatTimestamp, formatContextEntry are synchronous pure helpers and registerContextCaptureTool is a synchronous registration function — none get spans (RST-001).
- commit_story.context.source is set to 'mcp' since this context is captured via an MCP tool, matching the registered enum member.
- commit_story.journal.file_path is used for the output file location; the value is reduced to the file name (e.g. 2026-02-03.md) via inline split to avoid capturing raw filesystem paths (CDQ-007).
- commit_story.context.text_length (int) is a new extension capturing the character length of the captured context text; no registered key describes the size of input context content (messages_count/files_count count different things).
- The MCP SDK is only referenced in a JSDoc type annotation, not imported, so no auto-instrumentation library is recorded; if @traceloop/instrumentation-mcp were active it would cover the tool call protocol layer. The inner tool handler's catch is a graceful fallback returning an error message, so it was left untouched.

## Advisory Findings
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
I need to instrument saveContext itself since it's the async function doing the I/O work, but I'm also considering whether the MCP tool handler inside registerContextCaptureTool—being an entry point for requests—deserves its own span too, even though it's just an anonymous arrow function wrapping the call.

I'll settle on naming the span 'commit_story.context.save_context' with attributes for the context file path (sanitized to just the basename per path-handling conventions), a source marker of 'mcp', and the text length of the input. Since there's no existing inner try/catch in saveContext, errors will simply propagate up through the new span wrapper.


```
