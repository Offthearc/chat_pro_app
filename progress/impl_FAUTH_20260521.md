## FAUTH — User Registration & Auth

### Files created or modified

**New files:**

- `src/types/index.ts` — Shared TypeScript interfaces: `User`, `ChatRoom`, `Message`, `DMThread`, `DMMessage`
- `src/api/auth.ts` — Auth service using localStorage: `register`, `login`, `logout`, `getCurrentUser`, `getAllUsers`. Passwords stored as `btoa(password)` per spec.
- `src/context/AuthContext.tsx` — React context + `AuthProvider` exposing `user`, `register`, `login`, `logout`. Initializes user state from `getCurrentUser()` for persistence across reloads.
- `src/components/AuthGuard.tsx` — Redirects unauthenticated users to `/login` using `<Navigate replace>`.
- `src/components/NavBar.tsx` + `NavBar.css` — Top nav with ChatPro brand link, username display, and logout button. All styles use design tokens.
- `src/pages/RegisterPage.tsx` — Registration form (username, email, password) with accessible labels, inline error display via `role="alert"`.
- `src/pages/LoginPage.tsx` — Login form (email, password) with same accessible pattern.
- `src/pages/AuthForm.css` — Shared styles for auth forms using design tokens only.
- `tests/auth.test.tsx` — 18 tests covering: auth API (register, login, logout, persistence, duplicate email, wrong password), RegisterPage UI, LoginPage UI, NavBar, AuthContext state.

**Modified files:**

- `src/App.tsx` — Replaced placeholder with routing: `/` → redirect, `/login`, `/register`, `/rooms` (AuthGuard-protected), `/rooms/:id`.
- `src/main.tsx` — Added `<BrowserRouter>` and `<AuthProvider>` wrapping.
- `tests/App.test.tsx` — Updated to test routing with `<MemoryRouter>` + `<AuthProvider>`.
- `vite.config.ts` — Added `environmentOptions.jsdom.url` for localStorage support.
- `src/test/setup.ts` — Added localStorage patch for Node 26 compatibility.
- `package.json` — Added `react-router-dom` and `@testing-library/user-event` dependencies.

### Test output (final run)

```
 RUN  v2.1.9 /home/dcp/projects/chat_pro_app

 ✓ tests/App.test.tsx (3 tests) 68ms
 ✓ tests/auth.test.tsx (18 tests) 310ms

 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  06:34:29
   Duration  853ms
```

### Decisions

1. **localStorage key names**: The task description uses `chat_pro_users` and `chat_pro_current_user` as keys. The architecture doc uses `chat_pro_app:users` and `chat_pro_app:currentUser`. The task instructions were followed (`chat_pro_users` / `chat_pro_current_user`) since the feature-level spec is the immediate source of truth. The FCHAT/FDM features should use `chat_pro_app:*` keys per architecture — no conflict for FAUTH scope.

2. **Node 26 localStorage shim**: Node 26 ships experimental `localStorage` as `undefined` in the global scope. vitest's `populateGlobal` skips copying `window.localStorage` from jsdom because the key already exists in the Node global. The fix patches `globalThis.localStorage` in the test setup file using `globalThis.jsdom.window.localStorage`, which vitest attaches as `global.jsdom`.

3. **Placeholder `/rooms` route**: `App.tsx` includes a minimal `<PlaceholderRooms>` component so the redirect from `/` and the AuthGuard can be tested without implementing FCHAT. This will be replaced by FCHAT's `RoomsPage`.

4. **AuthContext exports both `AuthProvider` and `useAuth`**: This triggers a react-refresh lint warning (only 0 errors, 1 warning — exits 0). The warning is expected for context modules and is acceptable per the conventions.
