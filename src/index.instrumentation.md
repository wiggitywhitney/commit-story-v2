# Instrumentation Report: src/index.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 37.6K
- **Output tokens**: 40.9K
- **Cached tokens**: 26.4K

## Schema Extensions
- `span.commit_story.commands.main`

## Validation Journey
1. **Attempt 1**: 18 blocking errors (NDS-003 (Code Preserved):18)
2. **Attempt 2**: 18 blocking errors (NDS-003 (Code Preserved):18)
3. **Attempt 3**: 0 errors

## Notes
- main() is the COV-001 root entry point for the entire CLI — it gets a span using the schema extension name commit_story.commands.main since no pre-defined schema span exists for this function. The vcs.ref.head.revision attribute captures the commitRef parsed from CLI args, which is the primary identifier for the operation.
- Known limitation: main() contains multiple process.exit() calls directly in its body. Per COV-001 these do not prevent adding the span, but each process.exit() path bypasses the finally block and causes the span to leak without being closed or exported. This is an accepted trade-off for CLI entry point instrumentation.
- handleSummarize() is an async function that calls process.exit() directly in its body (not only inside catch/finally blocks) and is not the COV-001 root entry point — RST-006 applies, no span added. Its async sub-operations (runSummarize, runWeeklySummarize, runMonthlySummarize) are already instrumented in their respective callee files.
- debug, parseArgs, showHelp, isGitRepository, isValidCommitRef, validateEnvironment, and getPreviousCommitTime are all pure synchronous functions with no async I/O — no spans added (RST-001: synchronous utilities do not need spans).
- The inner try/catch around triggerAutoSummaries inside main() is a graceful-degradation catch that logs the error and continues without rethrowing — NDS-007 applies, no recordException or setStatus added to that catch block. It is preserved exactly as-is nested inside the outer span wrapper's try block.
- The span name span.commit_story.commands.main is declared as a schema extension. No existing schema span covers the top-level CLI main() entry point — the closest registered spans (commit_story.commands.run_summarize, etc.) are for specific subcommand operations, not the overall entry point dispatcher.
