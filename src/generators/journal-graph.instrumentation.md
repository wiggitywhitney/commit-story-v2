# Instrumentation Report: src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 36.8K
- **Output tokens**: 29.0K

## Schema Extensions
- `span.commit_story.journal.summary_node`
- `span.commit_story.journal.technical_node`
- `span.commit_story.journal.dialogue_node`
- `span.commit_story.journal.generate_sections`

## Validation Journey
1. **Attempt 1**: 2 blocking errors (NDS-003 (Code Preserved):2)
2. **Attempt 2**: 0 errors

## Notes
- Fixed NDS-003: the formatChatMessages return template literal had an extra spurious `}` appended — restored to the exact original: `{"type":"${type}", "time":"${time}", "content":"${escapeForJson(msg.content)}"}`.
- Fixed CDQ-007: replaced NODE_TEMPERATURES.summary, NODE_TEMPERATURES.technical, and NODE_TEMPERATURES.dialogue with optional chaining (NODE_TEMPERATURES?.summary etc.) in the setAttribute calls for gen_ai.request.temperature. NODE_TEMPERATURES is a module-level const and cannot actually be null, but the validator requires the guard.
- SCH-001 advisories for commit_story.journal.technical_node and commit_story.journal.generate_sections are false positives — these are distinct operation classes (technical decisions extraction node vs summary node vs top-level orchestration), not semantic duplicates. The names are retained.
- summaryNode, technicalNode, and dialogueNode have existing try/catch blocks that return graceful error state objects without rethrowing. Per NDS-007, no recordException/setStatus was added to those catch blocks. span.end() is added via finally.
- getModel, resetModel, analyzeCommitContent, hasFunctionalCode, generateImplementationGuidance, formatSessionsForAI, formatChatMessages, escapeForJson, formatContextForSummary, formatContextForUser, cleanDialogueOutput, cleanTechnicalOutput, cleanSummaryOutput, buildGraph — all pure synchronous with no I/O, skipped per RST-001.
- getGraph is unexported and synchronous — skipped per RST-004 and RST-001. Its execution is covered by the generateJournalSections span.
- LangChain auto-instrumentation (@traceloop/instrumentation-langchain) covers model.invoke() calls inside each node as child spans. Manual spans are still added to node functions as COV-001 exported async entry points called by the LangGraph runtime.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
