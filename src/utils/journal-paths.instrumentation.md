# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.7K
- **Output tokens**: 7.0K
- **Cached tokens**: 22.2K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- ensureDirectory is the only async function in this file and is an exported service entry point — it receives a span (COV-001). The registered attribute commit_story.journal.file_path is used for the filePath parameter since it is semantically equivalent (a file path for a journal artifact). No new attribute keys were invented.
- getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, and getSummariesDirectory are all pure synchronous functions with no I/O — they are skipped per RST-001 (no spans on synchronous utilities).
- span.commit_story.journal.ensure_directory is a new span name not present in the schema. The schema has no span defined for directory creation or file-system setup operations, so a new name was invented following the commit_story namespace and journal category pattern.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
