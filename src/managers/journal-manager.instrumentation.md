# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.3K
- **Output tokens**: 7.7K

## Schema Extensions
- `span.commit_story.journal.save_entry`
- `span.commit_story.journal.discover_reflections`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveJournalEntry and discoverReflections are the only two functions instrumented. All other functions are either unexported (RST-004) or pure synchronous transformations with no I/O (RST-001).
- The inner try/catch in saveJournalEntry (checking for duplicate entries) has an empty catch block representing expected control flow (file-not-found). No recordException/setStatus was added there per the expected-condition catches rule.
- Both inner try/catch blocks in discoverReflections (readdir and readFile failures) are empty expected-condition catches representing graceful skip behavior. No error recording was added to these.
- span.commit_story.journal.save_entry and span.commit_story.journal.discover_reflections are new span names not present in the schema registry; reported as schemaExtensions. No existing schema span matched these operations — the schema defines journal.generate_sections but not the file-write or reflection-discovery operations.
- formatJournalEntry is an exported function but is a pure synchronous data transformation (no I/O, no async) so it was skipped per RST-001.

## Advisory Findings
- CDQ-006 (isRecording Guard):187: setAttribute value "(commit.message || '').split('\n')[0]" at line 187 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
