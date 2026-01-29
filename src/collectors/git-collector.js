/**
 * Git Collector - Extracts commit data for journal generation
 *
 * Collects commit metadata and diffs, filtering out journal entries
 * to prevent context pollution in AI generation.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/**
 * Run a git command and return stdout
 * @param {string[]} args - Git command arguments
 * @returns {Promise<string>} - Command output
 */
async function runGit(args) {
  try {
    const { stdout } = await execFileAsync('git', args, {
      maxBuffer: 10 * 1024 * 1024, // 10MB for large diffs
    });
    return stdout;
  } catch (error) {
    if (error.code === 128) {
      if (error.stderr?.includes('not a git repository')) {
        throw new Error('Not a git repository');
      }
      if (error.stderr?.includes('unknown revision')) {
        throw new Error(`Invalid commit reference: ${args[args.length - 1]}`);
      }
    }
    throw error;
  }
}

/**
 * Get commit metadata
 * @param {string} commitRef - Git commit reference (default: HEAD)
 * @returns {Promise<object>} - Commit metadata
 */
async function getCommitMetadata(commitRef = 'HEAD') {
  // %H = full hash, %h = short hash, %s = subject, %b = body (without subject)
  // %an = author name, %ae = author email, %aI = author date ISO
  const format = '%H%n%h%n%s%n%b%n--END-BODY--%n%an%n%ae%n%aI';
  const output = await runGit(['show', '--no-patch', `--format=${format}`, commitRef]);

  const lines = output.split('\n');
  const bodyEndIndex = lines.findIndex(line => line === '--END-BODY--');

  const hash = lines[0];
  const shortHash = lines[1];
  const subject = lines[2];
  const body = lines.slice(3, bodyEndIndex).join('\n').trim();
  const author = lines[bodyEndIndex + 1];
  const authorEmail = lines[bodyEndIndex + 2];
  const timestampStr = lines[bodyEndIndex + 3];

  return {
    hash,
    shortHash,
    subject,
    message: body ? `${subject}\n\n${body}` : subject,
    author,
    authorEmail,
    timestamp: new Date(timestampStr),
  };
}

/**
 * Get commit diff, excluding journal entries
 * @param {string} commitRef - Git commit reference (default: HEAD)
 * @returns {Promise<string>} - Diff content
 */
async function getCommitDiff(commitRef = 'HEAD') {
  const output = await runGit([
    'diff-tree',
    '-p',           // Generate patch
    '-m',           // Show diff for merges
    '--first-parent', // For merges, diff against first parent
    commitRef,
    '--',
    '.',
    ':!journal/entries/', // Exclude journal entries
  ]);

  // First line is commit hash, rest is diff
  const lines = output.split('\n');
  return lines.slice(1).join('\n').trim();
}

/**
 * Check if commit is a merge commit
 * @param {string} commitRef - Git commit reference (default: HEAD)
 * @returns {Promise<{isMerge: boolean, parentCount: number}>}
 */
async function getMergeInfo(commitRef = 'HEAD') {
  const output = await runGit(['rev-list', '--parents', '-n', '1', commitRef]);
  const hashes = output.trim().split(' ');
  const parentCount = hashes.length - 1;

  return {
    isMerge: parentCount > 1,
    parentCount,
  };
}

/**
 * Get timestamp of previous commit
 * @param {string} commitRef - Git commit reference (default: HEAD)
 * @returns {Promise<Date|null>} - Previous commit timestamp, null if first commit
 */
export async function getPreviousCommitTime(commitRef = 'HEAD') {
  const output = await runGit(['log', '-2', '--format=%aI', commitRef]);
  const timestamps = output.trim().split('\n');

  if (timestamps.length < 2) {
    return null; // First commit, no previous
  }

  return new Date(timestamps[1]);
}

/**
 * Get complete commit data including metadata, diff, and merge info
 * @param {string} commitRef - Git commit reference (default: HEAD)
 * @returns {Promise<CommitData>}
 */
export async function getCommitData(commitRef = 'HEAD') {
  const [metadata, diff, mergeInfo] = await Promise.all([
    getCommitMetadata(commitRef),
    getCommitDiff(commitRef),
    getMergeInfo(commitRef),
  ]);

  return {
    ...metadata,
    diff,
    ...mergeInfo,
  };
}
