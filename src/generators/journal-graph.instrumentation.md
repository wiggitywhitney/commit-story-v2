# Instrumentation Report: src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 7.1K
- **Output tokens**: 30.3K
- **Cached tokens**: 20.2K

## Schema Extensions
- `span.commit_story.journal.generate_summary`
- `span.commit_story.journal.generate_technical`
- `span.commit_story.journal.generate_dialogue`
- `span.commit_story.journal.generate_sections`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- The catch blocks in summaryNode, technicalNode, and dialogueNode all return fallback values (e.g., '[Summary generation failed]') rather than rethrowing — these are graceful-degradation catches. Per NDS-007, no recordException or setStatus(ERROR) was added to them. Only generateJournalSections has an error-propagating catch and receives full error recording.
- All four invented span names use the commit_story.journal category since no matching schema-defined spans exist for these journal generation operations. The schema spans are for context collection, git operations, and summarize CLI commands — none cover LangGraph node execution.
- The LangChain @traceloop/instrumentation-langchain library will auto-instrument the ChatAnthropic model.invoke() calls inside each node, making those AI calls child spans of the manual orchestration spans. No manual wrapping of the invoke() calls was added.
- Thirteen synchronous helper functions (formatContextForSummary, formatContextForUser, cleanDialogueOutput, cleanTechnicalOutput, cleanSummaryOutput, formatSessionsForAI, formatChatMessages, escapeForJson, analyzeCommitContent, hasFunctionalCode, generateImplementationGuidance, buildGraph, getModel, resetModel) were skipped — they perform no async I/O and are pure data transformations (RST-001). getGraph was also skipped as an unexported synchronous accessor (RST-001, RST-004).
- gen_ai.request.model is set to the hardcoded string 'claude-haiku-4-5-20251001' matching the value passed to the ChatAnthropic constructor in getModel — this is the only model the application configures and is safe to set as a literal on the orchestration span.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):447: CDQ-007: setAttribute value "NODE_TEMPERATURES.summary" at line 447 accesses a property of "NODE_TEMPERATURES" without a null/undefined guard. If "NODE_TEMPERATURES" can be null or undefined, this will throw at runtime. Add an `if (NODE_TEMPERATURES)` check or use optional chaining (`NODE_TEMPERATURES?.summary`).
- CDQ-007 (Attribute Data Quality):491: CDQ-007: setAttribute value "NODE_TEMPERATURES.technical" at line 491 accesses a property of "NODE_TEMPERATURES" without a null/undefined guard. If "NODE_TEMPERATURES" can be null or undefined, this will throw at runtime. Add an `if (NODE_TEMPERATURES)` check or use optional chaining (`NODE_TEMPERATURES?.technical`).
- CDQ-007 (Attribute Data Quality):544: CDQ-007: setAttribute value "NODE_TEMPERATURES.dialogue" at line 544 accesses a property of "NODE_TEMPERATURES" without a null/undefined guard. If "NODE_TEMPERATURES" can be null or undefined, this will throw at runtime. Add an `if (NODE_TEMPERATURES)` check or use optional chaining (`NODE_TEMPERATURES?.dialogue`).
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.generate_summary" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.generate_dialogue" may be a semantic duplicate of existing registry operation "commit_story.journal.generate_summary". If these operations are equivalent, reuse "commit_story.journal.generate_summary" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
