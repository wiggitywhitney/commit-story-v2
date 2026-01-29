# PRD #2: Git Collector

**GitHub Issue**: [#2](https://github.com/wiggitywhitney/commit-story-v2/issues/2)
**Status**: Pending
**Priority**: High
**Dependencies**: #1 (Project Setup)

## Problem Statement

Need to extract git commit data (hash, message, author, timestamp, diff) for journal generation. The diff must exclude journal entries to prevent context pollution.

## Solution Overview

Build a git collector module that:
1. Extracts commit metadata via `git show`
2. Extracts diff via `git diff-tree` with pathspec filtering
3. Filters out `journal/entries/**` from diffs
4. Handles merge commits appropriately

## Key Learnings from v1

From PRD-32 (Journal File Filtering):
- **Problem**: Old journal entries in diffs caused AI to reference outdated context
- **Solution**: Use git pathspec `:!journal/entries/` to filter at collection time
- **Merge commits**: Use `-m --first-parent` flags to detect diffs in merges

## Success Criteria

- [ ] Extract commit hash, message, author, timestamp
- [ ] Extract diff excluding `journal/entries/**` files
- [ ] Handle merge commits (detect via parent count)
- [ ] Return structured data for context integrator

## Implementation Milestones

### Milestone 0: Research (Required First)
- [ ] Review git diff-tree options and pathspec syntax
- [ ] Research merge commit handling best practices
- [ ] Check if there are better git libraries for Node.js (vs exec)
- [ ] Verify v1 git commands still work with current git versions
- [ ] Document findings in `docs/research/prd-2-git-collector.md`

**Output**: Research document with git command patterns and any library recommendations

---

### Milestone 1: Basic Commit Data Extraction
**Pre-requisite**: Read `docs/research/prd-2-git-collector.md` before starting
- [ ] Create `src/collectors/git-collector.js`
- [ ] Implement `getCommitData(commitRef)` function
- [ ] Extract: hash, message, author, timestamp
- [ ] Use `git show --no-patch --format=...`

### Milestone 2: Diff Extraction with Filtering
- [ ] Implement `getCommitDiff(commitRef)` function
- [ ] Use `git diff-tree -p -m --first-parent` for merge support
- [ ] Add pathspec `:!journal/entries/` to exclude journal files
- [ ] Handle empty diffs gracefully

### Milestone 3: Previous Commit Detection
- [ ] Implement `getPreviousCommitTime(commitRef)` function
- [ ] Used for time window calculation in Claude collector
- [ ] Handle first commit edge case (no previous)

### Milestone 4: Merge Commit Detection
- [ ] Implement `isMergeCommit(commitRef)` function
- [ ] Use `git rev-list --parents -n 1` to count parents
- [ ] Return `{ isMerge: boolean, parentCount: number }`

## API Design

```javascript
// src/collectors/git-collector.js

/**
 * Get commit metadata and diff
 * @param {string} commitRef - Git commit reference (default: HEAD)
 * @returns {Promise<CommitData>}
 */
export async function getCommitData(commitRef = 'HEAD') {
  return {
    hash: string,           // Full commit hash
    shortHash: string,      // 7-char short hash
    message: string,        // Full commit message
    subject: string,        // First line of message
    author: string,         // Author name
    authorEmail: string,    // Author email
    timestamp: Date,        // Commit timestamp (Date object)
    diff: string,           // Filtered diff content
    isMerge: boolean,       // Is this a merge commit?
    parentCount: number     // Number of parent commits
  };
}

/**
 * Get timestamp of previous commit
 * @param {string} commitRef - Git commit reference
 * @returns {Promise<Date|null>} - Previous commit time, null if first commit
 */
export async function getPreviousCommitTime(commitRef = 'HEAD') {
  // ...
}
```

## Git Commands Used

```bash
# Commit metadata
git show --no-patch --format='%H|%h|%s|%B|%an|%ae|%aI' HEAD

# Diff with journal filtering (including merge support)
git diff-tree -p -m --first-parent HEAD -- . ':!journal/entries/'

# Previous commit timestamp
git log -2 --format='%aI' HEAD | tail -1

# Merge detection
git rev-list --parents -n 1 HEAD
```

## Design Decisions

### DD-001: Filter at Collection Time
**Decision**: Apply journal filtering in git command, not post-processing
**Rationale**:
- More efficient (git handles filtering)
- Cleaner architecture (collector returns clean data)
- Matches v1 PRD-32 solution

### DD-002: Merge Commit Flags
**Decision**: Use `-m --first-parent` for merge commit diffs
**Rationale**:
- Without these flags, `git diff-tree -p` shows no output for merges
- `-m` shows diff against each parent
- `--first-parent` focuses on changes from merge perspective
- Learned from v1 PRD-32 Phase 5 validation

### DD-003: UTC Timestamps
**Decision**: Convert all timestamps to UTC Date objects
**Rationale**:
- Git uses local timezone with offset
- Claude collector uses UTC ISO format
- Normalizing to UTC enables accurate time window comparison
- Critical for international travel (v1 PRD-17 lesson)

## Error Handling

- Invalid commit ref: Return descriptive error
- Not a git repo: Check before operations, fail gracefully
- Empty diff: Return empty string, not an error (valid case)

## Notes

- This module has no telemetry (Phase 1 design)
- The instrumentation agent will add spans in Phase 3
- Keep git command construction readable for demo purposes
