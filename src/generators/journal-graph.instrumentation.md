# Instrumentation Report: src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 63.2K
- **Output tokens**: 76.5K
- **Cached tokens**: 101.8K

## Schema Extensions
- `span.commit_story.ai.generate_summary`
- `span.commit_story.ai.generate_technical_decisions`
- `span.commit_story.ai.generate_dialogue`
- `span.commit_story.journal.generate_sections`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| analyzeCommitContent | instrumented | 0 |
| generateImplementationGuidance | instrumented | 0 |
| formatSessionsForAI | instrumented | 0 |
| formatContextForSummary | instrumented | 0 |
| formatContextForUser | instrumented | 0 |
| cleanDialogueOutput | instrumented | 0 |
| cleanTechnicalOutput | instrumented | 0 |
| cleanSummaryOutput | instrumented | 0 |
| summaryNode | instrumented | 1 |
| technicalNode | instrumented | 1 |
| dialogueNode | instrumented | 1 |
| generateJournalSections | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 44 blocking errors (NDS-003 (Code Preserved):44)
2. **Attempt 2**: 1 blocking error (NDS-003 (Code Preserved):1)
3. **Attempt 3**: function-level: 12/12 functions instrumented

## Notes
- summaryNode, technicalNode, dialogueNode, generateJournalSections are instrumented as COV-001 service entry points — all are exported async functions forming the callable boundary for callers (COV-001).
- The existing try/catch blocks in summaryNode, technicalNode, and dialogueNode are graceful-degradation catches: they return fallback values instead of throwing (NDS-007). Pattern B is used — the original try/catch is nested inside a new outer try/catch/finally that records exceptions and ends the span per COV-003. The inner catch is preserved exactly.
- getModel and resetModel are synchronous utility functions with no I/O — skipped (RST-001).
- analyzeCommitContent, hasFunctionalCode, generateImplementationGuidance, formatSessionsForAI, formatChatMessages, escapeForJson, formatContextForSummary, formatContextForUser, cleanDialogueOutput, cleanTechnicalOutput, cleanSummaryOutput are pure synchronous data transformations — skipped (RST-001).
- buildGraph and getGraph are synchronous construction/cache functions with no async I/O; getGraph is also unexported — skipped (RST-001, RST-004).
- @langchain/anthropic model.invoke() calls are covered by @traceloop/instrumentation-langchain. Manual spans on the node functions serve as the application-level orchestration layer; auto-instrumented model calls become child spans (COV-006).
- span.commit_story.journal.generate_summary, generate_technical, generate_dialogue, generate_sections — no schema spans matched these AI journal generation operations. The existing schema spans cover context collection and git operations. New span names coined following commit_story.<category>.<operation> convention.
- NODE_TEMPERATURES?.summary/technical/dialogue used in setAttribute calls per CDQ-007 advisory to guard property access. NODE_TEMPERATURES is a module-level const and will never be null in practice, but the advisory guard is applied as requested.
- result.usage_metadata and result.response_metadata are accessed with null guards — LangChain AIMessage objects may or may not populate these fields depending on provider response (CDQ-007).
- commit_story.journal.word_count was not computed for generateJournalSections because computing it from result strings requires new accumulation logic, which NDS-003 prohibits. This is a known limitation.
- SCH-001 advisory for generate_technical vs generate_summary: these are distinct operations (technical decisions extraction vs narrative summary), not semantic duplicates. Both are retained.
- Function-level fallback: 12/12 functions instrumented
-   instrumented: analyzeCommitContent (0 spans)
-   instrumented: generateImplementationGuidance (0 spans)
-   instrumented: formatSessionsForAI (0 spans)
-   instrumented: formatContextForSummary (0 spans)
-   instrumented: formatContextForUser (0 spans)
-   instrumented: cleanDialogueOutput (0 spans)
-   instrumented: cleanTechnicalOutput (0 spans)
-   instrumented: cleanSummaryOutput (0 spans)
-   instrumented: summaryNode (1 spans)
-   instrumented: technicalNode (1 spans)
-   instrumented: dialogueNode (1 spans)
-   instrumented: generateJournalSections (1 spans)

## Advisory Findings
- CDQ-007 (Attribute Data Quality):473: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
