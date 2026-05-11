# Instrumentation Report: src/integrators/filters/message-filter.js

## Summary
- **Status**: success
- **Spans added**: 0
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 0.0K
- **Output tokens**: 0.0K

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| filterMessages | instrumented | 0 |
| groupFilteredBySession | instrumented | 0 |

## Validation Journey
1. **Attempt 1**: 4 blocking errors (NDS-003 (Code Preserved):4)
2. **Attempt 2**: 4 blocking errors (NDS-003 (Code Preserved):4)
3. **Attempt 3**: 4 blocking errors (NDS-003 (Code Preserved):4)
4. **Attempt 4**: function-level: 2/2 functions instrumented

## Notes
- Pre-scan: no instrumentable functions — all are pure sync utilities or unexported helpers. No LLM call made.
- Function-level fallback: 2/2 functions instrumented
-   instrumented: filterMessages (0 spans)
-   instrumented: groupFilteredBySession (0 spans)
