#!/usr/bin/env bash
# ABOUTME: Installs the commit-story git post-commit hook with runtime OTel SDK discovery
# ABOUTME: Generated hook resolves instrumentation.js at runtime — no hardcoded paths to break
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
  echo "the following line to your post-commit hook manually:"
  echo ""
  echo "    npx commit-story &"
  echo ""
  exit 1
fi

# Create the hook with runtime instrumentation discovery
cat > "$HOOK_PATH" << 'HOOKEOF'
#!/bin/bash
# commit-story post-commit hook
# Generates a journal entry for each commit

# Discover instrumentation.js at runtime by checking:
# 1. Local repo (development mode — this IS the commit-story repo)
# 2. npm link symlink (dev dependency linked to the real repo)
find_instrumentation() {
  local repo_root
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || return

  # Check local examples/ (developing commit-story itself)
  if [[ -f "$repo_root/examples/instrumentation.js" ]]; then
    echo "$repo_root/examples/instrumentation.js"
    return
  fi

  # Follow npm link symlink to the real package
  local pkg_link="$repo_root/node_modules/commit-story"
  if [[ -L "$pkg_link" ]]; then
    local real_pkg
    # Portable symlink resolution (macOS lacks readlink -f)
    if command -v realpath >/dev/null 2>&1; then
      real_pkg="$(realpath "$pkg_link")"
    elif command -v greadlink >/dev/null 2>&1; then
      real_pkg="$(greadlink -f "$pkg_link")"
    else
      real_pkg="$(cd "$pkg_link" && pwd -P)"
    fi
    if [[ -f "$real_pkg/examples/instrumentation.js" ]]; then
      echo "$real_pkg/examples/instrumentation.js"
      return
    fi
  fi
}

# Run in background to not block git
(
  INSTRUMENT="$(find_instrumentation)"
  if [[ -n "$INSTRUMENT" ]]; then
    NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--import '$INSTRUMENT'" npx commit-story
  else
    npx commit-story
  fi
) &
HOOKEOF

# Make it executable
chmod +x "$HOOK_PATH"

echo "✅ Git hook installed successfully"
echo "   Location: $HOOK_PATH"
echo ""
echo "Journal entries will be generated automatically after each commit."
echo "   OTel SDK: auto-discovered at runtime (if available)"
echo ""
echo "To remove the hook, run: npx commit-story-remove"
echo "Or delete: $HOOK_PATH"
