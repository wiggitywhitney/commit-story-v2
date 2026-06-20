#!/usr/bin/env node
// ABOUTME: MCP server for commit-story — exposes journal_add_reflection and journal_capture_context tools
// ABOUTME: Runs on stdio transport; all logging goes to stderr (stdout is reserved for JSON-RPC)
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

import { trace, SpanStatusCode } from '@opentelemetry/api';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerReflectionTool } from './tools/reflection-tool.js';
import { registerContextCaptureTool } from './tools/context-capture-tool.js';
import pino from 'pino';

// stdout is reserved for JSON-RPC — logger must write to stderr
const logger = pino({ level: 'info' }, process.stderr);
const tracer = trace.getTracer('commit-story');

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
  return tracer.startActiveSpan('commit_story.mcp.server_start', async (span) => {
    try {
      span.setAttribute('commit_story.mcp.transport', 'stdio');
      const server = createServer();
      const transport = new StdioServerTransport();

      await server.connect(transport);

      logger.info('Commit Story MCP Server running on stdio');
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}

// Run the server
main().catch((error) => {
  logger.error(error, 'Fatal error in MCP server');
  process.exit(1);
});
