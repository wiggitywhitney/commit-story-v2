# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 33.4K
- **Output tokens**: 24.0K

## Schema Extensions
- `span.commit_story.journal.daily_summary_node`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.weekly_summary_node`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.journal.monthly_summary_node`
- `span.commit_story.journal.generate_monthly_summary`
- `commit_story.summary.entries_count`
- `commit_story.summary.week_label`
- `commit_story.summary.weekly_summaries_count`
- `commit_story.summary.month_label`

## Validation Journey
1. **Attempt 1**: 3 blocking errors (SCH-002 (Attribute Keys Match Registry):3)
2. **Attempt 2**: 0 errors

## Notes
- commit_story.summary.daily_summaries_count was replaced with commit_story.summary.entries_count per SCH-002 validation — the validator determined these are semantically equivalent (both count the number of input items passed to a summary node). The same key is now reused for daily entries, daily summaries, and weekly summaries counts across all three summary tiers.
- commit_story.summary.entries_count (int): number of input items (journal entries or daily summaries) passed to a summary generation node. No registered key matches this concept — commit_story.context.messages_count describes Claude Code session messages, not journal summary inputs.
- commit_story.summary.week_label (string): ISO week identifier used as the period label for weekly summaries, e.g., 2026-W09. No registered key fits — commit_story.journal.entry_date is a single YYYY-MM-DD date, not a week range label.
- commit_story.summary.weekly_summaries_count (int): number of weekly summary objects passed to the monthly summary node. Kept distinct from entries_count because the validator accepted this as a separate concept at a different aggregation tier (monthly vs daily/weekly).
- commit_story.summary.month_label (string): month period label for the monthly summary graph, e.g., 2026-02. No registered key captures month-level period identifiers.
- dailySummaryNode, weeklySummaryNode, and monthlySummaryNode each have an inner try/catch that returns a graceful fallback without rethrowing. Per NDS-007, no recordException or setStatus(ERROR) was added to those inner catches. The outer span-level catch (required by COV-003) acts as a safety net for any unexpected throws outside the inner try.
- SCH-001 advisories noted: the new span names for daily/weekly/monthly node and generate functions are distinct operation classes from each other and from the existing commit_story.journal.summary_node (which handles per-commit journal generation). They are not equivalent and warrant separate span names.
- LangChain instrumentation (@traceloop/instrumentation-langchain) covers the ChatAnthropic model.invoke() calls inside the Node functions. Manual spans on the exported orchestrating functions remain as COV-001 entry points.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
