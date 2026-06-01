# Instrumentation Report: src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 33.3K
- **Output tokens**: 42.9K
- **Cached tokens**: 22.3K

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
1. **Attempt 1**: 6 blocking errors (NDS-003 (Code Preserved):6)
2. **Attempt 2**: 6 blocking errors (NDS-003 (Code Preserved):6)
3. **Attempt 3**: 6 blocking errors (NDS-003 (Code Preserved):6)
4. **Attempt 4**: function-level: 3/3 functions instrumented

## Notes
- saveJournalEntry is an exported async function and receives a span (COV-001). The inner try/catch that handles file-not-found is a graceful-degradation catch (empty catch body — just proceeds), so no error recording is added to it (NDS-007).
- discoverReflections is an exported async function and receives a span (COV-001). Both inner try/catch blocks (one for readdir failing when directory doesn't exist, one for readFile failing) swallow the error and continue iteration — these are graceful-degradation catches and receive no error recording (NDS-007).
- formatTimestamp is an exported synchronous function with no I/O — skipped per RST-001 (no spans on synchronous utilities, regardless of export status).
- formatJournalEntry is an exported synchronous function with no I/O — skipped per RST-001.
- extractFilesFromDiff, countDiffLines, formatReflectionsSection, parseReflectionEntry, parseTimeString, parseReflectionsFile, isInTimeWindow, getYearMonthRange are all unexported synchronous helpers — skipped per both RST-001 and RST-004.
- All five attributes used (commit_story.journal.file_path, vcs.ref.head.revision, commit_story.context.time_window_start, commit_story.context.time_window_end, commit_story.journal.entries_count) are registered keys in the schema — attributesCreated is 0.
- span.commit_story.journal.save_journal_entry: no matching span in the registry was found for a journal entry save operation. The existing schema spans cover ensure_directory but not the higher-level entry persistence orchestration.
- span.commit_story.journal.discover_reflections: no matching span in the registry was found for reflection discovery. The schema covers context collection (collect_chat_messages, gather_context_for_commit) but those are semantically different operations targeting Claude Code sessions rather than local reflection files.
- Function-level fallback: 3/3 functions instrumented
-   instrumented: formatJournalEntry (0 spans)
-   instrumented: saveJournalEntry (1 spans)
-   instrumented: discoverReflections (1 spans)

## Advisory Findings
- CDQ-006 (isRecording Guard):207: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):196: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):204: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):468: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-010 (String Method Type Safety):207: CDQ-010 (String Method Type Safety) fired because a string-only method (.split(), .trim(), .replace(), etc.) is called directly on a property access like `obj.field.method()`. If `obj.field` isn't a string at runtime, this throws a TypeError. Either coerce with `String(obj.field).method()` or confirm the field is always a string from the surrounding code context.
