# CHECKPOINTS — Final State Evaluation

> In multi-agent systems, the path is not evaluated — the destination is.
> These are the objective checkpoints that a judge (human or AI) can use
> to decide whether the project is healthy.

## C1 — The harness is complete

- [ ] The base files exist: `AGENTS.md`, `init.sh`, `feature_list.json`,
      `progress/current.md`.
- [ ] The 3 docs exist: `docs/architecture.md`, `docs/conventions.md`,
      `docs/verification.md`.
- [ ] `DESIGN.md` exists (starter or designer-generated).
- [ ] `./init.sh` exits with exit code 0.

## C2 — The state is consistent

- [ ] At most one feature is `in_progress` in `feature_list.json`.
- [ ] Every `done` feature has associated tests that pass.
- [ ] `progress/current.md` is empty or describes the active session
      (contains no leftover data from previous sessions).

## C3 — The code respects the architecture

- [ ] `src/` only contains the modules/components specified in
      `docs/architecture.md`, organized into the documented layers
      (`components/`, `hooks/`, `api/`).
- [ ] No unjustified runtime dependencies in `package.json` `dependencies`
      (dev tooling is exempt; runtime deps need a documented reason).
- [ ] No stray `console.log` debug statements, commented-out code, or TODOs
      without context.

## C4 — Verification is real

- [ ] `tests/` has at least one test per component/hook in `src/`.
- [ ] Tests use React Testing Library queries (role/label/text), not shallow
      rendering or mocking of components under test.
- [ ] `npx vitest run` shows > 0 tests, all green.
- [ ] `npm run lint`, `npx prettier --check .`, and `npm run typecheck` pass.

## C5 — The session was properly closed

- [ ] There are no suspicious untracked files (build output, `*.log`, anything
      that should be in `.gitignore`).
- [ ] `progress/history.md` has an entry for the last session.
- [ ] The last feature worked on is reflected in its correct state.

## C6 — The implementation conforms to DESIGN.md

- [ ] `DESIGN.md` has valid YAML front matter (parses; required token groups
      present).
- [ ] `src/theme/tokens.css` is in sync with `DESIGN.md`
      (`node scripts/design_check.mjs` exits 0).
- [ ] No off-palette hex colors or off-token `font-family` values anywhere in
      `src/` (outside the generated `tokens.css`).
- [ ] Every component listed in the `DESIGN.md` `components` section is
      implemented and uses its specified tokens (colors, radius, spacing,
      typography).

---

**How to use this file:** a reviewer agent (`.claude/agents/reviewer.md`)
goes through each checkbox, marks `[x]` or `[ ]`, and rejects the session
close if any boxes in C1-C6 remain unchecked.
