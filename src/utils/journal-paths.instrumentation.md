# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.8K
- **Output tokens**: 7.6K
- **Cached tokens**: 23.7K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- span.commit_story.journal.ensure_directory is a new span name not defined in the registry schema — declared in schemaExtensions. It covers the only async exported function in this file, which creates parent directories for a given file path using fs/promises mkdir.
- getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, and getSummariesDirectory are all pure synchronous path-computation helpers with no I/O — no spans added (RST-001: no spans on synchronous utilities without I/O).
- commit_story.journal.file_path is already a registered attribute key in the schema, used directly in setAttribute without any schemaExtensions declaration needed.
- CDQ-007 note: filePath is a raw filesystem path used as the commit_story.journal.file_path attribute value. basename() is not imported in this file, so the raw value is used as-is per the CDQ-007 exception. This is a known limitation — a project-relative path would be preferable.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
