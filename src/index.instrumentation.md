# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/index.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.4K
- **Output tokens**: 8.3K

## Schema Extensions
- `span.commit_story.cli.main`
- `commit_story.cli.subcommand`
- `commit_story.commit.is_merge`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- span.commit_story.cli.main is a new span not in the schema — main() is the CLI entry point and COV-001 requires it have a span. No existing schema span matches this root entry point role.
- commit_story.cli.subcommand is a new attribute capturing which subcommand was dispatched (e.g., 'summarize'). No existing schema attribute covers the concept of a CLI subcommand selector — the closest would be a filter or operation type, but neither is semantically equivalent.
- commit_story.commit.is_merge is a new boolean attribute on the main span. No registered key captures whether the processed commit is a merge commit. This is useful for filtering spans by commit type in dashboards.
- handleSummarize was skipped per RST-004: it is unexported and main() already wraps the entire execution path including the handleSummarize call. The summarize subcommand operations themselves are instrumented in their own files.
- Many process.exit() calls inside the main span callback will cause span.end() in the finally block to be bypassed at process termination. This is a known limitation of CLI apps using process.exit() — the spans on those exit paths will not be properly flushed unless the SDK's graceful shutdown is configured. This is a pre-existing code structure issue, not introduced by instrumentation.

## Advisory Findings
- COV-004 (Async Operation Spans):211: "handleSummarize" (async function) at line 211 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- NDS-005 (Control Flow Preserved): NDS-005: Original try/catch block (line 490) is missing from instrumented output. Instrumentation must preserve existing error handling structure — do not remove or merge try/catch/finally blocks. Judge assessment (confidence 95%): semantics not preserved. Restore the original try/catch block structure from line 490. Do not merge, remove, or restructure catch clauses. Verify that exception types are caught in the same order, re-throw statements are preserved exactly as written, and the finally block (if present) executes in the original sequence. If instrumentation requires wrapping, do so outside the original try/catch/finally boundaries.
