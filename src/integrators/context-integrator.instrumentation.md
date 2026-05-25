# Instrumentation Report: src/integrators/context-integrator.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.2K
- **Output tokens**: 12.3K
- **Cached tokens**: 22.1K

## Schema Extensions
- `span.commit_story.context.gather_context_for_commit`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- formatContextForPrompt is a pure synchronous function that assembles string sections from an already-built context object — no I/O, no async operations. Skipped per RST-001 (no spans on synchronous data transformations).
- getContextSummary is a pure synchronous function that reshapes a context object into a summary record — no I/O, no async operations. Skipped per RST-001.
- The outbound calls to getCommitData, getPreviousCommitTime, and collectChatMessages are already instrumented in their respective collector modules (git-collector.js, claude-collector.js) and produce their own child spans. No duplicate spans were added for those calls.
- The outbound calls to filterMessages, groupFilteredBySession, applyTokenBudget, and applySensitiveFilter are synchronous or internal filter operations — their instrumentation is handled in the filter modules. No duplicate spans added here.
- span.commit_story.context.gather_context_for_commit is a new span name not present in the schema registry. No existing schema span matched this orchestration entry point — the existing context spans cover sub-operations (collect_chat_messages, get_previous_commit_time) but not the top-level coordinator that sequences all collectors and filters. Declared as a schema extension.
- All seven attributes set on gatherContextForCommit use registered keys from the schema: vcs.ref.head.revision (input commitRef), commit_story.filter.messages_before / commit_story.filter.messages_after (noise-removal filter counts), commit_story.context.messages_count / commit_story.context.sessions_count (post-filter chat data), and commit_story.context.time_window_start / commit_story.context.time_window_end (the chat collection window). No new attribute keys were invented.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):60: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):61: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):66: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):67: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
