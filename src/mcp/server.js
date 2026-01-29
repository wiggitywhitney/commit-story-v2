#!/usr/bin/env node
/**
 * Commit Story MCP Server
 *
 * Provides tools for real-time context capture during development:
 * - journal_add_reflection: Capture timestamped human insights
 * - journal_capture_context: Capture AI working memory
 *
 * Usage:
 *   node src/mcp/server.js
 *
 * Configuration (add to .mcp.json):
 *   {
 *     "mcpServers": {
 *       "commit-story": {
 *         "command": "node",
 *         "args": ["node_modules/commit-story/src/mcp/server.js"]
 *       }
 *     }
 *   }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerReflectionTool } from './tools/reflection-tool.js';
import { registerContextCaptureTool } from './tools/context-capture-tool.js';

/**
 * Create and configure the MCP server
 * @returns {McpServer}
 */
function createServer() {
  const server = new McpServer({
    name: 'commit-story',
    version: '2.0.0',
  });

  // Register tools
  registerReflectionTool(server);
  registerContextCaptureTool(server);

  return server;
}

/**
 * Main entry point
 */
async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Log to stderr (stdout is reserved for JSON-RPC)
  console.error('Commit Story MCP Server running on stdio');
}

// Run the server
main().catch((error) => {
  console.error('Fatal error in MCP server:', error);
  process.exit(1);
});
