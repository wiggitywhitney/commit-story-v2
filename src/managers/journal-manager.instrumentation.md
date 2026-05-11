# Instrumentation Report: src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 41.1K
- **Output tokens**: 50.1K
- **Cached tokens**: 43.7K

## Schema Extensions
- `span.commit_story.journal.save_entry`
- `span.commit_story.journal.discover_reflections`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| formatJournalEntry | instrumented | 0 |
| saveJournalEntry | instrumented | 1 |
| discoverReflections | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 15 blocking errors (NDS-003 (Code Preserved):15)
2. **Attempt 2**: 1 blocking error (NDS-003 (Code Preserved):1)
3. **Attempt 3**: 15 blocking errors (NDS-003 (Code Preserved):15)
4. **Attempt 4**: function-level: 3/3 functions instrumented

## Notes
- Ten synchronous functions (formatTimestamp, formatJournalEntry, formatReflectionsSection, extractFilesFromDiff, countDiffLines, parseReflectionEntry, parseTimeString, parseReflectionsFile, isInTimeWindow, getYearMonthRange) were skipped — they perform no I/O and are pure data transformations (RST-001). All unexported ones also qualify under RST-004.
- The inner catch blocks in saveJournalEntry (file-not-found path) and both inner catches in discoverReflections (unreadable file, missing directory) are graceful-degradation catches that swallow errors without rethrowing — recordException and setStatus were intentionally omitted from these catches per NDS-007. Each outer span wrapper still carries its own error-recording catch for unexpected exceptions.
- commit_story.journal.file_path is set with the raw entryPath string since path.basename is not imported in this file. CDQ-007 advises using a project-relative path, but adding a new non-OTel import is not permitted — this is a known limitation.
- Neither span.commit_story.journal.save_journal_entry nor span.commit_story.journal.discover_reflections appears in the schema registry. The schema defines journal spans only for summary generation operations (daily/weekly/monthly). These two spans cover save and discovery operations which have no semantic equivalent in the registry, so they are reported as schema extensions.
- vcs.ref.head.revision is set to commit.shortHash in saveJournalEntry because it is always present per the JSDoc. The full hash (commit.hash) is also available but shortHash is guaranteed non-null; callers that pass both will see the short form in this attribute.
- Function-level fallback: 3/3 functions instrumented
-   instrumented: formatJournalEntry (0 spans)
-   instrumented: saveJournalEntry (1 spans)
-   instrumented: discoverReflections (1 spans)

## Advisory Findings
- CDQ-007 (Attribute Data Quality):196: CDQ-007: setAttribute value "entryPath" at line 196 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
- CDQ-007 (Attribute Data Quality):460: CDQ-007: setAttribute value "reflections.length" at line 460 accesses a property of "reflections" without a null/undefined guard. If "reflections" can be null or undefined, this will throw at runtime. Add an `if (reflections)` check or use optional chaining (`reflections?.length`).
