# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.5K
- **Output tokens**: 16.9K

## Schema Extensions
- `span.commit_story.journal.get_days_with_entries`
- `span.commit_story.journal.get_summarized_days`
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.get_summarized_weeks`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.find_unsummarized_weeks`
- `span.commit_story.journal.get_summarized_months`
- `span.commit_story.journal.get_weeks_with_weekly_summaries`
- `span.commit_story.journal.find_unsummarized_months`
- `commit_story.summary.unsummarized_days_count`
- `commit_story.summary.unsummarized_weeks_count`
- `commit_story.summary.summarized_months_count`
- `commit_story.summary.unsummarized_months_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getTodayString and getNowDate are pure synchronous helpers with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- The schema defines span names commit_story.journal.read_day_entries, commit_story.journal.read_week_daily_summaries, and commit_story.journal.read_month_weekly_summaries, but all three are already in use by earlier files in this run. Invented unique names (get_days_with_entries, get_days_with_daily_summaries, get_weeks_with_weekly_summaries) to avoid collision.
- commit_story.summary.unsummarized_days_count (int): count of days that have journal entries but no daily summary, returned by findUnsummarizedDays. No registered key captures this concept — commit_story.summary.daily_summaries_count counts existing summaries, not the gap.
- commit_story.summary.unsummarized_weeks_count (int): count of ISO weeks that have daily summaries but no weekly summary, returned by findUnsummarizedWeeks. No registered key captures this concept — commit_story.summary.weekly_summaries_count counts existing weekly summaries, not the gap.
- commit_story.summary.summarized_months_count (int): count of months that already have a monthly summary file, returned by getSummarizedMonths. The registered commit_story.summary.months_generated_count describes months generated in a single pipeline run, not the total found on disk; the registered commit_story.summary.monthly_summaries_count does not exist. This key captures the distinct concept of discovered existing monthly summaries.
- commit_story.summary.unsummarized_months_count (int): count of months that have weekly summaries but no monthly summary, returned by findUnsummarizedMonths. No registered key captures this gap concept.
- Inner catch blocks in all functions return empty collections without rethrowing — these are graceful file-not-found degradation paths. Per NDS-007, no recordException or setStatus(ERROR) was added to them. The outer span catch handles unexpected errors.
- For findUnsummarizedDays, the input count from getDaysWithEntries is captured via span.setAttribute immediately after the await and before the early-return guard, ensuring the span carries context on the short-circuit path (COV-005 input attribute before early return).
- For findUnsummarizedWeeks and findUnsummarizedMonths, the count of upstream summaries found (daily and weekly respectively) is set immediately after the await and before the early-return guard for the same reason.
- getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries are unexported async functions. They are instrumented per COV-004 because they perform async filesystem I/O and are not fully covered by the exported orchestrator spans — each has independent diagnostic value (their own readdir calls and result sets).

## Advisory Findings
- CDQ-007 (Attribute Data Quality):95: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):132: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):155: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):207: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):245: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):268: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):371: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):394: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze the file and instrument it according to the schema and rules.

Functions to instrument:
1. `getDaysWithEntries` (line 57) - COV-001 entry point
2. `getSummarizedDays` (line 97) - COV-004 async
3. `findUnsummarizedDays` (line 124) - COV-001 entry point
4. `getSummarizedWeeks` (line 147) - COV-004 async
5. `getDaysWithDailySummaries` (line 172) - COV-001 entry point
6. `findUnsummarizedWeeks` (line 200) - COV-001 entry point

```
