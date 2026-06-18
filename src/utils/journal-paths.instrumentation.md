# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.8K
- **Output tokens**: 5.3K
- **Cached tokens**: 24.8K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, getSummariesDirectory are all pure synchronous functions with no I/O — skipped per RST-001 (no spans on synchronous utilities)
- ensureDirectory is the sole exported async function and the only COV-001 entry point — instrumented with span name commit_story.journal.ensure_directory. The registered attribute commit_story.journal.file_path was used to capture the input filePath parameter before any branching.
- span.commit_story.journal.ensure_directory is a new span name not present in the registry — declared in schemaExtensions. No existing schema span matched this filesystem directory-creation operation.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
