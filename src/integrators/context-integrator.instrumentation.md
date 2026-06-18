# Instrumentation Report: src/integrators/context-integrator.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.4K
- **Output tokens**: 9.3K
- **Cached tokens**: 24.3K

## Schema Extensions
- `span.commit_story.context.gather_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- gatherContextForCommit is the COV-001 entry point orchestrating all context collection. It receives a span named 'commit_story.context.gather_context' — no schema span existed for this orchestrating role (the schema spans for context cover the sub-operations like collect_messages, which are already instrumented in their respective callee files).
- formatContextForPrompt is a pure synchronous data transformation (no I/O, no async) — skipped per RST-001.
- getContextSummary is a pure synchronous data transformation returning a summary object — skipped per RST-001.
- All six attributes set on the gather_context span (vcs.ref.head.revision, commit_story.commit.message, commit_story.filter.messages_before, commit_story.filter.messages_after, commit_story.context.sessions_count, commit_story.context.messages_count) are already registered in the schema — no new attribute keys were declared.
- commit_story.commit.message is set from commitData.message (a git commit subject line from an external source). CDQ-006 isRecording() guards do not apply to COV-001 entry point spans per the exemption rule.
- vcs.ref.head.revision is set before any awaited calls so it is present even if an early error occurs in getCommitData.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):63: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):64: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):65: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):66: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):67: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
