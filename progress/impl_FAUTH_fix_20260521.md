# FAUTH Review Fixes — 2026-05-21

## Files Modified

- `src/api/auth.ts` — Changed localStorage key names:
  - `chat_pro_users` → `chat_pro_app:users`
  - `chat_pro_current_user` → `chat_pro_app:currentUser`

- `src/components/ProtectedRoute.tsx` — New file; same logic as former AuthGuard, component and props interface renamed to `ProtectedRoute` / `ProtectedRouteProps`.

- `src/components/AuthGuard.tsx` — Deleted (replaced by ProtectedRoute.tsx).

- `src/App.tsx` — Updated import from `./components/AuthGuard` to `./components/ProtectedRoute`; replaced all `<AuthGuard>` / `</AuthGuard>` JSX with `<ProtectedRoute>` / `</ProtectedRoute>`.

## Verification Output

### npm run typecheck
Exit 0, no errors.

### npm run lint
Exit 0, 0 errors (1 pre-existing warning in AuthContext.tsx about react-refresh — not introduced by these changes).

### npx vitest run
Test Files  2 passed (2)
Tests       21 passed (21)

### ./init.sh
All 6 steps passed. "Environment ready."

## Decisions

- No logic changes were made; only key names and component name/import were updated.
- The pre-existing react-refresh warning in AuthContext.tsx is unrelated to these fixes and was not introduced here.
