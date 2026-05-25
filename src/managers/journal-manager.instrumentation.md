# Instrumentation Report: src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.4K
- **Output tokens**: 22.9K
- **Cached tokens**: 22.6K

## Schema Extensions
- `span.commit_story.journal.save_entry`
- `span.commit_story.journal.discover_reflections`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- span.commit_story.journal.save_entry — no schema-defined span matched saveJournalEntry's responsibility (persisting a formatted journal entry to disk). The closest existing spans cover ensure_directory and generate_* operations; none cover the write/dedup orchestration performed here.
- span.commit_story.journal.discover_reflections — no schema-defined span matched discoverReflections' responsibility (scanning reflection directories and filtering by time window). Invented under the commit_story.journal namespace following the existing naming pattern.
- saveJournalEntry's inner try/catch (catching ENOENT when the file doesn't yet exist) is a graceful-degradation catch with an empty body — no recordException or setStatus added to it (NDS-007: expected-condition catches that don't propagate the error must not be marked as errors).
- discoverReflections contains two inner empty catch blocks inside the loop — one for unreadable files and one for missing directories. Both are graceful-degradation catches that continue the loop; no error recording added to them (NDS-007).
- formatTimestamp, formatJournalEntry — exported but purely synchronous with no I/O; no span added (RST-001: no spans on synchronous utilities regardless of export status).
- extractFilesFromDiff, countDiffLines, formatReflectionsSection, parseReflectionEntry, parseTimeString, parseReflectionsFile, isInTimeWindow, getYearMonthRange — unexported synchronous helpers; no spans added (RST-001 + RST-004).
- commit_story.journal.quotes_count is used in discoverReflections to record the number of reflection objects returned — the schema brief says 'Number of developer quotes extracted for the entry', which aligns with reflections being developer-written content. The count is set after the sort, immediately before returning.
- commit_story.context.time_window_start and commit_story.context.time_window_end are used in discoverReflections — these registered keys are a precise semantic match for the startTime/endTime parameters that define the discovery window.
- vcs.ref.head.revision is used in saveJournalEntry for commit.hash — the registered brief 'The full commit SHA hash' is an exact semantic match for this field.
- commit_story.commit.files_changed is used in saveJournalEntry for commit.filesChanged — registered as 'Number of files changed in the commit', which matches exactly.
- ensureDirectory calls are not wrapped with additional spans — the callee in ../utils/journal-paths.js already owns the commit_story.journal.ensure_directory span, so adding another span here would duplicate instrumentation (RST-005 principle applied to callees).

## Advisory Findings
- CDQ-006 (isRecording Guard):187: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) and no span.isRecording() guard. When sampling drops the span, that computation still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):186: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):188: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):189: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):415: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
