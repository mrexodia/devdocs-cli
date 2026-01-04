# Agent Instructions

## Issue Tracking (bd)

This project uses **bd (beads)** for issue tracking. Run `bd prime` for workflow context and commands.

## Epics (devdocs/)

For larger initiatives spanning multiple sessions, create an epic:

```
devdocs/<epic-name>/
├── design.md     # Consolidated design document (from user research)
└── plan.md       # Implementation phases and testing strategy
```

### Creating an Epic

Epic creation is collaborative. Work with the user to:

1. **Gather existing materials** - The user may have:
   - Research from Claude/ChatGPT/Grok sessions
   - Notes in Obsidian or other tools
   - Existing documentation scattered across the project
   - Reference implementations or examples

2. **Create design.md** - Consolidate the above into a clear design document:
   - Problem statement and goals
   - API design or architecture
   - Key decisions and rationale
   - References to documentation

3. **Define testing strategy (TDD)** - Before implementation:
   - What tests exist or need to be created?
   - Is there a "golden master" to compare against?
   - Can we set up: `make test` → actionable feedback?

4. **Create plan.md** - Implementation phases:
   - Phase breakdown with clear milestones
   - Each phase should be completable in one session
   - Testing checkpoints between phases

5. **Create bd issues** - `bd epic create` with child issues for tracking

### Working on an Epic

- Reference `design.md` for requirements and constraints
- Follow TDD: make tests pass, don't just write code
- Update `plan.md` if scope changes
- Stay under 50% context; wrap up at 70%

### Archiving an Epic (user-initiated only)

1. Ensure all bd issues are closed
2. Extract key learnings to `devdocs/archive/<epic-name>.md`:
   - Goal and scope (1 paragraph)
   - Key architectural decisions
   - Technical insights and gotchas
   - API summary (what was built)
   - References to related docs
3. Delete the epic directory
4. Ask user: promote `design.md` to permanent reference?

## Reference Documentation

Top-level `devdocs/<topic>.md` files contain permanent technical knowledge:
- Debugging guidelines, architectural patterns, API conventions
- Created when knowledge applies beyond a single epic
- Listed in `devdocs/README.md`

## Looking Up Past Decisions

1. Check `devdocs/archive/` for completed epic learnings
2. Check `devdocs/*.md` for reference documentation
3. Check `devdocs/README.md` for index of all docs

## When to Use What

| Scope | Approach |
|-------|----------|
| Single-session work | Just do it |
| Multi-session issue | `bd create` |
| Large initiative with phases | Epic (devdocs/ + bd epic) |
| Permanent reference knowledge | `devdocs/<topic>.md` |

## Session Handoff

Before ending a session:
- Create `bd` issues for any remaining or discovered work
- Close completed issues
- Update plan.md with current state
