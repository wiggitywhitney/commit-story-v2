# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.6K
- **Output tokens**: 5.8K
- **Cached tokens**: 21.4K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- ensureDirectory is the only async function in this file and performs real filesystem I/O (mkdir), so it receives a span as a COV-001 entry point. The filePath parameter is set via the registered attribute commit_story.journal.file_path.
- getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, and getSummariesDirectory are all pure synchronous functions with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- span.commit_story.journal.ensure_directory is a new span name not present in the schema registry. No existing schema span covers the operation of ensuring a directory exists for a file path. The closest schema spans relate to AI generation, context collection, and git operations — none of which match a filesystem directory-creation operation.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
