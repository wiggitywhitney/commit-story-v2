// ABOUTME: Detects failure-placeholder content so stale journal entries and summaries can be regenerated
// ABOUTME: Shared between journal-manager.js and summary-manager.js dedup checks

const FAILURE_MARKERS = ['generation failed', 'extraction failed'];

/**
 * Check whether content contains a known failure-placeholder substring
 * @param {string} content - Content to check
 * @returns {boolean} True if content contains a failure marker
 */
export function isFailurePlaceholder(content) {
  if (!content) return false;
  return FAILURE_MARKERS.some(marker => content.includes(marker));
}
