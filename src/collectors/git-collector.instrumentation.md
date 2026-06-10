# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 18.9K
- **Output tokens**: 24.8K
- **Cached tokens**: 21.1K

## Schema Extensions
- `span.commit_story.git.run`
- `span.commit_story.git.get_commit_metadata`
- `span.commit_story.git.get_commit_diff`
- `span.commit_story.git.get_merge_info`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`
- `commit_story.git.subcommand`
- `commit_story.git.diff_size`
- `commit_story.git.parent_count`
- `commit_story.git.is_merge`

## Validation Journey
1. **Attempt 1**: 3 blocking errors (SCH-002 (Attribute Keys Match Registry):3)
2. **Attempt 2**: 1 blocking error (NDS-003 (Code Preserved):1)
3. **Attempt 3**: 0 errors

## Notes
- span.commit_story.git.run: new span for the internal runGit function which shells out to git — it is async and performs an external process call (COV-004). No registry span matched this git process execution operation.
- span.commit_story.git.get_commit_metadata: new span for internal getCommitMetadata — async git invocation that parses commit metadata. No registry span matched.
- span.commit_story.git.get_commit_diff: new span for internal getCommitDiff — async git invocation that retrieves diff content. No registry span matched.
- span.commit_story.git.get_merge_info: new span for internal getMergeInfo — async git invocation to detect merge commits. No registry span matched.
- span.commit_story.git.get_previous_commit_time: new span for exported entry point getPreviousCommitTime (COV-001). No registry span matched.
- span.commit_story.git.get_commit_data: new span for exported entry point getCommitData (COV-001). No registry span matched.
- commit_story.git.subcommand: captures the git sub-command (e.g. 'show', 'diff-tree', 'log') passed as args[0] to runGit. No registered key captures the specific git command being executed; the closest registered keys are VCS ref attributes which describe refs rather than operations.
- commit_story.git.diff_size: captures the byte length of the diff string returned by getCommitDiff. No registered key captures diff content size; commit_story.commit.files_changed is a file count, not a byte/character size of the diff output.
- commit_story.git.parent_count: captures the number of parent commits from rev-list output. No registered key maps to parent commit count; vcs.ref.head.revision covers the ref identity, not parent topology.
- commit_story.git.is_merge: boolean indicating whether the commit has more than one parent. No registered boolean key covers merge-commit detection.
- In getCommitMetadata, author and subject are external strings sourced from git output. These are guarded with if (span.isRecording()) per CDQ-006 to avoid setting unbounded external strings on non-recording spans. getCommitMetadata is not a COV-001 entry point so the CDQ-006 exemption does not apply.
- In getCommitData (COV-001 entry point), CDQ-006 isRecording guards are omitted per the COV-001 exemption. metadata.author and metadata.subject are set directly on the span.
- The raw diff content is never set as a span attribute because it is an unbounded external string. Instead, diff.length (an integer byte count) is captured as commit_story.git.diff_size.
- runGit has an existing try/catch that transforms some errors and rethrows others. span.recordException and span.setStatus(ERROR) are added at the top of that catch block per COV-003, before all original error-handling logic, preserving the original conditional rethrow structure intact (NDS-005 Pattern A).
- authorEmail is not set as a span attribute even though it is available in getCommitMetadata. While commit_story.commit.author_email would not be an exact CDQ-007 PII match, the email address is user PII and there is no registered key for it, so it is omitted to avoid capturing unnecessary PII without a schema-backed key.
- metadata.subject is used (not metadata.message) in getCommitData because metadata.subject is the first line of the commit message only — this avoids potentially setting a large multi-paragraph message body on the span.
-  getCommitData uses metadata.subject rather than metadata.message to keep the span attribute bounded to the subject line; the full body is available via child span getCommitMetadata if needed.
-  span-to-function ratio: 6 spans across 6 functions (ratio 1:1). All functions are async with I/O so all qualify for instrumentation — no backstop deprioritization needed.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):78: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):128: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):212: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):213: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):214: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):215: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
