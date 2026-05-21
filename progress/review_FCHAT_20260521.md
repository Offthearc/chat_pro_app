# Review — feature FCHAT: Article-Linked Chat Rooms

**Verdict:** CHANGES_REQUESTED

## Verification

- `vitest run`: PASS
- `eslint`: PASS (1 warning in pre-existing `AuthContext.tsx`, 0 errors, not caused by FCHAT changes)
- `prettier --check`: PASS
- `typecheck (tsc)`: PASS
- `design:check`: PASS
- `./init.sh`: PASS

## Checkpoints

- C1: [x]
- C2: [x]
- C3: [ ] ← `src/api/messages.ts` does not exist; `getMessages` and `postMessage` are in `src/api/rooms.ts` instead. `docs/architecture.md` section 6 explicitly specifies a separate `src/api/messages.ts` module. Additionally, `useRooms` returns `{ rooms }` only, but the architecture specifies `{ rooms, loading }`.
- C4: [x]
- C5: [x]
- C6: [x]

## Required changes (if CHANGES_REQUESTED)

1. **Split `src/api/rooms.ts` into two files as the architecture mandates.**
   - `src/api/rooms.ts` must keep only: `getRooms`, `getRoom`, and seed-on-first-load logic.
   - `src/api/messages.ts` must be created with: `getMessages(roomId)` and `postMessage(roomId, author, content)`, using the same `chat_pro_app:messages:<roomId>` localStorage keys.
   - Update `src/hooks/useRoom.ts` to import from `../api/messages` rather than `../api/rooms`.
   - Update `tests/rooms.test.tsx` imports accordingly (or create a separate `tests/messages.test.ts` if needed to keep one-test-file-per-module coverage).

2. **Add `loading` to `useRooms` return type.**
   `docs/architecture.md` section 6 states `useRooms.ts — loads room list; returns { rooms, loading }`. The current implementation returns `{ rooms }` only. The `loading` field must be present (its value can be `false` for synchronous localStorage reads, but the contract must match the spec).
   - `src/hooks/useRooms.ts` line 5: add `loading: boolean` to `UseRoomsResult`.
   - Return `{ rooms, loading: false }` from the hook body.
   - `src/pages/RoomsPage.tsx` does not destructure `loading` currently; no page-side change is strictly required unless `loading` is used there.
