# Instrumentation Report: src/integrators/filters/token-filter.js

## Summary
- **Status**: success
- **Spans added**: 0
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 0.0K
- **Output tokens**: 0.0K

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| truncateDiff | instrumented | 0 |
| truncateMessages | instrumented | 0 |
| applyTokenBudget | instrumented | 0 |

## Validation Journey
1. **Attempt 1**: 11 blocking errors (NDS-003 (Code Preserved):11)
2. **Attempt 2**: 11 blocking errors (NDS-003 (Code Preserved):11)
3. **Attempt 3**: 11 blocking errors (NDS-003 (Code Preserved):11)
4. **Attempt 4**: function-level: 0/3 functions instrumented (no spans needed)

## Notes
- Pre-scan: no instrumentable functions — all are pure sync utilities or unexported helpers. No LLM call made.
- Function-level fallback: 0/3 functions instrumented
