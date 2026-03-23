// ABOUTME: Tests for install-hook.sh — verifies post-commit hook generation with runtime discovery
// ABOUTME: Covers package discovery, OTel instrumentation, vals integration, and edge cases

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync, statSync, mkdirSync, writeFileSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const INSTALL_SCRIPT = join(process.cwd(), 'scripts', 'install-hook.sh');
const UNINSTALL_SCRIPT = join(process.cwd(), 'scripts', 'uninstall-hook.sh');

describe('install-hook.sh', () => {
  let tmpDir;
  let fakePackageDir;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'commit-story-hook-'));
    fakePackageDir = null;
    execFileSync('git', ['init'], { cwd: tmpDir, stdio: 'ignore' });
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
    if (fakePackageDir && existsSync(fakePackageDir)) {
      rmSync(fakePackageDir, { recursive: true, force: true });
    }
  });

  it('creates post-commit hook file', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookPath = join(tmpDir, '.git', 'hooks', 'post-commit');
    expect(existsSync(hookPath)).toBe(true);
  });

  it('includes runtime package discovery function', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    expect(hookContent).toContain('find_package_dir');
    expect(hookContent).toContain('src/index.js');
  });

  it('runs local source (node src/index.js) not npx', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    // Primary path runs node with the package's src/index.js
    expect(hookContent).toContain('NODE_ARGS=("$PKG_DIR/src/index.js")');
  });

  it('adds --import for instrumentation.js when available', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    expect(hookContent).toContain('--import');
    expect(hookContent).toContain('examples/instrumentation.js');
  });

  it('integrates with vals when .vals.yaml exists', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    expect(hookContent).toContain('vals exec');
    expect(hookContent).toContain('.vals.yaml');
  });

  it('does not contain hardcoded absolute paths', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    // Should NOT contain baked-in absolute paths
    const absolutePathMatch = hookContent.match(/--import\s+'\/[^']+instrumentation\.js'/);
    expect(absolutePathMatch).toBeNull();
  });

  it('falls back to npx when package directory is not found', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    // Fallback path uses npx
    expect(hookContent).toMatch(/npx commit-story/);
  });

  it('makes hook executable', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookPath = join(tmpDir, '.git', 'hooks', 'post-commit');
    const stats = statSync(hookPath);
    expect(stats.mode & 0o111).toBeGreaterThan(0);
  });

  it('runs in background via subshell', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    // The outer subshell is backgrounded with ) &
    expect(hookContent).toMatch(/\)\s*&/);
  });

  it('refuses to overwrite existing hook', () => {
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

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

  it('generates hook with npm link symlink resolution logic', () => {
    fakePackageDir = mkdtempSync(join(tmpdir(), 'commit-story-pkg-'));
    mkdirSync(join(fakePackageDir, 'examples'), { recursive: true });
    writeFileSync(join(fakePackageDir, 'examples', 'instrumentation.js'), '// stub');
    mkdirSync(join(fakePackageDir, 'src'), { recursive: true });
    writeFileSync(join(fakePackageDir, 'src', 'index.js'), '// stub');

    mkdirSync(join(tmpDir, 'node_modules'), { recursive: true });
    symlinkSync(fakePackageDir, join(tmpDir, 'node_modules', 'commit-story'));

    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    expect(hookContent).toContain('node_modules/commit-story');
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
    execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });
    const hookPath = join(tmpDir, '.git', 'hooks', 'post-commit');
    expect(existsSync(hookPath)).toBe(true);

    execFileSync('bash', [UNINSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });
    expect(existsSync(hookPath)).toBe(false);
  });
});
