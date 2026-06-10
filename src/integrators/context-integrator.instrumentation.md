# Instrumentation Report: src/integrators/context-integrator.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.3K
- **Output tokens**: 10.4K
- **Cached tokens**: 24.1K

## Schema Extensions
- `span.commit_story.context.gather_context_for_commit`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- gatherContextForCommit is the sole COV-001 entry point — an exported async orchestrator that coordinates git data collection, chat message collection, filtering, and token budgeting. Instrumented with a new span (span.commit_story.context.gather_context_for_commit) since no schema-defined span exists for this orchestration function. All registered schema attributes that semantically match the data available at each step were applied: vcs.ref.head.revision at span open, filter counts after the filterMessages call, context counts after session grouping, and time window ISO strings after the context object is assembled.
- formatContextForPrompt is a pure synchronous string-building function with no I/O — skipped (RST-001: no spans on synchronous utilities without I/O).
- getContextSummary is a pure synchronous data extraction function with no I/O — skipped (RST-001: no spans on synchronous utilities without I/O).
- All async sub-operations called from gatherContextForCommit (getCommitData, getPreviousCommitTime, collectChatMessages, filterMessages, groupFilteredBySession, applyTokenBudget, applySensitiveFilter) are either already instrumented in their own files or are synchronous helpers. No duplicate spans were added for these calls.
- New span name commit_story.context.gather_context_for_commit declared in schemaExtensions — no existing schema span matches this top-level context orchestration entry point. The existing schema span commit_story.context.collect_chat_messages covers only the Claude chat collection sub-operation, not the full context gathering workflow.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):61: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):62: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):67: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):68: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
