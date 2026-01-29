/**
 * Reflection Tool
 *
 * Captures timestamped human insights and reflections during development.
 * Writes to journal/reflections/YYYY-MM/YYYY-MM-DD.md
 */

import { z } from 'zod';
import { mkdir, appendFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/** Separator bar for entries */
const SEPARATOR = '═══════════════════════════════════════';

/**
 * Get the reflections file path for a date
 * @param {Date} date
 * @returns {string}
 */
function getReflectionsPath(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return join('journal', 'reflections', `${year}-${month}`, `${year}-${month}-${day}.md`);
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
 * Format a reflection entry
 * @param {string} text - The reflection content
 * @param {Date} date - The timestamp
 * @returns {string}
 */
function formatReflectionEntry(text, date) {
  const timestamp = formatTimestamp(date);
  return `## ${timestamp} - Manual Reflection

${text}

${SEPARATOR}

`;
}

/**
 * Save a reflection to the daily file
 * @param {string} text - The reflection content
 * @returns {Promise<string>} - The path where the reflection was saved
 */
async function saveReflection(text) {
  const now = new Date();
  const filePath = getReflectionsPath(now);

  // Ensure directory exists
  await mkdir(dirname(filePath), { recursive: true });

  // Format and append the entry
  const entry = formatReflectionEntry(text, now);
  await appendFile(filePath, entry, 'utf-8');

  return filePath;
}

/**
 * Register the reflection tool with the MCP server
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server
 */
export function registerReflectionTool(server) {
  server.tool(
    'journal_add_reflection',
    'Capture a timestamped reflection or insight during development',
    {
      text: z.string().describe('The reflection or insight to capture'),
    },
    async ({ text }) => {
      try {
        const savedPath = await saveReflection(text);
        return {
          content: [
            {
              type: 'text',
              text: `Reflection saved to ${savedPath}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error saving reflection: ${error.message}`,
            },
          ],
        };
      }
    }
  );
}
