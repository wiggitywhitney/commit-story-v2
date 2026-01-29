#!/usr/bin/env node
/**
 * Commit Story - Automated Engineering Journal
 *
 * Generates journal entries from git commits and Claude Code chat history.
 * Triggered by git post-commit hook or run manually.
 *
 * Usage:
 *   npx commit-story [commitRef] [--debug]
 *   node src/index.js [commitRef] [--debug]
 *
 * Exit codes:
 *   0 - Success (journal generated)
 *   1 - Error occurred
 *   2 - Skipped (journal-only commit, empty merge)
 */

import { execSync } from 'node:child_process';
import { gatherContextForCommit } from './integrators/context-integrator.js';
import { generateJournalSections } from './generators/journal-graph.js';
import { saveJournalEntry, discoverReflections } from './managers/journal-manager.js';
import { isJournalEntriesOnlyCommit, isMergeCommit, getChangedFiles } from './utils/commit-analyzer.js';

/** Exit codes */
const EXIT_SUCCESS = 0;
const EXIT_ERROR = 1;
const EXIT_SKIPPED = 2;

/** Debug mode flag */
let DEBUG = false;

/**
 * Log debug message if debug mode is enabled
 * @param {...any} args - Arguments to log
 */
function debug(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Parse command line arguments
 * @returns {{ commitRef: string, debug: boolean, help: boolean }}
 */
function parseArgs() {
  const args = process.argv.slice(2);

  let commitRef = 'HEAD';
  let showHelp = false;

  for (const arg of args) {
    if (arg === '--debug' || arg === '-d') {
      DEBUG = true;
    } else if (arg === '--help' || arg === '-h') {
      showHelp = true;
    } else if (!arg.startsWith('-')) {
      commitRef = arg;
    }
  }

  return { commitRef, debug: DEBUG, help: showHelp };
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Commit Story - Automated Engineering Journal

Usage:
  npx commit-story [commitRef] [options]
  node src/index.js [commitRef] [options]

Arguments:
  commitRef    Git commit reference (default: HEAD)
               Examples: HEAD, abc1234, HEAD~3

Options:
  --debug, -d  Enable debug output
  --help, -h   Show this help message

Examples:
  npx commit-story              # Generate for latest commit
  npx commit-story HEAD~1       # Generate for previous commit
  npx commit-story abc1234      # Generate for specific commit
  npx commit-story --debug      # Verbose output

Exit codes:
  0  Success (journal entry generated)
  1  Error occurred
  2  Skipped (journal-only commit or empty merge)
`);
}

/**
 * Check if running inside a git repository
 * @returns {boolean}
 */
function isGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate that a commit reference exists
 * @param {string} ref - Commit reference to validate
 * @returns {boolean}
 */
function isValidCommitRef(ref) {
  try {
    execSync(`git rev-parse --verify ${ref}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate environment requirements
 * @returns {boolean}
 */
function validateEnvironment() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(`
❌ ANTHROPIC_API_KEY not set
   Set your API key: export ANTHROPIC_API_KEY=your-key
`);
    return false;
  }
  return true;
}

/**
 * Get previous commit timestamp for reflection discovery
 * @param {string} commitRef - Current commit reference
 * @returns {Date|null}
 */
function getPreviousCommitTime(commitRef) {
  try {
    // Get the commit before the current one
    const output = execSync(`git log -1 --format=%cI ${commitRef}~1 2>/dev/null`, {
      encoding: 'utf-8',
    });
    return new Date(output.trim());
  } catch {
    // No previous commit (first commit) or error
    // Use 24 hours ago as fallback
    const fallback = new Date();
    fallback.setHours(fallback.getHours() - 24);
    return fallback;
  }
}

/**
 * Main entry point
 */
async function main() {
  const { commitRef, help } = parseArgs();

  // Show help if requested
  if (help) {
    showHelp();
    process.exit(EXIT_SUCCESS);
  }

  debug('Starting commit-story');
  debug('Commit ref:', commitRef);

  // Validate git repository
  if (!isGitRepository()) {
    console.error(`
❌ Not a git repository
   Run commit-story from within a git repository.
`);
    process.exit(EXIT_ERROR);
  }

  // Validate commit reference
  if (!isValidCommitRef(commitRef)) {
    console.error(`
❌ Invalid commit reference: ${commitRef}
   Check that the commit exists: git log --oneline
`);
    process.exit(EXIT_ERROR);
  }

  // Validate environment
  if (!validateEnvironment()) {
    process.exit(EXIT_ERROR);
  }

  // Check skip conditions BEFORE expensive context collection
  debug('Checking skip conditions...');

  // Skip journal-entries-only commits
  if (isJournalEntriesOnlyCommit(commitRef)) {
    console.log(`
⏭️  Skipping: only journal entries changed
   This commit only modified journal/entries/ files.
`);
    process.exit(EXIT_SKIPPED);
  }

  // Check for merge commits
  const mergeInfo = isMergeCommit(commitRef);
  debug('Merge commit:', mergeInfo.isMerge);

  // Gather context
  debug('Gathering context...');
  const context = await gatherContextForCommit(commitRef);
  debug('Context gathered:', {
    messageCount: context.chat?.messageCount || 0,
    diffLength: context.commit?.diff?.length || 0,
  });

  // Skip empty merge commits (no chat AND no diff)
  if (mergeInfo.isMerge) {
    const hasChat = context.chat && context.chat.messageCount > 0;
    const hasDiff = context.commit && context.commit.diff && context.commit.diff.trim().length > 0;

    if (!hasChat && !hasDiff) {
      console.log(`
⏭️  Skipping: merge commit with no changes
   This merge commit has no chat context or code changes.
`);
      process.exit(EXIT_SKIPPED);
    }
    debug('Processing merge commit with:', { hasChat, hasDiff });
  }

  // Generate journal sections
  debug('Generating journal sections...');
  const sections = await generateJournalSections(context);
  debug('Sections generated:', {
    hasSummary: !!sections.summary,
    hasDialogue: !!sections.dialogue,
    hasTechnical: !!sections.technicalDecisions,
    errors: sections.errors?.length || 0,
  });

  // Discover reflections for time window
  const previousCommitTime = getPreviousCommitTime(commitRef);
  const currentCommitTime = context.commit.timestamp;
  debug('Reflection window:', { from: previousCommitTime, to: currentCommitTime });

  const reflections = await discoverReflections(previousCommitTime, currentCommitTime);
  debug('Reflections found:', reflections.length);

  // Save journal entry
  debug('Saving journal entry...');
  const savedPath = await saveJournalEntry(sections, context.commit, reflections);

  console.log(`
✅ Journal entry saved
   ${savedPath}
`);

  // Log any generation errors
  if (sections.errors && sections.errors.length > 0) {
    console.log('⚠️  Some sections had generation issues:');
    for (const err of sections.errors) {
      console.log(`   - ${err}`);
    }
  }

  process.exit(EXIT_SUCCESS);
}

// Run main function
main().catch((error) => {
  console.error(`
❌ Unexpected error: ${error.message}
`);
  if (DEBUG) {
    console.error(error.stack);
  }
  process.exit(EXIT_ERROR);
});
