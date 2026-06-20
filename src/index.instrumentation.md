# Instrumentation Report: src/index.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 6.4K
- **Output tokens**: 21.1K

## Schema Extensions
- `span.commit_story.journal.handle_summarize`
- `span.commit_story.cli.main`
- `commit_story.cli.subcommand`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- parseArgs, showHelp, isGitRepository, isValidCommitRef, validateEnvironment, and getPreviousCommitTime are all synchronous functions with no async I/O — no spans added (RST-001: no spans on synchronous utilities). They are also unexported internal helpers (RST-004).
- commit_story.cli.subcommand is a new attribute capturing which CLI subcommand was dispatched (e.g. 'summarize'). No registered key in the schema covers CLI routing information — the closest registered keys describe journal or git data, not CLI dispatch state.
- savedPath in main is used as-is for commit_story.journal.file_path. node:path is not imported in this file, so path.basename() cannot be applied without adding a new non-OTel import (CDQ-007 advisory: use raw value and note the limitation).
- The inner try/catch around triggerAutoSummaries in main is a graceful degradation catch — it logs the error and does not rethrow, meaning auto-summarize failures intentionally do not block the main journal generation flow. No recordException or setStatus added to this catch (NDS-007).
- commit_story.journal.force is set as the first output attribute in handleSummarize, before any early-return guards for parsed.help or parsed.error, so every span produced by this function carries the force flag regardless of which path is taken.
- span.commit_story.journal.handle_summarize is a new span name — no matching entry exists in the schema for the CLI subcommand dispatcher function. Declared as a schema extension.
- span.commit_story.cli.main is a new span name — no matching entry exists in the schema for the top-level CLI entry point. Declared as a schema extension.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):457: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):464: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
