# Code Conventions

## Language & Style

- **TypeScript** (`strict`), **React 19**, function components only — no classes.
- **Format:** Prettier (`npm run format`); config in `.prettierrc` (no
  semicolons, single quotes, trailing commas, 80-col print width).
- **Lint:** ESLint flat config (`npm run lint`), including `react-hooks` rules.
- **Types:** `npm run typecheck` (`tsc --noEmit`) must be clean. No `any` at
  public boundaries.

## Naming

| Type                  | Convention     | Example             |
| --------------------- | -------------- | ------------------- |
| Component files       | `PascalCase`   | `TodoItem.tsx`      |
| Components            | `PascalCase`   | `TodoItem`          |
| Hooks                 | `useCamelCase` | `useTodos`          |
| Functions / variables | `camelCase`    | `addTodo`           |
| Types / interfaces    | `PascalCase`   | `Todo`, `TodoProps` |
| Constants             | `UPPER_SNAKE`  | `MAX_ITEMS`         |
| CSS classes           | `kebab` / BEM  | `todo-item__title`  |

## File structure

- One component per file; co-locate its `.css` next to it
  (`TodoItem.tsx` + `TodoItem.css`).
- Components in `src/components/`, hooks in `src/hooks/`, data access in
  `src/api/`.
- Tests in `tests/` (or co-located `*.test.tsx`); see Tests below.

## Styling & design tokens

- **Never hardcode colors, spacing, radius, or font families.** Use the CSS
  custom properties generated from `DESIGN.md`:
  - colors → `var(--color-<name>)`
  - spacing → `var(--space-<name>)`
  - radius → `var(--rounded-<name>)`
  - typography → `var(--font-<name>)`, `var(--font-size-<name>)`, etc.
- If a value you need is missing, it is a design change: ask the `designer` to
  add the token to `DESIGN.md`. Do not edit `src/theme/tokens.css` by hand (it
  is generated) and do not inline a raw value.
- `npm run design:check` enforces this and runs inside `./init.sh`.

## Tests

- **Vitest + React Testing Library.** One test file per component/hook:
  `tests/<Name>.test.tsx`.
- Query by role/label/text the way a user would (`getByRole`, `getByLabelText`).
  Avoid `data-testid` unless there is no accessible alternative.
- Render real components and exercise behavior; do not mock what you can render.
- Use `@testing-library/user-event` for interactions where helpful.
- Descriptive test names: `it('adds an item when the form is submitted')`.

## Comments

By default, **none**. Only explain a non-obvious _why_ (a workaround, a subtle
invariant). Names and types should do the rest.
