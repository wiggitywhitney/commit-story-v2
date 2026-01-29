# PRD #3: Claude Collector

**GitHub Issue**: [#3](https://github.com/wiggitywhitney/commit-story-v2/issues/3)
**Status**: Complete
**Priority**: High
**Dependencies**: #1 (Project Setup)

## Problem Statement

Need to collect Claude Code chat history from local JSONL files for journal context. Must filter by repository path, time window, and group by session for AI comprehension.

## Solution Overview

Build a Claude collector module that:
1. Finds JSONL files in `~/.claude/projects/[project-path-encoded]/`
2. Parses messages and filters by `cwd` (repo path) and time window
3. Groups messages by `sessionId` for better AI context understanding
4. Does NOT attempt session isolation (v1 learned this adds complexity without value)

## Key Learnings from v1

From PRD-25 (Session Isolation - **Strategically Abandoned**):
- Multi-session isolation was attempted and abandoned due to complexity
- **Lesson**: Design for single Claude Code session per repo
- **Kept**: Session grouping (organize by sessionId) for AI comprehension
- **Removed**: Session filtering/selection logic

From Claude Chat Research (docs/dev/claude-chat-research.md):
- Storage: `~/.claude/projects/[project-path-encoded]/*.jsonl`
- Key fields: `sessionId`, `cwd`, `timestamp`, `type`, `message`, `isMeta`
- Time filtering: Messages between `previousCommitTime` and `commitTime`
- Timezone: Chat uses UTC ISO format (`2025-08-20T20:54:46.152Z`)

## Success Criteria

- [x] Find all JSONL files for the current project
- [x] Parse messages and filter by cwd match
- [x] Filter by time window (previous commit → current commit)
- [x] Group messages by sessionId
- [x] Return both flat list and grouped sessions

## Implementation Milestones

### Milestone 0: Research (Required First)
- [x] Verify Claude Code JSONL storage location hasn't changed
- [x] Check if message structure has evolved since v1 research (Aug 2025)
- [x] Research any new fields or patterns in Claude Code messages
- [x] Verify sessionId behavior and any changes
- [x] Document findings in `docs/research/prd-3-claude-collector.md`

**Output**: Research document with current Claude Code message structure and any changes from v1

---

### Milestone 1: Project Path Detection
**Pre-requisite**: Read `docs/research/prd-3-claude-collector.md` before starting
- [x] Create `src/collectors/claude-collector.js`
- [x] Implement `getClaudeProjectPath()` to find project directory
- [x] Handle path encoding (slashes → hyphens)
- [x] Verify directory exists

### Milestone 2: JSONL File Discovery
- [x] Implement `findJSONLFiles(projectPath)` function
- [x] Find all `*.jsonl` files in project directory
- [x] Return sorted by modification time (most recent first)

### Milestone 3: Message Parsing and Filtering
- [x] Implement `parseJSONLFile(filePath)` function
- [x] Implement `filterMessages(messages, repoPath, startTime, endTime)`
- [x] Filter by `cwd` field matching repo path
- [x] Filter by timestamp within time window
- [x] Handle timezone conversion (UTC)

### Milestone 4: Session Grouping
- [x] Implement `groupBySession(messages)` function
- [x] Group messages by `sessionId` field
- [x] Maintain chronological order within sessions
- [x] Return both flat array and session map

## API Design

```javascript
// src/collectors/claude-collector.js

/**
 * Collect Claude Code chat messages for a commit
 * @param {string} repoPath - Absolute path to repository
 * @param {Date} commitTime - Current commit timestamp
 * @param {Date} previousCommitTime - Previous commit timestamp
 * @returns {Promise<ChatData>}
 */
export async function collectChatMessages(repoPath, commitTime, previousCommitTime) {
  return {
    messages: Message[],           // Flat array of all messages
    sessions: Map<string, Message[]>,  // Grouped by sessionId
    sessionCount: number,          // Number of unique sessions
    messageCount: number,          // Total message count
    timeWindow: {
      start: Date,
      end: Date
    }
  };
}

/**
 * Message structure from Claude Code JSONL
 */
interface Message {
  uuid: string;
  parentUuid: string | null;
  sessionId: string;
  timestamp: Date;
  type: 'user' | 'assistant';
  message: {
    role: string;
    content: string | ContentBlock[];
  };
  cwd: string;
  isMeta?: boolean;
  gitBranch?: string;
}
```

## Message Structure Reference

See `docs/research/prd-3-claude-collector.md` for comprehensive analysis of Claude Code v2.1.x message structure.

Key findings:
- Version upgraded from 1.0.85 to 2.1.23
- 6 record types: user, assistant, progress, file-history-snapshot, queue-operation, system
- Only user and assistant types contain conversation content
- Path encoding uses hyphens for both slashes AND dots

```json
{
  "parentUuid": "previous-message-uuid",
  "isSidechain": false,
  "userType": "external",
  "cwd": "/working/directory/path",
  "sessionId": "session-uuid",
  "version": "2.1.23",
  "gitBranch": "main",
  "type": "user|assistant",
  "message": {
    "role": "user|assistant",
    "content": "string or array"
  },
  "isMeta": true|false,
  "uuid": "message-uuid",
  "timestamp": "2026-01-29T12:12:05.734Z"
}
```

## Design Decisions

### DD-001: No Session Isolation
**Decision**: Group sessions but don't try to select "the right one"
**Rationale**:
- v1 PRD-25 spent weeks on session isolation and abandoned it
- Time window truncation problem across commits
- Complexity explosion with /clear commands, sequential sessions
- Single-session workflow is the intended design

### DD-002: UTC-First Time Handling
**Decision**: Convert all timestamps to UTC for comparison
**Rationale**:
- Chat timestamps are UTC ISO format
- Git timestamps have local timezone offset
- Must normalize for accurate time window comparison
- Critical for international travel (conferences)

### DD-003: Session Grouping for AI Comprehension
**Decision**: Group messages by sessionId, pass all to generators
**Rationale**:
- AI can better understand conversation flow within sessions
- Doesn't filter out any context
- Provides structure without making selection decisions
- Matches v1's final implementation after PRD-25

### DD-004: Preserve Raw Content Structure
**Decision**: Keep `message.content` as-is (string or array)
**Rationale**:
- Content can be string (simple) or array (tool_use, text blocks)
- Context filter will handle transformation
- Preserves full fidelity for debugging

## Error Handling

- Claude projects directory not found: Return empty result, log warning
- JSONL parse error: Skip malformed lines, continue processing
- No messages in time window: Return empty arrays (valid case)
- Missing cwd field: Treat as non-matching (skip message)

## Notes

- This module has no telemetry (Phase 1 design)
- Message filtering (tool_use, isMeta) happens in Context Integration (#4)
- The collector's job is to get raw messages; filtering is a separate concern
- Single-session workflow is documented, not enforced (be graceful with multi-session)
