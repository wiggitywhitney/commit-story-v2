# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 14.9K
- **Output tokens**: 12.4K

## Schema Extensions
- `span.commit_story.git_collector.run_git`
- `span.commit_story.git_collector.get_commit_metadata`
- `span.commit_story.git_collector.get_commit_diff`
- `span.commit_story.git_collector.get_merge_info`
- `span.commit_story.git_collector.get_previous_commit_time`
- `span.commit_story.git_collector.get_commit_data`
- `commit_story.git_collector.is_merge`

## Validation Journey
1. **Attempt 1**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
2. **Attempt 2**: 0 errors

## Notes
- commit_story.git_collector.is_merge: No registered attribute covers a boolean merge-commit indicator. The commit_story.commit.* keys capture metadata fields (message, timestamp, author) and commit_story.commit.files_changed tracks file counts — none captures merge status. Declared as new boolean extension with brief 'Whether the commit is a merge commit'.
- commit_story.git_collector.parent_count was removed: the validator reported it as a semantic duplicate of commit_story.git_collector.is_merge (already registered). The parentCount value is implied by isMerge and omitted to avoid the duplicate-extension failure.
- commit_story.commit.author setAttribute calls removed from getCommitMetadata and getCommitData: the validator flagged this key as potentially exposing PII (CDQ-007 advisory). Although commit_story.commit.author is a registered schema attribute and not an exact PII key match under CDQ-007, the advisory was raised at the file level and removing the calls resolves it without losing other diagnostic value.
- getCommitData: added null guards (if (metadata != null) and if (mergeInfo != null)) before accessing metadata.subject, metadata.timestamp, and mergeInfo.isMerge. In practice these cannot be null after a successful Promise.all resolution, but the guards satisfy CDQ-007/CDQ-009 advisory requirements from the validator.
- SCH-001 advisories for get_previous_commit_time and get_commit_data flagged as potential duplicates of get_commit_metadata — these are different operations (list recent commit timestamps vs parse full metadata vs orchestrate all sub-operations) and are kept as distinct span names.
- runGit wraps execFileAsync (child process spawn) — classified as external call (COV-002). No auto-instrumentation library covers node:child_process, so a manual span is applied.
- getCommitDiff returns a raw diff string of unbounded size — not set as a span attribute. The span captures vcs.ref.head.revision as its sole attribute to satisfy COV-005 without risking oversized telemetry payloads.
- commit_story.commit.message is set using the subject (first line) in both getCommitMetadata and getCommitData, consistent with the registered attribute brief 'The first line of the commit message'.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
