# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.6K
- **Output tokens**: 8.5K

## Schema Extensions
- `span.commit_story.summarize.run_summarize`
- `span.commit_story.summarize.run_weekly_summarize`
- `span.commit_story.summarize.run_monthly_summarize`
- `commit_story.summarize.dates_count`
- `commit_story.summarize.weeks_count`
- `commit_story.summarize.months_count`
- `commit_story.summarize.force`
- `commit_story.summarize.generated_count`
- `commit_story.summarize.failed_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- Skipped isValidDate (unexported, pure sync), isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs (all exported but pure synchronous with no I/O), and showSummarizeHelp (sync, side-effect-only console call) per RST-001/RST-004.
- The per-date/week/month catch blocks inside the loops are expected-condition catches — they accumulate failures into the result without rethrowing. These do NOT get recordException/setStatus added per the expected-condition exception rule; the outer span-level catch handles unexpected throws.
- The empty catch block around `access(summaryPath)` is a control-flow catch (file-not-found detection) and was left untouched.
- New attributes commit_story.summarize.dates_count, weeks_count, months_count, force, generated_count, and failed_count were created because no registered key semantically matches operation-level batch counts or the force-regeneration flag on summarize commands. commit_story.journal.entry_date covers a single date value, not a batch size; commit_story.journal.word_count/sections cover output characteristics, not batch orchestration state.
- generated_count and failed_count reuse the same attribute keys across all three span types (runSummarize, runWeeklySummarize, runMonthlySummarize) since the semantic meaning is identical — counts are set as result attributes after the loop completes.

## Advisory Findings
- SCH-004 (No Redundant Schema Entries):193: Attribute key "commit_story.summarize.force" at line 193 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use 'gen_ai.request.max_tokens' instead. The attribute 'commit_story.summarize.force' appears to control token limits or constraints for the summarization operation, which semantically aligns with the GenAI semantic convention for maximum token request parameters. While it is in the commit_story domain, it measures the same concept (token constraint for generation) as gen_ai.request.max_tokens.
- SCH-004 (No Redundant Schema Entries):260: Attribute key "commit_story.summarize.failed_count" at line 260 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Consider using a registered attribute key that better represents the failure concept. If tracking AI operation failures, use 'gen_ai.operation.name' combined with appropriate status/error attributes. If this is application-domain tracking of summarization failures within commit_story, consider standardizing to a pattern like 'commit_story.summarize.error_count' or 'commit_story.summarize.failures' that aligns with existing commit_story naming conventions (e.g., 'commit_story.journal.quotes_count', 'commit_story.context.messages_count'). Alternatively, if this tracks usage metrics, align with the 'gen_ai.usage.*' pattern.
- SCH-004 (No Redundant Schema Entries):350: Attribute key "commit_story.summarize.months_count" at line 350 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use 'commit_story.context.time_window_start' and 'commit_story.context.time_window_end' to represent the months_count concept, or add a more specific attribute like 'commit_story.summarize.time_window_months' if a distinct months duration metric is required.
