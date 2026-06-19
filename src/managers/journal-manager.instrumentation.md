# Instrumentation Report: src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.6K
- **Output tokens**: 24.4K
- **Cached tokens**: 25.5K

## Schema Extensions
- `span.commit_story.journal.save_journal_entry`
- `span.commit_story.journal.discover_reflections`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveJournalEntry (line 177) gets a span as a COV-001 exported async entry point. The inner try/catch that handles a missing file (empty catch body, no rethrow) is a graceful-degradation catch governed by NDS-007 — no recordException or setStatus was added to it.
- discoverReflections (line 327) gets a span as a COV-001 exported async entry point. The two inner try/catch blocks (one for readdir, one for readFile) both use empty catch bodies with continue — these are expected-condition catches (NDS-007) and receive no error recording.
- formatTimestamp is a pure synchronous function — skipped (RST-001: no I/O or async work).
- formatJournalEntry is a pure synchronous function that formats strings — skipped (RST-001: no I/O or async work).
- extractFilesFromDiff, countDiffLines, formatReflectionsSection, parseReflectionEntry, parseTimeString, parseReflectionsFile, isInTimeWindow, getYearMonthRange are all unexported synchronous helpers — skipped (RST-001 + RST-004).
- The commit_story.journal.file_path attribute is set to the raw filesystem path returned by getJournalEntryPath. path.basename is not imported in this file (only join from node:path), so a project-relative path cannot be derived without adding a new non-OTel import — using the raw path per CDQ-007 import constraint.
- commit_story.journal.entries_count is a registered schema attribute (agent-discovered). Its brief is auto-generated but the name semantically matches the count of reflection entries discovered — used for the reflections.length output in discoverReflections.
- span.commit_story.journal.save_journal_entry is a new span not in the pre-defined schema list. Closest schema spans (ensure_directory, generate_daily_summary, etc.) describe different operations — saving a journal entry is a distinct operation requiring its own name.
- span.commit_story.journal.discover_reflections is a new span not in the pre-defined schema list. No existing schema span describes the reflection discovery operation.

## Advisory Findings
- CDQ-006 (isRecording Guard):186: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-006 (isRecording Guard):188: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):187: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):190: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):193: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):420: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
