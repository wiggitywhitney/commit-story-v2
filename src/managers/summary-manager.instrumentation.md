# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.5K
- **Output tokens**: 17.6K

## Schema Extensions
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.save_daily`
- `span.commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.read_week_daily_summaries`
- `span.commit_story.summary.save_weekly`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.read_month_weekly_summaries`
- `span.commit_story.summary.save_monthly`
- `span.commit_story.summary.generate_and_save_monthly`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- All 9 async exported functions were instrumented for consistency (COV-004). This is above the 20% ratio backstop for total functions (9/13 = 69%), but the file consists entirely of async I/O pipeline functions — the 4 uninstrumented functions are sync pure formatters/computations (RST-001) that cannot receive spans. Instrumenting all async exports is appropriate given their diagnostic value.
- All inner catch blocks handling file-not-found conditions (access(), readFile(), readdir()) are expected-condition catches representing normal control flow (e.g., DD-003 duplicate detection, missing optional files). These were left without recordException/setStatus to avoid false-positive error signals.
- The commit_story.summary.entries_count attribute was used across all read/generate functions to capture the count of items loaded (daily entries, daily summaries, weekly summaries). This is a semantic fit: the schema defines it as 'entries_count' for the summary domain, covering all variants of input item counts.
- The 9 new span names are all schema extensions because the schema's generate_daily/generate_weekly/generate_monthly spans were already claimed by summary-graph.js (the LangGraph generator layer). This file represents the manager/orchestration layer sitting above those generators, requiring distinct span names to differentiate the two layers in traces.
- options.force is typed as optional boolean in function signatures; || false ensures the setAttribute call always receives a boolean value rather than undefined, matching the schema's boolean type constraint for commit_story.summarize.force.

## Advisory Findings
- CDQ-006 (isRecording Guard):33: setAttribute value "getDateString(date)" at line 33 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
