# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 66.8K
- **Output tokens**: 64.9K
- **Cached tokens**: 268.4K

## Schema Extensions
- `span.commit_story.ai.generate_summary`
- `span.commit_story.ai.generate_technical_decisions`
- `span.commit_story.journal.generate_dialogue`
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
1. **Attempt 1**: 6 blocking errors (NDS-003 (Code Preserved):6)
2. **Attempt 2**: 2 blocking errors (NDS-003 (Code Preserved):2)
3. **Attempt 3**: 5 blocking errors (NDS-003 (Code Preserved):5)
4. **Attempt 4**: function-level: 12/12 functions instrumented

## Notes
- The catch blocks in summaryNode, technicalNode, and dialogueNode are graceful fallback paths (they return error-state objects instead of rethrowing), so recordException/setStatus were NOT added per the expected-condition catch rule. These catches represent deliberate resilience, not unhandled failures.
- The node functions (summaryNode, technicalNode, dialogueNode) are all exported via the bottom export block and make LLM API calls, so COV-004 requires instrumenting all three consistently. Each receives commit_story.ai.section_type to distinguish them in traces.
- generateJournalSections uses return-value capture (const sections = {...}) to allow setting commit_story.journal.sections and commit_story.journal.word_count from the assembled result object. This is the only permitted non-instrumentation code change.
- All four new span names are schema extensions because no matching span IDs existed in the registry. They follow the commit_story.journal.* namespace to match the journal attribute group and describe the LangGraph node operations.
- LangChainInstrumentation is reported as a library need because @langchain/langgraph and @langchain/anthropic are both LangChain ecosystem imports. The auto-instrumentation will cover individual model.invoke() calls as child spans; the manual spans here provide application-level orchestration visibility.
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
