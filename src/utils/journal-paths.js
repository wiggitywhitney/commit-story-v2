// ABOUTME: Centralizes path generation for all journal files (entries, reflections, context, summaries)
// ABOUTME: Uses date-based directory structure: journal/{type}/YYYY-MM/YYYY-MM-DD.md

import { trace, SpanStatusCode } from '@opentelemetry/api';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const tracer = trace.getTracer('commit-story');

/** Root directory for all journal files */
const JOURNAL_ROOT = 'journal';

/** Valid summary cadences */
const VALID_CADENCES = ['daily', 'weekly', 'monthly'];

/**
 * Get YYYY-MM format for directory names
 * @param {Date} date - Date object
 * @returns {string} YYYY-MM formatted string
 */
export function getYearMonth(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get YYYY-MM-DD format for file names
 * @param {Date} date - Date object
 * @returns {string} YYYY-MM-DD formatted string
 */
export function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get path to journal entry file for a given date
 * @param {Date} date - Date for the entry
 * @param {string} basePath - Base path (default: current directory)
 * @returns {string} Full path to entry file
 */
export function getJournalEntryPath(date, basePath = '.') {
  const yearMonth = getYearMonth(date);
  const dateStr = getDateString(date);
  return join(basePath, JOURNAL_ROOT, 'entries', yearMonth, `${dateStr}.md`);
}

/**
 * Get path to reflections file for a given date
 * @param {Date} date - Date for reflections
 * @param {string} basePath - Base path (default: current directory)
 * @returns {string} Full path to reflections file
 */
export function getReflectionPath(date, basePath = '.') {
  const yearMonth = getYearMonth(date);
  const dateStr = getDateString(date);
  return join(basePath, JOURNAL_ROOT, 'reflections', yearMonth, `${dateStr}.md`);
}

/**
 * Get path to context file for a given date
 * @param {Date} date - Date for context
 * @param {string} basePath - Base path (default: current directory)
 * @returns {string} Full path to context file
 */
export function getContextPath(date, basePath = '.') {
  const yearMonth = getYearMonth(date);
  const dateStr = getDateString(date);
  return join(basePath, JOURNAL_ROOT, 'context', yearMonth, `${dateStr}.md`);
}

/**
 * Get directory containing reflections for a year-month
 * @param {Date} date - Date within the month
 * @param {string} basePath - Base path (default: current directory)
 * @returns {string} Path to reflections directory
 */
export function getReflectionsDirectory(date, basePath = '.') {
  const yearMonth = getYearMonth(date);
  return join(basePath, JOURNAL_ROOT, 'reflections', yearMonth);
}

/**
 * Ensure directory exists for a file path
 * Creates parent directories recursively if needed
 * @param {string} filePath - Path to file
 */
export async function ensureDirectory(filePath) {
  return tracer.startActiveSpan('commit_story.journal.ensure_directory', async (span) => {
    try {
      span.setAttribute('commit_story.journal.file_path', filePath);
      const dir = dirname(filePath);
      await mkdir(dir, { recursive: true });
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
 * Parse date from YYYY-MM-DD filename
 * @param {string} filename - Filename like "2026-01-15.md"
 * @returns {Date|null} Parsed date or null if invalid
 */
export function parseDateFromFilename(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})\.md$/);
  if (!match) {
    return null;
  }
  const [, year, month, day] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Get journal root path
 * @param {string} basePath - Base path (default: current directory)
 * @returns {string} Path to journal root
 */
export function getJournalRoot(basePath = '.') {
  return join(basePath, JOURNAL_ROOT);
}

/**
 * Get ISO 8601 week string (YYYY-Www) for a date.
 * Uses ISO week-year, which can differ from calendar year at boundaries.
 * @param {Date} date - Date object
 * @returns {string} ISO week string like "2026-W09"
 */
export function getISOWeekString(date) {
  // ISO week date: week 1 contains the first Thursday of the year
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - day number (Monday=1, Sunday=7)
  const dayNum = d.getUTCDay() || 7; // Convert Sunday from 0 to 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  // ISO week-year is the year of that Thursday
  const isoYear = d.getUTCFullYear();
  // Week number: how many Thursdays have passed since Jan 1
  const jan1 = new Date(Date.UTC(isoYear, 0, 1));
  const weekNum = Math.ceil(((d - jan1) / 86400000 + 1) / 7);
  return `${isoYear}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * Get path to summary file for a given cadence and date.
 * Daily: journal/summaries/daily/YYYY-MM-DD.md
 * Weekly: journal/summaries/weekly/YYYY-Www.md
 * Monthly: journal/summaries/monthly/YYYY-MM.md
 * @param {'daily'|'weekly'|'monthly'} cadence - Summary cadence
 * @param {Date} date - Date for the summary
 * @param {string} basePath - Base path (default: current directory)
 * @returns {string} Full path to summary file
 */
export function getSummaryPath(cadence, date, basePath = '.') {
  if (!VALID_CADENCES.includes(cadence)) {
    throw new Error(`Invalid cadence: "${cadence}". Must be one of: ${VALID_CADENCES.join(', ')}`);
  }

  let filename;
  switch (cadence) {
    case 'daily':
      filename = `${getDateString(date)}.md`;
      break;
    case 'weekly':
      filename = `${getISOWeekString(date)}.md`;
      break;
    case 'monthly':
      filename = `${getYearMonth(date)}.md`;
      break;
  }

  return join(basePath, JOURNAL_ROOT, 'summaries', cadence, filename);
}

/**
 * Get directory containing summaries for a given cadence.
 * @param {'daily'|'weekly'|'monthly'} cadence - Summary cadence
 * @param {string} basePath - Base path (default: current directory)
 * @returns {string} Path to summaries directory
 */
export function getSummariesDirectory(cadence, basePath = '.') {
  if (!VALID_CADENCES.includes(cadence)) {
    throw new Error(`Invalid cadence: "${cadence}". Must be one of: ${VALID_CADENCES.join(', ')}`);
  }
  return join(basePath, JOURNAL_ROOT, 'summaries', cadence);
}
