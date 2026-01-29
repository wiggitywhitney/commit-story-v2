/**
 * Token Filter - Manages token budget for AI prompts
 *
 * Uses character-based heuristic for token estimation.
 * Truncates large diffs first, then older messages if needed.
 */

/**
 * Estimate token count using character-based heuristic
 * Claude uses ~4 characters per token on average
 * We use 3.5 to be slightly conservative (overestimate)
 * @param {string} text - Text to estimate
 * @returns {number} Estimated token count
 */
export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 3.5);
}

/**
 * Format messages for token estimation
 * @param {object[]} messages - Filtered messages
 * @returns {string} Formatted message text
 */
function formatMessagesForEstimation(messages) {
  return messages
    .map((m) => {
      const role = m.type === 'user' ? 'Human' : 'Assistant';
      return `${role}: ${m.content}`;
    })
    .join('\n\n');
}

/**
 * Truncate diff to fit within token budget
 * Tries to keep complete file sections
 * @param {string} diff - Git diff content
 * @param {number} maxTokens - Maximum tokens allowed
 * @returns {object} Truncated diff and metadata
 */
export function truncateDiff(diff, maxTokens) {
  if (!diff) {
    return { diff: '', truncated: false, originalTokens: 0 };
  }

  const originalTokens = estimateTokens(diff);

  if (originalTokens <= maxTokens) {
    return { diff, truncated: false, originalTokens };
  }

  // Calculate target character length
  const targetChars = Math.floor(maxTokens * 3.5);

  // Try to truncate at a file boundary (diff --git line)
  const truncated = diff.substring(0, targetChars);
  const lastFileStart = truncated.lastIndexOf('\ndiff --git ');

  let finalDiff;
  if (lastFileStart > targetChars * 0.5) {
    // Keep complete files up to the boundary
    finalDiff = truncated.substring(0, lastFileStart);
  } else {
    // Just truncate at character limit and add indicator
    finalDiff = truncated;
  }

  // Add truncation indicator
  const truncationMessage = `\n\n[DIFF TRUNCATED - Original: ${originalTokens} tokens, Shown: ~${estimateTokens(finalDiff)} tokens]`;

  return {
    diff: finalDiff + truncationMessage,
    truncated: true,
    originalTokens,
    shownTokens: estimateTokens(finalDiff),
  };
}

/**
 * Truncate messages to fit within token budget
 * Removes oldest messages first to preserve recent context
 * @param {object[]} messages - Filtered messages
 * @param {number} maxTokens - Maximum tokens allowed
 * @returns {object} Truncated messages and metadata
 */
export function truncateMessages(messages, maxTokens) {
  if (!messages || messages.length === 0) {
    return { messages: [], truncated: false, originalCount: 0 };
  }

  const originalCount = messages.length;
  const fullText = formatMessagesForEstimation(messages);
  const originalTokens = estimateTokens(fullText);

  if (originalTokens <= maxTokens) {
    return { messages, truncated: false, originalCount, originalTokens };
  }

  // Remove oldest messages until we fit
  // Messages should already be sorted chronologically
  let truncatedMessages = [...messages];
  let currentTokens = originalTokens;

  while (truncatedMessages.length > 1 && currentTokens > maxTokens) {
    // Remove oldest (first) message
    truncatedMessages.shift();
    currentTokens = estimateTokens(formatMessagesForEstimation(truncatedMessages));
  }

  return {
    messages: truncatedMessages,
    truncated: true,
    originalCount,
    preservedCount: truncatedMessages.length,
    originalTokens,
    finalTokens: currentTokens,
  };
}

/**
 * Apply token budget to context
 * Strategy: Include commit metadata, then chat, truncate diff if needed
 * @param {object} context - Full context object
 * @param {object} options - Budget options
 * @returns {object} Context with budget applied
 */
export function applyTokenBudget(context, options = {}) {
  const { totalBudget = 150000, diffBudget = 50000, chatBudget = 80000 } = options;

  const result = {
    ...context,
    metadata: {
      ...context.metadata,
      tokenBudget: {
        total: totalBudget,
        diffBudget,
        chatBudget,
      },
    },
  };

  // 1. Estimate commit metadata tokens (always included)
  const commitMetaTokens = estimateTokens(
    JSON.stringify({
      hash: context.commit.hash,
      message: context.commit.message,
      author: context.commit.author,
      timestamp: context.commit.timestamp,
    })
  );

  // 2. Process diff with budget
  const diffResult = truncateDiff(context.commit.diff, diffBudget);
  result.commit = {
    ...context.commit,
    diff: diffResult.diff,
  };
  result.metadata.tokenBudget.diffTruncated = diffResult.truncated;
  result.metadata.tokenBudget.diffOriginalTokens = diffResult.originalTokens;

  // 3. Process messages with budget
  const messageResult = truncateMessages(context.chat.messages, chatBudget);
  result.chat = {
    ...context.chat,
    messages: messageResult.messages,
  };
  result.metadata.tokenBudget.messagesTruncated = messageResult.truncated;
  if (messageResult.truncated) {
    result.metadata.tokenBudget.messagesOriginalCount = messageResult.originalCount;
    result.metadata.tokenBudget.messagesPreservedCount = messageResult.preservedCount;
  }

  // 4. Calculate final token estimate
  const diffTokens = estimateTokens(diffResult.diff);
  const chatTokens = estimateTokens(formatMessagesForEstimation(messageResult.messages));
  result.metadata.tokenEstimate = commitMetaTokens + diffTokens + chatTokens;

  return result;
}
