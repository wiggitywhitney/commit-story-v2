#!/bin/bash
# uninstall-hook.sh
#
# Removes the commit-story git post-commit hook.
# Run from the root of a git repository.

set -e

HOOK_PATH=".git/hooks/post-commit"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo "❌ Not a git repository"
  echo "   Run this script from the root of a git repository."
  exit 1
fi

# Check if hook exists
if [ ! -f "$HOOK_PATH" ]; then
  echo "⚠️  No post-commit hook found"
  echo "   Nothing to remove."
  exit 0
fi

# Check if it's our hook
if grep -q "npx commit-story" "$HOOK_PATH"; then
  # It's our hook or contains our hook

  # Count lines to see if there's more content
  LINE_COUNT=$(wc -l < "$HOOK_PATH" | tr -d ' ')

  if [ "$LINE_COUNT" -le 6 ]; then
    # Simple hook (just ours) - safe to remove
    rm "$HOOK_PATH"
    echo "✅ Git hook removed successfully"
  else
    # Hook has additional content - don't delete
    echo "⚠️  Hook contains additional commands"
    echo "   Please manually remove the commit-story line from: $HOOK_PATH"
    echo ""
    echo "   Look for: npx commit-story &"
    exit 1
  fi
else
  echo "⚠️  Post-commit hook exists but doesn't appear to be from commit-story"
  echo "   Location: $HOOK_PATH"
  echo "   Not removing to avoid breaking your existing hook."
  exit 1
fi
