# AGENTS.md — Navigation Map for AI Agents

> This file is the **entry point** for any agent working in this
> repository. It is NOT a rulebook: it is a **map**. Read only what you
> need, when you need it (progressive disclosure).

---

## 1. Before you start (mandatory)

1. Run `./init.sh` and verify it finishes without errors. If it fails, **stop**
   and resolve the environment before touching any code.
2. Read `progress/current.md` to understand the state of the last session.
3. Read `feature_list.json` and choose **one** task with `pending` status. Do
   not work on more than one at a time.

## 2. Repository map

| File / folder                   | What it contains                                                             | When to read it                                         |
| ------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| `feature_list.json`             | List of tasks with status (pending / in_progress / done)                     | Always, at the start                                    |
| `progress/current.md`           | State of the current session                                                 | Always, at the start                                    |
| `progress/history.md`           | Append-only log of previous sessions                                         | If you need historical context                          |
| `docs/architecture.md`          | What "doing a good job" means in this project                                | Before implementing                                     |
| `docs/conventions.md`           | Style rules, naming, structure                                               | Before writing code                                     |
| `docs/verification.md`          | How to verify your work is correct                                           | Before declaring a task `done`                          |
| `CHECKPOINTS.md`                | Objective criteria for "correct final state"                                 | For self-evaluation                                     |
| `DESIGN.md`                     | Design system: token front matter + rationale (design.md format)             | Before building or reviewing UI                         |
| `.claude/agents/architect.md`   | Architect: gathers requirements, produces `docs/architecture.md`             | Before any implementation on a new project or subsystem |
| `.claude/agents/designer.md`    | Designer: infers/maintains `DESIGN.md` + theme tokens                        | Before building UI, or when changing the design system  |
| `.claude/agents/leader.md`      | Leader: orchestrates the full pipeline                                       | If you need to understand orchestration rules           |
| `.claude/agents/implementer.md` | Implementer: codes one feature, runs verification                            | If you need to understand implementation rules          |
| `.claude/agents/reviewer.md`    | Reviewer: approves or rejects against `docs/`, `DESIGN.md`, `CHECKPOINTS.md` | If you need to understand review criteria               |
| `scripts/design_check.mjs`      | Generates `src/theme/tokens.css` from `DESIGN.md` and verifies conformance   | To understand the design gate                           |
| `src/`                          | React + TypeScript application code (`src/theme/tokens.css` is generated)    | To implement                                            |
| `tests/`                        | Vitest + React Testing Library tests                                         | To verify                                               |

## 3. Hard rules (non-negotiable)

- **One feature at a time.** Do not mix changes from multiple tasks in the same session.
- **Do not declare a task `done` without green tests.** Run `./init.sh` and
  make sure the test block passes 100%.
- **Document what you do** in `progress/current.md` as you work, not at the end.
- **Leave the repository clean** before closing the session (see §5).
- **If you don't know something, check `docs/`** before making it up.

## 4. How to choose a task
