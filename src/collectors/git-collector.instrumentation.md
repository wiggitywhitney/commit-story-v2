# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.7K
- **Output tokens**: 10.5K

## Schema Extensions
- `span.commit_story.git.run`
- `span.commit_story.git.get_commit_metadata`
- `span.commit_story.git.get_commit_diff`
- `span.commit_story.git.get_merge_info`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`
- `commit_story.git.operation`
- `commit_story.git.diff_size`
- `commit_story.git.is_merge`
- `commit_story.git.parent_count`
- `commit_story.git.has_previous_commit`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- commit_story.git.operation (type: string, brief: 'Git subcommand executed (e.g. show, diff-tree, rev-list, log)', stability: development) — no registered key captures which git subcommand is being run; the closest registered attributes describe commit-level metadata, not the operation type.
- commit_story.git.diff_size (type: int, brief: 'Character length of the generated diff output', stability: development) — no registered key captures diff output size; commit_story.commit.files_changed is for file counts, not byte/character length of diff content.
- commit_story.git.is_merge (type: boolean, brief: 'Whether the commit is a merge commit', stability: development) — no registered key captures merge status; the registered commit attributes cover hash, author, message, and timestamp only.
- commit_story.git.parent_count (type: int, brief: 'Number of parent commits for the commit', stability: development) — no registered key captures parent commit count; distinct from commit_story.commit.files_changed which counts changed files.
- commit_story.git.has_previous_commit (type: boolean, brief: 'Whether a previous commit exists before the given commit reference', stability: development) — no registered key captures this boolean; the registered timestamp attributes describe commit time, not commit existence.
- authorEmail property available in getCommitMetadata was not set as a span attribute — email addresses are PII and the raw key would capture unbounded sensitive data (CDQ-007).
- runGit is classified as externalCalls (1) because it wraps execFileAsync, which shells out to the git process — the closest analog to an outbound system call in this codebase. getCommitMetadata, getCommitDiff, and getMergeInfo are COV-004 internal async operations that call runGit; they receive spans to give visibility into which git operations are invoked per higher-level call.
- In getCommitMetadata, vcs.ref.head.revision is set twice: once before the try block with the input commitRef (so error spans carry the requested ref) and once inside with the resolved full hash (so success spans carry the canonical SHA).
- getCommitData is a COV-001 entry point — CDQ-006 isRecording guards are exempt per the COV-001 exemption, so metadata.timestamp.toISOString() is called directly without a guard.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):78: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):213: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):214: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file and add OpenTelemetry instrumentation according to the schema and rules.

Key observations:
1. Functions to instrument: `runGit`, `getCommitMetadata`, `getCommitDiff`, `getMergeInfo`, `getPreviousCommitTime`, `getCommitData`
2. Schema attributes available: `vcs.ref.head.revision` (commit SHA), `commit_story.commit.author`, `commit_story.commit.message`, `commit_story.commit.timestamp`, `commit_story.commit.files_changed`
3. Need to check for PII - `author` (line 62) - CDQ-007 says `author` is a PII key to avoid. But `commit_story.commit.author` is a registered attribute, so I should use it carefully. 

I'll use `commit_story.commit.author` since it's schema-registered rather than the raw PII-flagged key. Now I'm mapping out span names for each function using the `commit_story` namespace: `runGit` becomes `commit_story.git.run`, `getCommitMetadata` becomes `commit_story.git.get_commit_metadata`, `getCommitDiff` becomes `commit_story.git.get_commit_diff`, and I'm working through the naming for `getMergeInfo` next.

For `getMergeInfo`, `getPreviousCommitTime`, and `getCommitData`, I'll set `vcs.ref.head.revision` for the commitRef. For `runGit`, I'll capture the git subcommand via a new schema extension `commit_story.git.operation` since args[0] holds the operation.

Now I'm second-guessing whether `commit_story.commit.author` conflicts with the PII rule against exact-match keys like `author` -- but that rule targets raw key names, not namespaced registered attributes, so it should be fine.

For diff size and merge info, I don't see existing schema keys, so I'll need new extensions: `commit_story.git.diff_size`, `isMerge`, and `parentCount` as booleans/ints.

Turning to `runGit`'s existing try/catch, every path in the catch block ends in a throw—whether it's a new error for specific git exit codes or a rethrow of the original—so this is genuinely an error-propagating catch, not graceful degradation. That means I need to add `recordException` and `setStatus(ERROR)` here, using Pattern A where the original try/catch becomes the outer wrapper.

Wrapping the whole function body in a span, setting the ref revision attribute, then executing the git command...

Adding more span attributes...

Still writing attribute assignments... I'm skipping authorEmail since it's PII, and noting that for the diff function, I'll capture the ref revision and diff length as attributes rather than the raw content itself.

For `getMergeInfo`, I'm adding new schema keys like `commit_story.git.is_merge` and `commit_story.git.parent_count` alongside the ref revision. For `getPreviousCommitTime` I'm mostly just setting the ref revision without a dedicated output attribute, and I'm working through the same pattern for `getCommitData`.

I'm also cross-checking CDQ-006's isRecording guard rule -- values that involve method calls like trimming or splitting need a guard, but simple variables like subject, author, hash, and commitRef don't. For the diff result string, since it comes from a chain of method calls before being stored in a variable, I need to think carefully about whether accessing its length still counts as needing a guard.

For getCommitDiff, since the function returns the processed diff text directly, I'll capture that return value in a variable first, set the diff_size attribute from its length, then return it -- applying the return-value capture exception.

Now I'm cataloging the extension attributes I need: git operation type, diff size, merge status, and parent count. For getPreviousCommitTime, the tricky part is the return value can be a Date or null, so I'm thinking I need a boolean flag for whether a previous commit exists plus a separate extension attribute for its timestamp, since the standard commit timestamp attribute refers to the current commit, not the previous one.

I'm also finalizing the span names for each git operation, then moving into writing the instrumented `runGit` function, wrapping the existing try/catch with tracing calls that set attributes and record exceptions on failure.

I realize I set attributes before the try block, which is fine since it's before error handling, but I should guard the optional commitRef with a null check. Now I'm writing a similar function for getCommitMetadata that starts a span, sets the ref attribute, and begins formatting the git log output with a custom delimiter pattern for parsing hash, subject, body, author info, and date.

I'm now parsing that output by splitting on newlines and locating the body-end marker, then extracting hash, short hash, subject, body text, author, email, and timestamp from their positions, setting corresponding span attributes, and returning an object combining the subject and body into a full commit message.

I'm also wrapping this in a try/catch/finally that records exceptions and sets error status on the span, ensuring the span always ends. I noticed I was setting the revision attribute twice—once with the raw ref, once with the resolved hash—but decided it's simpler to just set it once inside the try block using the resolved hash value.

Now checking PII concerns for the git functions: I won't set `authorEmail` as a span attribute since email is personal data, and `commit_story.commit.author` is a distinct registered key so it doesn't collide with the flagged `author` key. I'm not attaching `body` as an attribute either, avoiding that concern too. Now starting the `getCommitDiff` function with its own traced span...

I need to preserve the original multi-line argument structure with its inline comments exactly, per NDS-003, rather than collapsing it. The change to capture the result into a variable before returning it is permitted since that pattern is allowed for adding the span attribute.

Now I'm applying similar tracing to getMergeInfo—wrapping it in a span, tagging the commit ref, and computing parent count from the rev-list output to determine whether it's a merge commit.

For getPreviousCommitTime, I'm setting up a span that runs a git log command with a custom format to grab the last two commit timestamps...

Still writing commit data logic...

I'm confirming the timestamp is a genuine Date object since it's explicitly constructed that way in getCommitMetadata, so calling toISOString() is safe. I'm also verifying that since getCommitData is a COV-001 entry point, it's exempt from needing isRecording guards around method calls like this one.

Checking getPreviousCommitTime next, and it's also a COV-001 entry point, so it's similarly exempt from CDQ-006 guarding. For the internal helper functions like runGit and getCommitMetadata that aren't entry points, I'm walking through their property accesses to confirm they're all simple direct reads that don't need guards.

Now I'm tallying up the new versus existing attributes: five new ones like operation, diff_size, is_merge, parent_count, and has_previous_commit, alongside existing ones like the revision reference and commit author that are already reused elsewhere.

Recounting the span categories: externalCalls should be 1 since runGit wraps the execFileAsync process call, schemaDefined is 0, serviceEntryPoints is 2 (getPreviousCommitTime, getCommitData), and totalFunctionsInFile is 6.

So of the 6 spans I'm adding, 3 belong to the COV-004 internal async operations category. Now I need to preserve getCommitDiff's exact multiline structure while making the edit.

Writing diff-tree call parameters...

Then I need to think through similar span attribute handling for getCommitMetadata before assembling the complete file.


```
