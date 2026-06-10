# Instrumentation Report: src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.2K
- **Output tokens**: 25.7K
- **Cached tokens**: 24.8K

## Schema Extensions
- `span.commit_story.journal.save_entry`
- `span.commit_story.journal.discover_reflections`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveJournalEntry is an exported async function that writes a journal entry to disk — it gets a span as a COV-001 service entry point. The inner try/catch around readFile (duplicate detection) is a graceful-degradation catch with no rethrow, so recordException/setStatus were intentionally omitted from it per NDS-007.
- discoverReflections is an exported async function that reads from the filesystem to find reflections in a time window — it gets a span as a COV-001 service entry point. Both inner try/catches (file read failure and directory-not-found) are graceful-degradation catches that swallow errors without propagating them, so recordException/setStatus were intentionally omitted from both per NDS-007.
- formatTimestamp and formatJournalEntry are exported but synchronous pure-formatting functions with no I/O — they are skipped per RST-001 (no spans on synchronous utilities).
- All unexported helpers (extractFilesFromDiff, countDiffLines, formatReflectionsSection, parseReflectionEntry, parseTimeString, parseReflectionsFile, isInTimeWindow, getYearMonthRange) are synchronous with no I/O and are covered by the exported orchestrator spans through context propagation — skipped per RST-001 and RST-004.
- span.commit_story.journal.save_entry: new span name — no existing schema span covers the act of persisting a formatted journal entry to disk. The closest existing spans are generate_* operations (AI generation) and ensure_directory (path setup), neither of which captures the write-and-dedup logic of saveJournalEntry.
- span.commit_story.journal.discover_reflections: new span name — no existing schema span covers scanning reflection directories and filtering entries by time window. The existing weekly/monthly/daily summary spans cover AI summary generation, not filesystem discovery.
- commit_story.journal.entries_count is used for the reflections array length in discoverReflections. Its brief is a bare default ('Agent-discovered attribute'), so the description does not conflict with the reflection count semantics. It is the closest registered int-type count key in the journal namespace.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):182: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):187: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):412: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
