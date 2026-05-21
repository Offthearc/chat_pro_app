# FCHAT Implementation — 2026-05-21

## Files created or modified

### New files

- `src/api/rooms.ts` — getRooms (seeds 5 rooms on first call), getRoom, getMessages, postMessage; localStorage keys `chat_pro_app:rooms` and `chat_pro_app:messages:<roomId>`
- `src/hooks/useRooms.ts` — hook returning seeded rooms list
- `src/hooks/useRoom.ts` — hook returning single room + messages + postMessage callback
- `src/components/RoomCard.tsx` — link card showing room name and article title
- `src/components/RoomCard.css` — room-card tokens (surface-variant bg, md radius, md padding)
- `src/components/MessageList.tsx` — scrollable message thread; sent vs received bubble styles; scroll-to-bottom on new message
- `src/components/MessageList.css` — message bubble styles using chat-sent/chat-received tokens
- `src/components/MessageInput.tsx` — textarea + Send button; clears after send; disabled when empty
- `src/components/MessageInput.css` — message-input styles using surface-elevated token
- `src/pages/RoomsPage.tsx` — lists all seeded rooms via RoomCard
- `src/pages/RoomsPage.css` — page layout on surface bg
- `src/pages/RoomPage.tsx` — room header with article link, MessageList, MessageInput
- `src/pages/RoomPage.css` — flex column layout; link uses color-link token
- `tests/rooms.test.tsx` — 19 tests covering API, RoomsPage, and RoomPage

### Modified files

- `src/App.tsx` — replaced PlaceholderRooms with real RoomsPage and RoomPage imports and routes
- `feature_list.json` — FCHAT status: pending → in_progress → done
- `progress/current.md` — session log

## Test output (final run)

```
 RUN  v2.1.9 /home/dcp/projects/chat_pro_app

 ✓ tests/App.test.tsx (3 tests) 78ms
 ✓ tests/rooms.test.tsx (19 tests) 270ms
 ✓ tests/auth.test.tsx (18 tests) 317ms

 Test Files  3 passed (3)
      Tests  40 passed (40)
```

## Decisions

- Room 5 seed: the task spec named both the room and its article "Claude's Model Specification". Since the RoomsPage renders both name and articleTitle, identical text caused `getByText` to find multiple elements. The room name was made distinct by appending " — Discussion".
- `scrollIntoView` in jsdom: jsdom does not implement `scrollIntoView`, so the effect guards with a `typeof` check rather than optional-chaining alone (the method exists but returns undefined in jsdom).
- MessageList aria-label: initially "Messages" then "Chat messages"; both still matched `/message/i` in `getByLabelText`. Final label is "Thread" — unambiguously distinct from the textarea's "Message" label.
- `Message.content` vs `Message.text`: the existing `src/types/index.ts` uses `text`; the task describes a `content` parameter for `postMessage`. The API accepts `content` as the parameter name but stores it as `text` to match the existing type, keeping types consistent across the codebase.
