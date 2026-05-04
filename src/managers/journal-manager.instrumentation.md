# Instrumentation Report: src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.2K
- **Output tokens**: 59.7K
- **Cached tokens**: 22.4K

## Schema Extensions
- `span.commit_story.journal.save_entry`
- `span.commit_story.journal.discover_reflections`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- saveJournalEntry gets span name 'commit_story.journal.save_entry' — the schema defines spans for journal section generation (generate_summary, generate_dialogue, etc.) but not for file persistence, so this is a new schema extension. The inner try/catch (catching ENOENT when the file doesn't exist yet) is a graceful-degradation catch and receives no recordException/setStatus per NDS-007, since the original catch neither propagates the error nor indicates a failure condition.
- discoverReflections gets span name 'commit_story.journal.discover_reflections' — again no matching schema span. Both inner try/catches (directory missing, file unreadable) are graceful-degradation catches that silently skip, so they receive no error recording per NDS-007.
- commit_story.journal.file_path is set using the raw entryPath variable in saveJournalEntry. CDQ-007 advises using path.basename() for filesystem paths, but only 'join' is imported from 'node:path' — 'basename' is not available without a new non-OTel import, so the raw path is used and this limitation is noted here.
- All synchronous functions (formatTimestamp, formatJournalEntry, extractFilesFromDiff, countDiffLines, formatReflectionsSection, parseReflectionEntry, parseTimeString, parseReflectionsFile, isInTimeWindow, getYearMonthRange) are skipped — they perform no I/O and are pure data transformations (RST-001). The unexported ones are additionally excluded by RST-004.
- commit_story.commit.author is deliberately omitted from saveJournalEntry even though commit.author is available — CDQ-007 lists 'author' as a PII field to avoid in span attributes.

## Advisory Findings
- CDQ-006 (isRecording Guard):183: setAttribute value "new Date(commit.timestamp).toISOString()..." at line 183 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
- CDQ-007 (Attribute Data Quality):184: CDQ-007: setAttribute value "commit.shortHash" at line 184 accesses a property of "commit" without a null/undefined guard. If "commit" can be null or undefined, this will throw at runtime. Add an `if (commit)` check or use optional chaining (`commit?.shortHash`).
- CDQ-007 (Attribute Data Quality):225: CDQ-007: setAttribute value "entryPath" at line 225 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
- CDQ-007 (Attribute Data Quality):410: CDQ-007: setAttribute value "reflections.length" at line 410 accesses a property of "reflections" without a null/undefined guard. If "reflections" can be null or undefined, this will throw at runtime. Add an `if (reflections)` check or use optional chaining (`reflections?.length`).
