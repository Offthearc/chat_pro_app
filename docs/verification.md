# Verification — How to Demonstrate That the Work Is Done

> Golden rule: **the agent doesn't say "it works", it proves it**.
> Every feature ends with executable evidence, not assertions.

## Verification Levels

### Level 1 — Unit / component tests (mandatory)

Every component and hook in `src/` has at least one test in `tests/` that:

1. Covers the happy path (renders / behaves as the acceptance criteria require).
2. Covers at least one edge or error path (empty state, invalid input, failure).

Command:

```bash
npx vitest run
```

### Level 2 — Static checks (mandatory)

```bash
npm run lint            # ESLint, including react-hooks rules
npx prettier --check .  # formatting
npm run typecheck       # tsc --noEmit, strict
```

### Level 3 — Design conformance (mandatory for UI features)

```bash
npm run design:check    # tokens in sync + no off-palette colors / off-token fonts
```

### Level 4 — Manual smoke test (optional but recommended)

```bash
npm run dev             # open the app and click through the feature
```

## Anti-patterns (do not do)

- ❌ "I added the component, it should work." → missing executable test.
- ❌ A test that only asserts the component renders without error → it must
  assert real behavior/output the user would see.
- ❌ Mocking a component you could render → render it and query by role.
- ❌ Hardcoding a hex color or pixel value instead of a design token.
- ❌ Marking a feature `done` without passing `./init.sh`.

## Final verification before closing

```bash
./init.sh           # must finish with [OK] Environment ready
```

`./init.sh` runs the feature-list check, the **DESIGN.md conformance gate**, and
the test suite. If it is red, do **not** mark anything `done`. Log the blocker in
`progress/current.md` and set the feature status to `blocked` in
`feature_list.json`.
