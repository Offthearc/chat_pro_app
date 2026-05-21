# Implementation Report — FCHAT Review Fixes (2026-05-21)

## Files Created or Modified

### Created

- `src/api/messages.ts` — New module containing `getMessages(roomId)` and `postMessage(roomId, author, content)`, both using localStorage key `chat_pro_app:messages:${roomId}`. Extracted directly from the former implementations in `src/api/rooms.ts`.

### Modified

- `src/api/rooms.ts` — Removed `getMessages`, `postMessage`, `readMessages`, `writeMessages`, `MESSAGES_KEY_PREFIX`, and the `Message`/`User` imports. Now only exports `getRooms`, `getRoom`, and seed-on-first-load logic.
- `src/hooks/useRoom.ts` — Updated import: `getMessages` and `postMessage` now come from `../api/messages`; `getRoom` still comes from `../api/rooms`.
- `src/hooks/useRooms.ts` — Added `loading: boolean` to the `UseRoomsResult` interface and returns `{ rooms, loading: false }` from the hook body.
- `tests/rooms.test.tsx` — Updated import line to pull `getMessages` and `postMessage` from `../src/api/messages` (and `getRooms`, `getRoom` remain from `../src/api/rooms`).

## Final Test Run Output

```
 RUN  v2.1.9 /home/dcp/projects/chat_pro_app

 ✓ tests/App.test.tsx (3 tests) 80ms
 ✓ tests/rooms.test.tsx (19 tests) 287ms
 ✓ tests/auth.test.tsx (18 tests) 336ms

 Test Files  3 passed (3)
      Tests  40 passed (40)
   Start at  06:48:35
   Duration  899ms (transform 103ms, setup 94ms, collect 380ms, tests 703ms, environment 645ms, prepare 176ms)
```

## Decisions

- The `loading: false` value is appropriate because `getRooms()` is a synchronous localStorage read; the field is added purely to satisfy the architecture contract (`{ rooms, loading }`) without introducing async complexity.
- No new test file was created for `messages.ts` because the existing `tests/rooms.test.tsx` already covers all message API behavior via the "rooms API" describe block. The imports in that block were updated to source from the correct module.
