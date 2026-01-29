/**
 * Claude Collector - Extracts Claude Code chat history for journal generation
 *
 * Collects messages from ~/.claude/projects/[project-path-encoded]/*.jsonl
 * Filters by repository path and time window, groups by session.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

/**
 * Get the Claude projects directory path
 * @returns {string} Path to ~/.claude/projects/
 */
export function getClaudeProjectsDir() {
  return join(homedir(), '.claude', 'projects');
}

/**
 * Encode a repository path to Claude's project directory format
 * Replaces path separators and dots with hyphens
 * @param {string} repoPath - Absolute path to repository
 * @returns {string} Encoded directory name
 */
export function encodeProjectPath(repoPath) {
  // Remove trailing slash if present
  const normalizedPath = repoPath.endsWith('/') ? repoPath.slice(0, -1) : repoPath;
  // Replace all forward slashes and dots with hyphens
  // Claude Code encodes both / and . as -
  return normalizedPath.replace(/[/.]/g, '-');
}

/**
 * Get the Claude project directory for a repository
 * @param {string} repoPath - Absolute path to repository
 * @returns {string|null} Path to project directory, or null if not found
 */
export function getClaudeProjectPath(repoPath) {
  const projectsDir = getClaudeProjectsDir();

  if (!existsSync(projectsDir)) {
    return null;
  }

  const encodedPath = encodeProjectPath(repoPath);
  const projectDir = join(projectsDir, encodedPath);

  if (!existsSync(projectDir)) {
    return null;
  }

  return projectDir;
}

/**
 * Find all JSONL files in a Claude project directory
 * @param {string} projectPath - Path to Claude project directory
 * @returns {string[]} Array of JSONL file paths, sorted by modification time (newest first)
 */
export function findJSONLFiles(projectPath) {
  if (!existsSync(projectPath)) {
    return [];
  }

  const entries = readdirSync(projectPath, { withFileTypes: true });

  const jsonlFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.jsonl'))
    .map((entry) => {
      const filePath = join(projectPath, entry.name);
      const stats = statSync(filePath);
      return {
        path: filePath,
        mtime: stats.mtime.getTime(),
      };
    })
    .sort((a, b) => b.mtime - a.mtime) // Sort by modification time, newest first
    .map((file) => file.path);

  return jsonlFiles;
}

/**
 * Record types to skip during message extraction
 * These are internal tracking records, not conversation content
 */
const SKIP_RECORD_TYPES = new Set([
  'file-history-snapshot', // File backup tracking
  'progress', // Execution progress (hooks, bash, mcp)
  'queue-operation', // User input queuing
  'system', // System metrics (turn duration)
]);

/**
 * Parse a JSONL file and extract messages
 * Skips malformed lines and non-conversation records
 * @param {string} filePath - Path to JSONL file
 * @returns {object[]} Array of parsed message records
 */
export function parseJSONLFile(filePath) {
  if (!existsSync(filePath)) {
    return [];
  }

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const messages = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    try {
      const record = JSON.parse(trimmedLine);

      // Skip non-conversation record types
      if (SKIP_RECORD_TYPES.has(record.type)) continue;

      // Must have basic message fields
      if (!record.uuid || !record.timestamp) continue;

      messages.push(record);
    } catch {
      // Skip malformed JSON lines, continue processing
      continue;
    }
  }

  return messages;
}

/**
 * Filter messages by repository path and time window
 * @param {object[]} messages - Array of message records
 * @param {string} repoPath - Repository path to filter by (matches cwd field)
 * @param {Date} startTime - Start of time window (inclusive)
 * @param {Date} endTime - End of time window (inclusive)
 * @returns {object[]} Filtered messages, sorted chronologically
 */
export function filterMessages(messages, repoPath, startTime, endTime) {
  return messages
    .filter((msg) => {
      // Must have cwd field matching repo path
      if (msg.cwd !== repoPath) return false;

      // Must have timestamp within window
      const msgTime = new Date(msg.timestamp);
      if (msgTime < startTime || msgTime > endTime) return false;

      return true;
    })
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

/**
 * Group messages by session ID
 * @param {object[]} messages - Array of message records
 * @returns {Map<string, object[]>} Map of sessionId to messages
 */
export function groupBySession(messages) {
  const sessions = new Map();

  for (const msg of messages) {
    const sessionId = msg.sessionId;
    if (!sessionId) continue;

    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, []);
    }
    sessions.get(sessionId).push(msg);
  }

  // Sort messages within each session chronologically
  for (const [sessionId, sessionMessages] of sessions) {
    sessionMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  return sessions;
}

/**
 * Collect Claude Code chat messages for a commit
 * @param {string} repoPath - Absolute path to repository
 * @param {Date} commitTime - Current commit timestamp
 * @param {Date} previousCommitTime - Previous commit timestamp (start of window)
 * @returns {Promise<ChatData>} Collected chat data
 */
export async function collectChatMessages(repoPath, commitTime, previousCommitTime) {
  const projectPath = getClaudeProjectPath(repoPath);

  if (!projectPath) {
    return {
      messages: [],
      sessions: new Map(),
      sessionCount: 0,
      messageCount: 0,
      timeWindow: {
        start: previousCommitTime,
        end: commitTime,
      },
    };
  }

  const jsonlFiles = findJSONLFiles(projectPath);
  let allMessages = [];

  for (const filePath of jsonlFiles) {
    const fileMessages = parseJSONLFile(filePath);
    const filtered = filterMessages(fileMessages, repoPath, previousCommitTime, commitTime);
    allMessages = allMessages.concat(filtered);
  }

  // Sort all messages chronologically
  allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const sessions = groupBySession(allMessages);

  return {
    messages: allMessages,
    sessions,
    sessionCount: sessions.size,
    messageCount: allMessages.length,
    timeWindow: {
      start: previousCommitTime,
      end: commitTime,
    },
  };
}
