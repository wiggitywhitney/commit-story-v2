# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.5K
- **Output tokens**: 9.7K

## Schema Extensions
- `span.commit_story.journal.trigger_auto_summaries`
- `span.commit_story.journal.trigger_auto_weekly_summaries`
- `span.commit_story.journal.trigger_auto_monthly_summaries`
- `commit_story.summary.days_generated_count`
- `commit_story.summary.days_failed_count`
- `commit_story.summary.weeks_generated_count`
- `commit_story.summary.weeks_failed_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- triggerAutoSummaries, triggerAutoWeeklySummaries, and triggerAutoMonthlySummaries are all COV-001 entry points and get spans. Schema had matching span IDs (run_summarize, run_weekly_summarize, run_monthly_summarize) but those were already declared by earlier files in this run — new unique names were invented and declared as schema extensions.
- getErrorMessage is a pure synchronous helper with no I/O — skipped per RST-001 (no spans on synchronous pure utilities) and RST-004 (unexported internal function).
- Inner catch blocks inside the for loops in all three functions push to result.failed and do not rethrow — these are graceful-degradation catches. Per NDS-007, recordException and setStatus(ERROR) were not added to them. The outer span-level catch handles unexpected errors (e.g., from findUnsummarized* calls) and does record the exception.
- commit_story.summary.days_generated_count and commit_story.summary.days_failed_count are new extension attributes (int) for daily generated and failed counts. No registered key's semantics precisely matched 'daily summaries generated in this run' or 'daily summaries that failed in this run' — commit_story.summary.daily_summaries_count has an ambiguous 'Agent-discovered attribute' brief that does not clearly map to either concept.
- commit_story.summary.weeks_generated_count and commit_story.summary.weeks_failed_count are new extension attributes (int) for weekly generated and failed counts. No registered key matches 'weekly summaries generated in this run' or 'weekly summaries that failed' — commit_story.summary.weekly_summaries_count has the same ambiguous brief.
- commit_story.summary.months_generated_count and commit_story.summary.months_failed_count are registered attribute keys reused for monthly generated and failed counts — their names precisely match the concept and they are already in the registry.
- commit_story.summary.unsummarized_days_count, commit_story.summary.unsummarized_weeks_count, and commit_story.summary.unsummarized_months_count are all registered keys used directly — they exactly match the data being captured (count of unsummarized periods found before the loop).
- No CDQ-006 isRecording guards were needed — all setAttribute calls use direct .length property accesses on local arrays (no method calls, no transformations, no external source strings).

## Advisory Findings
- CDQ-007 (Attribute Data Quality):29: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):122: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):186: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file and instrument it properly.

The three exported async functions need spans:
1. `triggerAutoSummaries` → span name from schema: `commit_story.journal.run_summarize` is already taken. Wait, let me check the already-used spans list again...

Looking at the already-used spans:
- `commit_story.journal.run_summarize` is already taken
- `commit_story.journal.run_weekly_summarize` is already taken  
- `commit_story.journal.run_monthly_summarize` is already taken

So I need new span names for:
- `triggerAutoSummaries` → need a new name, maybe `commit_story.journal.trigger_auto_summaries`

```
