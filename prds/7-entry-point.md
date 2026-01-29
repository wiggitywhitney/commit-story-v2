# PRD #7: Entry Point & Git Hook

**GitHub Issue**: [#7](https://github.com/wiggitywhitney/commit-story-v2/issues/7)
**Status**: Pending
**Priority**: High
**Dependencies**: #4 (Context Integration), #5 (AI Generation), #6 (Journal Manager)

## Problem Statement

Need a CLI entry point that orchestrates journal generation and a git hook for automatic triggering. Must handle edge cases like journal-only commits and merge commits.

## Solution Overview

Build an entry point that:
1. Provides CLI interface for manual and hook invocation
2. Skips journal-only commits (prevents recursion)
3. Handles merge commits intelligently (skip if no chat AND no diff)
4. Orchestrates the full pipeline: collect → filter → generate → save

## Key Learnings from v1

From PRD-32 (Journal File Filtering):
- **Journal-only commits**: Skip to prevent recursive generation
- **Merge commits**: Skip only if no chat AND no diff
- Check happens early, before expensive context collection

From v1 Architecture:
- CLI accepts optional commit ref (defaults to HEAD)
- Debug mode for verbose output
- Graceful error handling with informative messages

## Success Criteria

- [ ] CLI works with `npx commit-story` or `node src/index.js`
- [ ] Accepts optional commit reference argument
- [ ] Skips journal-entry-only commits
- [ ] Handles merge commits (skip silent merges, process others)
- [ ] Git hook installation script works
- [ ] Error messages are helpful

## Implementation Milestones

### Milestone 0: Research (Required First)
- [ ] Research Node.js CLI patterns (yargs vs commander vs native)
- [ ] Review git hook best practices
- [ ] Check cross-platform compatibility considerations
- [ ] Review v1 entry point for patterns to keep/change
- [ ] Document findings in `docs/research/prd-7-entry-point.md`

**Output**: Research document with CLI patterns and hook installation approaches

---

### Milestone 1: Basic CLI Entry Point
**Pre-requisite**: Read `docs/research/prd-7-entry-point.md` before starting
- [ ] Create `src/index.js` with shebang
- [ ] Parse command line arguments (commitRef, --debug)
- [ ] Validate git repository
- [ ] Basic error handling

### Milestone 2: Skip Logic
- [ ] Create `src/utils/commit-analyzer.js`
- [ ] Implement `isJournalEntriesOnlyCommit(commitRef)` function
- [ ] Implement `isMergeCommit(commitRef)` function
- [ ] Add early exit checks before context collection

### Milestone 3: Pipeline Orchestration
- [ ] Wire up context integrator
- [ ] Wire up AI generation
- [ ] Wire up journal manager
- [ ] Handle partial failures

### Milestone 4: Git Hook Installation
- [ ] Create `scripts/install-hook.sh`
- [ ] Create `scripts/uninstall-hook.sh`
- [ ] Handle existing hooks gracefully
- [ ] Create `.env.example` if needed

### Milestone 5: Error Handling & UX
- [ ] Informative error messages
- [ ] Debug mode with verbose output
- [ ] Progress indicators (optional)
- [ ] Exit codes for scripting

## API Design

```javascript
#!/usr/bin/env node
// src/index.js

/**
 * Main entry point
 * Usage: commit-story [commitRef] [--debug]
 */
async function main() {
  const commitRef = process.argv[2] || 'HEAD';
  const debug = process.argv.includes('--debug');

  // 1. Validate environment
  // 2. Check skip conditions
  // 3. Gather context
  // 4. Generate sections
  // 5. Save journal entry
}
```

## Skip Logic Details

### Journal-Only Commits
```javascript
async function isJournalEntriesOnlyCommit(commitRef) {
  const files = await getChangedFiles(commitRef);
  return files.every(f => f.startsWith('journal/entries/'));
}
```

**Why skip?**
- Prevents recursive generation (commit journal → triggers hook → generates journal about journal → ...)
- Reflections and context files are NOT skipped (manual content)

### Merge Commits
```javascript
async function shouldSkipMergeCommit(commitRef, context) {
  const { isMerge } = await isMergeCommit(commitRef);
  if (!isMerge) return false;

  const hasChat = context.chat.messageCount > 0;
  const hasDiff = context.commit.diff.trim().length > 0;

  // Skip ONLY if both no chat AND no diff
  return !hasChat && !hasDiff;
}
```

**Why this logic?** (from v1 PRD-32 DD-016):
- Merge with conflicts + no chat → Generate (conflict resolution)
- Merge with chat + no diff → Generate (strategic discussion)
- Clean merge + no chat + no diff → Skip (mechanical)

## Git Hook Script

```bash
#!/bin/bash
# .git/hooks/post-commit

# Run commit-story in background to not block commit
npx commit-story &
```

### Installation Script
```bash
#!/bin/bash
# scripts/install-hook.sh

HOOK_PATH=".git/hooks/post-commit"

if [ -f "$HOOK_PATH" ]; then
  echo "Warning: $HOOK_PATH already exists"
  echo "Please manually add: npx commit-story &"
  exit 1
fi

cat > "$HOOK_PATH" << 'EOF'
#!/bin/bash
npx commit-story &
EOF

chmod +x "$HOOK_PATH"
echo "Git hook installed successfully"
```

## Design Decisions

### DD-001: Skip Before Collection
**Decision**: Check skip conditions before gathering context
**Rationale**:
- Context collection is expensive (file I/O, git commands)
- Skip checks are cheap (single git command)
- Fail fast principle

### DD-002: Background Hook Execution
**Decision**: Run hook with `&` to not block git
**Rationale**:
- Journal generation takes seconds
- Don't make developer wait
- Output goes to background (not visible in terminal)

### DD-003: Merge Skip Logic
**Decision**: Skip merge only if BOTH no chat AND no diff
**Rationale**:
- Silent conflict resolution (no chat, has diff) → valuable
- Strategic merge discussion (has chat, no diff) → valuable
- Mechanical merge (no chat, no diff) → not valuable
- Conservative: only skip when definitely not valuable

### DD-004: Manual Hook Integration
**Decision**: Don't auto-merge with existing hooks
**Rationale**:
- Existing hooks might be complex
- Auto-merging could break things
- User knows their setup best
- Provide clear instructions instead

## CLI Usage

```bash
# Automatic (via git hook)
git commit -m "Add feature"
# → Hook runs commit-story in background

# Manual invocation
npx commit-story                    # Current commit (HEAD)
npx commit-story abc1234            # Specific commit
npx commit-story HEAD~3             # Three commits ago
npx commit-story --debug            # Verbose output

# Hook management
npx commit-story-init               # Install hook
npx commit-story-remove             # Remove hook
```

## Error Messages

```
❌ Not a git repository
   Run commit-story from within a git repository.

❌ ANTHROPIC_API_KEY not set
   Set your API key: export ANTHROPIC_API_KEY=your-key

⏭️  Skipping: only journal entries changed
   This commit only modified journal/entries/ files.

⏭️  Skipping: merge commit with no changes
   This merge commit has no chat context or code changes.

✅ Journal entry saved
   journal/entries/2026-01/2026-01-15.md
```

## Notes

- This is the user-facing component
- No telemetry in Phase 1 (instrumentation agent adds later)
- Keep output minimal by default (--debug for verbose)
- Exit codes: 0 = success, 1 = error, 2 = skipped
