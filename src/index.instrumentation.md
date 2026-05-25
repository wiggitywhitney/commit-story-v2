# Instrumentation Report: src/index.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 6.4K
- **Output tokens**: 19.6K

## Schema Extensions
- `span.commit_story.cli.main`
- `commit_story.cli.subcommand`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- debug, parseArgs, showHelp, isGitRepository, isValidCommitRef, validateEnvironment, and getPreviousCommitTime are all synchronous functions with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- handleSummarize is an unexported async function called only from within main() — skipped per RST-004 (the exported orchestrator main() covers this execution path via context propagation). It also calls process.exit() directly in its body, which would apply RST-006.
- main() contains multiple process.exit() calls that terminate the process before the span's finally block can run — the span will leak on those exit paths. This is a known limitation per CDQ-001. No span.end() calls were added before individual process.exit() calls as instructed by the pre-instrumentation analysis.
- The inner try/catch inside main() (the auto-summarize block) is a graceful-degradation catch that swallows the error without rethrowing — per NDS-007, no recordException or setStatus was added to it.
- commit_story.cli.subcommand is a new attribute key for the CLI subcommand routing value (e.g., 'summarize' or null). No registered key in the schema captures the concept of which CLI subcommand was dispatched — the closest registered keys relate to context sources, journal sections, or AI operations, none of which match CLI routing.
- vcs.ref.head.revision was used for the commitRef parameter — this registered key represents the git commit reference/revision being processed, which is exactly what commitRef holds.
