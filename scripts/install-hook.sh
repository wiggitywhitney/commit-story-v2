#!/usr/bin/env bash
# ABOUTME: Installs the commit-story git post-commit hook with runtime path discovery
# ABOUTME: Generated hook resolves the package location at runtime — no hardcoded paths to break
#
# Run from the root of a git repository.

set -euo pipefail

HOOK_PATH=".git/hooks/post-commit"

# Check if we're in a git repository
if [[ ! -d ".git" ]]; then
  echo "❌ Not a git repository"
  echo "   Run this script from the root of a git repository."
  exit 1
fi

# Check if hook already exists
if [[ -f "$HOOK_PATH" ]]; then
  echo "⚠️  Warning: $HOOK_PATH already exists"
  echo ""
  echo "To avoid overwriting your existing hook, please add"
  echo "the commit-story invocation to your post-commit hook manually."
  echo ""
  exit 1
fi

# Create the hook with runtime package discovery
cat > "$HOOK_PATH" << 'HOOKEOF'
#!/bin/bash
# commit-story post-commit hook
# Generates a journal entry for each commit

# Resolve symlinks portably (macOS lacks readlink -f)
# NOTE: Fallback method (cd + pwd -P) only works for directory paths/symlinks
resolve_path() {
  if command -v realpath >/dev/null 2>&1 && realpath "$1" 2>/dev/null; then
    return
  elif command -v greadlink >/dev/null 2>&1 && greadlink -f "$1" 2>/dev/null; then
    return
  elif [[ -d "$1" ]] || [[ -L "$1" ]]; then
    cd "$1" && pwd -P
  fi
}

# Discover the commit-story package directory at runtime by checking:
# 1. Local repo (development mode — this IS the commit-story repo)
# 2. npm link symlink (dev dependency linked to the real repo)
find_package_dir() {
  local repo_root
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || return

  # Check if this IS the commit-story repo (has src/index.js and package.json with commit-story name)
  if [[ -f "$repo_root/src/index.js" ]] && grep -q '"name"[[:space:]]*:[[:space:]]*"commit-story"' "$repo_root/package.json" 2>/dev/null; then
    echo "$repo_root"
    return
  fi

  # Follow npm link symlink to the real package
  local pkg_link="$repo_root/node_modules/commit-story"
  if [[ -L "$pkg_link" ]]; then
    resolve_path "$pkg_link"
    return
  fi

  # Installed as a regular dependency
  if [[ -d "$pkg_link" ]]; then
    echo "$pkg_link"
    return
  fi
}

# Run in background to not block git
(
  PKG_DIR="$(find_package_dir)"

  if [[ -z "$PKG_DIR" || ! -f "$PKG_DIR/src/index.js" ]]; then
    # Fallback: try npx (may resolve to an older published version)
    #
    # Strip gateway env vars here too — this path runs a real Anthropic SDK call same as
    # the branches below, and is just as vulnerable to the silent gateway leak (see comment
    # above the vals/node invocations for the full explanation).
    env -u ANTHROPIC_CUSTOM_HEADERS -u ANTHROPIC_BASE_URL npx commit-story
    exit
  fi

  # Build the node command — run the local source directly
  NODE_ARGS=("$PKG_DIR/src/index.js")

  # Add OTel instrumentation if available
  if [[ -f "$PKG_DIR/examples/instrumentation.js" ]]; then
    NODE_ARGS=("--import" "$PKG_DIR/examples/instrumentation.js" "${NODE_ARGS[@]}")
  fi

  # Inject secrets via vals if .vals.yaml exists in the target repo
  #
  # Strip ANTHROPIC_BASE_URL / ANTHROPIC_CUSTOM_HEADERS unconditionally: Claude Code sets
  # these to route its own Anthropic calls through the Datadog AI Gateway. If a commit is
  # made from inside a Claude Code session, this hook's child node process inherits them,
  # sending commit-story's own Anthropic SDK calls to the gateway URL without valid gateway
  # headers. The hook still exits 0, so the failure is silent — journal entries are saved
  # with "[... generation failed]" placeholder text instead of real content.
  REPO_ROOT="$(git rev-parse --show-toplevel)"
  if [[ -f "$REPO_ROOT/.vals.yaml" ]] && command -v vals >/dev/null 2>&1; then
    env -u ANTHROPIC_CUSTOM_HEADERS -u ANTHROPIC_BASE_URL vals exec -f "$REPO_ROOT/.vals.yaml" -- node "${NODE_ARGS[@]}"
  else
    env -u ANTHROPIC_CUSTOM_HEADERS -u ANTHROPIC_BASE_URL node "${NODE_ARGS[@]}"
  fi
) &
HOOKEOF

# Make it executable
chmod +x "$HOOK_PATH"

echo "✅ Git hook installed successfully"
echo "   Location: $HOOK_PATH"
echo ""
echo "Journal entries will be generated automatically after each commit."
echo "   Package & OTel SDK: auto-discovered at runtime"
echo ""
echo "To remove the hook, run: npx commit-story-remove"
echo "Or delete: $HOOK_PATH"
