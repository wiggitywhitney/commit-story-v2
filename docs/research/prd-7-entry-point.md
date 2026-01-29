# PRD #7 Research: Entry Point & Git Hook

## Research Date: January 2026

## Summary

This document covers Node.js CLI patterns, git hook best practices, and cross-platform compatibility for the commit-story entry point and hook installation.

---

## 1. Node.js CLI Patterns

### Option Comparison

| Library | Size | Dependencies | Learning Curve | Features |
| --- | --- | --- | --- | --- |
| Native (process.argv) | 0 KB | None | Low | Basic |
| Commander.js | ~50 KB | 0 | Medium | Full-featured |
| Yargs | ~200 KB | Many | Medium | Feature-rich |
| meow | ~30 KB | Few | Low | Simple |

### Recommendation: Native process.argv

For commit-story, native argument parsing is sufficient:
- Only 2-3 arguments needed (commitRef, --debug)
- No complex subcommands
- Zero dependencies (aligns with lean packaging goal)
- Simple to understand and maintain

### Native Pattern

```javascript
#!/usr/bin/env node

const args = process.argv.slice(2);

// Parse positional and flags
let commitRef = 'HEAD';
let debug = false;

for (const arg of args) {
  if (arg === '--debug' || arg === '-d') {
    debug = true;
  } else if (arg === '--help' || arg === '-h') {
    showHelp();
    process.exit(0);
  } else if (!arg.startsWith('-')) {
    commitRef = arg;
  }
}
```

### Shebang Best Practice

```javascript
#!/usr/bin/env node
```

- Uses `env` for portability across systems
- Node.js path varies by installation
- Works on macOS, Linux, and Windows (with appropriate setup)

### Sources
- [Node.js process.argv documentation](https://nodejs.org/docs/latest/api/process.html#processargv)
- [Building CLI tools with Node.js](https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs)

---

## 2. Git Hook Best Practices

### Hook Types

| Hook | Timing | Use Case |
| --- | --- | --- |
| pre-commit | Before commit created | Linting, formatting |
| commit-msg | After message entered | Message validation |
| **post-commit** | After commit created | Notifications, journal generation |
| post-merge | After merge completes | Dependency installation |

### post-commit is Correct for Journal Generation

- Runs after commit is finalized
- Has access to full commit data
- Doesn't block commit creation
- Can't prevent commit (already done)

### Hook Script Pattern

```bash
#!/bin/bash
# .git/hooks/post-commit

# Run in background to not block terminal
npx commit-story &
```

**Key considerations:**
- `&` runs in background - doesn't block user
- `npx` resolves the package at runtime (may use local install or cache)
- Output goes to background (not visible)
- Errors don't block git

### Alternative: Direct Node Execution

```bash
#!/bin/bash
# .git/hooks/post-commit

# More reliable than npx in some environments
node "$(dirname "$0")/../../node_modules/commit-story/src/index.js" &
```

### Hook Installation Safety

```bash
# Check if hook exists
if [ -f ".git/hooks/post-commit" ]; then
  # Don't overwrite - user may have custom hooks
  echo "Hook exists. Please add manually:"
  echo "  npx commit-story &"
  exit 1
fi
```

**Why not auto-merge?**
- Existing hooks might be complex
- Could break user's workflow
- Better to be conservative
- User knows their setup best

### Sources
- [Git Hooks Documentation](https://git-scm.com/docs/githooks)
- [Customizing Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

---

## 3. Cross-Platform Compatibility

### Shell Script Considerations

| Platform | Shell | Hook Execution |
| --- | --- | --- |
| macOS | bash/zsh | Native support |
| Linux | bash | Native support |
| Windows | Git Bash | Via Git for Windows |

### Windows-Specific Notes

1. **Git Bash**: Git for Windows includes bash - hooks work normally
2. **PowerShell**: Can't run bash hooks directly
3. **WSL**: Full Linux environment, works perfectly

### Recommendation: Bash Script

```bash
#!/bin/bash
```

- Works on all platforms with Git installed
- Git for Windows includes Git Bash
- PowerShell users typically use Git Bash for git operations

### Node.js Cross-Platform

```javascript
import { platform } from 'node:os';
import { join } from 'node:path';

// path.join handles separators correctly
const hookPath = join('.git', 'hooks', 'post-commit');

// Check platform if needed
if (platform() === 'win32') {
  // Windows-specific handling
}
```

### Sources
- [Git for Windows](https://gitforwindows.org/)
- [Node.js path module](https://nodejs.org/api/path.html)

---

## 4. v1 Entry Point Review

### Patterns to Keep

1. **Optional commit ref**: Default to HEAD, allow override
2. **Debug mode**: --debug flag for verbose output
3. **Early exit checks**: Skip before expensive operations
4. **Informative messages**: Clear error and skip messages
5. **Exit codes**: 0 = success, 1 = error, 2 = skipped

### Patterns to Change

1. **Simpler argument parsing**: Native instead of library
2. **ES modules**: Use `import` instead of `require`
3. **Better error messages**: More actionable guidance

### Exit Code Convention

```javascript
// Exit codes
const EXIT_SUCCESS = 0;  // Journal generated
const EXIT_ERROR = 1;    // Error occurred
const EXIT_SKIPPED = 2;  // Intentionally skipped (journal-only, merge)
```

---

## 5. Git Repository Validation

### Check if in Git Repository

```javascript
import { execFileSync } from 'node:child_process';

function isGitRepository() {
  try {
    execFileSync('git', ['rev-parse', '--git-dir'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
```

### Validate Commit Reference

```javascript
/**
 * Validate that a string is a safe git ref (no shell metacharacters)
 */
function isSafeGitRef(ref) {
  if (!ref || typeof ref !== 'string') return false;
  return /^[a-zA-Z0-9._\-\/~^]+$/.test(ref);
}

function isValidCommitRef(ref) {
  if (!isSafeGitRef(ref)) return false;
  try {
    execFileSync('git', ['rev-parse', '--verify', ref], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
```

---

## 6. Environment Validation

### Required: ANTHROPIC_API_KEY

```javascript
function validateEnvironment() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    console.error('   Set your API key: export ANTHROPIC_API_KEY=your-key');
    process.exit(1);
  }
}
```

### Optional: Debug Mode

```javascript
const DEBUG = process.argv.includes('--debug') || process.env.DEBUG === 'true';

function debug(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}
```

---

## 7. Skip Logic Implementation

### Journal-Only Commits

```javascript
import { execSync } from 'node:child_process';

function isJournalEntriesOnlyCommit(commitRef) {
  const output = execSync(`git diff-tree --no-commit-id --name-only -r ${commitRef}`, {
    encoding: 'utf-8'
  });

  const files = output.trim().split('\n').filter(Boolean);
  return files.length > 0 && files.every(f => f.startsWith('journal/entries/'));
}
```

**Note**: Only skip `journal/entries/` - NOT reflections or context (those are manual content).

### Merge Commit Detection

```javascript
function isMergeCommit(commitRef) {
  const output = execSync(`git rev-parse ${commitRef}^@ 2>/dev/null | wc -l`, {
    encoding: 'utf-8'
  });

  return parseInt(output.trim()) > 1;
}

// Alternative: check parent count
function isMergeCommit(commitRef) {
  const output = execSync(`git cat-file -p ${commitRef}`, { encoding: 'utf-8' });
  const parentLines = output.split('\n').filter(l => l.startsWith('parent '));
  return parentLines.length > 1;
}
```

---

## 8. Error Handling Patterns

### User-Friendly Messages

```javascript
const MESSAGES = {
  NOT_GIT_REPO: `
❌ Not a git repository
   Run commit-story from within a git repository.
`,
  NO_API_KEY: `
❌ ANTHROPIC_API_KEY not set
   Set your API key: export ANTHROPIC_API_KEY=your-key
`,
  INVALID_COMMIT: (ref) => `
❌ Invalid commit reference: ${ref}
   Check that the commit exists: git log --oneline
`,
  SKIP_JOURNAL_ONLY: `
⏭️  Skipping: only journal entries changed
   This commit only modified journal/entries/ files.
`,
  SKIP_MERGE: `
⏭️  Skipping: merge commit with no changes
   This merge commit has no chat context or code changes.
`,
  SUCCESS: (path) => `
✅ Journal entry saved
   ${path}
`,
};
```

### Error Wrapping

```javascript
async function main() {
  try {
    await run();
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ File or command not found:', error.message);
    } else {
      console.error('❌ Unexpected error:', error.message);
      if (DEBUG) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}
```

---

## 9. Decision Summary

| Decision | Choice | Rationale |
| --- | --- | --- |
| CLI library | Native process.argv | Zero dependencies, sufficient for needs |
| Hook type | post-commit | After commit, doesn't block |
| Hook execution | Background (&) | Non-blocking for user |
| Hook script | Bash | Works on all platforms with Git |
| Hook installation | Manual if exists | Safety, user knows best |
| Exit codes | 0/1/2 | Standard convention |
| Error messages | Actionable | Help user fix issues |
