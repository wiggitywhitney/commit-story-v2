# Instrumentation Report: src/index.js

## Summary
- **Status**: partial
- **Spans added**: 2
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 36.9K
- **Output tokens**: 26.1K
- **Cached tokens**: 75.5K

## Schema Extensions
- `span.commit_story.cli.handle_summarize`
- `commit_story.summarize.mode`
- `commit_story.summarize.weeks_count`
- `commit_story.summarize.months_count`
- `commit_story.summarize.generated_count`
- `commit_story.summarize.failed_count`
- `span.commit_story.cli.main`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| handleSummarize | instrumented | 1 |
| main | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 4 blocking errors (SCH-002 (Attribute Keys Match Registry):4)
2. **Attempt 2**: 1 blocking error (SCH-002 (Attribute Keys Match Registry):1)
3. **Attempt 3**: function-level: 2/2 functions instrumented
4. **Attempt 4**: reassembly: NDS-005: NDS-005: Original try/catch block is missing from instrumented output. You removed this block — it must survive intact, nested inside the outer span wrapper. Do NOT remove, merge, or hoist it.

## Notes
- Function-level fallback: 2/2 functions instrumented
-   instrumented: handleSummarize (1 spans)
-   instrumented: main (1 spans)
- Reassembly validation failed — using partial results. Failing rules: NDS-005: NDS-005: Original try/catch block is missing from instrumented output. You removed this block — it must survive intact, nested inside the outer span wrapper. Do NOT remove, merge, or hoist it.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):591: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
