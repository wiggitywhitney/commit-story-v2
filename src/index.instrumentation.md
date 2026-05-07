# Instrumentation Report: src/index.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.9K
- **Output tokens**: 8.8K

## Schema Extensions
- `span.commit_story.cli.run`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- span.commit_story.cli.run is a new span name for the main() CLI entry point. No schema-defined span covered this operation — all existing span.commit_story.* entries target specific sub-operations (journal generation, summarize commands, git data). This is the root CLI dispatch span (COV-001 requires it as the application entry point).
- debug, parseArgs, showHelp, isGitRepository, isValidCommitRef, validateEnvironment, and getPreviousCommitTime are all synchronous helpers with no async I/O — they don't need spans (RST-001: no spans on synchronous utilities). They are also unexported (RST-004).
- handleSummarize is an unexported async function that delegates to runSummarize, runWeeklySummarize, and runMonthlySummarize, all of which are already instrumented in their respective source files. Skipped per RST-004 (unexported, covered by exported orchestrators) and RST-006 (contains direct process.exit() calls throughout its body).
- The inner try/catch inside main() around triggerAutoSummaries is a graceful-degradation catch — it logs the error and continues without propagating. No recordException/setStatus was added to it (NDS-007: expected-condition catches that don't propagate errors must not receive error recording).
- Known limitation: multiple process.exit() calls inside main() (on validation failures and skip conditions) will cause the span to leak — process.exit() bypasses the finally block. This is an inherent limitation when instrumenting a CLI entry point that exits early. The root span will not be exported for early-exit paths.
