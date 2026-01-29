/**
 * Journal Path Utilities
 *
 * Provides consistent path generation for journal entries, reflections, and context.
 * Uses date-based directory structure: journal/{type}/YYYY-MM/YYYY-MM-DD.md
 */

import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

/** Root directory for all journal files */
const JOURNAL_ROOT = 'journal';

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
  const dir = dirname(filePath);
  await mkdir(dir, { recursive: true });
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
