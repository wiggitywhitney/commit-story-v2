# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 22.4K
- **Output tokens**: 26.4K
- **Cached tokens**: 21.4K

## Schema Extensions
- `span.commit_story.git.run`
- `span.commit_story.git.commit_metadata`
- `span.commit_story.git.commit_diff`
- `span.commit_story.git.merge_info`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`
- `commit_story.git.subcommand`
- `commit_story.git.diff_lines`
- `commit_story.git.parent_count`

## Validation Journey
1. **Attempt 1**: 3 blocking errors (SCH-002 (Attribute Keys Match Registry):3)
2. **Attempt 2**: 1 blocking error (NDS-003 (Code Preserved):1)
3. **Attempt 3**: 0 errors

## Notes
- commit_story.git.subcommand: No registered key captures the git subcommand (e.g. 'show', 'log', 'diff-tree'). The closest registered key, vcs.ref.head.revision, describes a commit reference — not a command name. Declaring commit_story.git.subcommand (type: string) for runGit identity.
- commit_story.git.diff_lines: No registered key captures the number of lines in a raw git diff patch. commit_story.commit.files_changed describes changed file count, not patch line count. Declaring commit_story.git.diff_lines (type: int). The lines array is already computed in the function body so no extra computation is required — CDQ-006 guard is unnecessary.
- commit_story.git.parent_count: No registered key captures parent commit count. commit_story.context.sessions_count and similar count keys describe different domain concepts. Declaring commit_story.git.parent_count (type: int) for getMergeInfo and reused in getCommitData.
- runGit has an existing try/catch that re-throws on all paths — COV-003 applies. OTel error recording is added at the top of the catch before all original conditional rethrows, preserving the existing error-handling logic intact (NDS-005 Pattern A with added finally).
- getCommitMetadata sets vcs.ref.head.revision twice: once with commitRef at span open (ensures the attribute is present on all paths including early errors) and again with the resolved full hash after git output is parsed. The second assignment gives the canonical SHA rather than a symbolic ref like HEAD.
- getCommitDiff: The previous instrumentation failure (NDS-003) was caused by wrapping the diff value in an isRecording guard combined with a null check. This version avoids that entirely — lines.length is a property access on an already-computed array, so no isRecording guard is needed per CDQ-006, and no null check is required because lines is always defined at that point.
- getPreviousCommitTime and getCommitData are exported async entry points (COV-001). They each receive their own span with commitRef captured as vcs.ref.head.revision before any conditional branching, satisfying COV-005 input-before-guard requirement.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):122: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):205: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):206: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
