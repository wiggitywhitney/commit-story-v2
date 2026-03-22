#!/usr/bin/env bash
# ABOUTME: Installs the commit-story git post-commit hook with OTel SDK loading
# ABOUTME: Resolves instrumentation.js path through symlinks for dev/linked mode
#
# Run from the root of a git repository.

set -euo pipefail

HOOK_PATH=".git/hooks/post-commit"

# Resolve this script's real location (follows symlinks from npx/npm link)
resolve_script_dir() {
  local source="$1"
  while [[ -L "$source" ]]; do
    local dir
    dir="$(cd "$(dirname "$source")" && pwd)"
    source="$(readlink "$source")"
    [[ "$source" != /* ]] && source="$dir/$source"
  done
  cd "$(dirname "$source")" && pwd
}

SCRIPT_DIR="$(resolve_script_dir "$0")"
EXAMPLES_DIR="$SCRIPT_DIR/../examples"
if [[ -d "$EXAMPLES_DIR" ]]; then
  INSTRUMENTATION_PATH="$(cd "$EXAMPLES_DIR" && pwd)/instrumentation.js"
else
  INSTRUMENTATION_PATH=""
fi

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
  if [[ -n "$INSTRUMENTATION_PATH" && -f "$INSTRUMENTATION_PATH" ]]; then
    echo "    NODE_OPTIONS=\"\${NODE_OPTIONS:+\$NODE_OPTIONS }--import '$INSTRUMENTATION_PATH'\" npx commit-story &"
  else
    echo "    npx commit-story &"
  fi
  echo ""
  exit 1
fi

# Build the hook command based on whether instrumentation.js exists (dev/linked mode)
if [[ -n "$INSTRUMENTATION_PATH" && -f "$INSTRUMENTATION_PATH" ]]; then
  HOOK_CMD="NODE_OPTIONS=\"\${NODE_OPTIONS:+\$NODE_OPTIONS }--import '$INSTRUMENTATION_PATH'\" npx commit-story &"
else
  HOOK_CMD="npx commit-story &"
fi

# Create the hook
cat > "$HOOK_PATH" << EOF
#!/bin/bash
# commit-story post-commit hook
# Generates a journal entry for each commit

# Run in background to not block git
$HOOK_CMD
EOF

# Make it executable
chmod +x "$HOOK_PATH"

echo "✅ Git hook installed successfully"
echo "   Location: $HOOK_PATH"
echo ""
echo "Journal entries will be generated automatically after each commit."
if [[ -n "$INSTRUMENTATION_PATH" && -f "$INSTRUMENTATION_PATH" ]]; then
  echo "   OTel SDK: enabled (--import instrumentation.js)"
fi
echo ""
echo "To remove the hook, run: npx commit-story-remove"
echo "Or delete: $HOOK_PATH"
