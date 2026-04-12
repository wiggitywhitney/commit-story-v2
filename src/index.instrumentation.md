# Instrumentation Report: src/index.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.4K
- **Output tokens**: 15.9K

## Schema Extensions
- `span.commit_story.cli.main`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- span.commit_story.cli.main is a new span not in the schema. No existing schema span matches the CLI orchestration entry point. The span captures the top-level journal generation flow and routes to subcommand handlers.
- process.exit() is called on 7 code paths inside main(). Because process.exit() terminates the Node.js process without running finally blocks, span.end() is added explicitly before each process.exit() call. The finally block serves as a safety net for the throw path only. A suggestedRefactor documents how to restructure main() to avoid this pattern.
- handleSummarize() is not exported and is skipped per RST-004. Its child operations (runSummarize, runWeeklySummarize, runMonthlySummarize) are already instrumented in their respective files and will appear as child spans of commit_story.cli.main via context propagation.
- The auto-summarize inner catch (err) block is an expected-condition handler — auto-summarize failures are documented as non-blocking. recordException/setStatus are intentionally not added there.
- commit_story.journal.file_path is set from savedPath, which is a project-relative path matching the schema example (journal/entries/YYYY-MM/YYYY-MM-DD.md), not an absolute filesystem path, so CDQ-007 does not apply.

## Advisory Findings
- COV-004 (Async Operation Spans):211: "handleSummarize" (async function) at line 211 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- NDS-005 (Control Flow Preserved): NDS-005: Original try/catch block (line 490) is missing from instrumented output. Instrumentation must preserve existing error handling structure — do not remove or merge try/catch/finally blocks. Judge assessment (confidence 95%): semantics not preserved. Restore the original try/catch/finally block structure from line 490. Do not merge, flatten, or restructure exception handling logic. Preserve the exact exception types being caught, their order, and any re-throw statements. If instrumentation must wrap the try/catch, do so without altering the internal control flow or catch clause ordering.
