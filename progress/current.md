Feature in progress: FDM — Direct Messaging

Plan:

- Add DMConversation and DMMessage types to src/types/index.ts
- Create src/api/dm.ts with getConversations, getOrCreateConversation, getDMMessages, sendDMMessage, markRead
- Create hooks: src/hooks/useDMList.ts and src/hooks/useDMThread.ts
- Create pages: src/pages/DMListPage.tsx and src/pages/DMThreadPage.tsx
- Create component: src/components/NewDMButton.tsx
- Add /dm and /dm/:conversationId routes to src/App.tsx and DM nav link to NavBar
- Write tests/dm.test.tsx covering all acceptance criteria
