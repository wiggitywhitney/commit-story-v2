# Instrumentation Report: src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.3K
- **Output tokens**: 25.4K
- **Cached tokens**: 23.9K

## Schema Extensions
- `span.commit_story.journal.save_journal_entry`
- `span.commit_story.journal.discover_reflections`
- `commit_story.journal.reflections_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveJournalEntry is an exported async function that writes journal entries to disk — it gets a span as a COV-001 entry point. The span name commit_story.journal.save_journal_entry is new (not in the schema) and declared in schemaExtensions.
- discoverReflections is an exported async function that performs async file I/O across multiple directories — it gets a span as a COV-001 entry point. The span name commit_story.journal.discover_reflections is new and declared in schemaExtensions.
- The inner catch{} in saveJournalEntry (file-not-found path) is a graceful degradation catch — it swallows the error and lets execution continue to create the file. No recordException or setStatus added (NDS-007: expected-condition catches must not be marked as errors).
- The two inner catch{} blocks in discoverReflections (directory-not-found and file-unreadable paths) both continue without rethrowing. No recordException or setStatus added to them (NDS-007).
- formatTimestamp, formatJournalEntry, formatReflectionsSection, extractFilesFromDiff, countDiffLines, parseReflectionEntry, parseTimeString, parseReflectionsFile, isInTimeWindow, getYearMonthRange — all synchronous functions with no I/O. Skipped per RST-001 (no spans on synchronous utilities) and RST-004 (unexported internal helpers covered by their orchestrator spans).
- commit_story.journal.reflections_count is a new attribute declared in schemaExtensions with type int. The registered key commit_story.journal.quotes_count was considered but its brief says 'Number of developer quotes extracted for the entry' — these are file-parsed developer reflection entries discovered within a time window, a semantically distinct concept from AI-extracted dialogue quotes.
- vcs.ref.head.revision is set to commit.shortHash (the short commit SHA) in saveJournalEntry. The schema examples include full hashes, but the attribute notes permit any revision identifier including shorter forms. commit.hash (full SHA) is documented in formatJournalEntry's JSDoc but not guaranteed in saveJournalEntry's parameter contract; shortHash is actively used in the function body and is always present.

## Advisory Findings
- CDQ-006 (isRecording Guard):187: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):186: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):188: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):414: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
