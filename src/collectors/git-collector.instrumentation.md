# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 16.2K
- **Output tokens**: 14.6K

## Schema Extensions
- `span.commit_story.git.run_git`
- `span.commit_story.git.get_commit_metadata`
- `span.commit_story.git.get_commit_diff`
- `span.commit_story.git.get_merge_info`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`
- `commit_story.git.command`
- `commit_story.git.parent_count`
- `commit_story.git.is_merge`

## Validation Journey
1. **Attempt 1**: 3 blocking errors (NDS-005 (Control Flow Preserved):2, COV-003 (Error Recording):1)
2. **Attempt 2**: 0 errors

## Notes
- runGit wraps execFileAsync (node:child_process) and is the single external-call span. The original try/catch always rethrows on every path (three distinct throw statements), so it is not a graceful-degradation catch. Pattern A is used: span.recordException and span.setStatus are added at the top of the original catch block, and the original throw behavior is preserved exactly below them. This satisfies both COV-003 (error recording present) and NDS-005 (throw statements unchanged).
- getCommitMetadata, getCommitDiff, and getMergeInfo are different git sub-operations — each runs a distinct git command and returns different data shapes. They are not semantic duplicates of each other or of runGit; SCH-001 advisories can be safely ignored for these span names.
- getPreviousCommitTime runs 'git log -2' to find the prior commit timestamp; getCommitData orchestrates three parallel git calls and assembles the full commit record. Neither is equivalent to getCommitMetadata ('git show'), so their span names are distinct operations, not duplicates.
- commit_story.git.command (new, type: string) — captures the git subcommand (e.g. 'show', 'diff-tree', 'rev-list', 'log'). No registered key covers child-process sub-command identity.
- commit_story.git.parent_count (new, type: int) — captures the number of parent commits computed in getMergeInfo. No registered key covers this count; commit_story.commit.files_changed tracks changed files, which is semantically different.
- commit_story.git.is_merge (new, type: boolean) — captures whether the commit is a merge (parentCount > 1). No registered boolean commit-classification attribute exists in the schema.
- commit_story.commit.author is a registered schema attribute, but its value (author name) is PII. It is omitted from instrumentation to avoid retaining PII in telemetry backends without a retention policy.
- getCommitDiff does not set a diff-size attribute because diff content is an unbounded external string. The span still carries vcs.ref.head.revision as its input attribute, satisfying COV-005.
- CDQ-007 advisories for metadata.subject and mergeInfo.isMerge in getCommitData addressed by guarding both property accesses with != null checks before setAttribute calls.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
