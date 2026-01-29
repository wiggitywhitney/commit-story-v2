# MCP Server Integration Testing Guide

## Prerequisites

- Claude Code installed and running
- commit-story repository cloned
- Node.js 18+ installed

## Step 1: Configure MCP Server

Add to your Claude Code `.mcp.json` (typically at project root or `~/.mcp.json`):

```json
{
  "mcpServers": {
    "commit-story": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/commit-story-v2/src/mcp/server.js"]
    }
  }
}
```

Replace `/ABSOLUTE/PATH/TO/` with the actual path to your commit-story-v2 repository.

## Step 2: Restart Claude Code

After saving the `.mcp.json` file, restart Claude Code to load the MCP server.

## Step 3: Verify Tool Discovery

1. In Claude Code, type a message and look for the MCP tools indicator
2. You should see two tools available:
   - `journal_add_reflection`
   - `journal_capture_context`

## Step 4: Test Reflection Tool

Say to Claude Code:
```
capture a reflection: I just learned how MCP servers work with Claude Code
```

**Expected behavior:**
- Claude calls `journal_add_reflection` with the insight
- File created at `journal/reflections/YYYY-MM/YYYY-MM-DD.md`
- Response confirms the save location

**Verify:**
```bash
ls journal/reflections/
cat journal/reflections/*/$(date +%Y-%m-%d).md
```

## Step 5: Test Context Capture Tool

### Comprehensive Context
Say to Claude Code:
```
capture context
```

**Expected behavior:**
- Claude provides a comprehensive context dump
- File created at `journal/context/YYYY-MM/YYYY-MM-DD.md`
- Context includes current project understanding, recent work, decisions

### Specific Context
Say to Claude Code:
```
capture why we chose the MCP SDK for this project
```

**Expected behavior:**
- Claude provides specific context about that decision
- Appended to the same day's context file

**Verify:**
```bash
ls journal/context/
cat journal/context/*/$(date +%Y-%m-%d).md
```

## Step 6: Verify Timestamp Format

Check that entries have correct timestamp format:
```
## 10:15:32 AM EST - Manual Reflection

[content]

═══════════════════════════════════════
```

The timestamp should:
- Include time in 12-hour format with seconds
- Show AM/PM
- Include timezone abbreviation (e.g., EST, PST, CDT)

## Step 7: Test File Appending

1. Run the reflection tool twice in the same day
2. Verify both entries appear in the same file with separator bars between them

## Troubleshooting

### Server doesn't start
Check stderr output:
```bash
node src/mcp/server.js 2>&1
```

Should print: `Commit Story MCP Server running on stdio`

### Tools not appearing
1. Verify `.mcp.json` syntax is valid JSON
2. Check path is absolute, not relative
3. Restart Claude Code completely

### Files not created
1. Check directory permissions
2. Verify you're in the correct working directory
3. Check for errors in tool response

## Test Checklist

- [ ] MCP server configured in `.mcp.json`
- [ ] Claude Code restarted
- [ ] Both tools visible in tool list
- [ ] Reflection tool creates file with correct format
- [ ] Context capture (comprehensive) works
- [ ] Context capture (specific) works
- [ ] Timestamps include timezone
- [ ] Multiple entries append to same daily file
- [ ] Separator bars between entries
