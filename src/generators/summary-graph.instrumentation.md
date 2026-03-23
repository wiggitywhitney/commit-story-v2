# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 6.4K
- **Output tokens**: 14.9K
- **Cached tokens**: 17.1K

## Schema Extensions
- `span.commit_story.summary.daily_node`
- `span.commit_story.summary.generate_daily`
- `span.commit_story.summary.weekly_node`
- `span.commit_story.summary.generate_weekly`
- `span.commit_story.summary.monthly_node`
- `span.commit_story.summary.generate_monthly`
- `commit_story.summary.week_label`
- `commit_story.summary.month_label`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- The inner catch blocks inside dailySummaryNode, weeklySummaryNode, and monthlySummaryNode are expected-condition catches (they return degraded state rather than throwing), so recordException/setStatus were NOT added to those catches. The outer try/catch/finally in the span wrapper handles any unexpected errors that escape.
- LangChain is imported via @langchain/langgraph and @langchain/anthropic — @traceloop/instrumentation-langchain will auto-instrument the model.invoke() calls as child spans. Manual spans are still added to the node and generate functions to capture application-level orchestration context.
- commit_story.summary.week_label and commit_story.summary.month_label are new schema extensions. No existing registered key semantically matches a week identifier (e.g. '2026-W09') or month identifier (e.g. '2026-02'). commit_story.journal.entry_date is specifically for YYYY-MM-DD day-level dates and would be semantically incorrect for week/month period labels.
- The node functions (dailySummaryNode, weeklySummaryNode, monthlySummaryNode) are instrumented in addition to the generate* entry points because they are exported async functions that make LLM calls and represent distinct units of LangGraph execution. This provides visibility into the graph node execution separate from the overall generate operation.
- 6 of 23 functions (26%) received spans, just above the 20% backstop. However, the uninstrumented functions are either pure synchronous transformations (formatEntriesForSummary, cleanDailySummaryOutput, etc.), unexported helpers (parseSummarySections, buildGraph, etc.), or trivial utilities (getModel, resetModel). The 6 instrumented functions are all meaningful async operations.
