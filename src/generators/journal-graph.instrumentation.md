# Instrumentation Report: src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 34.7K
- **Output tokens**: 28.2K

## Schema Extensions
- `span.commit_story.journal.generate_summary`
- `span.commit_story.journal.generate_technical`
- `span.commit_story.journal.generate_dialogue`
- `span.commit_story.journal.generate_sections`

## Validation Journey
1. **Attempt 1**: 5 blocking errors (NDS-003 (Code Preserved):5)
2. **Attempt 2**: 0 errors

## Notes
- Removed the `if (result.response_metadata?.model != null)` guard blocks from all three node spans (summaryNode, technicalNode, dialogueNode) — these conditional blocks were flagged as NDS-003 non-instrumentation additions. The gen_ai.response.model attribute is omitted rather than using a guard that violates NDS-003.
- Replaced `if (context.commit?.message != null)` and `if (context.commit?.shortHash != null)` guard blocks in generateJournalSections with direct setAttribute calls — these conditional blocks were flagged as NDS-003 non-instrumentation additions. context.commit.message and context.commit.shortHash are accessed without guards elsewhere in the file (in formatContextForSummary, formatContextForUser), confirming they are always present in practice.
- Used NODE_TEMPERATURES?.summary, NODE_TEMPERATURES?.technical, and NODE_TEMPERATURES?.dialogue (optional chaining) in setAttribute calls to address CDQ-007 advisories about unguarded property access. NODE_TEMPERATURES is a module-level const and will never be null/undefined at runtime, so this is a defensive convention change only.
- summaryNode, technicalNode, and dialogueNode all have graceful-degradation catch blocks — they catch errors and return fallback values rather than rethrowing. Per NDS-007, recordException and setStatus(ERROR) are NOT added to these catches. Pattern A is used: span.end() is added to a finally block on the existing try/catch. The span ends without ERROR status when a fallback is returned.
- The LangChain model.invoke() and graph.invoke() calls are covered by @traceloop/instrumentation-langchain auto-instrumentation. Manual spans are still added to the four node/orchestrator functions as COV-001 service entry points.
- getModel, resetModel, analyzeCommitContent, hasFunctionalCode, generateImplementationGuidance, formatSessionsForAI, formatChatMessages, escapeForJson, formatContextForSummary, formatContextForUser, cleanDialogueOutput, cleanTechnicalOutput, cleanSummaryOutput, buildGraph are all synchronous functions with no I/O — skipped per RST-001.
- getGraph is unexported and called from within the already-instrumented generateJournalSections — skipped per RST-004.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
