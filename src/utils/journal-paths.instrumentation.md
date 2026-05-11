# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.7K
- **Output tokens**: 5.1K
- **Cached tokens**: 21.7K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- ensureDirectory is the only function instrumented — all other 11 exports are pure synchronous helpers with no I/O (getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, getSummariesDirectory) and are skipped per RST-001 (no spans on synchronous utilities without I/O).
- The span name 'commit_story.journal.ensure_directory' is a new schema extension — no existing registry span covers directory creation. The closest entries are journal-level spans for generate_daily_summary / generate_weekly_summary / generate_monthly_summary, which are generation operations, not filesystem operations. Schema extension declared accordingly.
- commit_story.journal.file_path is a registered attribute key for journal file paths and is used to record the filePath parameter. CDQ-007 advises using path.basename() instead of raw paths, but 'basename' is not imported in this file and adding a non-OTel import is prohibited — the raw path is used and noted as a known limitation.
- getSummaryPath and getSummariesDirectory contain synchronous throw statements for invalid cadence values — these are pure validation helpers with no I/O and remain uninstrumented (RST-001). Their thrown errors will propagate naturally to any instrumented caller.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007: setAttribute value "filePath" at line 94 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
