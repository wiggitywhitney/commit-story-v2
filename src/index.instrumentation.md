# Instrumentation Report: src/index.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 6.8K
- **Output tokens**: 14.3K
- **Cached tokens**: 28.4K

## Schema Extensions
- `span.commit_story.index.main`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- main() is the CLI entry point and receives the commit_story.index.main span (COV-001). It has multiple process.exit() calls throughout its body — these bypass the span's finally block, so the span will leak on those code paths at runtime. This is a known limitation when COV-001 entry points call process.exit() (COV-001 takes priority over RST-006).
- handleSummarize is an unexported async function called only from main(). Since main() has a span covering that execution path, handleSummarize is skipped per RST-004 — instrument the exported orchestrator, not internal helpers. The imported functions it calls (runSummarize, runWeeklySummarize, runMonthlySummarize) are instrumented in their own files.
- The inner try/catch for auto-summarize inside main() (the config.autoSummarize block) is a graceful-degradation catch — it swallows the error and logs a warning without rethrowing. Per NDS-007, no recordException or setStatus was added to that inner catch.
- Pure synchronous functions debug, parseArgs, showHelp, isGitRepository, isValidCommitRef, validateEnvironment, and getPreviousCommitTime were skipped per RST-001 — they perform no async I/O and adding spans to them provides no diagnostic value.
- span.commit_story.index.main is a new span name not present in the schema registry. It follows the established commit_story.<category>.<operation> naming pattern for the application's main CLI entry point.
- vcs.ref.head.revision is used for commitRef (the git commit reference passed to the CLI), matching the schema's registered definition of the full commit SHA or ref at HEAD. commit_story.git.subcommand captures the subcommand name when one is routed. commit_story.journal.file_path captures the output path of the saved journal entry — all three are registered schema keys requiring no new extension declarations.
-  The .catch() handler at the bottom of the file is not wrapped in a span — it is a top-level error reporter that runs after main() has already thrown, at which point span.end() in main's finally has already been called (or process.exit bypassed it). No additional span is needed there.
-  handleSummarize contains multiple process.exit() calls as well. If it were instrumented, those paths would also leak spans. Keeping it under main's span hierarchy avoids adding more leak-prone instrumentation.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):482: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
