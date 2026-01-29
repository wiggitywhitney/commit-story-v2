# PRD #8: MCP Server

**GitHub Issue**: [#8](https://github.com/wiggitywhitney/commit-story-v2/issues/8)
**Status**: In Progress
**Priority**: Medium
**Dependencies**: #1 (Project Setup), #6 (Journal Manager - for path utilities)

## Problem Statement

Need MCP tools for real-time context capture during development. This enables capturing reflections and working context that enrich journal entries.

## Solution Overview

Build an MCP server with two tools:
1. **Reflection Tool**: Capture timestamped human insights
2. **Context Capture Tool**: Capture AI working memory

Both tools write to the journal directory structure and integrate with journal generation via chat flow.

## Key Learnings from v1

From PRD-17 (Reflection Tool):
- Storage: `journal/reflections/YYYY-MM/YYYY-MM-DD.md`
- Format: Timestamp header + content + separator
- UTC-first for timezone handling
- Reflections appear in dedicated journal section

From PRD-18 (Context Capture Tool):
- Storage: `journal/context/YYYY-MM/YYYY-MM-DD.md`
- Two modes: comprehensive dump vs specific capture
- Context integrates via chat flow (DD-014), not file parsing
- Tool calls preserved in chat history for generators

## Success Criteria

- [x] MCP server starts and accepts connections
- [x] Reflection tool captures timestamped thoughts
- [x] Context capture tool captures working memory
- [x] Both tools write to correct directories
- [x] Files formatted consistently with entries
- [ ] Tools registered with Claude Code

## Implementation Milestones

### Milestone 0: Research (Required First) ✅
- [x] Research current @modelcontextprotocol/sdk API and patterns
- [x] Check MCP server best practices and examples
- [x] Review any changes to MCP protocol since v1
- [x] Research tool description patterns that work well with Claude
- [x] Review v1 MCP server implementation for reusable patterns
- [x] Document findings in `docs/research/prd-8-mcp-server.md`

**Output**: Research document with MCP patterns and tool design approaches

---

### Milestone 1: MCP Server Setup ✅
**Pre-requisite**: Read `docs/research/prd-8-mcp-server.md` before starting
- [x] Create `src/mcp/server.js`
- [x] Set up stdio transport
- [x] Implement tool registration
- [x] Handle connection lifecycle

### Milestone 2: Reflection Tool ✅
- [x] Create `src/mcp/tools/reflection-tool.js`
- [x] Accept text input
- [x] Generate timestamp
- [x] Write to reflections directory
- [x] Append to existing daily file

### Milestone 3: Context Capture Tool ✅
- [x] Create `src/mcp/tools/context-capture-tool.js`
- [x] Two-mode support (comprehensive vs specific) via description
- [x] Write to context directory
- [x] Append to existing daily file

### Milestone 4: Integration Testing
- [ ] Test with Claude Code
- [ ] Verify file creation and appending
- [ ] Test timezone handling
- [ ] Verify tool discovery

## API Design

### Reflection Tool
```javascript
// Tool: journal_add_reflection
{
  name: "journal_add_reflection",
  description: "Capture a timestamped reflection or insight during development",
  inputSchema: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "The reflection or insight to capture"
      }
    },
    required: ["text"]
  }
}
```

### Context Capture Tool
```javascript
// Tool: journal_capture_context
{
  name: "journal_capture_context",
  description: "Capture development context. If the user requests specific context " +
    "(e.g., 'capture why we chose X'), provide that specific content. Otherwise, " +
    "provide a comprehensive context capture of your current understanding of " +
    "this project, recent development insights, and key context that would help " +
    "a fresh AI understand where we are and how we got here.",
  inputSchema: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "The context to capture"
      }
    },
    required: ["text"]
  }
}
```

## File Format

### Reflection File
```markdown
## 10:15:32 AM CDT - Manual Reflection

Just realized the issue was in the async handling - the Promise
wasn't being awaited properly. This is a common pattern I should
watch for.

═══════════════════════════════════════

## 2:30:45 PM CDT - Manual Reflection

Decided to go with option B for the API design because...

═══════════════════════════════════════
```

### Context File
```markdown
## 10:15:32 AM CDT - Context Capture

Current focus: Implementing the authentication flow.

Recent progress:
- Added JWT validation
- Set up refresh token rotation
- Integrated with user service

Key decisions:
- Using short-lived access tokens (15 min)
- Refresh tokens stored in httpOnly cookies

Next steps:
- Add rate limiting
- Implement logout (token invalidation)

═══════════════════════════════════════
```

## MCP Server Configuration

For Claude Code integration, add to `.mcp.json`:
```json
{
  "mcpServers": {
    "commit-story": {
      "command": "node",
      "args": ["node_modules/commit-story/src/mcp/server.js"]
    }
  }
}
```

## Design Decisions

### DD-001: Description-Guided Two Modes
**Decision**: Context tool uses description to guide comprehensive vs specific
**Rationale**:
- v1 tried prompt-return mechanism (awkward round-trip)
- Tool description guides AI behavior naturally
- Single API call for both modes
- v1 PRD-18 DD-013

### DD-002: Context via Chat Flow
**Decision**: Context capture tool calls stay in chat, not parsed from files
**Rationale**:
- Preserves temporal position in conversation
- No special injection into prompts
- Natural prioritization by AI
- v1 PRD-18 DD-014

### DD-003: Daily Files with Append
**Decision**: One file per day, multiple entries append
**Rationale**:
- Consistent with journal entries pattern
- Easy to browse by date
- Separator bars delineate entries

### DD-004: UTC Timestamp Storage
**Decision**: Store timestamps in local format with timezone
**Rationale**:
- Human readable in files
- Timezone preserved for accurate parsing
- Consistent with entries format
- v1 PRD-17 learned timezone importance

## Usage Patterns

### Reflection Tool
```
User: "I just realized why the tests were flaky"
AI: [calls journal_add_reflection with user's insight]
```

### Context Capture - Comprehensive
```
User: "capture context"
AI: [provides comprehensive analysis of current work in tool call]
```

### Context Capture - Specific
```
User: "capture why we chose postgres over mongodb"
AI: [provides specific context about that decision in tool call]
```

## Notes

- MCP server can run independently of main CLI
- No telemetry in Phase 1 (instrumentation agent adds later)
- Tools should fail gracefully (return error message, don't crash)
- Session ID detection from v1 is optional (may add complexity)
- Priority is Medium - core journal works without MCP tools
