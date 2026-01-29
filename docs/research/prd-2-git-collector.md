# PRD #2 Git Collector Research

Research findings for git collector implementation.

---

## 1. Git Version Compatibility

**Tested with**: git 2.50.1

All PRD commands work correctly with current git version.

---

## 2. Git Command Patterns (Verified)

### Commit Metadata
```bash
git show --no-patch --format='%H|%h|%s|%B|%an|%ae|%aI' HEAD
```

**Output format**: `fullHash|shortHash|subject|body|authorName|authorEmail|isoTimestamp`

**Example output**:
```
8de6bcb69ca593dbabdfd362fd4b7d267cc90288|8de6bcb|docs: reinforce YOLO mode...|full body...|Whitney Lee|whitney.lee@datadoghq.com|2026-01-29T07:57:26-05:00
```

**Note**: The `%B` (body) includes the subject line, so we get it twice. Use `%b` for body-only if needed.

### Diff with Journal Filtering
```bash
git diff-tree -p -m --first-parent HEAD -- . ':!journal/entries/'
```

**Flags explained**:
- `-p`: Generate patch (full diff)
- `-m`: Show diff for merge commits
- `--first-parent`: For merges, diff against first parent only
- `-- .`: Start from current directory
- `':!journal/entries/'`: Exclude journal entries (pathspec magic)

**Output**: First line is commit hash, followed by diff in unified format.

### Previous Commit Timestamp
```bash
git log -2 --format='%aI' HEAD
```

**Output**: Two lines - current commit timestamp, previous commit timestamp.

To get just previous: `git log -2 --format='%aI' HEAD | tail -1`

### Merge Detection
```bash
git rev-list --parents -n 1 HEAD
```

**Output**: Space-separated hashes - first is commit, rest are parents.

**Logic**:
- 2 hashes total (1 parent) = regular commit
- 3+ hashes total (2+ parents) = merge commit

---

## 3. Node.js Git Library Analysis

| Library | Size | Approach | Recommendation |
|---------|------|----------|----------------|
| `simple-git` | ~150KB | JS wrapper around git CLI | ❌ Adds dependency |
| `@napi-rs/simple-git` | ~5MB+ | Native bindings | ❌ Platform-specific, bloat |
| `child_process` | Built-in | Direct exec | ✅ Zero dependencies |

### Recommendation: Use `child_process.execFile` directly

**Rationale**:
1. **Lean packaging** - No added dependencies (per CLAUDE.md guidelines)
2. **Simple use case** - Only 4 git commands needed
3. **Readable code** - Easier for instrumentation agent to understand
4. **v1 pattern** - Original commit-story used exec directly
5. **Control** - Full control over command construction and error handling

---

## 4. Implementation Patterns

### Using execFile (Recommended)
```javascript
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function runGit(args) {
  const { stdout } = await execFileAsync('git', args, {
    maxBuffer: 10 * 1024 * 1024, // 10MB for large diffs
  });
  return stdout;
}

// Usage
const metadata = await runGit(['show', '--no-patch', '--format=%H|%h|%s', 'HEAD']);
```

### Parsing Commit Metadata
```javascript
function parseCommitMetadata(output) {
  const [hash, shortHash, subject, body, author, email, timestamp] = output.split('|');
  return {
    hash,
    shortHash,
    subject,
    message: body.trim(),
    author,
    authorEmail: email,
    timestamp: new Date(timestamp),
  };
}
```

### Parsing Parent Count for Merge Detection
```javascript
function parseMergeInfo(output) {
  const hashes = output.trim().split(' ');
  const parentCount = hashes.length - 1;
  return {
    isMerge: parentCount > 1,
    parentCount,
  };
}
```

---

## 5. Error Handling Considerations

| Scenario | Detection | Handling |
|----------|-----------|----------|
| Not a git repo | Exit code 128 | Throw descriptive error |
| Invalid commit ref | Exit code 128 | Throw with commit ref in message |
| Empty diff | Empty stdout | Return empty string (valid) |
| First commit | `git log -2` returns 1 line | Return null for previous time |

### Error Detection Pattern
```javascript
try {
  const result = await runGit(args);
  return result;
} catch (error) {
  if (error.code === 128) {
    if (error.stderr?.includes('not a git repository')) {
      throw new Error('Not a git repository');
    }
    if (error.stderr?.includes('unknown revision')) {
      throw new Error(`Invalid commit reference: ${commitRef}`);
    }
  }
  throw error;
}
```

---

## 6. Timestamp Handling

Git uses ISO 8601 with timezone offset: `2026-01-29T07:57:26-05:00`

**Conversion to UTC**:
```javascript
// JavaScript Date constructor handles timezone automatically
const timestamp = new Date('2026-01-29T07:57:26-05:00');
// Result: 2026-01-29T12:57:26.000Z (UTC)
```

This is important for Claude collector time window comparison which uses UTC.

---

## 7. Summary

**Ready for implementation**:
- All git commands verified working
- Use `child_process.execFile` (no external dependencies)
- Handle errors gracefully with descriptive messages
- Convert timestamps to UTC Date objects
- Merge detection via parent count

**No blockers identified.**
