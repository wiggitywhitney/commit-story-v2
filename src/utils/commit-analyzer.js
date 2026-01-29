/**
 * Commit Analyzer
 *
 * Analyzes git commits to determine if they should be processed or skipped.
 * Checks for journal-only commits and merge commits.
 */

import { execSync } from 'node:child_process';

/**
 * Get list of files changed in a commit
 * @param {string} commitRef - Git commit reference
 * @returns {string[]} Array of file paths
 */
export function getChangedFiles(commitRef) {
  try {
    const output = execSync(`git diff-tree --no-commit-id --name-only -r ${commitRef}`, {
      encoding: 'utf-8',
    });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Check if a commit only modifies journal entry files
 * This is used to prevent recursive generation (commit triggers hook,
 * hook generates journal, journal commit triggers hook, etc.)
 *
 * Note: Only checks journal/entries/ - NOT reflections or context
 * because those contain manual content worth documenting.
 *
 * @param {string} commitRef - Git commit reference
 * @returns {boolean} True if commit only touches journal/entries/
 */
export function isJournalEntriesOnlyCommit(commitRef) {
  const files = getChangedFiles(commitRef);

  // Empty commit or error - don't skip
  if (files.length === 0) {
    return false;
  }

  // Check if ALL files are in journal/entries/
  return files.every((file) => file.startsWith('journal/entries/'));
}

/**
 * Check if a commit is a merge commit
 * @param {string} commitRef - Git commit reference
 * @returns {{ isMerge: boolean, parentCount: number }}
 */
export function isMergeCommit(commitRef) {
  try {
    // Get commit object and count parent lines
    const output = execSync(`git cat-file -p ${commitRef}`, { encoding: 'utf-8' });
    const parentLines = output.split('\n').filter((line) => line.startsWith('parent '));
    const parentCount = parentLines.length;

    return {
      isMerge: parentCount > 1,
      parentCount,
    };
  } catch {
    return {
      isMerge: false,
      parentCount: 1,
    };
  }
}

/**
 * Check if a merge commit should be skipped
 *
 * Logic (from v1 PRD-32 DD-016):
 * - Merge with conflicts + no chat → Generate (conflict resolution is valuable)
 * - Merge with chat + no diff → Generate (strategic discussion is valuable)
 * - Clean merge + no chat + no diff → Skip (mechanical, not valuable)
 *
 * @param {string} commitRef - Git commit reference
 * @param {Object} context - Gathered context with chat and commit data
 * @returns {boolean} True if merge should be skipped
 */
export function shouldSkipMergeCommit(commitRef, context) {
  const { isMerge } = isMergeCommit(commitRef);

  // Not a merge - don't skip via this check
  if (!isMerge) {
    return false;
  }

  // Check if we have chat context
  const hasChat = context.chat && context.chat.messageCount > 0;

  // Check if we have meaningful diff
  const hasDiff = context.commit && context.commit.diff && context.commit.diff.trim().length > 0;

  // Only skip if BOTH no chat AND no diff
  // Conservative: only skip when definitely not valuable
  return !hasChat && !hasDiff;
}

/**
 * Get commit metadata
 * @param {string} commitRef - Git commit reference
 * @returns {Object} Commit metadata
 */
export function getCommitMetadata(commitRef) {
  try {
    // Get formatted commit info
    const format = '%H%n%h%n%s%n%an%n%ae%n%cI';
    const output = execSync(`git log -1 --format="${format}" ${commitRef}`, {
      encoding: 'utf-8',
    });

    const [hash, shortHash, subject, author, authorEmail, timestamp] = output.trim().split('\n');

    return {
      hash,
      shortHash,
      subject,
      author,
      authorEmail,
      timestamp: new Date(timestamp),
    };
  } catch (error) {
    throw new Error(`Failed to get commit metadata: ${error.message}`);
  }
}
