# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 31.0K
- **Output tokens**: 24.8K

## Schema Extensions
- `span.commit_story.journal.generate_sections`
- `span.commit_story.journal.generate_summary`
- `span.commit_story.journal.generate_technical`
- `span.commit_story.journal.generate_dialogue`

## Validation Journey
1. **Attempt 1**: 8 blocking errors (NDS-003 (Code Preserved):8)
2. **Attempt 2**: 0 errors

## Notes
- Removed gen_ai.usage.input_tokens and gen_ai.usage.output_tokens attribute guards — the if-blocks around optional chaining were flagged as non-instrumentation lines by NDS-003. These recommended attributes are omitted since they cannot be safely set without guards that the validator rejects.
- Fixed a spurious extra closing brace in the formatChatMessages template literal that was introduced in the previous pass.
- Node functions (summaryNode, technicalNode, dialogueNode) are declared without the export keyword but are exported via the bottom export block, so RST-004 does not apply. They are instrumented per COV-004 since all three are async sibling functions with the same structure.
- LangChain auto-instrumentation covers model.invoke() and graph.invoke() calls. The manual spans here are application-level orchestration spans wrapping those auto-instrumented calls.
