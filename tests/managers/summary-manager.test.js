// ABOUTME: Tests for summary-manager.js — summary orchestration and file I/O
// ABOUTME: Uses temp directories for file operations, mocks summary-graph for LLM calls

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// Mock the summary graph
const mockGenerateDailySummary = vi.fn();
vi.mock('../../src/generators/summary-graph.js', () => ({
  generateDailySummary: (...args) => mockGenerateDailySummary(...args),
}));

import {
  readDayEntries,
  formatDailySummary,
  saveDailySummary,
  generateAndSaveDailySummary,
} from '../../src/managers/summary-manager.js';

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

let tmpDir;

function setupTmpDir() {
  tmpDir = mkdtempSync(join(tmpdir(), 'summary-manager-test-'));
}

function teardownTmpDir() {
  if (tmpDir) {
    rmSync(tmpDir, { recursive: true });
    tmpDir = null;
  }
}

function writeEntry(dateStr, content) {
  const [year, month] = dateStr.split('-');
  const dir = join(tmpDir, 'journal', 'entries', `${year}-${month}`);
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, `${dateStr}.md`);
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

function writeSummary(dateStr, content) {
  const dir = join(tmpDir, 'journal', 'summaries', 'daily');
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, `${dateStr}.md`);
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

const SAMPLE_ENTRY = `## 10:00:00 AM CDT — abc123d

### Summary
The developer implemented feature A.

### Development Dialogue
> **Human:** "How should we handle this?"

### Technical Decisions
- **DECISION: Use pattern A** (Implemented)

### Commit Details
**Files Changed**:
- src/index.js

═══════════════════════════════════════

## 2:00:00 PM CDT — def456a

### Summary
The developer fixed a bug in feature A.

### Development Dialogue
No significant dialogue found for this development session

### Technical Decisions
No significant technical decisions documented for this development session

### Commit Details
**Files Changed**:
- src/index.js

═══════════════════════════════════════
`;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('readDayEntries', () => {
  beforeEach(setupTmpDir);
  afterEach(teardownTmpDir);

  it('reads and splits entries from a day file', async () => {
    writeEntry('2026-02-22', SAMPLE_ENTRY);

    const entries = await readDayEntries(new Date(2026, 1, 22), tmpDir);

    expect(entries).toHaveLength(2);
    expect(entries[0]).toContain('abc123d');
    expect(entries[1]).toContain('def456a');
  });

  it('returns empty array when no entry file exists', async () => {
    const entries = await readDayEntries(new Date(2026, 1, 22), tmpDir);
    expect(entries).toEqual([]);
  });

  it('returns empty array for empty file', async () => {
    writeEntry('2026-02-22', '');
    const entries = await readDayEntries(new Date(2026, 1, 22), tmpDir);
    expect(entries).toEqual([]);
  });

  it('rethrows non-ENOENT errors', async () => {
    // Create the entry path as a directory — readFile on a directory throws EISDIR, not ENOENT
    const dir = join(tmpDir, 'journal', 'entries', '2026-02');
    mkdirSync(dir, { recursive: true });
    mkdirSync(join(dir, '2026-02-22.md'));

    await expect(readDayEntries(new Date(2026, 1, 22), tmpDir)).rejects.toThrow();
  });
});

describe('formatDailySummary', () => {
  it('formats sections into daily summary markdown', () => {
    const sections = {
      narrative: 'The developer built auth today.',
      keyDecisions: '- JWT over sessions',
      openThreads: '- Refresh tokens needed',
    };
    const result = formatDailySummary(sections, '2026-02-22');

    expect(result).toContain('# Daily Summary — 2026-02-22');
    expect(result).toContain('## Narrative');
    expect(result).toContain('built auth today');
    expect(result).toContain('## Key Decisions');
    expect(result).toContain('JWT over sessions');
    expect(result).toContain('## Open Threads');
    expect(result).toContain('Refresh tokens needed');
  });

  it('handles empty sections', () => {
    const sections = {
      narrative: 'Short day.',
      keyDecisions: 'No key decisions documented today.',
      openThreads: 'No open threads identified.',
    };
    const result = formatDailySummary(sections, '2026-02-22');

    expect(result).toContain('Short day.');
    expect(result).toContain('No key decisions');
    expect(result).toContain('No open threads');
  });
});

describe('saveDailySummary', () => {
  beforeEach(setupTmpDir);
  afterEach(teardownTmpDir);

  it('writes summary to correct path', async () => {
    const content = '# Daily Summary\n\nSome content';
    const path = await saveDailySummary(content, new Date(2026, 1, 22), tmpDir);

    expect(path).toContain('journal/summaries/daily/2026-02-22.md');
    expect(readFileSync(path, 'utf-8')).toBe(content);
  });

  it('creates directories if they do not exist', async () => {
    const content = '# Daily Summary\n\nSome content';
    await saveDailySummary(content, new Date(2026, 1, 22), tmpDir);

    expect(existsSync(join(tmpDir, 'journal', 'summaries', 'daily'))).toBe(true);
  });

  it('skips writing when summary already exists and force is false', async () => {
    writeSummary('2026-02-22', 'Existing summary');

    const content = '# New Summary';
    const result = await saveDailySummary(content, new Date(2026, 1, 22), tmpDir);

    expect(result).toBeNull();
    expect(readFileSync(join(tmpDir, 'journal', 'summaries', 'daily', '2026-02-22.md'), 'utf-8')).toBe('Existing summary');
  });

  it('overwrites when force is true', async () => {
    writeSummary('2026-02-22', 'Existing summary');

    const content = '# New Summary';
    const path = await saveDailySummary(content, new Date(2026, 1, 22), tmpDir, { force: true });

    expect(path).toContain('2026-02-22.md');
    expect(readFileSync(path, 'utf-8')).toBe(content);
  });

  it('regenerates when existing summary is a failure placeholder', async () => {
    writeSummary('2026-02-22', '[Daily summary generation failed]');

    const content = '# New Summary';
    const path = await saveDailySummary(content, new Date(2026, 1, 22), tmpDir);

    expect(path).not.toBeNull();
    expect(readFileSync(path, 'utf-8')).toBe(content);
  });
});

describe('generateAndSaveDailySummary', () => {
  beforeEach(() => {
    setupTmpDir();
    mockGenerateDailySummary.mockReset();
  });
  afterEach(teardownTmpDir);

  it('reads entries, generates summary, and saves to file', async () => {
    writeEntry('2026-02-22', SAMPLE_ENTRY);

    mockGenerateDailySummary.mockResolvedValue({
      narrative: 'The developer worked on feature A and fixed a bug.',
      keyDecisions: '- Used pattern A for clean separation',
      openThreads: 'No open threads identified.',
      errors: [],
      generatedAt: new Date(),
    });

    const result = await generateAndSaveDailySummary(new Date(2026, 1, 22), tmpDir);

    expect(result.saved).toBe(true);
    expect(result.path).toContain('2026-02-22.md');
    expect(result.entryCount).toBe(2);

    // Verify the file was written
    const content = readFileSync(result.path, 'utf-8');
    expect(content).toContain('worked on feature A');

    // Verify the graph was called with the entries
    expect(mockGenerateDailySummary).toHaveBeenCalledOnce();
    const [entries, dateStr] = mockGenerateDailySummary.mock.calls[0];
    expect(entries).toHaveLength(2);
    expect(dateStr).toBe('2026-02-22');
  });

  it('skips when no entries exist for the date', async () => {
    const result = await generateAndSaveDailySummary(new Date(2026, 1, 22), tmpDir);

    expect(result.saved).toBe(false);
    expect(result.reason).toContain('no entries');
    expect(mockGenerateDailySummary).not.toHaveBeenCalled();
  });

  it('skips when summary already exists and force is false', async () => {
    writeEntry('2026-02-22', SAMPLE_ENTRY);
    writeSummary('2026-02-22', 'Existing summary');

    const result = await generateAndSaveDailySummary(new Date(2026, 1, 22), tmpDir);

    expect(result.saved).toBe(false);
    expect(result.reason).toContain('already exists');
    expect(mockGenerateDailySummary).not.toHaveBeenCalled();
  });

  it('regenerates when force is true', async () => {
    writeEntry('2026-02-22', SAMPLE_ENTRY);
    writeSummary('2026-02-22', 'Existing summary');

    mockGenerateDailySummary.mockResolvedValue({
      narrative: 'Regenerated summary.',
      keyDecisions: '',
      openThreads: '',
      errors: [],
      generatedAt: new Date(),
    });

    const result = await generateAndSaveDailySummary(new Date(2026, 1, 22), tmpDir, { force: true });

    expect(result.saved).toBe(true);
    expect(mockGenerateDailySummary).toHaveBeenCalledOnce();
  });

  it('regenerates when existing summary is a failure placeholder', async () => {
    writeEntry('2026-02-22', SAMPLE_ENTRY);
    writeSummary('2026-02-22', '[Daily summary generation failed]');

    mockGenerateDailySummary.mockResolvedValue({
      narrative: 'Real generated narrative.',
      keyDecisions: '',
      openThreads: '',
      errors: [],
      generatedAt: new Date(),
    });

    const result = await generateAndSaveDailySummary(new Date(2026, 1, 22), tmpDir);

    expect(result.saved).toBe(true);
    expect(mockGenerateDailySummary).toHaveBeenCalledOnce();
    const content = readFileSync(result.path, 'utf-8');
    expect(content).toContain('Real generated narrative.');
    expect(content).not.toContain('generation failed');
  });
});
