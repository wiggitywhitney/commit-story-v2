# Instrumentation Report: src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 44.6K
- **Output tokens**: 53.7K

## Schema Extensions
- `span.commit_story.journal.generate_summary`
- `span.commit_story.journal.generate_technical`
- `span.commit_story.journal.generate_dialogue`
- `span.commit_story.journal.generate_sections`

## Validation Journey
1. **Attempt 1**: 1 blocking error (NDS-001 (Syntax Valid):1)
2. **Attempt 2**: 1 blocking error (NDS-001 (Syntax Valid):1)
3. **Attempt 3**: 0 errors

## Notes
- summaryNode, technicalNode, dialogueNode each have existing catch blocks that return fallback values without rethrowing (graceful degradation). Per NDS-007, recordException/setStatus were NOT added to these catches. The span still closes cleanly in the finally block on both the success and error paths.
- span.commit_story.journal.generate_summary: new span name invented because no schema-defined span matches summary node generation. Same for generate_technical, generate_dialogue, and generate_sections — the schema defines agent-extension spans for git operations but none for journal graph nodes.
- LangChain is used via @langchain/langgraph and @langchain/anthropic. The @traceloop/instrumentation-langchain library covers model.invoke() calls at the framework level, making those automatic child spans of the manual node spans.
- getModel and resetModel are synchronous helpers with no I/O — skipped per RST-001 (no spans on synchronous utilities). analyzeCommitContent, hasFunctionalCode, generateImplementationGuidance, formatSessionsForAI, formatChatMessages, escapeForJson, formatContextForSummary, formatContextForUser, cleanDialogueOutput, cleanTechnicalOutput, cleanSummaryOutput, buildGraph are all synchronous with no I/O — skipped per RST-001. getGraph is unexported and its execution is covered by the generateJournalSections span — skipped per RST-004.
- commit_story.context.messages_count is set in technicalNode and dialogueNode before the early-exit guard to ensure input context is present on all execution paths including the short-circuit return, satisfying COV-005 input-before-guard requirements.
- All attributes used (gen_ai.*, commit_story.ai.section_type, commit_story.context.messages_count, vcs.ref.head.revision, commit_story.commit.message, commit_story.journal.sections) are already registered in the schema — attributesCreated is 0.
- generateJournalSections: commit_story.journal.sections computation (inline array + .filter) is guarded with span.isRecording() per CDQ-006 since it involves a filter operation on a derived array.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):445: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):495: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):555: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
