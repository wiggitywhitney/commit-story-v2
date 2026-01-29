# PRD #8 Research: MCP Server

## Research Date: January 2026

## Summary

This document covers the @modelcontextprotocol/sdk API patterns for building MCP servers with tools, focusing on Node.js/TypeScript with stdio transport.

---

## 1. MCP SDK Overview

### Current Version
- **SDK Version**: 1.25.3 (latest stable)
- **Status**: v1.x is recommended for production; v2 expected Q1 2026
- **Required Peer Dependency**: `zod` for schema validation (v3.25+)

### Installation
```bash
npm install @modelcontextprotocol/sdk zod
```

### Key Imports
```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
```

---

## 2. Server Creation Pattern

### Basic Server Setup
```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create server instance
const server = new McpServer({
  name: "commit-story",
  version: "2.0.0",
});

// Create and connect transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio"); // Use stderr, not stdout!
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

### Critical: Logging Rules for STDIO Servers
**NEVER use `console.log()` in STDIO servers** - it writes to stdout and corrupts JSON-RPC messages.

```javascript
// ❌ Bad (STDIO) - breaks the server
console.log("Server started");

// ✅ Good (STDIO) - stderr is safe
console.error("Server started");
```

---

## 3. Tool Registration Pattern

### Using server.registerTool()
```javascript
import { z } from "zod";

server.registerTool(
  "tool_name",
  {
    description: "Description of what the tool does",
    inputSchema: {
      paramName: z.string().describe("Parameter description"),
      optionalParam: z.number().optional().describe("Optional param"),
    },
  },
  async ({ paramName, optionalParam }) => {
    // Tool implementation
    const result = await doSomething(paramName);

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }
);
```

### Tool Response Format
Tools must return a specific format:
```javascript
{
  content: [
    {
      type: "text",
      text: "The text content to return"
    }
  ]
}
```

### Error Handling in Tools
```javascript
server.registerTool(
  "example_tool",
  { description: "...", inputSchema: { ... } },
  async (params) => {
    try {
      const result = await riskyOperation(params);
      return {
        content: [{ type: "text", text: result }],
      };
    } catch (error) {
      // Return error as text, don't throw
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
      };
    }
  }
);
```

---

## 4. Zod Schema Patterns

### String Parameter
```javascript
inputSchema: {
  text: z.string().describe("The text to process"),
}
```

### Number with Constraints
```javascript
inputSchema: {
  latitude: z.number().min(-90).max(90).describe("Latitude"),
  longitude: z.number().min(-180).max(180).describe("Longitude"),
}
```

### String with Length Constraint
```javascript
inputSchema: {
  state: z.string().length(2).describe("Two-letter state code"),
}
```

### Optional Parameters
```javascript
inputSchema: {
  required: z.string().describe("Required param"),
  optional: z.string().optional().describe("Optional param"),
}
```

---

## 5. Commit-Story Tool Designs

### Reflection Tool
Based on PRD requirements and SDK patterns:

```javascript
server.registerTool(
  "journal_add_reflection",
  {
    description: "Capture a timestamped reflection or insight during development",
    inputSchema: {
      text: z.string().describe("The reflection or insight to capture"),
    },
  },
  async ({ text }) => {
    // Implementation: write to journal/reflections/YYYY-MM/YYYY-MM-DD.md
    const savedPath = await saveReflection(text);
    return {
      content: [
        {
          type: "text",
          text: `Reflection saved to ${savedPath}`,
        },
      ],
    };
  }
);
```

### Context Capture Tool
```javascript
server.registerTool(
  "journal_capture_context",
  {
    description:
      "Capture development context. If the user requests specific context " +
      "(e.g., 'capture why we chose X'), provide that specific content. Otherwise, " +
      "provide a comprehensive context capture of your current understanding of " +
      "this project, recent development insights, and key context that would help " +
      "a fresh AI understand where we are and how we got here.",
    inputSchema: {
      text: z.string().describe("The context to capture"),
    },
  },
  async ({ text }) => {
    // Implementation: write to journal/context/YYYY-MM/YYYY-MM-DD.md
    const savedPath = await saveContext(text);
    return {
      content: [
        {
          type: "text",
          text: `Context saved to ${savedPath}`,
        },
      ],
    };
  }
);
```

**Key Design Decision**: The tool description guides Claude on how to use the tool (comprehensive vs specific context). This is cleaner than a separate mode parameter.

---

## 6. File Writing Pattern

### Append to Daily File
```javascript
import { mkdir, appendFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

async function appendToFile(filePath, content) {
  // Ensure directory exists
  await mkdir(dirname(filePath), { recursive: true });

  // Append content
  await appendFile(filePath, content, 'utf-8');
}
```

### Entry Format
```markdown
## 10:15:32 AM CDT - [Type]

[Content here]

═══════════════════════════════════════

```

### Timestamp Formatting
```javascript
function formatTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}
```

---

## 7. ES Module Considerations

### Package.json Requirements
```json
{
  "type": "module",
  "bin": {
    "commit-story-mcp": "src/mcp/server.js"
  }
}
```

### Shebang for CLI Execution
```javascript
#!/usr/bin/env node
```

---

## 8. Claude Code Configuration

### .mcp.json Format
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

### Alternative: Direct npx
```json
{
  "mcpServers": {
    "commit-story": {
      "command": "npx",
      "args": ["commit-story-mcp"]
    }
  }
}
```

---

## 9. Reusable Patterns from v1

### From PRD-17 (Reflection Tool)
- Storage: `journal/reflections/YYYY-MM/YYYY-MM-DD.md`
- Separator bar: `═══════════════════════════════════════`
- Include timezone in timestamp for accuracy
- Reflections integrate with journal generation naturally

### From PRD-18 (Context Capture Tool)
- Storage: `journal/context/YYYY-MM/YYYY-MM-DD.md`
- Description-guided modes (no separate parameter needed)
- Context stays in chat history (DD-014) - generators see tool calls
- No special injection into prompts needed

---

## 10. Implementation Plan

### File Structure
```
src/mcp/
├── server.js           # Main MCP server entry point
└── tools/
    ├── reflection-tool.js
    └── context-capture-tool.js
```

### Shared Utilities
Reuse from journal-manager.js:
- `getYearMonth(date)` for path generation
- Directory structure matches entries pattern

### Error Handling Strategy
- Tools should never crash the server
- Return error messages as text content
- Use console.error for logging (not console.log)

---

## Sources

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [@modelcontextprotocol/sdk on npm](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [Build an MCP Server - Official Docs](https://modelcontextprotocol.io/docs/develop/build-server)
- [How to build MCP servers with TypeScript SDK](https://dev.to/shadid12/how-to-build-mcp-servers-with-typescript-sdk-1c28)
