# Instrumentation Report: src/utils/commit-analyzer.js

## Summary
- **Status**: success
- **Spans added**: 0
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 0.0K
- **Output tokens**: 0.0K

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- All exported functions are synchronous (isSafeGitRef, getChangedFiles, isJournalEntriesOnlyCommit, isMergeCommit, shouldSkipMergeCommit, getCommitMetadata) — no async I/O to trace. No LLM call made.
