#!/bin/bash
# install-hook.sh
#
# Installs the commit-story git post-commit hook.
# Run from the root of a git repository.

set -e

HOOK_PATH=".git/hooks/post-commit"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo "❌ Not a git repository"
  echo "   Run this script from the root of a git repository."
  exit 1
fi

# Check if hook already exists
if [ -f "$HOOK_PATH" ]; then
  echo "⚠️  Warning: $HOOK_PATH already exists"
  echo ""
  echo "To avoid overwriting your existing hook, please add"
  echo "the following line to your post-commit hook manually:"
  echo ""
  echo "    npx commit-story &"
  echo ""
  exit 1
fi

# Create the hook
cat > "$HOOK_PATH" << 'EOF'
#!/bin/bash
# commit-story post-commit hook
# Generates a journal entry for each commit

# Run in background to not block git
npx commit-story &
EOF

# Make it executable
chmod +x "$HOOK_PATH"

echo "✅ Git hook installed successfully"
echo "   Location: $HOOK_PATH"
echo ""
echo "Journal entries will be generated automatically after each commit."
echo ""
echo "To remove the hook, run: npx commit-story-remove"
echo "Or delete: $HOOK_PATH"
