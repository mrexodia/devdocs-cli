# Agent Instructions

## Issue Tracking (bd)

This project uses **bd (beads)** for issue tracking. Run `bd prime` for workflow context and commands.

## Epics (devdocs/)

For larger initiatives spanning multiple sessions, create an epic:

```
devdocs/<epic-name>/
├── design.md     # User-provided design document (optional)
└── plan.md       # Goals, phases, required APIs, testing strategy
```

**Creating an epic** (user-initiated):
1. Create `devdocs/<epic-name>/plan.md` with goals and phases
2. User may provide `design.md` with requirements/architecture
3. Create bd epic: `bd epic create "Epic Name"` with child issues

**Working on an epic:**
- Use `bd` to track progress on individual issues
- Reference `design.md` for requirements and constraints
- Update `plan.md` if scope changes significantly

**Archiving an epic** (user-initiated only):
1. Ensure all bd issues are closed
2. Extract key learnings to `devdocs/archive/<epic-name>.md`:
   - Goal and scope (1 paragraph)
   - Key architectural decisions
   - Technical insights and gotchas
   - API summary (what was built)
   - References to related docs
3. Delete the epic directory (plan.md, design.md)
4. Ask user: promote `design.md` to `devdocs/<epic-name>.md` as permanent reference?

**Note:** Suggest when an epic might be ready for archival, but don't archive without explicit user request.

## Reference Documentation

Top-level `devdocs/<topic>.md` files contain permanent technical knowledge (not tied to any epic):
- Debugging guidelines, architectural patterns, API conventions
- Created when knowledge is broadly applicable beyond a single epic
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
