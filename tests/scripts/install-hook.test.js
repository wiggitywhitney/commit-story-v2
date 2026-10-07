// ABOUTME: Tests for install-hook.sh — verifies post-commit hook generation with runtime discovery
// ABOUTME: Covers package discovery, OTel instrumentation, vals integration, and edge cases

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync, statSync, mkdirSync, writeFileSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// Git sets these when it runs a hook (pre-push runs the test suite), and in a linked worktree.
// Inherited, they point the temporary repos these tests create at the real repository.
const REPO_LOCATING_GIT_VARS = [
  'GIT_DIR',
  'GIT_WORK_TREE',
  'GIT_INDEX_FILE',
  'GIT_PREFIX',
  'GIT_COMMON_DIR',
  'GIT_OBJECT_DIRECTORY',
  'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_NAMESPACE',
];
const savedGitEnv = {};

beforeAll(() => {
  for (const name of REPO_LOCATING_GIT_VARS) {
    if (name in process.env) savedGitEnv[name] = process.env[name];
    delete process.env[name];
  }
});

afterAll(() => {
  Object.assign(process.env, savedGitEnv);
});

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

  it('strips ANTHROPIC_BASE_URL and ANTHROPIC_CUSTOM_HEADERS before all three invocations', () => {
    execFileSync('bash', [INSTALL_SCRIPT], {
      cwd: tmpDir,
      stdio: 'pipe',
      env: {
        ...process.env,
        ANTHROPIC_BASE_URL: 'https://ai-gateway.us1.ddbuild.io',
        ANTHROPIC_CUSTOM_HEADERS: 'source: claude-code',
      },
    });

    const hookContent = readFileSync(join(tmpDir, '.git', 'hooks', 'post-commit'), 'utf-8');
    const stripPrefix = 'env -u ANTHROPIC_CUSTOM_HEADERS -u ANTHROPIC_BASE_URL';

    // Must precede the vals exec invocation
    expect(hookContent).toContain(`${stripPrefix} vals exec`);
    // Must precede the plain node fallback invocation
    expect(hookContent).toContain(`${stripPrefix} node "${'${NODE_ARGS[@]}'}"`);
    // Must precede the npx fallback invocation (package directory not found)
    expect(hookContent).toContain(`${stripPrefix} npx commit-story`);
  });

  describe('secret injection at runtime', () => {
    const git = (cwd, ...args) =>
      execFileSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=t', '-c', 'user.email=t@example.com', ...args], { cwd, stdio: 'pipe' });

    // Runs the generated hook and waits for the background subshell to write the marker file.
    const runHook = (cwd, env = {}) => {
      const marker = join(cwd, 'hook-ran.txt');
      execFileSync('bash', [hookFor(cwd)], {
        cwd,
        stdio: 'pipe',
        env: { ...process.env, PATH: `/tmp/commit-story-path-marker:${process.env.PATH}`, ...env },
      });
      for (let i = 0; i < 100 && !existsSync(marker); i++) execFileSync('sleep', ['0.1']);
      return existsSync(marker) ? readFileSync(marker, 'utf-8') : null;
    };

    // Worktrees share the hook with the main checkout, so resolve it from the common git dir.
    const hookFor = (cwd) =>
      join(execFileSync('git', ['rev-parse', '--git-common-dir'], { cwd }).toString().trim().replace(/^\.git$/, join(cwd, '.git')), 'hooks', 'post-commit');

    const writeFakePackage = () => {
      fakePackageDir = mkdtempSync(join(tmpdir(), 'fake-commit-story-'));
      mkdirSync(join(fakePackageDir, 'src'));
      writeFileSync(join(fakePackageDir, 'package.json'), '{"name":"fake-not-commit-story","type":"module"}');
      writeFileSync(
        join(fakePackageDir, 'src', 'index.js'),
        "import { writeFileSync } from 'node:fs';\nwriteFileSync('hook-ran.txt', `${process.env.ANTHROPIC_API_KEY ?? 'missing'}|${(process.env.PATH ?? '').includes('commit-story-path-marker') ? 'path-kept' : 'path-lost'}|${process.env.COMMIT_STORY_TRACELOOP ?? 'traceloop-unset'}`);\n"
      );
    };

    it('injects secrets from the main checkout when the hook runs in a linked worktree', () => {
      writeFakePackage();
      mkdirSync(join(tmpDir, 'node_modules'));
      symlinkSync(fakePackageDir, join(tmpDir, 'node_modules', 'commit-story'));
      writeFileSync(join(tmpDir, '.vals.yaml'), 'ANTHROPIC_API_KEY: ref+echo://worktree-test-key\n');
      execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });
      git(tmpDir, 'commit', '--allow-empty', '-m', 'init');
      const worktreeDir = `${tmpDir}-worktree`;
      git(tmpDir, 'worktree', 'add', '-q', worktreeDir, '-b', 'wt-branch');

      try {
        expect(runHook(worktreeDir)).toBe('worktree-test-key|path-kept|traceloop-unset');
      } finally {
        rmSync(worktreeDir, { recursive: true, force: true });
      }
    });

    it('injects secrets from the repo root in a normal checkout', () => {
      writeFakePackage();
      mkdirSync(join(tmpDir, 'node_modules'));
      symlinkSync(fakePackageDir, join(tmpDir, 'node_modules', 'commit-story'));
      writeFileSync(join(tmpDir, '.vals.yaml'), 'ANTHROPIC_API_KEY: ref+echo://checkout-test-key\n');
      execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

      expect(runHook(tmpDir)).toBe('checkout-test-key|path-kept|traceloop-unset');
    });

    it('passes COMMIT_STORY_TRACELOOP from the caller through to node', () => {
      writeFakePackage();
      mkdirSync(join(tmpDir, 'node_modules'));
      symlinkSync(fakePackageDir, join(tmpDir, 'node_modules', 'commit-story'));
      writeFileSync(join(tmpDir, '.vals.yaml'), 'ANTHROPIC_API_KEY: ref+echo://traceloop-test-key\n');
      execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });

      expect(runHook(tmpDir, { COMMIT_STORY_TRACELOOP: 'true' })).toBe('traceloop-test-key|path-kept|true');
    });

    it('injects secrets on the npx path when no package directory is found', () => {
      writeFileSync(join(tmpDir, '.vals.yaml'), 'ANTHROPIC_API_KEY: ref+echo://fallback-test-key\n');
      execFileSync('bash', [INSTALL_SCRIPT], { cwd: tmpDir, stdio: 'pipe' });
      // Stand-in for npx so the test does not touch the network or a globally linked package.
      const binDir = mkdtempSync(join(tmpdir(), 'fake-bin-'));
      // Records the key and whether node is reachable, because a real npx needs node on PATH.
      writeFileSync(
        join(binDir, 'npx'),
        '#!/bin/bash\nprintf "%s|%s" "${ANTHROPIC_API_KEY:-missing}" "$(command -v node >/dev/null 2>&1 && echo node-found || echo node-missing)" > hook-ran.txt\n',
        { mode: 0o755 }
      );

      try {
        expect(runHook(tmpDir, { PATH: `${binDir}:${process.env.PATH}` })).toBe('fallback-test-key|node-found');
      } finally {
        rmSync(binDir, { recursive: true, force: true });
      }
    });
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
