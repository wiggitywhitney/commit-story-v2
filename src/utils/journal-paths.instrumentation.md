# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.8K
- **Output tokens**: 6.0K
- **Cached tokens**: 25.4K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- ensureDirectory is the only async function in the file and is a COV-001 entry point — it receives a manual span named commit_story.journal.ensure_directory. No schema span matched this operation, so the name was invented following the commit_story namespace convention.
- The file_path attribute used for ensureDirectory is the already-registered commit_story.journal.file_path key (brief: 'Output file path for the journal entry'). The filePath parameter is the same concept — an output path being prepared for writing — so the existing registered key was reused directly; no extension declaration is needed.
- All other functions (getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, getSummariesDirectory) are pure synchronous path-computation helpers with no I/O — they are skipped per RST-001 (no spans on synchronous utilities without I/O).
- span.commit_story.journal.ensure_directory is a new span name not in the schema. It represents the async operation of creating parent directories for a target file path using node:fs/promises mkdir. No existing schema span describes this file-system preparation operation.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):93: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
