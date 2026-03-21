// ABOUTME: Tests for install-hook.sh — verifies post-commit hook generation with OTel SDK loading
// ABOUTME: Covers hook content, NODE_OPTIONS --import flag, executable permissions, and edge cases

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const INSTALL_SCRIPT = join(process.cwd(), 'scripts', 'install-hook.sh');
const UNINSTALL_SCRIPT = join(process.cwd(), 'scripts', 'uninstall-hook.sh');

describe('install-hook.sh', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'commit-story-hook-'));
    execFileSync('git', ['init'], { cwd: tmpDir, stdio: 'ignore' });
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates post-commit hook file', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookPath = join(tmpDir, '.git', 'hooks', 'post-commit');
    expect(existsSync(hookPath)).toBe(true);
  });

  it('includes npx commit-story in hook', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    expect(hookContent).toContain('npx commit-story');
  });

  it('includes NODE_OPTIONS with --import for instrumentation.js', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    expect(hookContent).toContain('NODE_OPTIONS=');
    expect(hookContent).toContain('--import');
    expect(hookContent).toContain('instrumentation.js');
  });

  it('embeds absolute path to instrumentation.js', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    const match = hookContent.match(/--import\s+'?([^"&\s']+)'?/);
    expect(match).toBeTruthy();
    // Path should be absolute
    expect(match[1]).toMatch(/^\//);
    // Should point to the real instrumentation.js in this repo
    expect(existsSync(match[1])).toBe(true);
  });

  it('makes hook executable', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookPath = join(tmpDir, '.git', 'hooks', 'post-commit');
    const stats = statSync(hookPath);
    expect(stats.mode & 0o111).toBeGreaterThan(0);
  });

  it('runs hook in background (trailing &)', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    expect(hookContent).toMatch(/npx commit-story\s*&/);
  });

  it('refuses to overwrite existing hook', () => {
    // Install once
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    // Second install should fail
    expect(() => {
      execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });
    }).toThrow();
  });

  it('fails outside a git repository', () => {
    const nonGitDir = mkdtempSync(join(tmpdir(), 'no-git-'));
    try {
      expect(() => {
        execFileSync('bash', [INSTALL_SCRIPT], { cwd: nonGitDir, stdio: 'pipe' });
      }).toThrow();
    } finally {
      rmSync(nonGitDir, { recursive: true, force: true });
    }
  });

  it('preserves existing NODE_OPTIONS in hook', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    // Should use ${NODE_OPTIONS:+...} pattern to preserve existing options
    expect(hookContent).toMatch(/\$\{NODE_OPTIONS:\+/);
  });
});

describe('uninstall-hook.sh', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'commit-story-hook-'));
    execFileSync('git', ['init'], { cwd: tmpDir, stdio: 'ignore' });
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('removes hook installed by install-hook.sh', () => {
    // Install
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });
    const hookPath = join(tmpDir, '.git', 'hooks', 'post-commit');
    expect(existsSync(hookPath)).toBe(true);

    // Uninstall
    execFileSync('bash', [UNINSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });
    expect(existsSync(hookPath)).toBe(false);
  });
});
