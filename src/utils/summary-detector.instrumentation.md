# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 5
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 24.7K
- **Output tokens**: 14.3K
- **Cached tokens**: 36.2K

## Schema Extensions
- `span.commit_story.journal.get_days_with_entries`
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.find_unsummarized_weeks`
- `span.commit_story.journal.find_unsummarized_months`
- `commit_story.summarize.before_date`

## Validation Journey
1. **Attempt 1**: 4 blocking errors (SCH-002 (Attribute Keys Match Registry):4)
2. **Attempt 2**: 0 errors

## Notes
- Five exported async functions (getDaysWithEntries, findUnsummarizedDays, getDaysWithDailySummaries, findUnsummarizedWeeks, findUnsummarizedMonths) received spans as entry points; no schema span matched these directory-scanning operations, so new commit_story.journal.* names were declared.
- The unexported async helpers getSummarizedDays, getSummarizedWeeks, getSummarizedMonths and getWeeksWithWeeklySummaries each do a single readdir and are only called from the exported find* functions, which now have spans; they were left unspanned so their work is attributed to the parent span (RST-004: prefer instrumenting the exported orchestrator over unexported helpers). Span-to-function ratio is 5/11.
- getTodayString and getNowDate are synchronous date helpers with no I/O and were skipped (RST-001).
- Inner readdir catch blocks that return [] or continue are graceful handling of missing directories, so no error recording was added there (NDS-007).
- Per validator feedback, the counts of unsummarized weeks and months returned by findUnsummarizedWeeks/findUnsummarizedMonths use the registered commit_story.summarize.dates_count key (count of periods pending summarization) instead of new weeks_count/months_count extensions.
- commit_story.summarize.before_date (string) captures the optional exclusive cutoff date passed to findUnsummarizedDays; no registered key describes a cutoff date.
- Length attributes are guarded with != null checks to satisfy null-safety advisories.

## Advisory Findings
- COV-004 (Async Operation Spans):113: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):183: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):302: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):327: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

## Agent Thinking

### Attempt 1

```
I'm weighing whether to instrument the unexported helper functions versus just the exported entry points. Since RST-004 says to skip unexported functions when an exported orchestrator already spans them, I'll leave helpers like getSummarizedDays out and focus instrumentation on the 5 exported functions instead.

Now I'm naming the spans and attributes for each journal function—get_days_with_entries, find_unsummarized_days, get_days_with_daily_summaries, find_unsummarized_weeks, find_unsummarized_months—and figuring out appropriate attribute names like entries_count and dates_count to capture the counts each function returns.

For functions returning a filtered call expression directly, I'll capture the result in a variable first, then set the count attribute before returning. For functions returning a plain identifier, I can just insert the attribute line right before the return statement. The inner catches and entry points look fine as-is, so I'll leave those untouched.


```

### Attempt 2

```
I should fix this by using commit_story.summarize.dates_count for weeks/months rather than the week/month string fields, since the validator requires consistent meaning for the same key. I'll also consider adding spans to the helpers to satisfy the advisory check, even though it's optional.

Since RST-004 is currently passing, adding spans might actually break it, so I'll leave that alone and just add notes instead. For the CDQ-007 guards, I'll add cheap null checks wrapping the relevant values.


```
