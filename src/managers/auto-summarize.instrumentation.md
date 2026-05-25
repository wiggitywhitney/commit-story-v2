# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: partial
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 35.5K
- **Output tokens**: 39.6K
- **Cached tokens**: 104.5K

## Schema Extensions
- `span.commit_story.summary.trigger_auto_weekly_summaries`
- `span.commit_story.summary.trigger_auto_monthly_summaries`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| triggerAutoSummaries | skipped — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: original line 90 missing/modified: failed: [...result.failed, ...weeklyResult.failed, ...monthlyResult.failed],
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line. | 0 |
| triggerAutoWeeklySummaries | instrumented | 1 |
| triggerAutoMonthlySummaries | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 6 blocking errors (NDS-003 (Code Preserved):6)
2. **Attempt 2**: 6 blocking errors (NDS-003 (Code Preserved):6)
3. **Attempt 3**: 6 blocking errors (NDS-003 (Code Preserved):6)
4. **Attempt 4**: function-level: 2/3 functions instrumented

## Notes
- triggerAutoSummaries, triggerAutoWeeklySummaries, and triggerAutoMonthlySummaries are exported async orchestration functions and are instrumented as COV-001 entry points. The schema defines run_summarize, run_weekly_summarize, and run_monthly_summarize span names, but those are already in use by earlier files in this run — new unique names trigger_auto_summaries, trigger_auto_weekly_summaries, and trigger_auto_monthly_summaries were invented under the commit_story.summary namespace and declared as schema extensions.
- getErrorMessage is a pure synchronous helper with no I/O — skipped per RST-001 (no spans on synchronous utilities) and RST-004 (unexported internal).
- The inner catch blocks inside the for loops in all three functions are graceful-degradation catches — they push to failed/errors arrays and never rethrow. No recordException or setStatus was added to them (NDS-007: expected-condition catches must not be marked as errors).
- The existing try/catch blocks inside the for loops are preserved intact as nested blocks inside the outer span try/catch/finally wrapper (NDS-005 pattern B).
- For triggerAutoMonthlySummaries, the original lines 147 (function declaration) and 148 (const { onProgress } = options;) are preserved exactly. onProgress is destructured before the span callback so the original line 148 content is retained at the function body level.
- All attributes used — commit_story.summary.unsummarized_days_count, commit_story.summary.unsummarized_weeks_count, commit_story.summary.unsummarized_months_count, commit_story.summary.generated_count, commit_story.summary.failed_count — are already registered in the schema. No new attribute keys were invented (attributesCreated = 0).
- findUnsummarizedDays, findUnsummarizedWeeks, and findUnsummarizedMonths are already instrumented in their source file (../utils/summary-detector.js) — no manual spans were added for those calls here (RST-005 equivalent: callee already owns that layer).
- Function-level fallback: 2/3 functions instrumented
-   instrumented: triggerAutoWeeklySummaries (1 spans)
-   instrumented: triggerAutoMonthlySummaries (1 spans)
-   skipped: triggerAutoSummaries — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: original line 90 missing/modified: failed: [...result.failed, ...weeklyResult.failed, ...monthlyResult.failed],
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line.

## Advisory Findings
- COV-004 (Async Operation Spans):31: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality):128: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):211: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
