# Instrumentation Report: src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 40.3K
- **Output tokens**: 39.1K
- **Cached tokens**: 43.1K

## Schema Extensions
- `span.commit_story.journal.save_entry`
- `span.commit_story.journal.discover_reflections`
- `commit_story.journal.reflections_count`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| formatJournalEntry | instrumented | 0 |
| saveJournalEntry | instrumented | 1 |
| discoverReflections | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 15 blocking errors (NDS-003 (Code Preserved):15)
2. **Attempt 2**: 3 blocking errors (NDS-003 (Code Preserved):3)
3. **Attempt 3**: 15 blocking errors (NDS-003 (Code Preserved):15)
4. **Attempt 4**: function-level: 3/3 functions instrumented

## Notes
- The ten synchronous functions — extractFilesFromDiff, countDiffLines, formatTimestamp, formatReflectionsSection, formatJournalEntry, parseReflectionEntry, parseTimeString, parseReflectionsFile, isInTimeWindow, and getYearMonthRange — were skipped. All are pure data transformations or formatters with no I/O or async operations. Adding spans to synchronous utilities with no I/O provides no diagnostic value (RST-001). The unexported helpers among them are also covered transitively by the parent exported spans (RST-004).
- In saveJournalEntry, the inner catch block (which swallows the ENOENT error when the journal file does not yet exist) is an expected-condition catch representing normal control flow, not a failure. Per NDS-007, recordException and setStatus were NOT added to it. The outer span-level catch handles genuinely unexpected errors only.
- In discoverReflections, both inner catch blocks — one for unreadable reflection files and one for missing year-month directories — are graceful-degradation catches that simply continue iteration. Per NDS-007, error recording was not added to either. The outer span-level catch captures truly unexpected failures.
- The commit_story.journal.file_path attribute in saveJournalEntry is set to the raw entryPath filesystem path. CDQ-007 recommends using path.basename() or a project-relative path, but basename is not already imported (only join is imported from node:path). Adding a new non-OTel import to comply would violate the import constraint, so the raw path is used and noted here as a known limitation.
- Two new span names — commit_story.journal.save_entry and commit_story.journal.discover_reflections — were invented because no schema span definitions matched these operations. They follow the commit_story.<category>.<operation> naming convention established by the registry and are reported as schemaExtensions.
- Function-level fallback: 3/3 functions instrumented
-   instrumented: formatJournalEntry (0 spans)
-   instrumented: saveJournalEntry (1 spans)
-   instrumented: discoverReflections (1 spans)

## Advisory Findings
- CDQ-007 (Attribute Data Quality):197: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):467: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
