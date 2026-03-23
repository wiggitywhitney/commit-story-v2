// ABOUTME: Tests for install-hook.sh — verifies post-commit hook generation with OTel SDK loading
// ABOUTME: Covers runtime discovery of instrumentation.js, fallback behavior, and edge cases

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync, statSync, mkdirSync, writeFileSync, symlinkSync } from 'node:fs';
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

  it('includes runtime discovery function for instrumentation.js', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    // Hook should contain resolution logic, not a hardcoded path
    expect(hookContent).toContain('find_instrumentation');
    expect(hookContent).toContain('instrumentation.js');
  });

  it('uses --import when instrumentation.js is found at runtime', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    expect(hookContent).toContain('--import');
    expect(hookContent).toContain('NODE_OPTIONS');
  });

  it('falls back to no-telemetry mode when instrumentation.js is absent', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    // Should have a fallback path that runs without --import
    expect(hookContent).toMatch(/else/);
    expect(hookContent).toMatch(/npx commit-story/);
  });

  it('does not contain hardcoded absolute paths', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    // Should NOT contain baked-in absolute paths to instrumentation.js
    const absolutePathMatch = hookContent.match(/--import\s+'\/[^']+instrumentation\.js'/);
    expect(absolutePathMatch).toBeNull();
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
    expect(hookContent).toMatch(/npx commit-story\s*(&|.*&)/);
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

  it('discovers instrumentation.js through npm link symlinks', () => {
    // Simulate an npm-linked commit-story package
    const fakePackageDir = mkdtempSync(join(tmpdir(), 'commit-story-pkg-'));
    mkdirSync(join(fakePackageDir, 'examples'), { recursive: true });
    writeFileSync(join(fakePackageDir, 'examples', 'instrumentation.js'), '// stub');
    mkdirSync(join(fakePackageDir, 'scripts'), { recursive: true });

    // Create a symlink in the tmp repo's node_modules pointing to our fake package
    mkdirSync(join(tmpDir, 'node_modules'), { recursive: true });
    symlinkSync(fakePackageDir, join(tmpDir, 'node_modules', 'commit-story'));

    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    // Hook should have the logic to follow node_modules symlinks
    expect(hookContent).toContain('node_modules/commit-story');

    rmSync(fakePackageDir, { recursive: true, force: true });
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
