Feature in progress: FAUTH — User Registration & Auth

Plan:

- Create shared types in src/types/index.ts (User, ChatRoom, Message, DMThread, DMMessage)
- Create auth service in src/api/auth.ts using localStorage
- Create React context in src/context/AuthContext.tsx
- Create AuthGuard component and NavBar component
- Create RegisterPage and LoginPage with accessible forms
- Install react-router-dom and wire routing in main.tsx / App.tsx
- Write tests in tests/auth.test.tsx covering register, login, logout, persistence
