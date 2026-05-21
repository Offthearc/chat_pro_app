#!/usr/bin/env bash
# Conventional-commit hook — called after every file write.
# Creates a commit when a feature transitions to "done" in feature_list.json.
# Never pushes.

set -u

# Nothing to commit if the working tree is clean.
if git diff --quiet HEAD 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
  exit 0
fi

# detect_done.mjs prints a commit message only when a feature just moved to done.
COMMIT_MSG=$(node scripts/detect_done.mjs 2>/dev/null)

if [ -z "$COMMIT_MSG" ]; then
  exit 0
fi

git add -A
git commit -m "$COMMIT_MSG

Co-Authored-By: Claude Code <noreply@anthropic.com>"
echo "[harness] committed: $(echo "$COMMIT_MSG" | head -1)"
