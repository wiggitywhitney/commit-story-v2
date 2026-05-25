# Instrumentation Report: src/utils/journal-paths.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.8K
- **Output tokens**: 7.0K
- **Cached tokens**: 22.5K

## Schema Extensions
- `span.commit_story.journal.ensure_directory`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- ensureDirectory is the only function instrumented — it is an exported async function that performs filesystem I/O (mkdir), making it a COV-001 entry point. The span name 'commit_story.journal.ensure_directory' is invented because no registry span definition matches this operation; it is reported as a schemaExtension.
- getYearMonth, getDateString, getJournalEntryPath, getReflectionPath, getContextPath, getReflectionsDirectory, parseDateFromFilename, getJournalRoot, getISOWeekString, getSummaryPath, and getSummariesDirectory are all pure synchronous functions with no I/O — skipped per RST-001 (no spans on synchronous data transformation utilities).
- commit_story.journal.file_path is a registered attribute key matching the filePath parameter passed to ensureDirectory — used directly with no extension needed.
- span.commit_story.journal.ensure_directory is a new span name not in the registry. No existing registry span covers filesystem directory creation as a distinct operation. Declaring as schemaExtension.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
