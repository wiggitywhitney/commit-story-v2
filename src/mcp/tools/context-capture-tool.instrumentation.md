# Instrumentation Report: src/mcp/tools/context-capture-tool.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.4K
- **Output tokens**: 6.7K

## Schema Extensions
- `span.commit_story.mcp.capture_context`
- `span.commit_story.context.save_context`
- `commit_story.context.content_length`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- commit_story.mcp.capture_context is a new span for the inline async MCP tool handler registered via server.tool() — this is the COV-001 service entry point that receives external tool invocations from Claude. No schema span matched this operation class.
- commit_story.context.save_context is a new span for the unexported async saveContext function — it performs async file I/O (mkdir + appendFile) and no exported orchestrator span covers its execution path directly (the tool handler is an inline callback, not an instrumented function wrapping saveContext), so RST-004's exception applies and it is instrumented as a COV-004 target.
- The inline tool handler's existing catch block returns a user-facing error message without rethrowing — it is graceful degradation, not a failure propagation path. Per NDS-007, recordException and setStatus(ERROR) were not added to it. The outer span wrapper uses try/finally only since the inner catch swallows all errors, making an outer catch unreachable.
- commit_story.context.content_length is a new integer attribute capturing the byte length of the text being captured. No registered key semantically matches this — commit_story.context.messages_count counts messages across sessions, commit_story.filter.tokens_before/after are about token budget filtering, and none describe the raw character length of a single capture payload.
- registerContextCaptureTool is synchronous and its only role is registering the tool with the server — it performs no I/O and is skipped per RST-001.
- getContextPath, formatTimestamp, and formatContextEntry are pure synchronous helpers with no I/O — skipped per RST-001 and RST-004.
- @traceloop/instrumentation-mcp is recorded in librariesNeeded because @modelcontextprotocol/sdk is used for the MCP server. The manual span on the inline handler still gets added as the COV-001 service entry point — auto-instrumentation covers the MCP protocol layer, while the manual span covers the application-level handler logic.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):85: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):118: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file carefully.

Functions:
1. `getContextPath` - synchronous, skip (RST-001, RST-004)
2. `formatTimestamp` - synchronous, skip (RST-001, RST-004)
3. `formatContextEntry` - synchronous, skip (RST-001, RST-004)
4. `saveContext` - async, unexported, performs I/O (mkdir, appendFile) - needs a span (COV-004, since no exported orchestrator covers it directly... wait, `registerContextCaptureTool` calls it, but `registerContextCaptureTool` is synchronous)
5. `registerContextCaptureTool` - exported, synchronous, skip (RST-001)

The async callback inside `server.tool(...)` is an entry point that calls `saveContext`. This is an MCP tool handler - it's a service entry point (COV-001). So I need to instrument both the async handler callback and the `saveContext` function it invokes.

`saveContext` performs I/O operations and isn't covered by an exported async orchestrator, so it qualifies as a COV-004 target under the RST-004 exception. The inline async handler itself should be instrumented as the COV-001 entry point. Since it already has a try/catch that returns error content gracefully rather than throwing, I won't need to record exceptions there.

For span naming, I'm creating schema extensions: `commit_story.mcp.capture_context` for the inline MCP tool handler and `commit_story.context.save_context` for the `saveContext` function. The `saveContext` function gets a span as a COV-004 target, while the synchronous `registerContextCaptureTool` can be skipped. The inline async handler is actually the service entry point that gets invoked from outside, so I should mark it as COV-001. Now I'm wrapping `saveContext` with a span that captures the file path and handles errors appropriately.

Writing instrumentation code... Writing span wrapper... I'll keep the inline handler straightforward with just the text content length as an attribute. For the `saveContext` span, I can use the already-registered `commit_story.journal.file_path` along with a new `commit_story.context.content_length` extension attribute. Since entry points are exempt from the recording guard requirement, I don't need to worry about wrapping the length calculation.

Writing the implementation... Checking whether `content_length` is actually a new attribute or if it's already registered in the schema, and confirming it makes sense to capture just the length rather than the full text content. Now I'm ready to write out the complete implementation with the inline handler that calls `saveContext` and returns the saved path. Completing the span wrapper with the finally block to ensure the span ends properly, and I'm verifying that the savedPath variable assignment stays intact while just adding the span attribute call after it. The `saveContext` function wraps the file operations in a span, creating the directory if needed, formatting and appending the entry, then setting the file path attribute on the span. For the inline handler, I'm checking `text.length` as a direct property access to determine if recording is needed.

Looking at the schema extensions, I need to add `commit_story.context.content_length` as an integer attribute capturing the length of the context being saved, and define the new `commit_story.mcp.capture_context` span.

For the span analysis, I'm counting 6 total functions including the inline handler, no external network calls (the file system operations are local I/O), no matching schema-defined spans, and 1 service entry point. I'm realizing the categorization is tricky here—the `saveContext` span doesn't fit neatly into the existing categories since it's an internal async I/O operation, not an external call or service entry point. Let me reconsider what these metrics actually represent and whether I need to adjust how I'm counting them. I'll finalize the span reporting: serviceEntryPoints gets 1 for the inline MCP handler, externalCalls and schemaDefined are both 0, and totalFunctionsInFile is 6, with a note that saveContext receives a COV-004 span outside these categories. Now I'm ready to write out the complete file.
```
