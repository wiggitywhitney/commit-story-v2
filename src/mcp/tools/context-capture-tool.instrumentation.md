# Instrumentation Report: src/mcp/tools/context-capture-tool.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.5K
- **Output tokens**: 5.6K

## Schema Extensions
- `span.commit_story.context.save_context`
- `span.commit_story.mcp.capture_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveContext is an unexported async function that performs filesystem I/O (mkdir, appendFile). Since no exported orchestrator span covers its execution path (registerContextCaptureTool is synchronous and RST-001 applies to it), saveContext is instrumented directly as a COV-004 target per the RST-004 exception (RST-004: skip unexported internals unless no orchestrator span covers their path).
- The anonymous async tool handler passed to server.tool() is an MCP entry point — it is the application-level boundary invoked when the 'journal_capture_context' tool is called. It receives a COV-001 span as a service entry point.
- The catch block inside the tool handler returns a content object without rethrowing the error — this is graceful degradation. Per NDS-007, recordException and setStatus(ERROR) are not added to this catch block to avoid false alerts on expected conditions. The span still closes in the finally block.
- registerContextCaptureTool is a synchronous function that only registers callbacks — no I/O, no async work. Skipped per RST-001 (no spans on synchronous non-I/O code).
- getContextPath, formatTimestamp, and formatContextEntry are pure synchronous helpers with no I/O. Skipped per RST-001.
- span.commit_story.context.save_context is a new span name — no existing registry span matches the 'write context entry to filesystem' operation. The existing commit_story.context.collect span covers collection, not persistence.
- span.commit_story.mcp.capture_context is a new span name — no existing registry span covers the MCP tool handler invocation for context capture. commit_story.context.collect is already used for a different operation in another file.
- @modelcontextprotocol/sdk appears only in a JSDoc type annotation, not as an actual import. No MCPInstrumentation library entry is recorded.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):77: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):117: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file:

1. `saveContext` (line 69) - async, unexported but it's the main logic called from the tool handler. Since `registerContextCaptureTool` is synchronous (RST-001), `saveContext` is the only async function with I/O. Since no exported orchestrator spans it, I should instrument it (RST-004 exception).

2. The anonymous async handler inside `server.tool(...)` - this is effectively the service entry point for MCP tool calls. It calls `saveContext`. I should consider whether to span this.

3. `registerContextCaptureTool` - synchronous, RST-001 applies. Skip.
4. `getContextPath`, `formatTimestamp`, `formatContextEntry` - also synchronous, so RST-001 applies and I'll skip these too.

Now focusing on what needs instrumentation: `saveContext` does actual I/O (mkdir, appendFile) so COV-004 applies and it should get a span. The anonymous async tool handler is trickier since it's the true MCP entry point but isn't exported directly—`registerContextCaptureTool` just registers it. I need a new span name since `commit_story.context.collect` is already taken, so I'm thinking of something reflecting a context file save operation.

I've settled on `commit_story.context.save_context` for the naming. Since MCP protocol calls are covered by auto-instrumentation but the tool handler is application-level orchestration, COV-001 applies to it too and I should add a manual span there. But I need to think through how the try/catch in the handler—which swallows errors and returns them as content rather than rethrowing—affects span error handling.

Since the catch block returns gracefully without rethrowing, per NDS-007 it shouldn't call recordException or setStatus. I'm now planning the two spans: one for saveContext with attributes for the file path and content length, and one wrapping the tool handler that preserves the existing try/catch structure while adding the span.

I do see a tension here though—COV-003 requires error recording on any catch paired with a finally that ends the span, but NDS-007 explicitly says graceful degradation catches shouldn't get that treatment. NDS-007 should win since it's the more specific rule for this scenario.

Writing handler code...

For `saveContext`, I'm wrapping the file operations in a span that records the file path attribute, creates the directory if needed, formats and appends the entry, then properly records exceptions with recordException and setStatus before rethrowing, with span.end() in finally. I'm noting the two new spans I'll need to add to the schema: one for the context save operation and one for the MCP tool handler itself.

I'm deciding to skip adding the context text itself as a span attribute since it's user content that's potentially sensitive and unbounded in size, and I'm also noting that MCPInstrumentation should be included in the auto-instrumentation libraries needed since the SDK is in the allowlist.

I'll keep the attributes simple, sticking with just the journal file path for `saveContext`, and I'll add `commit_story.context.source` set to 'mcp' for the tool handler span to mark it as an MCP context capture. Now I'm double-checking that the span name `commit_story.context.save_context` doesn't conflict with anything already used.

Writing the instrumented saveContext function...

Now I'm wiring up the MCP tool registration itself, wrapping the capture call in a span that tags the source as 'mcp', returning a success message with the saved path, and catching errors gracefully to report them back as text rather than throwing.

Checking whether both attributes—context source and journal file path—are already registered in the schema, and they are, so no new attributes get created here. I'm also noting a schema extension for a new span tied to the saveContext function.

Now I'm tallying span categories: no external calls since the filesystem operations aren't RPC-style, one service entry point for the tool handler, and counting six functions total in the file. I'm reconsidering whether the saveContext span really counts as a service entry point or external call, leaning toward zero external calls since it's really an async I/O operation instead.

I'll set externalCalls to 0. Checking the actual imports, the file only pulls in zod and Node's fs/path modules directly - the MCP SDK reference is just a JSDoc type annotation, not a real import - so no auto-instrumentation libraries are needed and librariesNeeded stays empty.

Now I'm reasoning through the span wrapping: the existing try/catch in the tool handler doesn't rethrow, so per NDS-007 it stays graceful without added error recording, even though it's paired with the finally block that ends the span. With that resolved, I'm ready to write out the complete file.


```
