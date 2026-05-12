# Instrumentation Report: src/utils/commit-analyzer.js

## Summary
- **Status**: partial
- **Spans added**: 0
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 0.0K
- **Output tokens**: 0.0K

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| isJournalEntriesOnlyCommit | instrumented | 0 |
| shouldSkipMergeCommit | instrumented | 0 |

## Validation Journey
1. **Attempt 1**: 12 blocking errors (NDS-003 (Code Preserved):12)
2. **Attempt 2**: 12 blocking errors (NDS-003 (Code Preserved):12)
3. **Attempt 3**: 12 blocking errors (NDS-003 (Code Preserved):12)
4. **Attempt 4**: function-level: 2/2 functions instrumented
5. **Attempt 5**: reassembly: NDS-005: NDS-005: Original try/catch block is missing from instrumented output. You removed this block — it must survive intact, nested inside the outer span wrapper. Do NOT remove, merge, or hoist it.

## Notes
- Pre-scan: no instrumentable functions — all are pure sync utilities or unexported helpers. No LLM call made.
- Function-level fallback: 2/2 functions instrumented
-   instrumented: isJournalEntriesOnlyCommit (0 spans)
-   instrumented: shouldSkipMergeCommit (0 spans)
- Reassembly validation failed — using partial results. Failing rules: NDS-005: NDS-005: Original try/catch block is missing from instrumented output. You removed this block — it must survive intact, nested inside the outer span wrapper. Do NOT remove, merge, or hoist it.
