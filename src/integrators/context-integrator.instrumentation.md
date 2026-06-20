# Instrumentation Report: src/integrators/context-integrator.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.2K
- **Output tokens**: 9.3K
- **Cached tokens**: 23.1K

## Schema Extensions
- `span.commit_story.context.gather_context_for_commit`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- gatherContextForCommit is the exported async entry point (COV-001) and receives a manual span named commit_story.context.gather_context_for_commit — no matching schema span name existed, so a new name was invented under the commit_story namespace and declared in schemaExtensions.
- All async sub-operations called from gatherContextForCommit (getCommitData, getPreviousCommitTime, collectChatMessages, filterMessages, groupFilteredBySession, applyTokenBudget, applySensitiveFilter) are either already instrumented in their own files or are pure synchronous transformations — no additional spans were added for these calls; context propagation makes them child spans of the entry-point span automatically.
- formatContextForPrompt is a pure synchronous function with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- getContextSummary is a pure synchronous function with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- vcs.ref.head.revision is set unconditionally at span open (before any branching) so the input commitRef is present on all execution paths including early-exit error paths.
- commit_story.context.time_window_start and commit_story.context.time_window_end are read from context.metadata.timeWindow after the context object is built, which is the earliest point where both branches (previousCommitTime present vs. absent) have resolved to a single Date value — calling .toISOString() is safe because both branches assign a Date object.
- filterStats.total maps to commit_story.filter.messages_before (count before filtering) and filterStats.preserved maps to commit_story.filter.messages_after (count after filtering), matching the registered attribute briefs precisely.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):45: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):64: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):65: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):107: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):108: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
