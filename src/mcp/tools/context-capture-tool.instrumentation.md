# Instrumentation Report: src/mcp/tools/context-capture-tool.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.4K
- **Output tokens**: 4.3K

## Schema Extensions
- `span.commit_story.context.save_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getContextPath, formatTimestamp, and formatContextEntry are pure synchronous helpers with no I/O — skipped (RST-001: no spans on synchronous utilities).
- registerContextCaptureTool is a synchronous registration function — skipped (RST-001). The anonymous async tool handler it registers is not directly exported and its execution path is effectively the MCP framework's dispatch layer; if @modelcontextprotocol/sdk were directly imported, @traceloop/instrumentation-mcp (MCPInstrumentation) would cover that boundary. The SDK is referenced only in a JSDoc type comment, not as a real import, so no librariesNeeded entry was added.
- saveContext is unexported but is the sole async I/O function in the file and has no exported orchestrator covering its execution path — instrumented per COV-004. The span name 'commit_story.context.save_context' is new; the schema defines 'commit_story.context.gather_context_for_commit' (already in use by another file) but that name covers a different operation class (gathering multi-source context for a commit vs. appending a captured entry to a daily file).
- The text parameter was not captured as a span attribute — it is unbounded user-provided content (CDQ-007: avoid unbounded string values).
- commit_story.journal.entry_date is derived from now.toISOString().split('T')[0] — a method-call chain — so it is wrapped in an isRecording() guard per CDQ-006. commit_story.journal.file_path is a direct variable read and does not require a guard.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):77: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file:

1. `saveContext` (line 69) - async, unexported but it's the only async I/O function. The pre-instrumentation analysis says to add a span (COV-004). It's unexported but no exported orchestrator covers it directly - the `registerContextCaptureTool` is synchronous and calls `saveContext` indirectly through a closure.

Wait, `registerContextCaptureTool` is synchronous (RST-001 says skip), but it registers a tool handler that is an async function. The async handler inside `server.tool(...)` calls `saveContext`.

The inline async handler `async ({ text }) => { ... 
}` is the actual entry point. Should I instrument it? It's an unexported anonymous async function that acts as a tool handler. This is essentially a service entry point - it's a callback registered with an MCP server. The pre-instrumentation analysis doesn't mention it, but since it's covered by the MCP framework's auto-instrumentation, I should skip it per RST-004. The key is that `saveContext` itself needs the span since it's the actual I/O operation that's not covered by any exported path.

I'll instrument `saveContext` with a span, and I need to figure out the right span name from the schema since there's no predefined one for context capture operations.

Looking at existing patterns, I could use `commit_story.mcp.save_context` or `commit_story.context.save_context`. For attributes, I'll capture the file path where context gets saved and the entry date, but skip the text content since it could contain PII.

Now I need to add error handling with a try/catch/finally pattern to the `saveContext` function. Checking the imports, there's no actual import of the MCP SDK in the code itself—just a JSDoc type annotation—so I won't record any auto-instrumentation library for that.

For the instrumentation, I'm setting up a span called `commit_story.mcp.save_context` with attributes like the entry date (computed from the current timestamp) and the file path. The entry date needs to be formatted as a YYYY-MM-DD string derived from the `now` variable. Writing the instrumented function... `formatContextEntry` is a function call so I don't need to guard it with an attribute. The `text` parameter is unbounded user input, so I'll skip capturing that per the data quality guidelines. Now I'm reviewing the schema extensions and counting the functions in this file—there are five named functions plus the anonymous async handler, so six total.

For the span categories, I need to clarify what counts as an external call versus an I/O operation. The `saveContext` function uses filesystem operations like `mkdir` and `appendFile`, which are I/O but not external service calls. Since `saveContext` is marked as a long-running async operation, it should be categorized as a service entry point rather than an external call.

Looking at the attributes, both `commit_story.journal.file_path` and `commit_story.journal.entry_date` are already registered in the schema, so no new attributes are being created here.

The helper functions like `getContextPath`, `formatTimestamp`, and `formatContextEntry` are synchronous utilities that don't need instrumentation. The `registerContextCaptureTool` function itself is also synchronous, though it contains an async handler for MCP tool execution that would be covered by the SDK's auto-instrumentation if it were imported. Since `@modelcontextprotocol/sdk` isn't actually imported in this file, I won't add it to the libraries list. The only async I/O function worth noting is `saveContext`, which handles the actual file writing and falls under COV-004 instrumentation. One thing to flag: the `text` parameter isn't being captured as an attribute, which could be problematic if the content is unbounded.
```
