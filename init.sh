#!/usr/bin/env bash
# init.sh — Environment verification and initialization for the React harness.
#
# The agent runs this at the START of a session and BEFORE declaring any task
# `done`. If it fails, the session must not advance.
#
# Expected output: clear exit codes and blocks marked [OK]/[WARN]/[FAIL].

set -u
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok()    { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
fail()  { printf "${RED}[FAIL]${NC}  %s\n" "$1"; }

EXIT_CODE=0

echo "── 1. Verifying toolchain ──────────────────────────────"

if ! command -v node >/dev/null 2>&1; then
  fail "node is not installed"
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  fail "npm is not installed"
  exit 1
fi
ok "node -> $(node --version)"
ok "npm  -> $(npm --version)"

# Node >= 20 (modern ESM + built-in test/glob support)
NODE_MAJOR=$(node -p "Number(process.versions.node.split('.')[0])")
if [ "$NODE_MAJOR" -lt 20 ]; then
  fail "Node >= 20 required (found $(node --version))"
  exit 1
fi
ok "Node version supported"

# Install dependencies if needed (mirrors uv's implicit sync).
if [ ! -d node_modules ]; then
  warn "node_modules missing — running npm install"
  if ! npm install --no-audit --no-fund; then
    fail "npm install failed"
    exit 1
  fi
fi
ok "Dependencies installed"

echo ""
echo "── 2. Verifying harness base files ─────────────────────"

for f in AGENTS.md feature_list.json progress/current.md \
         docs/architecture.md docs/conventions.md docs/verification.md \
         CHECKPOINTS.md; do
  if [ ! -f "$f" ]; then
    fail "Missing base file: $f"
    EXIT_CODE=1
  else
    ok "Exists $f"
  fi
done

echo ""
echo "── 3. Validating feature_list.json ─────────────────────"

if ! node scripts/validate_features.mjs; then
  EXIT_CODE=1
fi

echo ""
echo "── 4. Verifying DESIGN.md conformance ──────────────────"

# design_check.mjs warns + exits 0 if DESIGN.md is not present yet.
if ! node scripts/design_check.mjs; then
  EXIT_CODE=1
fi

echo ""
echo "── 5. Running tests ────────────────────────────────────"

if [ -d "tests" ] || ls src/**/*.test.* >/dev/null 2>&1; then
  if npx vitest run --passWithNoTests 2>&1; then
    ok "Tests pass"
  else
    fail "Broken tests"
    EXIT_CODE=1
  fi
else
  warn "No tests yet"
fi

echo ""
echo "── 6. Summary ──────────────────────────────────────────"

if [ $EXIT_CODE -eq 0 ]; then
  ok "Environment ready. You can start working."
else
  fail "Environment NOT ready. Resolve the errors before advancing."
fi

exit $EXIT_CODE
