/**
 * Context Capture Tool
 *
 * Captures AI working memory and development context.
 * Writes to journal/context/YYYY-MM/YYYY-MM-DD.md
 *
 * The tool description guides Claude on usage:
 * - Specific context: When user asks for specific capture (e.g., "capture why we chose X")
 * - Comprehensive context: When user just says "capture context"
 */

import { z } from 'zod';
import { mkdir, appendFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/** Separator bar for entries */
const SEPARATOR = '═══════════════════════════════════════';

/**
 * Get the context file path for a date
 * @param {Date} date
 * @returns {string}
 */
function getContextPath(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return join('journal', 'context', `${year}-${month}`, `${year}-${month}-${day}.md`);
}

/**
 * Format a timestamp for display
 * @param {Date} date
 * @returns {string}
 */
function formatTimestamp(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}

/**
 * Format a context entry
 * @param {string} text - The context content
 * @param {Date} date - The timestamp
 * @returns {string}
 */
function formatContextEntry(text, date) {
  const timestamp = formatTimestamp(date);
  return `## ${timestamp} - Context Capture

${text}

${SEPARATOR}

`;
}

/**
 * Save context to the daily file
 * @param {string} text - The context content
 * @returns {Promise<string>} - The path where the context was saved
 */
async function saveContext(text) {
  const now = new Date();
  const filePath = getContextPath(now);

  // Ensure directory exists
  await mkdir(dirname(filePath), { recursive: true });

  // Format and append the entry
  const entry = formatContextEntry(text, now);
  await appendFile(filePath, entry, 'utf-8');

  return filePath;
}

/**
 * Register the context capture tool with the MCP server
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server
 */
export function registerContextCaptureTool(server) {
  server.tool(
    'journal_capture_context',
    'Capture development context. If the user requests specific context ' +
      "(e.g., 'capture why we chose X'), provide that specific content. Otherwise, " +
      'provide a comprehensive context capture of your current understanding of ' +
      'this project, recent development insights, and key context that would help ' +
      'a fresh AI understand where we are and how we got here.',
    {
      text: z.string().describe('The context to capture'),
    },
    async ({ text }) => {
      try {
        const savedPath = await saveContext(text);
        return {
          content: [
            {
              type: 'text',
              text: `Context saved to ${savedPath}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error saving context: ${error.message}`,
            },
          ],
        };
      }
    }
  );
}
