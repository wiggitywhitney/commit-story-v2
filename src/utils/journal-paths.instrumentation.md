# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.8K
- **Output tokens**: 4.5K
- **Cached tokens**: 24.7K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- ensureDirectory is the only exported async function in the file and gets a span as a COV-001 entry point (span.commit_story.journal.ensure_directory — no matching schema span exists, so this is a new extension).
- commit_story.journal.file_path is already registered in the schema and semantically matches the filePath parameter (the path to the file whose directory will be created), so no new attribute extension is needed.
- CDQ-007 recommends using path.basename() instead of a raw filesystem path for the file_path attribute, but basename is not imported in this file. Adding a new non-OTel import is not permitted, so the raw filePath value is used. This is noted as a known limitation.
- All other 11 functions (getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, getSummariesDirectory) are pure synchronous data transformations with no I/O — they do not need spans (RST-001: no spans on synchronous utilities).

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
