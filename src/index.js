#!/usr/bin/env node
// ABOUTME: Main entry point for commit-story — generates journal entries from git commits
// ABOUTME: Orchestrates context gathering, LLM generation, saving, and auto-summary triggers
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

import './utils/config.js'; // Load environment variables first
import './traceloop-init.js'; // Register traceloop auto-instrumentation (if enabled)
import { config } from './utils/config.js';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gatherContextForCommit } from './integrators/context-integrator.js';
import { generateJournalSections } from './generators/journal-graph.js';
import { saveJournalEntry, discoverReflections } from './managers/journal-manager.js';
import { isJournalEntriesOnlyCommit, isMergeCommit, shouldSkipMergeCommit, isSafeGitRef } from './utils/commit-analyzer.js';
import { triggerAutoSummaries } from './managers/auto-summarize.js';
import { parseSummarizeArgs, runSummarize, runWeeklySummarize, runMonthlySummarize, showSummarizeHelp } from './commands/summarize.js';
import logger from './logger.js';

/** Exit codes */
const EXIT_SUCCESS = 0;
const EXIT_ERROR = 1;
const EXIT_SKIPPED = 2;

/** Debug mode flag — set by parseArgs, used to enable logger debug level */
let DEBUG = false;

/**
 * Parse command line arguments
 * @returns {{ subcommand: string|null, commitRef: string, debug: boolean, help: boolean, subcommandArgs: string[] }}
 */
function parseArgs() {
  const args = process.argv.slice(2);

  let commitRef = 'HEAD';
  let showHelp = false;
  let subcommand = null;
  const subcommandArgs = [];

  // Check if first non-flag argument is a known subcommand
  const knownSubcommands = ['summarize'];
  const firstNonFlag = args.find(a => !a.startsWith('-'));
  if (firstNonFlag && knownSubcommands.includes(firstNonFlag)) {
    subcommand = firstNonFlag;
    // Everything after the subcommand name goes to the subcommand handler
    const subIdx = args.indexOf(firstNonFlag);
    subcommandArgs.push(
      ...args
        .slice(subIdx + 1)
        .filter(arg => arg !== '--debug' && arg !== '-d')
    );
    // Still check for global --debug flag
    for (const arg of args) {
      if (arg === '--debug' || arg === '-d') {
        DEBUG = true;
      }
    }
    return { subcommand, commitRef, debug: DEBUG, help: false, subcommandArgs };
  }

  for (const arg of args) {
    if (arg === '--debug' || arg === '-d') {
      DEBUG = true;
    } else if (arg === '--help' || arg === '-h') {
      showHelp = true;
    } else if (!arg.startsWith('-')) {
      commitRef = arg;
    }
  }

  return { subcommand, commitRef, debug: DEBUG, help: showHelp, subcommandArgs };
}

/**
 * Show help message
 */
function showHelp() {
  process.stdout.write(`
Commit Story - Automated Engineering Journal

Usage:
  npx commit-story [commitRef] [options]
  npx commit-story summarize <date|range> [--force]

Commands:
  summarize    Generate daily, weekly, or monthly summaries
               Use --help for subcommand details

Arguments:
  commitRef    Git commit reference (default: HEAD)
               Examples: HEAD, abc1234, HEAD~3

Options:
  --debug, -d  Enable debug output
  --help, -h   Show this help message

Examples:
  npx commit-story                              # Generate for latest commit
  npx commit-story HEAD~1                       # Generate for previous commit
  npx commit-story summarize 2026-02-22         # Summarize a day
  npx commit-story summarize 2026-02-01..2026-02-20  # Summarize a range
  npx commit-story --debug                      # Verbose output

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
    execFileSync('git', ['rev-parse', '--git-dir'], { stdio: 'ignore' });
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
  if (!isSafeGitRef(ref)) {
    return false;
  }
  try {
    execFileSync('git', ['rev-parse', '--verify', ref], { stdio: 'ignore' });
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
    logger.error('ANTHROPIC_API_KEY not set — set your API key: export ANTHROPIC_API_KEY=your-key');
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
  if (!isSafeGitRef(commitRef)) {
    const fallback = new Date();
    fallback.setHours(fallback.getHours() - 24);
    return fallback;
  }
  try {
    // Get the commit before the current one
    const output = execFileSync('git', ['log', '-1', '--format=%cI', `${commitRef}~1`], {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
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
 * Handle the "summarize" subcommand.
 * @param {string[]} args - Arguments after "summarize"
 * @returns {Promise<number>} Exit code
 */
export async function handleSummarize(args) {
  const parsed = parseSummarizeArgs(args);

  if (parsed.help) {
    showSummarizeHelp();
    return EXIT_SUCCESS;
  }

  if (parsed.error) {
    logger.error(parsed.error);
    return EXIT_ERROR;
  }

  // Validate environment (need API key for generation)
  if (!validateEnvironment()) {
    return EXIT_ERROR;
  }

  // Weekly mode
  if (parsed.weekly) {
    const total = parsed.weeks.length;
    logger.info(`Generating weekly summaries for ${total} week${total > 1 ? 's' : ''}...`);
    if (parsed.force) {
      logger.info('--force: regenerating existing summaries');
    }

    let completed = 0;
    const result = await runWeeklySummarize({
      weeks: parsed.weeks,
      force: parsed.force,
      basePath: '.',
      onProgress: (msg) => {
        completed++;
        logger.info({ progress: `${completed}/${total}` }, msg);
      },
    });

    if (result.generated.length > 0) {
      logger.info({ count: result.generated.length }, 'Generated weekly summaries');
    }
    if (result.noSummaries.length > 0) {
      logger.info({ count: result.noSummaries.length }, 'No daily summaries found for weeks');
    }
    if (result.alreadyExists.length > 0) {
      logger.info({ count: result.alreadyExists.length }, 'Weekly summaries already exist');
    }
    if (result.failed.length > 0) {
      logger.warn({ count: result.failed.length, weeks: result.failed }, 'Failed to generate weekly summaries');
    }
    if (result.errors.length > 0) {
      for (const err of result.errors) {
        logger.warn({ error: err }, 'Weekly summary error');
      }
    }

    return result.failed.length > 0 ? EXIT_ERROR : EXIT_SUCCESS;
  }

  // Monthly mode
  if (parsed.monthly) {
    const total = parsed.months.length;
    logger.info(`Generating monthly summaries for ${total} month${total > 1 ? 's' : ''}...`);
    if (parsed.force) {
      logger.info('--force: regenerating existing summaries');
    }

    let completed = 0;
    const result = await runMonthlySummarize({
      months: parsed.months,
      force: parsed.force,
      basePath: '.',
      onProgress: (msg) => {
        completed++;
        logger.info({ progress: `${completed}/${total}` }, msg);
      },
    });

    if (result.generated.length > 0) {
      logger.info({ count: result.generated.length }, 'Generated monthly summaries');
    }
    if (result.noSummaries.length > 0) {
      logger.info({ count: result.noSummaries.length }, 'No weekly summaries found for months');
    }
    if (result.alreadyExists.length > 0) {
      logger.info({ count: result.alreadyExists.length }, 'Monthly summaries already exist');
    }
    if (result.failed.length > 0) {
      logger.warn({ count: result.failed.length, months: result.failed }, 'Failed to generate monthly summaries');
    }
    if (result.errors.length > 0) {
      for (const err of result.errors) {
        logger.warn({ error: err }, 'Monthly summary error');
      }
    }

    return result.failed.length > 0 ? EXIT_ERROR : EXIT_SUCCESS;
  }

  // Daily mode
  const total = parsed.dates.length;
  logger.info(`Generating daily summaries for ${total} date${total > 1 ? 's' : ''}...`);
  if (parsed.force) {
    logger.info('--force: regenerating existing summaries');
  }

  let completed = 0;
  const result = await runSummarize({
    dates: parsed.dates,
    force: parsed.force,
    basePath: '.',
    onProgress: (msg) => {
      completed++;
      logger.info({ progress: `${completed}/${total}` }, msg);
    },
  });

  if (result.generated.length > 0) {
    logger.info({ count: result.generated.length }, 'Generated daily summaries');
  }
  if (result.noEntries.length > 0) {
    logger.info({ count: result.noEntries.length }, 'No journal entries found for dates');
  }
  if (result.alreadyExists.length > 0) {
    logger.info({ count: result.alreadyExists.length }, 'Daily summaries already exist');
  }
  if (result.failed.length > 0) {
    logger.warn({ count: result.failed.length, dates: result.failed }, 'Failed to generate daily summaries');
  }
  if (result.errors.length > 0) {
    for (const err of result.errors) {
      logger.warn({ error: err }, 'Daily summary error');
    }
  }

  return result.failed.length > 0 ? EXIT_ERROR : EXIT_SUCCESS;
}

/**
 * Main entry point
 * @returns {Promise<number>} Exit code
 */
export async function main() {
  const { subcommand, commitRef, help, subcommandArgs } = parseArgs();

  if (DEBUG) {
    logger.level = 'debug';
  }

  // Show help if requested
  if (help) {
    showHelp();
    return EXIT_SUCCESS;
  }

  // Route to subcommand handlers
  if (subcommand === 'summarize') {
    return await handleSummarize(subcommandArgs);
  }

  logger.debug('Starting commit-story');
  logger.debug({ commitRef }, 'Commit ref');

  // Validate git repository
  if (!isGitRepository()) {
    logger.error('Not a git repository — run commit-story from within a git repository');
    return EXIT_ERROR;
  }

  // Validate commit reference
  if (!isValidCommitRef(commitRef)) {
    logger.error({ commitRef }, 'Invalid commit reference — check that the commit exists: git log --oneline');
    return EXIT_ERROR;
  }

  // Validate environment
  if (!validateEnvironment()) {
    return EXIT_ERROR;
  }

  // Check skip conditions BEFORE expensive context collection
  logger.debug('Checking skip conditions');

  // Skip journal-entries-only commits
  if (isJournalEntriesOnlyCommit(commitRef)) {
    logger.info('Skipping: only journal entries changed');
    return EXIT_SKIPPED;
  }

  // Check for merge commits
  const mergeInfo = isMergeCommit(commitRef);
  logger.debug({ isMerge: mergeInfo.isMerge }, 'Merge commit check');

  // Gather context
  logger.debug('Gathering context');
  const context = await gatherContextForCommit(commitRef);
  logger.debug({
    messageCount: context.chat?.messageCount || 0,
    diffLength: context.commit?.diff?.length || 0,
  }, 'Context gathered');

  // Skip empty merge commits (no chat AND no diff)
  if (mergeInfo.isMerge) {
    const hasChat = context.chat && context.chat.messageCount > 0;
    const hasDiff = context.commit && context.commit.diff && context.commit.diff.trim().length > 0;

    if (!hasChat && !hasDiff) {
      logger.info('Skipping: merge commit with no changes');
      return EXIT_SKIPPED;
    }
    logger.debug({ hasChat, hasDiff }, 'Processing merge commit');
  }

  // Generate journal sections
  logger.debug('Generating journal sections');
  const sections = await generateJournalSections(context);
  logger.debug({
    hasSummary: !!sections.summary,
    hasDialogue: !!sections.dialogue,
    hasTechnical: !!sections.technicalDecisions,
    errors: sections.errors?.length || 0,
  }, 'Sections generated');

  // Discover reflections for time window
  const previousCommitTime = getPreviousCommitTime(commitRef);
  const currentCommitTime = context.commit.timestamp;
  logger.debug({ from: previousCommitTime, to: currentCommitTime }, 'Reflection window');

  const reflections = await discoverReflections(previousCommitTime, currentCommitTime);
  logger.debug({ count: reflections.length }, 'Reflections found');

  // Save journal entry
  logger.debug('Saving journal entry');
  const savedPath = await saveJournalEntry(sections, context.commit, reflections, '.', { debug: (msg) => logger.debug(msg) });

  logger.info({ path: savedPath }, 'Journal entry saved');

  // Log any generation errors
  if (sections.errors && sections.errors.length > 0) {
    for (const err of sections.errors) {
      logger.warn({ error: err }, 'Section generation issue');
    }
  }

  // Auto-generate daily and weekly summaries for unsummarized past days/weeks
  if (config.autoSummarize) {
    logger.debug('Checking for unsummarized days and weeks');
    try {
      const summaryResult = await triggerAutoSummaries('.', {
        onProgress: (msg) => logger.debug(msg),
      });

      if (summaryResult.generated.length > 0) {
        const dailyCount = summaryResult.generated.filter(p => p.includes('daily')).length;
        const weeklyCount = summaryResult.generated.filter(p => p.includes('weekly')).length;
        const monthlyCount = summaryResult.generated.filter(p => p.includes('monthly')).length;
        logger.info({ dailyCount, weeklyCount, monthlyCount }, 'Auto-generated summaries');
        for (const path of summaryResult.generated) {
          logger.debug({ path }, 'Summary path');
        }
      }

      if (summaryResult.failed.length > 0) {
        logger.warn({ count: summaryResult.failed.length }, 'Failed to auto-generate summaries');
        for (const dateStr of summaryResult.failed) {
          logger.warn({ date: dateStr }, 'Failed summary date');
        }
      }
    } catch (err) {
      // Auto-summarize failures should not block the main flow
      logger.warn(err, 'Auto-summarize error');
    }
  }

  return EXIT_SUCCESS;
}

// Run when executed directly (not when imported by tests)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().then((exitCode) => {
    process.exit(exitCode ?? EXIT_SUCCESS);
  }).catch((error) => {
    logger.error(error, 'Unexpected error');
    process.exit(EXIT_ERROR);
  });
}
