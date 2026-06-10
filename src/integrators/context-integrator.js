/**
 * Context Integrator - Orchestrates collectors and applies filtering
 *
 * Central point for gathering all context for journal generation.
 * Coordinates git and Claude collectors, then applies message filtering,
 * token budget limits, and sensitive data redaction.
 */

import { trace, SpanStatusCode } from '@opentelemetry/api';
import { getCommitData, getPreviousCommitTime } from '../collectors/git-collector.js';
import { collectChatMessages } from '../collectors/claude-collector.js';
import { filterMessages, groupFilteredBySession } from './filters/message-filter.js';
import { applyTokenBudget, estimateTokens } from './filters/token-filter.js';
import { applySensitiveFilter } from './filters/sensitive-filter.js';

const tracer = trace.getTracer('commit-story');

/**
 * Gather all context for a commit
 * @param {string} commitRef - Git commit reference (default: HEAD)
 * @param {object} options - Configuration options
 * @param {string} options.repoPath - Repository path (default: process.cwd())
 * @param {number} options.tokenBudget - Total token budget (default: 150000)
 * @param {number} options.diffBudget - Token budget for diff (default: 50000)
 * @param {number} options.chatBudget - Token budget for chat (default: 80000)
 * @param {boolean} options.redactEmails - Whether to redact emails (default: false)
 * @returns {Promise<Context>} Gathered and filtered context
 */
export async function gatherContextForCommit(commitRef = 'HEAD', options = {}) {
  return tracer.startActiveSpan('commit_story.context.gather_context_for_commit', async (span) => {
    try {
      span.setAttribute('vcs.ref.head.revision', commitRef);

      const {
        repoPath = process.cwd(),
        tokenBudget = 150000,
        diffBudget = 50000,
        chatBudget = 80000,
        redactEmails = false,
      } = options;

      // 1. Collect git data
      const commitData = await getCommitData(commitRef);

      // 2. Get previous commit time for chat window
      const previousCommitTime = await getPreviousCommitTime(commitRef);

      // 3. Collect chat messages
      let chatData;
      if (previousCommitTime) {
        chatData = await collectChatMessages(repoPath, commitData.timestamp, previousCommitTime);
      } else {
        // First commit - use 24 hours before as window
        const dayBefore = new Date(commitData.timestamp.getTime() - 24 * 60 * 60 * 1000);
        chatData = await collectChatMessages(repoPath, commitData.timestamp, dayBefore);
      }

      // 4. Filter chat messages
      const { messages: filteredMessages, stats: filterStats } = filterMessages(chatData.messages);

      span.setAttribute('commit_story.filter.messages_before', filterStats.total);
      span.setAttribute('commit_story.filter.messages_after', filterStats.preserved);

      // 5. Group filtered messages by session
      const filteredSessions = groupFilteredBySession(filteredMessages);

      span.setAttribute('commit_story.context.messages_count', filteredMessages.length);
      span.setAttribute('commit_story.context.sessions_count', filteredSessions.size);

      // 6. Build initial context object
      let context = {
        commit: {
          hash: commitData.hash,
          shortHash: commitData.shortHash,
          message: commitData.message,
          subject: commitData.subject,
          author: commitData.author,
          authorEmail: commitData.authorEmail,
          timestamp: commitData.timestamp,
          diff: commitData.diff,
          isMerge: commitData.isMerge,
          parentCount: commitData.parentCount,
        },
        chat: {
          messages: filteredMessages,
          sessions: filteredSessions,
          messageCount: filteredMessages.length,
          sessionCount: filteredSessions.size,
        },
        metadata: {
          previousCommitTime,
          timeWindow: {
            start: previousCommitTime || new Date(commitData.timestamp.getTime() - 24 * 60 * 60 * 1000),
            end: commitData.timestamp,
          },
          filterStats: {
            totalMessages: filterStats.total,
            filteredMessages: filterStats.filtered,
            preservedMessages: filterStats.preserved,
            substantialUserMessages: filterStats.substantialUserMessages,
            filterReasons: filterStats.byReason,
          },
          tokenEstimate: 0, // Will be calculated after budget applied
        },
      };

      span.setAttribute('commit_story.context.time_window_start', context.metadata.timeWindow.start.toISOString());
      span.setAttribute('commit_story.context.time_window_end', context.metadata.timeWindow.end.toISOString());

      // 7. Apply token budget limits
      context = applyTokenBudget(context, {
        totalBudget: tokenBudget,
        diffBudget,
        chatBudget,
      });

      // 8. Apply sensitive data redaction
      context = applySensitiveFilter(context, {
        redactEmails,
      });

      return context;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Format context for AI prompt consumption
 * @param {object} context - Gathered context
 * @returns {string} Formatted context string
 */
export function formatContextForPrompt(context) {
  const sections = [];

  // Commit section
  sections.push('## Commit Information');
  sections.push(`**Hash**: ${context.commit.shortHash}`);
  sections.push(`**Author**: ${context.commit.author}`);
  sections.push(`**Date**: ${context.commit.timestamp.toISOString()}`);
  sections.push(`**Message**: ${context.commit.message}`);
  if (context.commit.isMerge) {
    sections.push(`**Merge Commit**: Yes (${context.commit.parentCount} parents)`);
  }
  sections.push('');

  // Diff section
  sections.push('## Code Changes');
  if (context.commit.diff) {
    sections.push('```diff');
    sections.push(context.commit.diff);
    sections.push('```');
  } else {
    sections.push('*No code changes in this commit*');
  }
  sections.push('');

  // Chat section
  sections.push('## Development Conversation');
  if (context.chat.messageCount > 0) {
    sections.push(
      `*${context.chat.messageCount} messages from ${context.chat.sessionCount} session(s)*`
    );
    sections.push('');

    for (const message of context.chat.messages) {
      const role = message.type === 'user' ? '**Human**' : '**Assistant**';
      const time = new Date(message.timestamp).toLocaleTimeString();
      sections.push(`${role} (${time}):`);
      sections.push(message.content);
      sections.push('');
    }
  } else {
    sections.push('*No conversation captured for this time window*');
  }

  return sections.join('\n');
}

/**
 * Get context summary for logging/debugging
 * @param {object} context - Gathered context
 * @returns {object} Summary statistics
 */
export function getContextSummary(context) {
  return {
    commit: {
      hash: context.commit.shortHash,
      author: context.commit.author,
      timestamp: context.commit.timestamp.toISOString(),
      isMerge: context.commit.isMerge,
      diffLength: context.commit.diff?.length || 0,
    },
    chat: {
      messageCount: context.chat.messageCount,
      sessionCount: context.chat.sessionCount,
    },
    metadata: {
      tokenEstimate: context.metadata.tokenEstimate,
      filterStats: context.metadata.filterStats,
      tokenBudget: context.metadata.tokenBudget,
      sensitiveDataFilter: context.metadata.sensitiveDataFilter,
    },
  };
}
