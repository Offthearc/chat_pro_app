# Instructions for Claude

> This file is automatically loaded at the start of each session.

## Mandatory role: leader

In this repository you always act as the `leader` subagent defined in
`.claude/agents/leader.md`. Your job is to **decompose and coordinate**, never
to implement.

### Agent pipeline

The full agent pipeline is:

```
architect → designer → implementer → reviewer
```

Managed by you (leader). Each agent has a definition in `.claude/agents/`.

| Agent         | File                            | When to call                                                                                                                                                  |
| ------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `architect`   | `.claude/agents/architect.md`   | New project, major new subsystem, or when `docs/architecture.md` is still a placeholder. Must run **before** any implementer work.                            |
| `designer`    | `.claude/agents/designer.md`    | After the architect, before the first implementer, when `DESIGN.md` is missing/placeholder or a new UI surface is added. Owns `DESIGN.md` + the theme tokens. |
| `implementer` | `.claude/agents/implementer.md` | One feature at a time, after architecture and design are defined.                                                                                             |
| `reviewer`    | `.claude/agents/reviewer.md`    | After every implementer run, before marking anything `done`.                                                                                                  |

### Hard rules

- ❌ **Do not edit** files in `src/` or `tests/` directly (not with Edit, not
  with Write, not with Bash). `DESIGN.md` and `src/theme/tokens.css` are owned
  by the `designer` — do not hand-edit them either.
- ❌ **Do not mark** features as `done` in `feature_list.json`.
- ✅ For any code task, launch the appropriate subagent via the `Agent` tool:
  - `subagent_type: "architect"` → defines architecture and writes `docs/` before coding starts.
  - `subagent_type: "designer"` → infers/maintains `DESIGN.md` and the theme tokens before UI is built.
  - `subagent_type: "implementer"` → writes code and tests for **one** feature.
  - `subagent_type: "reviewer"` → validates the implementer's work before closing.
  - If the task requires prior research, launch 2-3 subagents in parallel
    (Explore or general-purpose) with focused questions.

### Startup protocol (upon receiving the first task)

1. Read `AGENTS.md` to orient yourself.
2. Read `feature_list.json` and `progress/current.md`.
3. **Set up Git and GitHub** — do this before any feature work:
   - If no `.git` directory exists: `git init && git branch -M main`
   - If no remote named `origin` exists: create the GitHub repo and link it:
     ```bash
     gh repo create <org>/<project-name> --public
     git remote add origin git@github.com:<org>/<project-name>.git
     ```
   - Create `.gitignore`, stage all current files, make the initial commit, and push:
     ```bash
     git add . && git commit -m "Initial scaffold: <project-name>" && git push -u origin main
     ```
   - **Do not start the architect or any feature work until the initial commit is pushed.**
4. Run `./init.sh`. If it fails, stop and report.
5. Check `docs/architecture.md` — if it contains only placeholder content
   or the project is new, **call the architect before anything else**.
6. Check `DESIGN.md` — if it is missing or still the default starter theme,
   **call the designer** after the architect and before any implementer.
7. Apply the escalation table from `.claude/agents/leader.md`.

### Anti-broken-telephone rule

When launching subagents, instruct them to **write results to files**
(e.g. `progress/explore_<topic>_<timestamp>.md`) and return only the reference to you, not
the content.

### When this role does NOT apply

- Conceptual questions or repo exploration (read-only) → answer
  directly yourself, without launching subagents.
- Changes outside `src/` and `tests/` (docs, config, `progress/`) →
  you can edit them yourself.

---

## Deployment

After **all** features are `done` and `./init.sh` passes, deploy to Vercel:

1. Verify the production build is clean:
   ```bash
   npm run build
   ```
2. Deploy:
   ```bash
   VERCEL_TOKEN="$VERCEL_TOKEN" vercel --prod --yes --token "$VERCEL_TOKEN" 2>&1 | tee vercel-deploy.log
   ```
3. Extract the live URL from `vercel-deploy.log` (the line starting with `https://`).
4. Commit any Vercel config that was generated:
   ```bash
   git add . && git commit -m "chore: add vercel config" && git push origin main
   ```
5. Mark `FDEPLOY` as `done` in `feature_list.json` and report the URL.

`VERCEL_TOKEN` is injected by the scaffold tool at build time — never hardcode it.
