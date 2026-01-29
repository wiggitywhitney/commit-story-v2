# PRD #3 Research: Claude Collector

**Date**: 2026-01-29
**Status**: Complete
**Purpose**: Verify Claude Code JSONL storage structure and identify changes since v1 research (Aug 2025)

## Summary of Changes from v1

The Claude Code storage format has evolved significantly since v1 (version 1.0.85). Current version is **2.1.23**.

### Key Changes

| Aspect | v1 (Aug 2025) | v2 (Jan 2026) |
|--------|---------------|---------------|
| Version | 1.0.85 | 2.1.23 |
| File-history snapshots | Not present | New record type |
| Sessions index | Not documented | `sessions-index.json` exists |
| Assistant message structure | Simple content array | Includes model metadata, usage stats |
| Request tracking | Not present | `requestId` field on assistant messages |

## Storage Location (Unchanged)

```text
~/.claude/projects/[project-path-encoded]/*.jsonl
```

**Path Encoding**: Forward slashes replaced with hyphens
- `/Users/whitney.lee/Documents/Repositories/commit-story-v2`
- Becomes: `-Users-whitney-lee-Documents-Repositories-commit-story-v2`

**Files in project directory**:
- `*.jsonl` - Chat history files (one per session)
- `sessions-index.json` - Session metadata index (new)
- `[sessionId]/` - Directories for file backups (new)

## Message Structure (Updated)

### User Messages (Unchanged from v1)

```json
{
  "parentUuid": "previous-message-uuid",
  "isSidechain": false,
  "userType": "external",
  "cwd": "/working/directory/path",
  "sessionId": "session-uuid",
  "version": "2.1.23",
  "gitBranch": "main",
  "type": "user",
  "message": {
    "role": "user",
    "content": "string or array"
  },
  "isMeta": true,
  "uuid": "message-uuid",
  "timestamp": "2026-01-29T12:12:05.734Z"
}
```

### Assistant Messages (Updated)

```json
{
  "parentUuid": "user-message-uuid",
  "isSidechain": false,
  "userType": "external",
  "cwd": "/working/directory/path",
  "sessionId": "session-uuid",
  "version": "2.1.23",
  "gitBranch": "main",
  "message": {
    "model": "claude-opus-4-5-20251101",
    "id": "msg_01QcnTLdAS8S7jucefmAofqx",
    "type": "message",
    "role": "assistant",
    "content": [
      {
        "type": "text",
        "text": "Response text here"
      }
    ],
    "stop_reason": null,
    "stop_sequence": null,
    "usage": {
      "input_tokens": 3,
      "cache_creation_input_tokens": 14953,
      "cache_read_input_tokens": 10349,
      "output_tokens": 3,
      "service_tier": "standard"
    }
  },
  "requestId": "req_011CXbeYLj4mtNwwDpMVQRqD",
  "type": "assistant",
  "uuid": "message-uuid",
  "timestamp": "2026-01-29T12:12:16.341Z"
}
```

**New fields in assistant messages**:
- `message.model` - Model ID used for response
- `message.id` - API message ID
- `message.usage` - Token usage statistics
- `message.stop_reason`, `message.stop_sequence` - Completion info
- `requestId` - API request ID

## Record Types (Comprehensive)

Analysis of actual JSONL files reveals 6 distinct outer record types:

| Type | Count (sample) | Purpose |
|------|----------------|---------|
| `user` | 278 | User messages |
| `assistant` | 444 | Assistant responses |
| `progress` | 1241 | Progress tracking (hooks, bash, mcp) |
| `file-history-snapshot` | 44 | File backup tracking |
| `queue-operation` | 14 | User input queuing |
| `system` | 6 | System metrics (turn duration) |

### File History Snapshots

```json
{
  "type": "file-history-snapshot",
  "messageId": "associated-message-uuid",
  "snapshot": {
    "messageId": "associated-message-uuid",
    "trackedFileBackups": {},
    "timestamp": "2026-01-29T12:12:05.735Z"
  },
  "isSnapshotUpdate": false
}
```

### Progress Records (New)

Tracks various progress events during execution:

```json
{
  "type": "progress",
  "data": {
    "type": "hook_progress",
    "hookEvent": "PostToolUse",
    "hookName": "PostToolUse:Glob",
    "command": "callback"
  },
  "toolUseID": "toolu_01YbkPVRgDYPU161PiMztrUL",
  "parentToolUseID": "toolu_01YbkPVRgDYPU161PiMztrUL",
  "timestamp": "2026-01-29T12:12:17.458Z",
  "uuid": "72e0e4e6-d178-44cb-827a-42677575af1c"
}
```

Progress subtypes (in `data.type`):
- `hook_progress` - Hook execution events
- `bash_progress` - Bash command execution progress
- `mcp_progress` - MCP tool execution progress

### Queue Operations (New)

Tracks user input queuing when typing while Claude responds:

```json
{
  "type": "queue-operation",
  "operation": "enqueue",
  "timestamp": "2026-01-29T12:24:38.494Z",
  "sessionId": "session-uuid",
  "content": "User message content queued..."
}
```

### System Records (New)

Tracks system metrics like turn duration:

```json
{
  "type": "system",
  "subtype": "turn_duration",
  "durationMs": 61535,
  "timestamp": "2026-01-29T12:17:27.522Z",
  "uuid": "uuid",
  "isMeta": false
}
```

### Filtering Recommendation

**Keep for journal context**:
- `type === "user"` - User messages
- `type === "assistant"` - Assistant responses

**Skip (noise for journal)**:
- `type === "file-history-snapshot"` - Internal file tracking
- `type === "progress"` - Execution progress events
- `type === "queue-operation"` - Input queue tracking
- `type === "system"` - System metrics

## Sessions Index (New)

```json
{
  "version": 1,
  "entries": [
    {
      "sessionId": "18cf1c76-942f-4e0b-be5a-9e6bd3b80a4f",
      "fullPath": "/Users/.../.jsonl",
      "fileMtime": 1769690516892,
      "firstPrompt": "First message preview...",
      "summary": "Session summary",
      "messageCount": 2,
      "created": "2026-01-29T12:10:12.460Z",
      "modified": "2026-01-29T12:11:17.219Z",
      "gitBranch": "main",
      "projectPath": "/Users/.../commit-story-v2",
      "isSidechain": false
    }
  ],
  "originalPath": "/Users/.../commit-story-v2"
}
```

**Note**: This index is useful for quick session discovery, but we should still parse JSONL files directly for message extraction (index may be stale).

## Filtering Logic (Updated)

### Collector-Level Filtering (Record Types)

Skip these outer record types entirely in the collector:
```javascript
const SKIP_RECORD_TYPES = new Set([
  'file-history-snapshot',
  'progress',
  'queue-operation',
  'system',
]);
```

### Context Integration Filtering (Message Content)

These filters apply during context integration, not collection:

1. **Meta messages**: `record.isMeta === true`
2. **Tool calls**: `content.some(item => item.type === "tool_use")`
3. **Tool results**: `content.some(item => item.type === "tool_result")`

### Records to Keep for Journal

1. **Human input**: `type === "user"` AND `typeof content === "string"` AND NOT `isMeta`
2. **Assistant responses**: `type === "assistant"` AND `content.some(item => item.type === "text")`

## Time Handling (Unchanged)

- **Chat timestamps**: UTC ISO format `2026-01-29T12:12:05.734Z`
- **Git timestamps**: Local timezone with offset `2026-01-29T07:12:05-05:00`
- **Strategy**: Convert both to JavaScript `Date` objects, which normalizes to UTC for comparison

## Implementation Recommendations

### Message Extraction Algorithm

```javascript
const SKIP_RECORD_TYPES = new Set([
  'file-history-snapshot',
  'progress',
  'queue-operation',
  'system',
]);

function extractMessages(filePath, repoPath, startTime, endTime) {
  const messages = [];
  const lines = readFileSync(filePath, 'utf-8').split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const record = JSON.parse(line);

      // Skip non-conversation records
      if (SKIP_RECORD_TYPES.has(record.type)) continue;

      // Must have required fields
      if (!record.timestamp || !record.uuid) continue;

      // Filter by cwd (project path)
      if (record.cwd !== repoPath) continue;

      // Filter by time window
      const messageTime = new Date(record.timestamp);
      if (messageTime < startTime || messageTime > endTime) continue;

      messages.push(record);
    } catch {
      // Skip malformed JSON lines
      continue;
    }
  }

  return messages;
}
```

### SessionId Behavior

- SessionId is consistent within a chat session
- JSONL filename matches sessionId (e.g., `1e3222c4-c061-4232-9dd0-ec1fe874e7e9.jsonl`)
- Multiple sessions may exist for the same project
- Design decision from v1 PRD-25: Group by session but don't filter/select sessions

### Edge Cases to Handle

1. **Empty lines**: Skip empty/whitespace-only lines in JSONL
2. **Malformed JSON**: Log warning and skip line, don't fail entire file
3. **Missing cwd**: Treat as non-matching (skip message)
4. **Missing timestamp**: Skip message (can't apply time filter)
5. **Null parentUuid**: Valid for first message in session

## Conclusion

The core extraction logic from v1 remains valid. Key updates needed:

1. **Add filter for `file-history-snapshot` records** - New record type that should be skipped
2. **Handle new assistant message structure** - Message content is nested deeper but extraction pattern is the same
3. **Optional**: Could use `sessions-index.json` for optimization but not required

The v1 design decisions (DD-001 through DD-004) remain valid and applicable.
