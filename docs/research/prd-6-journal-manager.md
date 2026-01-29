# PRD #6 Research: Journal Manager

## Research Date: January 2026

## Summary

This document covers Node.js fs/promises best practices, timezone handling approaches, and markdown formatting conventions for the journal manager feature.

---

## 1. Node.js fs/promises API

### Import Pattern

```javascript
import { readFile, writeFile, mkdir, appendFile, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
```

### Recursive Directory Creation

```javascript
// Create nested directories - returns first created path or undefined
await mkdir('./journal/entries/2026-01', { recursive: true });
```

Key points:
- Always use `{ recursive: true }` to create parent directories
- Returns `undefined` if directory exists (no error when recursive is true)
- Only rejects when `recursive: false` and directory exists

### writeFile

```javascript
await writeFile(filePath, content, 'utf-8');
```

Key points:
- Creates file if it doesn't exist
- Overwrites entire file if it exists
- Use for new file creation

### appendFile

```javascript
await appendFile(filePath, content, 'utf-8');
```

Key points:
- Creates file if it doesn't exist
- Appends to end of existing file
- Ideal for multiple entries per day

### File Existence Check

```javascript
import { access, constants } from 'node:fs/promises';

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
```

Note: `fs.exists()` is deprecated - use `access()` instead.

### Best Practices

1. **Always use `node:` prefix** for built-in modules (Node.js recommended)
2. **Use `path.join()`** for cross-platform path construction
3. **Handle errors gracefully** - wrap in try/catch
4. **Use streams for large files** - not needed for journal entries
5. **Close file handles** if using `open()` - not needed with writeFile/appendFile

### Sources

- [Node.js fs Documentation](https://nodejs.org/api/fs.html)
- [Mastering fs.promises in Node.js](https://dev.to/sovannaro/mastering-the-fspromises-module-in-nodejs-4210)
- [Create Directory if Not Exists](https://jsdev.space/howto/create-dir-if-not-exists/)

---

## 2. Timezone Handling

### Temporal API Status (2025)

The Temporal API is at **TC39 Stage 3** - recommended for implementation, API is stable. However, browser support is limited:
- Firefox Nightly: Available under flag (`javascript.options.experimental.temporal`)
- Chrome, Safari: In progress
- Node.js: Not yet natively supported

**Recommendation**: Don't use Temporal API yet for production. Use native Date with careful UTC handling.

### Approach for Journal Manager: Native Date + UTC

For this project, we'll use native JavaScript Date with explicit UTC handling:

```javascript
// Store/compare in UTC
const utcTimestamp = date.toISOString();

// Display in local time
const localDisplay = date.toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZoneName: 'short'
});
// Output: "10:15:32 AM CDT"
```

### Why Not External Libraries?

1. **date-fns**: Lightweight but timezone support requires date-fns-tz
2. **Luxon**: Great timezone support but adds ~20KB
3. **Native Date**: Sufficient for our needs, no dependencies

Our use case is simple:
- Compare timestamps in UTC (for filtering)
- Display in local time (for readability)
- No cross-timezone conversions needed

### UTC-First Pattern (from v1 DD-002)

```javascript
// 1. Parse timestamps to Date objects
const commitTime = new Date(commit.timestamp);
const reflectionTime = new Date(reflection.timestamp);

// 2. Compare using getTime() (milliseconds since epoch, always UTC)
const isInWindow = reflectionTime.getTime() >= startTime.getTime()
                && reflectionTime.getTime() <= endTime.getTime();

// 3. Display in local time for readability
const displayTime = commitTime.toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZoneName: 'short'
});
```

### Date Formatting for Paths

```javascript
// YYYY-MM format for directories
function getYearMonth(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// YYYY-MM-DD format for files
function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

### Sources

- [Temporal API - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
- [JavaScript Temporal in 2025](https://medium.com/@asierr/javascripts-temporal-api-in-2025-finally-dates-and-times-done-right-7b63a0ac6669)
- [date-fns vs Luxon comparison](https://www.slant.co/versus/20523/29531/~date-fns_vs_luxon)

---

## 3. Markdown Formatting Conventions

### Journal Entry Structure

```markdown
## 10:15:32 AM CDT - Commit: abc1234

### Summary
{content}

### Development Dialogue
{content}

### Technical Decisions
{content}

### Developer Reflections
> 9:45:00 AM - "Quote from reflection..."

### Commit Details
- **Hash**: abc1234def5678
- **Author**: Whitney Lee
- **Files Changed**: 5

═══════════════════════════════════════
```

### Formatting Guidelines

1. **Entry Header**: `## HH:MM:SS AM/PM TZ - Commit: {shortHash}`
2. **Section Headers**: `### Section Name`
3. **Reflections**: Use blockquote `> ` for emphasis
4. **Commit Details**: Bullet list with bold labels
5. **Separator**: Unicode box drawing character `═` (U+2550)

### Separator Pattern

```javascript
const ENTRY_SEPARATOR = '\n═══════════════════════════════════════\n\n';
```

Using `═` (box drawing double horizontal) instead of `=` for visual distinction.

---

## 4. Path Utilities Design

### Directory Structure

```text
journal/
  entries/
    2026-01/
      2026-01-15.md
      2026-01-16.md
  reflections/
    2026-01/
      2026-01-15.md
  context/
    2026-01/
      2026-01-15.md
```

### Path Functions

```javascript
const JOURNAL_ROOT = 'journal';

export function getJournalEntryPath(date) {
  const yearMonth = getYearMonth(date);
  const dateStr = getDateString(date);
  return join(JOURNAL_ROOT, 'entries', yearMonth, `${dateStr}.md`);
}

export function getReflectionPath(date) {
  const yearMonth = getYearMonth(date);
  const dateStr = getDateString(date);
  return join(JOURNAL_ROOT, 'reflections', yearMonth, `${dateStr}.md`);
}

export function getContextPath(date) {
  const yearMonth = getYearMonth(date);
  const dateStr = getDateString(date);
  return join(JOURNAL_ROOT, 'context', yearMonth, `${dateStr}.md`);
}

export async function ensureDirectory(filePath) {
  const dir = dirname(filePath);
  await mkdir(dir, { recursive: true });
}
```

---

## 5. Reflection Parsing

### Reflection File Format

```markdown
## 9:45:00 AM CDT - Manual Reflection

Realized the issue was in the async handling...

═══════════════════════════════════════
```

### Parsing Strategy

```javascript
const ENTRY_PATTERN = /^## (\d{1,2}:\d{2}:\d{2} [AP]M \w+) - (.+?)$/gm;
const SEPARATOR = '═══════════════════════════════════════';

function parseReflections(content) {
  const entries = [];
  const parts = content.split(SEPARATOR);

  for (const part of parts) {
    const match = part.match(/^## (\d{1,2}:\d{2}:\d{2} [AP]M \w+) - (.+?)$/m);
    if (match) {
      const [, timeStr, title] = match;
      const contentStart = part.indexOf('\n', part.indexOf(match[0])) + 1;
      const text = part.slice(contentStart).trim();

      entries.push({
        timeString: timeStr,
        title,
        content: text
      });
    }
  }

  return entries;
}
```

### Time Window Filtering

For filtering reflections to a commit time window:
1. Parse date from file path (YYYY-MM-DD)
2. Parse time from entry header
3. Combine into full Date object
4. Compare using UTC milliseconds

---

## 6. Implementation Recommendations

### Error Handling Strategy

```javascript
try {
  await ensureDirectory(filePath);
  await appendFile(filePath, content, 'utf-8');
  return filePath;
} catch (error) {
  // Log error but don't crash
  console.error(`Failed to save journal entry: ${error.message}`);
  throw new Error(`Journal save failed: ${error.message}`);
}
```

### File Writing Pattern

```javascript
export async function saveJournalEntry(sections, commit, reflections) {
  const entryPath = getJournalEntryPath(commit.timestamp);
  await ensureDirectory(entryPath);

  const formattedEntry = formatJournalEntry(sections, commit, reflections);

  // appendFile creates or appends
  await appendFile(entryPath, formattedEntry, 'utf-8');

  return entryPath;
}
```

### Decision Summary

| Decision | Choice | Rationale |
| --- | --- | --- |
| File API | fs/promises | Modern, async, standard |
| Timezone | Native Date + UTC | No dependencies, sufficient for use case |
| Directory creation | mkdir recursive | Silent, idempotent |
| Multiple entries | appendFile | Preserves daily history |
| Separator | Unicode ═ | Visual distinction |
