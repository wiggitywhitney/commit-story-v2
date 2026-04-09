# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 33.7K
- **Output tokens**: 28.0K
- **Cached tokens**: 17.3K

## Schema Extensions
- `span.commit_story.summarize.generate_daily`
- `span.commit_story.summarize.generate_weekly`
- `span.commit_story.summarize.generate_monthly`
- `span.commit_story.summarize.daily_node`
- `span.commit_story.summarize.weekly_node`
- `span.commit_story.summarize.monthly_node`
- `commit_story.summarize.week_label`
- `commit_story.summarize.month_label`

## Validation Journey
1. **Attempt 1**: 3 blocking errors (NDS-003 (Code Preserved):3)
2. **Attempt 2**: 0 errors

## Notes
- The inner catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode are expected-condition catches (graceful degradation — they return a fallback result rather than rethrowing). Per the error-handling rules, recordException and setStatus are NOT added to these catches. The outer try/finally ensures span.end() is always called regardless.
- commit_story.summarize.week_label is a new schema extension because no existing registered attribute captures an ISO week identifier string (e.g., '2026-W09'). commit_story.summarize.weeks_count is a numeric count, not a label string — semantically distinct.
- commit_story.summarize.month_label is a new schema extension because no existing registered attribute captures a month identifier string (e.g., '2026-02'). commit_story.summarize.months_count is a numeric count; the SCH-004 advisory notes 72% confidence overlap but the two attributes are intentionally different types (string label vs integer count).
- The if-guards around entries.length, dailySummaries.length, and weeklySummaries.length were removed. The JSDoc types these parameters as arrays, so .length is always defined from the contract perspective. Calling code passing null/undefined is a programming error, not a case to guard against in instrumentation.
- LangChainInstrumentation from @traceloop/instrumentation-langchain is reported because the file imports from @langchain/langgraph and @langchain/anthropic (@langchain/* allowlist). It covers ChatAnthropic model.invoke() calls as child spans inside the manual spans added here.

## Advisory Findings
- SCH-004 (No Redundant Schema Entries):472: Attribute key "commit_story.summarize.week_label" at line 472 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Replace 'commit_story.summarize.week_label' with 'commit_story.summarize.weeks_count'. The novel key appears to be a label/identifier for weeks in the summarization context, but the registry already captures the week dimension via 'commit_story.summarize.weeks_count'. If you need to preserve a week label/identifier distinct from the count, consider renaming to 'commit_story.summarize.week_identifier' or 'commit_story.summarize.selected_week' to avoid semantic overlap with the existing weeks_count attribute.
- SCH-004 (No Redundant Schema Entries):692: Attribute key "commit_story.summarize.month_label" at line 692 appears to be a semantic duplicate of an existing registry entry (judge confidence: 78%). Replace 'commit_story.summarize.month_label' with 'commit_story.summarize.months_count'. The novel key appears to be labeling or categorizing months, which is a derived representation of month counting. The registered key 'commit_story.summarize.months_count' captures the same semantic concept (month-related aggregation in summarization) within the same domain. Using the count-based key maintains consistency with the parallel structure of 'commit_story.summarize.dates_count' and 'commit_story.summarize.weeks_count'.
