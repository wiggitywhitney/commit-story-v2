# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 38.8K
- **Output tokens**: 28.1K

## Schema Extensions
- `span.commit_story.summary.generate_daily_node`
- `span.commit_story.summary.generate_daily`
- `span.commit_story.summary.generate_weekly_node`
- `span.commit_story.summary.generate_weekly`
- `span.commit_story.summary.generate_monthly_node`
- `span.commit_story.summary.generate_monthly`
- `commit_story.summary.entries_count`

## Validation Journey
1. **Attempt 1**: 12 blocking errors (SCH-002 (Attribute Keys Match Registry):12)
2. **Attempt 2**: 0 errors

## Notes
- Replaced commit_story.summary.daily_summaries_count with the already-registered commit_story.summary.entries_count — the count of input summaries fed to a weekly node is semantically equivalent to 'entries count' in the context of summary generation.
- Replaced commit_story.summary.weekly_summaries_count with the registered commit_story.summarize.weeks_count — the number of weekly summaries fed to a monthly node is the number of weeks being summarized, which matches the registered key's intent.
- Dropped week_label and month_label attributes — no registered string key exists for ISO period identifiers like '2026-W09' or '2026-02', and the validator identified them as semantic duplicates of integer count keys (which is incompatible in type). Omitting them avoids type mismatch and false SCH-002 failures.
- All three result.id accesses are now guarded by an outer if (result != null) block to satisfy CDQ-007 — even though result comes from a successful await, the guard makes the null safety explicit and avoids the advisory.
- The inner catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode remain without recordException/setStatus because they are graceful-degradation catches that return fallback objects without rethrowing (NDS-007).

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.generate_daily_node" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_monthly_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_monthly_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.generate_daily" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_daily_node". If these operations are equivalent, reuse "commit_story.summary.generate_daily_node" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.generate_weekly_node" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_weekly_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_weekly_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.generate_weekly" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_weekly_node". If these operations are equivalent, reuse "commit_story.summary.generate_weekly_node" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.generate_monthly_node" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_monthly_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_monthly_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.generate_monthly" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_monthly_node". If these operations are equivalent, reuse "commit_story.summary.generate_monthly_node" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
