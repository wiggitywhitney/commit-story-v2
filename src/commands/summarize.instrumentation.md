# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.6K
- **Output tokens**: 8.3K

## Schema Extensions
- `span.commit_story.summarize.run_daily`
- `span.commit_story.summarize.run_weekly`
- `span.commit_story.summarize.run_monthly`
- `commit_story.summarize.dates_count`
- `commit_story.summarize.weeks_count`
- `commit_story.summarize.months_count`
- `commit_story.summarize.force`
- `commit_story.summarize.generated_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- No schema span matched runSummarize, runWeeklySummarize, or runMonthlySummarize — invented names under commit_story.summarize.* namespace following the project prefix convention.
- The inner catch blocks inside the per-date/week/month loops (which push to result.failed and do NOT re-throw) are expected-condition catches representing graceful per-item failure handling. recordException/setStatus were NOT added there to avoid false error signals on the outer span — only a truly unhandled top-level failure triggers span ERROR status.
- The empty catch block for access(summaryPath) is an ENOENT-style expected-condition catch (file not found means proceed with generation) — no recordException/setStatus added per the expected-condition catch rule.
- isValidDate, isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs, and showSummarizeHelp were all skipped: they are synchronous pure functions (validators, parsers, formatters) with no I/O or async operations — RST-001 applies.
- New custom attributes commit_story.summarize.dates_count, weeks_count, months_count, force, and generated_count were created because no registered schema key captures input item counts for summarize operations or boolean force flags. commit_story.context.sessions_count/messages_count are semantically about context collection, not summary command invocation parameters.

## Advisory Findings
- SCH-004 (No Redundant Schema Entries):193: Attribute key "commit_story.summarize.dates_count" at line 193 appears to be a semantic duplicate of an existing registry entry (judge confidence: 85%). This appears to be a semantic duplicate of an existing registered key. The attribute 'commit_story.summarize.dates_count' measures a count within the summarization domain of commit_story. However, examining the registry, there is no direct semantic match. The key is semantically distinct because it captures a unique concept: the count of dates identified/extracted during the summarization process. Unlike 'commit_story.journal.quotes_count' (quotes in journal entries) or 'commit_story.journal.word_count' (word count in journal), this key measures dates specifically within summarization output. Since it represents a novel summarization-specific metric not covered by existing keys, it should be registered as a new semantic convention attribute following the pattern: 'commit_story.summarize.dates_count'. If you must map to existing keys, there is no semantically equivalent registered attribute; do not force a mapping.
