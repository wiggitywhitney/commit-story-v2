# Instrumentation Report: src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 7.1K
- **Output tokens**: 30.4K
- **Cached tokens**: 22.6K

## Schema Extensions
- `span.commit_story.journal.generate_summary`
- `span.commit_story.journal.generate_technical`
- `span.commit_story.journal.generate_dialogue`
- `span.commit_story.journal.generate_sections`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- summaryNode, technicalNode, and dialogueNode each have try/catch blocks that return graceful-degradation state (error strings, no rethrow). Per NDS-007, recordException and setStatus(ERROR) were NOT added to those catches — they represent expected failure modes, not unexpected errors. span.end() is called via finally in all cases.
- The catch blocks in summaryNode, technicalNode, and dialogueNode never propagate errors upward (they return error state instead), so the LangGraph runtime always sees a resolved promise from these nodes. The outer span-level catch required by COV-003 is satisfied by the existing catch clause; NDS-007 takes precedence over adding error recording to graceful-degradation catches.
- getModel and resetModel are synchronous functions with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- analyzeCommitContent, hasFunctionalCode, generateImplementationGuidance, formatSessionsForAI, formatChatMessages, escapeForJson, formatContextForSummary, formatContextForUser, cleanDialogueOutput, cleanTechnicalOutput, cleanSummaryOutput, buildGraph are all synchronous pure/data-transform functions — skipped per RST-001.
- getGraph is unexported and its execution path is fully covered by the generateJournalSections span — skipped per RST-004.
- All four new span names use the commit_story namespace prefix consistent with existing schema spans. They are declared in schemaExtensions because no existing schema span matched these journal-generation operations.
- LangChainInstrumentation from @traceloop/instrumentation-langchain covers the getModel(...).invoke() calls inside summaryNode, technicalNode, and dialogueNode — those model.invoke() calls become child spans automatically when auto-instrumentation is active. Token usage attributes (gen_ai.usage.input_tokens, gen_ai.usage.output_tokens) are also set on the parent span from result.usage_metadata when available, guarded with != null.
- gen_ai.request.model is set to the hard-coded model string 'claude-haiku-4-5-20251001' matching the ChatAnthropic constructor — this is a static value known at instrumentation time.
- commit_story.journal.sections in generateJournalSections uses .filter(Boolean) on an inline array — CDQ-006 isRecording guard is not required here because generateJournalSections is a COV-001 entry point (CDQ-006 COV-001 exemption applies).

## Advisory Findings
- CDQ-006 (isRecording Guard):649: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):445: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):494: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):552: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
