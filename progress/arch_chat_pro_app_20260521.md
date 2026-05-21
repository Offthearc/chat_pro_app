# Architecture Session — chat_pro_app — 2026-05-21

## Solution type agreed upon

**MVP** — first shippable, client-only, Vercel-deployed SPA. No backend, no
email confirmation, localStorage for all persistence.

## Key architectural decisions

1. **No backend.** All data (users, messages, DM threads) lives in
   localStorage under namespaced keys (`chat_pro_app:*`). The `src/api/`
   layer provides synchronous read/write functions that are the only callers
   of `localStorage`.

2. **Auth via React Context.** `AuthContext` + `AuthProvider` hold the
   current user in memory; `src/api/auth.ts` backs them with localStorage.
   `ProtectedRoute` wraps all authenticated pages.

3. **Routing.** React Router v6 with these routes:
   `/`, `/login`, `/register`, `/rooms`, `/rooms/:id`, `/dm`, `/dm/:userId`.

4. **Seed rooms.** Five or more rooms are hard-coded in `src/api/rooms.ts`
   and written to localStorage once on first load (key absent check).

5. **Unread DM indicator.** The `read` boolean on `DMMessage` drives the
   unread badge on `DMThreadItem`. `markRead` is called when the thread is
   opened.

6. **Plain-text password storage.** Documented explicitly as a known MVP
   limitation. No hashing. Acceptable only for demo use.

7. **Source layout:**
   `src/api/`, `src/hooks/`, `src/context/`, `src/components/`,
   `src/pages/`, `src/types/`, `src/theme/`

8. **localStorage schema keys:**
   - `chat_pro_app:users` — `User[]`
   - `chat_pro_app:currentUser` — `User | null`
   - `chat_pro_app:rooms` — `ChatRoom[]`
   - `chat_pro_app:messages:<roomId>` — `Message[]`
   - `chat_pro_app:dm:threads` — `DMThread[]`
   - `chat_pro_app:dm:messages:<threadId>` — `DMMessage[]`

## Open questions / blockers

None. All requirements are fully specified and unambiguous. No conflicting
constraints were identified.

## Implementer can proceed

Yes. Architecture and verification docs are complete. The designer agent
should run next to produce `DESIGN.md` and `src/theme/tokens.css` before
implementation begins.

## Files written

- `docs/architecture.md` — full project-specific architecture
- `docs/verification.md` — concrete verification steps per feature (FAUTH,
  FCHAT, FDM)
