# Instrumentation Report: src/managers/journal-manager.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 37.7K
- **Output tokens**: 31.5K
- **Cached tokens**: 92.3K

## Schema Extensions
- `span.commit_story.journal.save_journal_entry`
- `span.commit_story.context.discover_reflections`
- `commit_story.context.reflections_count`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| formatJournalEntry | instrumented | 0 |
| saveJournalEntry | instrumented | 1 |
| discoverReflections | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 2 blocking errors (NDS-003 (Code Preserved):2)
2. **Attempt 2**: 2 blocking errors (NDS-003 (Code Preserved):2)
3. **Attempt 3**: 1 blocking error (NDS-003 (Code Preserved):1)
4. **Attempt 4**: function-level: 3/3 functions instrumented

## Notes
- formatTimestamp and formatJournalEntry are exported but purely synchronous with no I/O — skipped per RST-001. Their computation is covered by the parent saveJournalEntry span.
- The inner empty catch blocks in saveJournalEntry (file not found) and discoverReflections (unreadable file, missing directory) represent expected control flow, not errors. Per the error handling rules, recordException and setStatus were intentionally omitted from these catches.
- commit_story.journal.quotes_count was used for the reflection count in discoverReflections since reflections are the developer quotes captured for journal entries — this is the closest semantic match in the schema.
- entryPath in saveJournalEntry is set as commit_story.journal.file_path. The schema example value 'journal/entries/2026-02/2026-02-03.md' confirms this attribute expects a project-relative path, which getJournalEntryPath returns relative to basePath.
- span.commit_story.journal.save_entry and span.commit_story.journal.discover_reflections are new schema extensions. No existing schema spans matched these operations — all schema-defined journal spans (generate_dialogue, generate_sections) were already consumed by earlier files covering AI generation functions.
- Function-level fallback: 3/3 functions instrumented
-   instrumented: formatJournalEntry (0 spans)
-   instrumented: saveJournalEntry (1 spans)
-   instrumented: discoverReflections (1 spans)

## Advisory Findings
- CDQ-006 (isRecording Guard):188: setAttribute value "commit.timestamp.split('T')[0]" at line 188 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
- SCH-004 (No Redundant Schema Entries):418: Attribute key "commit_story.context.reflections_count" at line 418 may be redundant with registry entry "commit_story.context.messages_count" (67% token overlap). Consider using the existing registry attribute instead of creating a new one.
