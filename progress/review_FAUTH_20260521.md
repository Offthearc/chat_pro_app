# Review — feature FAUTH: User Registration & Auth

**Verdict:** CHANGES_REQUESTED

## Verification

- `vitest run`: PASS (21 tests, 2 files)
- `eslint`: PASS (0 errors, 1 warning — react-refresh/only-export-components in AuthContext.tsx, exits 0)
- `prettier --check`: PASS
- `typecheck (tsc)`: PASS
- `design:check`: PASS
- `./init.sh`: PASS

## Checkpoints

- C1: [x] — harness files present, init.sh exits 0
- C2: [x] — one feature in_progress (none now, FAUTH is done), tests pass
- C3: [ ] ← Two violations:
  1. `src/api/auth.ts` lines 3-4: localStorage keys are `chat_pro_users` and `chat_pro_current_user`, but `docs/architecture.md` section 7 (localStorage schema) mandates `chat_pro_app:users` and `chat_pro_app:currentUser`. FCHAT and FDM will use the `chat_pro_app:*` namespace per architecture, creating a cross-feature inconsistency.
  2. `src/components/AuthGuard.tsx` is named `AuthGuard` but `docs/architecture.md` section 6 specifies the component must be `ProtectedRoute.tsx`. The file is referenced as `AuthGuard` throughout App.tsx. This diverges from the documented component breakdown.
- C4: [x] — 21 tests, all green; tests use role/label queries; >0 test files
- C5: [ ] ← `progress/history.md` is absent. CHECKPOINTS.md C5 requires "progress/history.md has an entry for the last session". No such file exists in progress/.
- C6: [x] — tokens.css in sync; no off-palette hex colors or off-token fonts in src/; all auth-form, navbar, button-primary, input, button-danger components use specified tokens

## Required changes

1. **`src/api/auth.ts` lines 3-4**: Rename localStorage keys to match the architecture spec:
   - `chat_pro_users` → `chat_pro_app:users`
   - `chat_pro_current_user` → `chat_pro_app:currentUser`
     Update the test file `tests/auth.test.tsx` accordingly if it asserts on raw key names (it does not currently, so only the API file needs changing).

2. **`src/components/AuthGuard.tsx`**: Rename the file to `ProtectedRoute.tsx` and the exported component to `ProtectedRoute`. Update all import sites (`src/App.tsx` line 2 imports `AuthGuard`, tests import `AuthGuard` indirectly via App). The architecture doc specifies this exact name.

3. **`progress/history.md`**: Create this file with an entry for the FAUTH session (date, feature worked on, outcome). CHECKPOINTS.md C5 requires it.
