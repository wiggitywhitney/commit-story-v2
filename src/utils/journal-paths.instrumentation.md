# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.1K
- **Output tokens**: 19.0K
- **Cached tokens**: 48.6K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- ensureDirectory is the only async function in the file — it creates parent directories recursively via mkdir and is an exported entry point, so it receives a span (COV-001). The span name commit_story.journal.ensure_directory is not in the schema registry and is reported as a schema extension.
- All other 11 functions (getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, getSummariesDirectory) are pure synchronous path-computation helpers with no I/O — they are skipped per RST-001.
- The commit_story.journal.file_path attribute (already registered in the schema) is used to record the filePath input on the ensureDirectory span. CDQ-007 advises against raw filesystem paths, but basename is not already imported so no path-shortening transformation is available without adding a new non-OTel import. The raw path value is used and noted as a known limitation.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007: setAttribute value "filePath" at line 94 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.ensure_directory" may be a semantic duplicate. If these operations are equivalent, reuse "the existing name" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
