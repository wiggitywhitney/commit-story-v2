// ABOUTME: Detects failure-placeholder content so stale journal entries and summaries can be regenerated
// ABOUTME: Shared between journal-manager.js and summary-manager.js dedup checks

const FAILURE_MARKERS = [/\[[^\]]*generation failed\]/i, /\[[^\]]*extraction failed\]/i];

/**
 * Check whether content contains a known failure-placeholder marker
 * @param {string} content - Content to check
 * @returns {boolean} True if content contains a bracketed failure placeholder
 */
export function isFailurePlaceholder(content) {
  if (!content) return false;
  return FAILURE_MARKERS.some(marker => marker.test(content));
}
