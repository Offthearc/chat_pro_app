Feature in progress: FCHAT fix — Split messages API and add loading to useRooms

Plan:

- Create src/api/messages.ts with getMessages and postMessage functions
- Remove getMessages and postMessage from src/api/rooms.ts
- Update src/hooks/useRoom.ts to import from ../api/messages
- Update tests/rooms.test.tsx to import getMessages and postMessage from ../api/messages
- Add loading: boolean to useRooms return type and return { rooms, loading: false }
