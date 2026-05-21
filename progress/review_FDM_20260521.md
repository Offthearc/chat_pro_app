# Review — feature FDM: Direct Messaging

**Verdict:** APPROVED

## Verification

- `vitest run`: PASS (60 tests across 4 files, all green)
- `eslint`: PASS (1 pre-existing warning in AuthContext.tsx unrelated to FDM; 0 errors)
- `prettier --check`: PASS
- `typecheck (tsc)`: PASS
- `design:check`: PASS
- `./init.sh`: PASS — prints `[OK] Environment ready`

## Checkpoints

- C1: [x] — AGENTS.md, init.sh, feature_list.json, progress/current.md, all 3 docs, DESIGN.md all present; ./init.sh exits 0
- C2: [x] — 0 features in_progress in feature_list.json; FDM is marked done; every done feature has passing tests; progress/current.md describes the FDM session
- C3: [x] — All new files are in the documented layers (src/api/dm.ts, src/hooks/useDMList.ts, src/hooks/useDMThread.ts, src/pages/DMListPage.tsx, src/pages/DMThreadPage.tsx, src/components/NewDMButton.tsx); no console.log, no TODOs, no commented-out code in any new file
- C4: [x] — tests/dm.test.tsx has 20 tests covering conversation creation, idempotency, commutativity, message send, getDMMessages isolation, markRead, persistence, page rendering, unread badge, compose box, send → append, send → clear, sent class alignment, received class alignment; queries use getByRole/getByLabelText/getByText; vitest run green
- C5: [x] — No suspicious untracked files (build output, logs)
- C6: [x] — DESIGN.md YAML parses; tokens.css in sync; design:check passes; dm-thread-item uses --color-surface-variant bg / --color-surface-elevated hover / --rounded-md / --space-sm --space-md padding (matches DESIGN.md dm-thread-item spec); unread-badge uses --color-badge / --color-on-badge / --rounded-full (matches DESIGN.md unread-badge spec); message-bubble-sent uses --color-chat-sent / --color-on-chat-sent / --rounded-lg (matches DESIGN.md message-bubble-sent spec); message-bubble-received uses --color-chat-received / --color-on-chat-received / --rounded-lg (matches DESIGN.md message-bubble-received spec); NewDMButton trigger uses --color-primary / --color-on-primary / --rounded-sm (matches DESIGN.md button-primary spec); no hardcoded hex in any new file

## Implementation notes (informational, not blocking)

- src/api/dm.ts uses localStorage key `chat_pro_app:dm:conversations` (task spec requirement); docs/architecture.md Section 7 lists `chat_pro_app:dm:threads` — minor doc/impl skew that does not affect test correctness or user-facing behaviour. No functional issue.
- The lint ESLint warning (`react-refresh/only-export-components` in AuthContext.tsx) is pre-existing and unrelated to FDM; not a new issue introduced by this feature.
