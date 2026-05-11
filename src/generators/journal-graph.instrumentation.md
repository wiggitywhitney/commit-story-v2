# Instrumentation Report: src/generators/journal-graph.js

## Summary
- **Status**: partial
- **Spans added**: 3
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 72.3K
- **Output tokens**: 112.0K
- **Cached tokens**: 118.3K

## Schema Extensions
- `span.commit_story.ai.generate_summary`
- `span.commit_story.ai.generate_dialogue`
- `span.commit_story.ai.generate_journal_sections`

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
| technicalNode | skipped — Oscillation detected during fresh regeneration: Error count increased for NDS-003: 1 → 5 (at line 29, line 30, line 54, line 57, line 31) | 0 |
| dialogueNode | instrumented | 1 |
| generateJournalSections | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 1 blocking error (NDS-001 (Syntax Valid):1)
2. **Attempt 2**: 1 blocking error (NDS-001 (Syntax Valid):1)
3. **Attempt 3**: 44 blocking errors (NDS-003 (Code Preserved):44)
4. **Attempt 4**: function-level: 11/12 functions instrumented

## Notes
- summaryNode, technicalNode, and dialogueNode each have an existing catch block that returns fallback error state (e.g., '[Summary generation failed]') without rethrowing — these are graceful-degradation catches. Per NDS-007, recordException and setStatus(ERROR) were NOT added to them. The existing try/catch structure became the span wrapper's try/catch (Pattern A), with span.end() added in a new finally block. There is no path for exceptions to bypass these all-encompassing catch handlers, so no outer error-recording catch is needed.
- All 15 synchronous functions (getModel, resetModel, analyzeCommitContent, hasFunctionalCode, generateImplementationGuidance, formatSessionsForAI, formatChatMessages, escapeForJson, formatContextForSummary, formatContextForUser, cleanDialogueOutput, cleanTechnicalOutput, cleanSummaryOutput, buildGraph, getGraph) were skipped — they are synchronous with no I/O or async operations (RST-001: no spans on synchronous utilities).
- The file uses @langchain/anthropic and @langchain/langgraph. LangChain model.invoke() calls are covered by @traceloop/instrumentation-langchain. Manual spans were still added to the three node functions and generateJournalSections as service entry points that orchestrate those auto-instrumented calls, so LangChain spans become children of these manual spans.
- All four new span names (generate_summary, generate_technical_decisions, generate_dialogue, generate_sections) were invented under the commit_story.journal namespace — the schema contains no matching span definitions for these operations. They are reported as schemaExtensions.
- generateJournalSections sets vcs.ref.head.revision from context.commit.shortHash (the commit SHA, which is not PII). A context.commit != null guard is added before the setAttribute call since the context parameter shape is not guaranteed at the call site.
- Function-level fallback: 11/12 functions instrumented
-   instrumented: analyzeCommitContent (0 spans)
-   instrumented: generateImplementationGuidance (0 spans)
-   instrumented: formatSessionsForAI (0 spans)
-   instrumented: formatContextForSummary (0 spans)
-   instrumented: formatContextForUser (0 spans)
-   instrumented: cleanDialogueOutput (0 spans)
-   instrumented: cleanTechnicalOutput (0 spans)
-   instrumented: cleanSummaryOutput (0 spans)
-   instrumented: summaryNode (1 spans)
-   instrumented: dialogueNode (1 spans)
-   instrumented: generateJournalSections (1 spans)
-   skipped: technicalNode — Oscillation detected during fresh regeneration: Error count increased for NDS-003: 1 → 5 (at line 29, line 30, line 54, line 57, line 31)

## Advisory Findings
- COV-004 (Async Operation Spans):518: "technicalNode" (async function) at line 518 is exported and async but has no span. Add a span wrapping this function's body. Context propagation is not a valid exemption for exported async functions. RST-004 (unexported function) does not apply here — this function is exported. RST-001 (utility function heuristic) applies only to unexported synchronous functions. If this function is a thin wrapper delegating to another already-instrumented function, RST-003 may apply.
