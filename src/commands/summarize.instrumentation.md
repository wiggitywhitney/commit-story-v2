# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.6K
- **Output tokens**: 8.5K

## Schema Extensions
- `span.commit_story.summarize.run_daily`
- `span.commit_story.summarize.run_weekly`
- `span.commit_story.summarize.run_monthly`
- `commit_story.summarize.input_count`
- `commit_story.summarize.force`
- `commit_story.summarize.generated_count`
- `commit_story.summarize.failed_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- isValidDate, isValidWeekString, isValidMonthString, expandDateRange, and parseSummarizeArgs are all pure synchronous functions with no I/O — they receive no spans (RST-001: no spans on synchronous utilities regardless of export status).
- showSummarizeHelp is a synchronous function that only calls console.log — no async I/O, no span needed (RST-001).
- The inner try/catch around `access(summaryPath)` in runSummarize catches a file-not-found condition as expected control flow (the file not existing is the normal case for generating a new summary). No recordException or setStatus is added to that catch block — it is an expected-condition catch, not an error path.
- Four new attribute keys were created under the commit_story.summarize.* namespace: commit_story.summarize.input_count (number of dates/weeks/months requested), commit_story.summarize.force (whether --force was passed), commit_story.summarize.generated_count (how many were successfully generated), and commit_story.summarize.failed_count (how many failed with exceptions). No existing schema attribute was a semantic match — the schema's journal.*, filter.*, and context.* attributes describe different domains.
- The outer try/catch added around each function body wraps only unexpected errors that escape the inner per-item catch blocks (e.g., an error in result object initialization or the for-of loop itself). The per-item catches remain unchanged and do not call recordException since they handle individual item failures as expected operational conditions that are accumulated into result.failed.

## Advisory Findings
- SCH-004 (No Redundant Schema Entries):260: Attribute key "commit_story.summarize.generated_count" at line 260 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use registered attribute 'commit_story.context.messages_count' instead, as both measure generated/counted discrete items within the commit_story domain. If 'generated_count' specifically measures AI-generated summaries rather than context messages, consider renaming to 'commit_story.summarize.summaries_count' for semantic clarity, or map it to an existing OpenTelemetry semantic convention if it represents a standard metric like token usage.
