# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.6K
- **Output tokens**: 6.7K
- **Cached tokens**: 21.4K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- 11 of 12 functions in this file are pure synchronous utilities with no I/O — getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, getSummariesDirectory were all skipped (RST-001: no spans on synchronous functions with no async or network/disk operations).
- ensureDirectory is the sole exported async function and the only COV-001 entry point — it calls mkdir which is an async filesystem operation. It received the span commit_story.journal.ensure_directory, invented because no schema span definition matches this operation. Registered as a schemaExtension.
- The filePath parameter was recorded using the registered key commit_story.journal.file_path, which semantically describes an output file path for a journal entry. The raw path value is used since path.basename is not imported in this file — adding a new non-OTel import to sanitize it is not permitted (CDQ-007 known limitation: full filesystem path set as attribute value).

## Advisory Findings
- CDQ-007 (Attribute Data Quality):95: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
