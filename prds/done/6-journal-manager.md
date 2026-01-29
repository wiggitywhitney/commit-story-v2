# PRD #6: Journal Manager

**GitHub Issue**: [#6](https://github.com/wiggitywhitney/commit-story-v2/issues/6)
**Status**: Complete
**Priority**: High
**Dependencies**: #5 (AI Generation)

## Problem Statement

Need to write generated journal sections to markdown files and discover user reflections for inclusion in entries. Files should be organized by date with consistent formatting.

## Solution Overview

Build a journal manager that:
1. Writes journal entries to `journal/entries/YYYY-MM/YYYY-MM-DD.md`
2. Discovers reflections from `journal/reflections/` for time window
3. Formats entries with consistent structure
4. Handles file creation, appending, and directory management

## Key Learnings from v1

From PRD-17 (Reflection Tool):
- Reflections stored in `journal/reflections/YYYY-MM/YYYY-MM-DD.md`
- Discovery filters by time window (previousCommit → currentCommit)
- Reflections displayed in dedicated section, not mixed with AI content
- UTC-first timestamp handling for international travel

From v1 Architecture:
- Journal paths utility for consistent path generation
- Separator bars between entries
- Timezone-aware timestamp formatting

## Success Criteria

- [x] Create journal directories if needed
- [x] Write entries with proper formatting
- [x] Append multiple entries per day
- [x] Discover reflections for commit time window
- [x] Include reflections in dedicated section
- [x] Handle timezone properly in timestamps

## Implementation Milestones

### Milestone 0: Research (Required First)
- [x] Review Node.js fs/promises API best practices
- [x] Research timezone handling in JavaScript (Temporal API status?)
- [x] Check markdown formatting conventions
- [x] Review v1 journal-paths.js for reusable patterns
- [x] Document findings in `docs/research/prd-6-journal-manager.md`

**Output**: Research document with file I/O patterns and timezone handling approaches

---

### Milestone 1: Path Utilities
**Pre-requisite**: Read `docs/research/prd-6-journal-manager.md` before starting
- [x] Create `src/utils/journal-paths.js`
- [x] Implement `getJournalEntryPath(date)` function
- [x] Implement `getReflectionPath(date)` function
- [x] Handle directory creation

### Milestone 2: Entry Formatting
- [x] Create `src/managers/journal-manager.js`
- [x] Implement `formatJournalEntry(sections, commit, reflections)`
- [x] Include timestamp, commit hash, all sections
- [x] Add separator bars between entries
- [x] Format reflections section if present

### Milestone 3: File Writing
- [x] Implement `saveJournalEntry(entry, date)` function
- [x] Create directory if needed
- [x] Append to existing file or create new
- [x] Handle file system errors gracefully

### Milestone 4: Reflection Discovery
- [x] Implement `discoverReflections(startTime, endTime)` function
- [x] Find reflection files for time window
- [x] Parse reflection timestamps
- [x] Filter to time window
- [x] Return chronologically sorted

## API Design

```javascript
// src/managers/journal-manager.js

/**
 * Save a journal entry for a commit
 * @param {JournalSections} sections - Generated sections from AI
 * @param {CommitData} commit - Commit metadata
 * @param {Date} previousCommitTime - For reflection discovery
 * @returns {Promise<string>} - Path to saved file
 */
export async function saveJournalEntry(sections, commit, previousCommitTime) {
  // ...
}

/**
 * Discover reflections in a time window
 * @param {Date} startTime - Beginning of window
 * @param {Date} endTime - End of window
 * @returns {Promise<Reflection[]>}
 */
export async function discoverReflections(startTime, endTime) {
  return [{
    timestamp: Date,
    content: string,
    filePath: string
  }];
}
```

## Journal Entry Format

```markdown
## 10:15:32 AM CDT - Commit: abc1234

### Summary
{AI-generated summary}

### Development Dialogue
{AI-extracted quotes}

### Technical Decisions
{AI-identified decisions}

### Developer Reflections
> 9:45:00 AM - "Realized the issue was in the async handling..."

### Commit Details
- **Hash**: abc1234def5678
- **Author**: Whitney Lee
- **Files Changed**: 5

═══════════════════════════════════════
```

## Directory Structure

```
journal/
  entries/
    2026-01/
      2026-01-15.md    # May have multiple entries
      2026-01-16.md
  reflections/
    2026-01/
      2026-01-15.md    # Manual reflections
  context/
    2026-01/
      2026-01-15.md    # Context captures (from MCP tool)
```

## Design Decisions

### DD-001: Reflections as Dedicated Section
**Decision**: Display reflections in their own section, not mixed with AI
**Rationale**:
- Preserves authenticity of human-written content
- Clear attribution (human vs AI)
- Avoids AI misinterpreting or duplicating reflections
- v1 PRD-17 DD-007 established this pattern

### DD-002: UTC-First Time Handling
**Decision**: Convert timestamps to UTC for comparison, display in local
**Rationale**:
- Reflection timestamps may have different timezone than commit
- UTC comparison ensures accurate time window filtering
- Local display maintains readability
- Critical for international conference travel

### DD-003: Append, Don't Replace
**Decision**: Multiple entries per day append to same file
**Rationale**:
- Multiple commits in a day is common
- Preserves full development story
- Separator bars clearly delineate entries

### DD-004: Silent Directory Creation
**Decision**: Create directories as needed without prompting
**Rationale**:
- Reduces friction
- Standard behavior for file writers
- Directories are cheap

## Reflection Parsing

Reflections use same format as entries:
```markdown
## 9:45:00 AM CDT - Manual Reflection

Realized the issue was in the async handling...

═══════════════════════════════════════
```

Parsing extracts:
- Timestamp from header
- Content between header and separator
- Converts timestamp to UTC for filtering

## Notes

- This module has no telemetry (Phase 1 design)
- Path utilities are shared with MCP tools
- Timezone handling is critical - test with different TZ
- Keep formatting consistent with v1 for familiarity
