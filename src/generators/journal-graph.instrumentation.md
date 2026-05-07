# Instrumentation Report: src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 64.9K
- **Output tokens**: 64.9K
- **Cached tokens**: 257.1K

## Schema Extensions
- `span.commit_story.ai.generate_summary`
- `span.commit_story.journal.technical_node`
- `span.commit_story.journal.dialogue_node`
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
1. **Attempt 1**: 7 blocking errors (NDS-003 (Code Preserved):7)
2. **Attempt 2**: 1 blocking error (NDS-001 (Syntax Valid):1)
3. **Attempt 3**: 5 blocking errors (NDS-003 (Code Preserved):5)
4. **Attempt 4**: function-level: 12/12 functions instrumented

## Notes
- summaryNode, technicalNode, and dialogueNode are exported async functions that make LLM calls (external calls, highest priority). Even though they're internal LangGraph nodes, they're exported for testing and each performs a distinct AI generation step — all three receive spans (COV-002, COV-004).
- The node function catch blocks return error objects rather than rethrowing — this is intentional LangGraph node design (nodes must not throw). span.recordException and span.setStatus(ERROR) are still added because the error is a genuine failure, not expected control flow.
- gen_ai.response.model is guarded with a local const for result.response_metadata?.model_name to avoid passing undefined to setAttribute (optional chaining result may be undefined).
- getModel and resetModel are skipped: getModel is a synchronous cache getter (RST-002, RST-003) and resetModel is a trivial one-liner (RST-002). All formatting and cleaning helpers are pure synchronous utilities with no I/O (RST-001). buildGraph and getGraph are unexported synchronous helpers (RST-004).
- Four new span names were invented because no schema-defined span matched these operations. All use the commit_story namespace prefix: commit_story.journal.generate_sections (orchestrates the full graph run), commit_story.journal.summary_node (summary AI generation step), commit_story.journal.technical_node (technical decisions AI step), commit_story.journal.dialogue_node (dialogue extraction AI step).
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
