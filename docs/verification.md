# Verification — chat_pro_app

> Golden rule: the agent does not say "it works", it proves it.
> Every feature ends with executable evidence, not assertions.

---

## Verification levels

### Level 1 — Unit / component tests (mandatory)

Every component, hook, and api module in `src/` has at least one test in
`tests/` that covers the happy path and at least one error or edge case.

```bash
npx vitest run
```

All tests must pass. Zero tests is a failure.

### Level 2 — Static checks (mandatory)

```bash
npm run lint
npx prettier --check .
npm run typecheck
```

All three commands must exit with code 0.

### Level 3 — Design conformance (mandatory for UI features)

```bash
npm run design:check
```

No off-palette colors or off-token font values in `src/` outside
`src/theme/tokens.css`.

### Level 4 — Full harness gate (mandatory before marking done)

```bash
./init.sh
```

Must print `[OK] Environment ready` and exit with code 0.

---

## FAUTH — User Registration and Auth

### FR-1: Register a new user

Open the app unauthenticated. Navigate to `/register`. Fill in a unique
username, email, and password. Submit.

Expected:

- Redirect to `/rooms`.
- `localStorage.getItem('chat_pro_app:users')` contains an entry with the
  submitted email.
- `localStorage.getItem('chat_pro_app:currentUser')` is set to the new user.

### FR-2: Duplicate email rejected

On `/register`, submit a form using an email address that is already registered.

Expected:

- No redirect occurs.
- An inline error message is visible in the form (e.g. "Email already taken").
- `localStorage.getItem('chat_pro_app:users')` still contains exactly one
  entry for that email.

### FR-3: Login with correct credentials

Navigate to `/login`. Enter the email and password of a registered user.

Expected:

- Redirect to `/rooms`.
- `localStorage.getItem('chat_pro_app:currentUser')` is set.

### FR-4: Login with wrong password

Navigate to `/login`. Enter a registered email with an incorrect password.

Expected:

- No redirect occurs.
- An inline error message is visible (e.g. "Invalid email or password").

### FR-5: Auth state survives page reload

While logged in, reload the page (F5 / Cmd+R).

Expected:

- User remains on `/rooms` (or the last protected route).
- Navbar still shows the username.

### FR-6: Navbar shows username

While logged in, inspect the navbar.

Expected:

- The current user's username is visible.

### FR-7: Logout

While logged in, click the logout button in the navbar.

Expected:

- Redirect to `/login`.
- `localStorage.getItem('chat_pro_app:currentUser')` is `null` or the key is
  absent.
- Navigating to `/rooms` redirects back to `/login`.

### FR-8: Protected route redirect

Without being logged in, navigate directly to `/rooms`, `/rooms/1`,
`/dm`, or `/dm/someUserId`.

Expected:

- Redirected to `/login` in all cases.

### Test commands and expected output

```bash
npx vitest run tests/RegisterPage.test.tsx
npx vitest run tests/LoginPage.test.tsx
npx vitest run tests/useAuth.test.ts
npx vitest run tests/ProtectedRoute.test.tsx
npx vitest run tests/auth.test.ts
```

All test suites pass; total passing tests > 0.

---

## FCHAT — Article-Linked Chat Rooms

### FR-9: Rooms list renders all seed rooms

Navigate to `/rooms` while authenticated.

Expected:

- At least 5 room cards are visible.
- Each card shows the room name and the linked article title.

### FR-10: Seed rooms have article links

Click on any room card to open `/rooms/:id`.

Expected:

- The room's article title is rendered as an anchor tag with `target="_blank"`.
- The `href` is a valid URL (begins with `https://`).

### FR-11: Post a message

While authenticated and viewing `/rooms/:id`, type a message and submit.

Expected:

- The message appears in the thread immediately, attributed to the logged-in
  user's username.
- `localStorage.getItem('chat_pro_app:messages:<roomId>')` contains the new
  message.

### FR-12: Message persistence

Post a message in a room, then reload the page.

Expected:

- The previously posted message is still visible in the thread.

### FR-13: Unauthenticated users cannot post

Navigate to `/rooms/:id` without being logged in.

Expected:

- Redirected to `/login` (ProtectedRoute).

### Test commands and expected output

```bash
npx vitest run tests/RoomsPage.test.tsx
npx vitest run tests/RoomPage.test.tsx
npx vitest run tests/useRoom.test.ts
npx vitest run tests/useRooms.test.ts
npx vitest run tests/messages.test.ts
npx vitest run tests/rooms.test.ts
```

All test suites pass.

### Edge cases

- Room with no messages: thread area renders empty (no crash).
- Very long message text: wraps or scrolls; does not break layout.
- Navigating between two rooms: messages from room A do not appear in room B.

---

## FDM — Direct Messaging

### FR-14: DM list shows existing threads

While authenticated, navigate to `/dm`.

Expected:

- All DM threads in which the current user is `participantA` or `participantB`
  are listed.

### FR-15: Start a new DM conversation

On `/dm`, select a different registered user from the dropdown and confirm.

Expected:

- Navigate to `/dm/:userId`.
- A new `DMThread` entry appears in `localStorage.getItem('chat_pro_app:dm:threads')`.

### FR-16: Send a DM message

On `/dm/:userId`, type a message and send it.

Expected:

- Message appears in the thread immediately.
- `localStorage.getItem('chat_pro_app:dm:messages:<threadId>')` contains the
  new `DMMessage`.

### FR-17: DM message persistence

Send a message, then reload the page.

Expected:

- Message is still visible in the thread.

### FR-18: Unread indicator

User A sends a message to User B. Log in as User B and navigate to `/dm`.

Expected:

- The thread with User A shows an unread badge/indicator.
- Opening the thread (`/dm/:userAId`) marks messages as read.
- Returning to `/dm`: the unread indicator is gone.

### Test commands and expected output

```bash
npx vitest run tests/DMListPage.test.tsx
npx vitest run tests/DMPage.test.tsx
npx vitest run tests/useDM.test.ts
npx vitest run tests/useDMThread.test.ts
npx vitest run tests/dm.test.ts
npx vitest run tests/DMThreadItem.test.tsx
```

All test suites pass.

### Edge cases

- Selecting yourself from the user list: prevent or handle gracefully (no
  self-DM thread created, or show an error).
- Thread with no messages: thread view renders empty without crashing.
- All messages read: unread indicator is not shown.

---

## Performance baseline

The app is a static bundle served from Vercel's CDN. No network calls are made
at runtime.

Baseline check:

```bash
npm run build
# Vite output should show no chunk larger than 500 kB (uncompressed)
```

Expected: `dist/` is produced without errors; the largest JS chunk is under
500 kB. No async data fetching means initial render is bounded only by bundle
parse time.

---

## Final verification gate

```bash
./init.sh
```

Must exit with code 0 and print `[OK] Environment ready`. This runs:

- Feature-list consistency check
- DESIGN.md conformance gate (`npm run design:check`)
- Full test suite (`npx vitest run`)

If any step is red, do NOT mark any feature `done`. Log the blocker in
`progress/current.md` and set the feature status to `blocked` in
`feature_list.json`.
