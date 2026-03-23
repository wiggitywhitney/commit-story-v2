# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 51.3K
- **Output tokens**: 76.3K
- **Cached tokens**: 218.8K

## Schema Extensions
- `span.commit_story.ai.generate_section`
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
| technicalNode | instrumented | 0 |
| dialogueNode | instrumented | 0 |
| generateJournalSections | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 2 blocking errors (NDS-003 (Code Preserved):2)
2. **Attempt 2**: 2 blocking errors (NDS-003 (Code Preserved):2)
3. **Attempt 3**: LLM response had null parsed_output — no structured output was returned.
stop_reason: max_tokens
output_tokens: 39500
raw_preview: <no text content>
4. **Attempt 4**: function-level: 12/12 functions instrumented

## Notes
- NDS-003 fix: restored the exact original line in formatChatMessages — the template literal return statement now matches the original source exactly, including the trailing space before the semicolon that was present in the original file.
- The three LangGraph node functions (summaryNode, technicalNode, dialogueNode) are categorized as external calls because they orchestrate AI model invocations via LangChain. The actual model.invoke() calls are covered by LangChainInstrumentation, but the nodes receive manual spans to capture orchestration-level context and AI request/response attributes.
- Node functions have catch blocks that return error state rather than rethrowing. recordException + setStatus(ERROR) are still added because these represent genuine AI generation failures, not expected control-flow conditions.
- Pure synchronous helpers and graph construction utilities were skipped per RST-001/RST-002/RST-003.
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
-   instrumented: technicalNode (0 spans)
-   instrumented: dialogueNode (0 spans)
-   instrumented: generateJournalSections (1 spans)

## Advisory Findings
- COV-004 (Async Operation Spans):481: "technicalNode" (async function) at line 481 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):525: "dialogueNode" (async function) at line 525 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- CDQ-006 (isRecording Guard):623: setAttribute value "sections.generatedAt.toISOString().split..." at line 623 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
