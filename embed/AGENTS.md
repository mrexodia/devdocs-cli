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

2. **Create design.md** - Consolidate the above **INTO** the epic directory (not just reference it):
   - Problem statement and goals
   - API design or architecture  
   - Key decisions and rationale
   - Full content, not links to external files

3. **Define testing strategy (TDD)** - Before implementation:
   - What tests exist or need to be created?
   - Is there a "golden master" to compare against?
   - Can we set up: `make test` → actionable feedback?

4. **Create plan.md** - Implementation phases:
   - Phase breakdown with clear milestones
   - Each phase should be completable in one session
   - Testing checkpoints between phases

5. **Create bd issues** - Create epic with child issues for tracking

6. **Offer cleanup** - Since devdocs/<epic>/ now contains the consolidated content, offer to delete the original scattered docs (DESIGN.md, research notes, etc.). The epic must be self-contained.

### Writing Good Bd Issues

Issues must be **self-sufficient for session handoff**. A new session should be able to pick up an issue from `bd show <id>` without hunting through the codebase.

**Required sections in issue description:**

```markdown
## What to build
- Concrete deliverables (files, endpoints, functions)
- Dependencies to install

## References
- Specific doc sections: "DESIGN.md § 'Server API'"
- Not just "see the docs"

## Validation
- Command to run with expected output
- How to know it's done
```

**Bad issue:** "Implement the server foundation"

**Good issue:**
```
Create basic HTTP server with placeholder UI.

## What to build
- server/main.go with HTTP server on port 8080
- server/static/index.html (placeholder)
- GET /api/sessions returning {"sessions": []}

## References
- devdocs/<epic>/implementation.md § 'Phase 1: Server Foundation'
- devdocs/<epic>/design.md § 'Server' for full API spec

## Validation
Can load http://localhost:8080 in browser and see HTML page.
```

### Working on an Epic

- Reference `design.md` for requirements and constraints
- Follow TDD: make tests pass, don't just write code
- Update `plan.md` if scope changes

### Archiving an Epic (user-initiated only)

1. Ensure all bd issues are closed
2. Extract key learnings to `devdocs/archive/<epic-name>.md`:
   - Goal and scope (1 paragraph)
   - Key architectural decisions
   - Technical insights and gotchas
   - API summary (what was built)
   - Code walkthrough (key files and functions)
   - Validation (how to verify it works)
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

## Fixing Bugs

For non-trivial bugs, isolate before fixing:

1. **Isolate**: Create a minimal standalone reproducer test
2. **Verify it fails**: Run the test, confirm it reproduces the issue
3. **Fix**: Implement the fix
4. **Verify it passes**: Run the test again, confirm it now passes
5. **Run full suite**: Make sure the fix doesn't break anything else

A minimal reproducer:
- Proves you understand the bug
- Creates a permanent regression test
- Makes debugging easier if the fix doesn't work

For trivial fixes (typos, obvious one-liners), use your judgment. But if you find yourself guessing at the cause or trying multiple fixes, stop and isolate first.

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
- **Provide validation** - Help the user verify the work without reading diffs:
  - Commands to run with expected output
  - Code walkthrough: key files and functions to review (a "speedrun" of the changes)
  - Summary presentation: what changed, why, and what to look at (like a 1:1 with a tech lead)
