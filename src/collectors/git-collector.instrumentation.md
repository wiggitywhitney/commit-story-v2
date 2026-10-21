# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 18.9K
- **Output tokens**: 18.1K

## Schema Extensions
- `span.commit_story.git.run_command`
- `span.commit_story.git.get_commit_metadata`
- `span.commit_story.git.get_commit_diff`
- `span.commit_story.git.get_merge_info`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`
- `commit_story.git.diff_size`
- `commit_story.git.parent_count`

## Validation Journey
1. **Attempt 1**: 5 blocking errors (NDS-005 (Control Flow Preserved):2, SCH-002 (Attribute Keys Match Registry):2, COV-003 (Error Recording):1)
2. **Attempt 2**: 0 errors

## Notes
- runGit restructured to Pattern A: the original try/catch becomes the outer span wrapper. span.recordException and span.setStatus are added at the top of the original catch block, followed by all original conditional throw statements and the final rethrow. This satisfies both COV-003 (error recording in the catch that pairs with span.end()) and NDS-005 (all original throw statements preserved in place).
- commit_story.git.is_merge was removed from schemaExtensions and from setAttribute calls. The SCH-002 validator flagged it as a semantic duplicate — commit_story.git.parent_count (already registered) conveys the same information since parentCount > 1 implies a merge. Callers can derive isMerge from parentCount, so the boolean attribute is redundant.
- commit_story.commit.author was removed from getCommitMetadata per the CDQ-007 advisory. The attribute value is a person's full name captured from git log, which constitutes PII in telemetry. The registered attribute key exists in the schema but the advisory correctly flags the privacy risk of emitting author names as span attributes.
- commit_story.git.diff_size (int): character length of the filtered diff string returned by getCommitDiff. No registered key covers diff output size — commit_story.commit.files_changed counts files changed, not the raw diff character count. Extension declared with type int.
- commit_story.git.parent_count (int): number of parent commits for the given ref, extracted from rev-list output. No registered key covers parent commit count — vcs.ref.head.revision and vcs.ref.head.name identify refs but do not count parents. Extension declared with type int.
- SCH-001 advisories for span name similarity are ignored — each span covers a distinct git operation (metadata fetch, diff fetch, merge info fetch, previous commit time, full commit data orchestration) and none are semantically equivalent to run_command.
- getCommitData orchestrates getCommitMetadata, getCommitDiff, and getMergeInfo via Promise.all. Each sub-function has its own span that becomes a child of the getCommitData span through context propagation. Only commitRef is set on the parent span; detailed attributes are captured on the respective child spans.

## Advisory Findings
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file and add OpenTelemetry instrumentation according to the schema and rules.

Key functions to instrument:
1. `runGit` (line 20) - async, COV-004
2. `getCommitMetadata` (line 45) - async, COV-004
3. `getCommitDiff` (line 78) - async, COV-004
4. `getMergeInfo` (line 103) - async, COV-004

```

### Attempt 2

````
Let me analyze the failures:

1. **COV-003 fail at line 26/31**: The inner catch block (the original one) doesn't record errors on the span. The validator sees two catch blocks and complains that the inner one (line 31) doesn't call recordException/setStatus. But per NDS-007, the inner catch IS an error-propagating catch (it rethrows), so it should have error recording. Wait, but the validator says COV-003 fails because catch at line 31 doesn't record error. 

Wait, looking at the structure:
```js
```

Actually the inner catch transforms and always rethrows, while the outer catch is the one that records the exception on the span and rethrows before the finally closes it. So the validator is flagging the inner catch even though the outer one already handles the actual span recording — I need to figure out whether that's a false positive or a legitimate gap per COV-003's rule about every propagating catch needing its own recordException call.

This suggests the validator is comparing the original catch's conditional throw statements against my instrumented version, and it's flagging that those specific error throws (for "Not a git repository" and "Invalid commit reference") aren't showing up where expected—even though I believe I kept that logic intact, so I need to check whether my rewrite accidentally altered or displaced those conditional throws.

That's the point - the original catch stays intact as an inner block, while the outer catch is new span infrastructure. Maybe instead of nesting, I should fold the span's error handling directly into the original catch block, keeping the try/catch structure as the outer wrapper around the span logic.

This preserves all the original error-checking logic and throw statements exactly as they were, just adding recordException and setStatus calls at the start of the existing catch. That should satisfy both requirements - not restructuring the original try/catch while still capturing errors in the span. Though I'm second-guessing whether adding those calls at the top counts as "restructuring" under NDS-005.

Let me apply Pattern A to rewrite runGit, wrapping the original try/catch with the tracing span and preserving the exact error-handling behavior underneath.

This addresses all three requirements: original throws stay intact, recordException/setStatus land in the catch block, and span.end() runs in finally. Next I need to look at the SCH-002 failures.

The `commit_story.git.is_merge` attribute is flagged both as a "semantic duplicate" and as "not found in registry," which seems contradictory since the registered list only has `diff_size` and `parent_count`, with nothing matching a merge indicator. I need to figure out what registered key the validator actually wants me to use instead.

That makes sense — I should just drop the is_merge attribute entirely and rely on parent_count > 1 to signal a merge, removing both the setAttribute call and its schema entry. Similarly I'll strip the author attribute causing the CDQ-007 flag, and leave the span name advisories alone since they're not blocking. Now I'm putting together the corrected file: fixing runGit's error handling pattern, then removing the is_merge references throughout.


````
