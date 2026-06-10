// ABOUTME: Auto-trigger logic for daily, weekly, and monthly summaries after journal entry creation
// ABOUTME: Detects unsummarized past days/weeks/months and generates summaries with progress reporting

import { trace, SpanStatusCode } from '@opentelemetry/api';
import { findUnsummarizedDays, findUnsummarizedWeeks, findUnsummarizedMonths } from '../utils/summary-detector.js';
import { generateAndSaveDailySummary, generateAndSaveWeeklySummary, generateAndSaveMonthlySummary } from './summary-manager.js';

const tracer = trace.getTracer('commit-story');

function getErrorMessage(err) {
  return err instanceof Error ? err.message : String(err);
}

/**
 * Trigger automatic daily summary generation for all unsummarized past days.
 * Generates summaries sequentially to avoid overwhelming the LLM API.
 * Continues past failures to maximize coverage.
 *
 * @param {string} basePath - Base path for journal (default: current directory)
 * @param {{ onProgress?: (msg: string) => void }} options - Options
 * @returns {Promise<{ generated: string[], skipped: string[], failed: string[], errors: string[] }>}
 */
export async function triggerAutoSummaries(basePath = '.', options = {}) {
  return tracer.startActiveSpan('commit_story.summarize.trigger_auto_summaries', async (span) => {
    try {
      span.setAttribute('commit_story.journal.base_path', basePath);
      const { onProgress } = options;

      const unsummarizedDays = await findUnsummarizedDays(basePath);
      span.setAttribute('commit_story.summarize.dates_count', unsummarizedDays?.length ?? 0);

      const result = {
        generated: [],
        skipped: [],
        failed: [],
        errors: [],
      };

      for (const dateStr of unsummarizedDays) {
        const date = new Date(
          parseInt(dateStr.slice(0, 4)),
          parseInt(dateStr.slice(5, 7)) - 1,
          parseInt(dateStr.slice(8, 10)),
        );

        try {
          const summaryResult = await generateAndSaveDailySummary(date, basePath);

          if (summaryResult.saved) {
            result.generated.push(summaryResult.path);
            if (onProgress) {
              onProgress(`Generated daily summary for ${dateStr}`);
            }

            // Track errors from generation (partial issues like LLM timeouts)
            if (summaryResult.errors && summaryResult.errors.length > 0) {
              for (const err of summaryResult.errors) {
                result.errors.push(`${dateStr}: ${err}`);
              }
            }
          } else {
            result.skipped.push(dateStr);
          }
        } catch (err) {
          result.failed.push(dateStr);
          result.errors.push(`${dateStr}: ${getErrorMessage(err)}`);
          if (onProgress) {
            onProgress(`Failed to generate summary for ${dateStr}: ${getErrorMessage(err)}`);
          }
        }
      }

      // Skip higher-cadence rollups if daily generation had failures —
      // prevents locking in incomplete weekly/monthly via duplicate detection
      if (result.failed.length > 0) {
        if (onProgress) {
          onProgress('Skipped weekly/monthly auto-summaries because daily generation had failures');
        }
        span.setAttribute('commit_story.journal.daily_summaries_count', result.generated.length);
        return result;
      }

      // After daily summaries are generated, check for unsummarized weeks
      const weeklyResult = await triggerAutoWeeklySummaries(basePath, options);

      // After weekly summaries are generated, check for unsummarized months
      const monthlyResult = await triggerAutoMonthlySummaries(basePath, options);

      span.setAttribute('commit_story.journal.daily_summaries_count', result.generated.length);

      return {
        generated: [...result.generated, ...weeklyResult.generated, ...monthlyResult.generated],
        skipped: [...result.skipped, ...weeklyResult.skipped, ...monthlyResult.skipped],
        failed: [...result.failed, ...weeklyResult.failed, ...monthlyResult.failed],
        errors: [...result.errors, ...weeklyResult.errors, ...monthlyResult.errors],
      };
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
 * Trigger automatic weekly summary generation for all unsummarized past weeks.
 * A week is eligible when it has daily summaries and is no longer the current week.
 *
 * @param {string} basePath - Base path for journal (default: current directory)
 * @param {{ onProgress?: (msg: string) => void }} options - Options
 * @returns {Promise<{ generated: string[], skipped: string[], failed: string[], errors: string[] }>}
 */
export async function triggerAutoWeeklySummaries(basePath = '.', options = {}) {
  return tracer.startActiveSpan('commit_story.summarize.trigger_auto_weekly', async (span) => {
    try {
      span.setAttribute('commit_story.journal.base_path', basePath);
      const { onProgress } = options;

      const unsummarizedWeeks = await findUnsummarizedWeeks(basePath);
      span.setAttribute('commit_story.summarize.dates_count', unsummarizedWeeks?.length ?? 0);

      const result = {
        generated: [],
        skipped: [],
        failed: [],
        errors: [],
      };

      for (const weekStr of unsummarizedWeeks) {
        try {
          const summaryResult = await generateAndSaveWeeklySummary(weekStr, basePath);

          if (summaryResult.saved) {
            result.generated.push(summaryResult.path);
            if (onProgress) {
              onProgress(`Generated weekly summary for ${weekStr}`);
            }

            if (summaryResult.errors && summaryResult.errors.length > 0) {
              for (const err of summaryResult.errors) {
                result.errors.push(`${weekStr}: ${err}`);
              }
            }
          } else {
            result.skipped.push(weekStr);
          }
        } catch (err) {
          result.failed.push(weekStr);
          result.errors.push(`${weekStr}: ${getErrorMessage(err)}`);
          if (onProgress) {
            onProgress(`Failed to generate weekly summary for ${weekStr}: ${getErrorMessage(err)}`);
          }
        }
      }

      span.setAttribute('commit_story.journal.weekly_summaries_count', result.generated.length);

      return result;
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
 * Trigger automatic monthly summary generation for all unsummarized past months.
 * A month is eligible when it has weekly summaries and is no longer the current month.
 *
 * @param {string} basePath - Base path for journal (default: current directory)
 * @param {{ onProgress?: (msg: string) => void }} options - Options
 * @returns {Promise<{ generated: string[], skipped: string[], failed: string[], errors: string[] }>}
 */
export async function triggerAutoMonthlySummaries(basePath = '.', options = {}) {
  return tracer.startActiveSpan('commit_story.summarize.trigger_auto_monthly', async (span) => {
    try {
      span.setAttribute('commit_story.journal.base_path', basePath);
      const { onProgress } = options;

      const unsummarizedMonths = await findUnsummarizedMonths(basePath);
      span.setAttribute('commit_story.journal.unsummarized_months_count', unsummarizedMonths?.length ?? 0);

      const result = {
        generated: [],
        skipped: [],
        failed: [],
        errors: [],
      };

      for (const monthStr of unsummarizedMonths) {
        try {
          const summaryResult = await generateAndSaveMonthlySummary(monthStr, basePath);

          if (summaryResult.saved) {
            result.generated.push(summaryResult.path);
            if (onProgress) {
              onProgress(`Generated monthly summary for ${monthStr}`);
            }

            if (summaryResult.errors && summaryResult.errors.length > 0) {
              for (const err of summaryResult.errors) {
                result.errors.push(`${monthStr}: ${err}`);
              }
            }
          } else {
            result.skipped.push(monthStr);
          }
        } catch (err) {
          result.failed.push(monthStr);
          result.errors.push(`${monthStr}: ${getErrorMessage(err)}`);
          if (onProgress) {
            onProgress(`Failed to generate monthly summary for ${monthStr}: ${getErrorMessage(err)}`);
          }
        }
      }

      span.setAttribute('commit_story.summarize.monthly_summaries_generated', String(result.generated.length));

      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}
