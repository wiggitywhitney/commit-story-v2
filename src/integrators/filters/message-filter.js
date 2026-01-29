/**
 * Message Filter - Filters noisy messages from chat context
 *
 * Removes tool calls, tool results, meta messages, and empty content
 * while preserving human/assistant dialogue and context capture tool calls.
 */

/**
 * Check if a message should be filtered out
 * @param {object} message - Chat message record
 * @returns {boolean} True if message should be filtered out
 */
function shouldFilterMessage(message) {
  // Must have a type
  if (!message.type) {
    return true;
  }

  // Only keep user and assistant messages
  if (!['user', 'assistant'].includes(message.type)) {
    return true;
  }

  // Filter meta messages
  if (message.isMeta === true) {
    return true;
  }

  // Get content
  const content = message.message?.content;

  // Filter empty content
  if (!content) {
    return true;
  }

  // If content is array, check for tool_use/tool_result
  if (Array.isArray(content)) {
    const hasToolUse = content.some((c) => c.type === 'tool_use');
    const hasToolResult = content.some((c) => c.type === 'tool_result');

    // EXCEPTION: Preserve journal_capture_context tool calls (per v1 DD-014)
    if (hasToolUse) {
      const isContextCapture = content.some(
        (c) => c.type === 'tool_use' && c.name === 'journal_capture_context'
      );
      if (!isContextCapture) {
        return true;
      }
    }

    // Always filter tool results
    if (hasToolResult) {
      return true;
    }

    // Check if there's any meaningful text content
    const hasText = content.some((c) => c.type === 'text' && c.text?.trim());
    if (!hasText) {
      return true;
    }
  }

  // If content is string, check if empty
  if (typeof content === 'string' && !content.trim()) {
    return true;
  }

  return false; // Keep this message
}

/**
 * Extract text content from a message for display
 * @param {object} message - Chat message record
 * @returns {string} Extracted text content
 */
function extractTextContent(message) {
  const content = message.message?.content;

  if (!content) {
    return '';
  }

  // If string, return as-is
  if (typeof content === 'string') {
    return content;
  }

  // If array, extract text blocks
  if (Array.isArray(content)) {
    return content
      .filter((c) => c.type === 'text')
      .map((c) => c.text || '')
      .join('\n')
      .trim();
  }

  return '';
}

/**
 * Filter messages and extract relevant content
 * @param {object[]} messages - Array of chat messages
 * @returns {object} Filtered messages and stats
 */
export function filterMessages(messages) {
  const filtered = [];
  const stats = {
    total: messages.length,
    filtered: 0,
    preserved: 0,
    byReason: {
      noType: 0,
      wrongType: 0,
      isMeta: 0,
      emptyContent: 0,
      toolUse: 0,
      toolResult: 0,
    },
  };

  for (const message of messages) {
    if (shouldFilterMessage(message)) {
      stats.filtered++;

      // Track reason for filtering
      if (!message.type) {
        stats.byReason.noType++;
      } else if (!['user', 'assistant'].includes(message.type)) {
        stats.byReason.wrongType++;
      } else if (message.isMeta === true) {
        stats.byReason.isMeta++;
      } else {
        const content = message.message?.content;
        if (!content || (typeof content === 'string' && !content.trim())) {
          stats.byReason.emptyContent++;
        } else if (Array.isArray(content)) {
          if (content.some((c) => c.type === 'tool_result')) {
            stats.byReason.toolResult++;
          } else if (content.some((c) => c.type === 'tool_use')) {
            stats.byReason.toolUse++;
          } else {
            stats.byReason.emptyContent++;
          }
        }
      }
    } else {
      stats.preserved++;
      filtered.push({
        uuid: message.uuid,
        sessionId: message.sessionId,
        type: message.type,
        timestamp: message.timestamp,
        content: extractTextContent(message),
        // Preserve context capture info if present
        isContextCapture: Array.isArray(message.message?.content)
          ? message.message.content.some(
              (c) => c.type === 'tool_use' && c.name === 'journal_capture_context'
            )
          : false,
      });
    }
  }

  return { messages: filtered, stats };
}

/**
 * Group filtered messages by session
 * @param {object[]} messages - Filtered messages
 * @returns {Map<string, object[]>} Messages grouped by sessionId
 */
export function groupFilteredBySession(messages) {
  const sessions = new Map();

  for (const message of messages) {
    const sessionId = message.sessionId;
    if (!sessionId) continue;

    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, []);
    }
    sessions.get(sessionId).push(message);
  }

  return sessions;
}
