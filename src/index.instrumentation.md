# Instrumentation Report: src/index.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 6.2K
- **Output tokens**: 13.2K

## Schema Extensions
- `span.commit_story.cli.main`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- span.commit_story.cli.main is a new span name for the CLI entry point in src/index.js. All existing schema span names (commit_story.mcp.main and the full list of already-used names) are taken; this file's main() is the CLI orchestrator, distinct from the MCP server entry point, so a new name is warranted. The namespace prefix commit_story is preserved.
- main() sets vcs.ref.head.revision with the commitRef value (the git commit reference passed at the CLI) and conditionally sets commit_story.git.subcommand with the parsed subcommand. Both are registered schema keys — no new attribute declarations are needed.
- Known limitation: main() calls process.exit() in multiple code paths (validation failures, skip conditions, success). process.exit() bypasses the finally block, so the span will not be ended on those paths. This is an inherent limitation of the process.exit() pattern in the original code; no span.end() calls are added before individual process.exit() calls per the pre-instrumentation analysis.
- handleSummarize() is an unexported async function that calls process.exit() directly in its body on multiple paths. It is skipped on two grounds: RST-004 (unexported helper whose execution path is covered by the parent main() span) and RST-006 (direct process.exit() calls in the function body would bypass the span finally block causing span leaks).
- parseArgs(), showHelp(), isGitRepository(), isValidCommitRef(), validateEnvironment(), and getPreviousCommitTime() are all synchronous functions with no async I/O — skipped per RST-001 (no spans on pure synchronous utilities).
- The inner try/catch block inside main() that wraps triggerAutoSummaries() is a graceful-degradation catch — it catches errors and logs a warning without rethrowing. Per NDS-007, recordException() and setStatus(ERROR) are not added to this inner catch. The outer span-level catch (COV-003) handles unexpected errors that escape the main flow.
