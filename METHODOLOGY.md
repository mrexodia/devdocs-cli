# The Devdocs Methodology

A guide for AI coding agents working on multi-session projects.

## The Problem

AI coding agents are powerful but forgetful. Each session starts fresh, and when context limits are reached, automatic compaction loses critical details. This creates several problems:

1. **Lost context**: The agent forgets decisions made in previous sessions
2. **Repeated mistakes**: Without history, the agent may try approaches that already failed
3. **Incomplete work**: Large projects can't be finished in a single session
4. **No verification**: How do you know the agent actually did what it claimed?

The devdocs methodology solves these problems through structured documentation and issue tracking that persists across sessions.

## Core Concepts

### Epics

An epic is a large initiative that spans multiple sessions. Each epic lives in its own directory:

```
devdocs/<epic-name>/
├── design.md     # What we're building and why
└── plan.md       # How we're building it, in phases
```

**design.md** contains:
- Problem statement and goals
- API design or architecture decisions
- Key constraints and rationale
- References to external documentation

The user typically creates design.md by researching in Claude, ChatGPT, or other tools, then consolidating their findings. Your job is to help them structure this research into a clear design document.

**plan.md** contains:
- Phased implementation plan
- Each phase should be completable in one session
- Testing checkpoints between phases
- Current status and blockers

### Issue Tracking with Beads

Beads (`bd`) tracks individual issues and their dependencies. For epics, create a bd epic with child issues:

```bash
bd epic create "Epic Name"
bd create "Implement phase 1" --parent <epic-id>
bd create "Write tests for phase 1" --parent <epic-id>
```

Use `bd ready` to find unblocked work. Use `bd close` when work is complete.

The combination of devdocs (for design and planning) and beads (for granular tracking) gives you both the big picture and the details.

### Reference Documentation

Some knowledge applies beyond any single epic. This goes in top-level files:

```
devdocs/
├── README.md           # Index of all documentation
├── debugging.md        # How to debug issues in this project
├── architecture.md     # System architecture overview
└── conventions.md      # Code style and patterns
```

Create reference docs when you discover something that future sessions should know.

### Archive

When an epic is complete, archive it to preserve key learnings:

```
devdocs/archive/<epic-name>.md
```

The archive contains:
- Goal and scope (one paragraph)
- Key architectural decisions
- Technical insights and gotchas
- API summary (what was built)
- Code walkthrough (key files and functions for future reference)
- Validation (how to verify it still works)
- References to related docs

Then delete the epic directory. The detailed progress is in git history; only essential knowledge lives in the archive.

## The Workflow

### Starting a New Epic

Epic creation is collaborative. Ask the user:

1. **Existing materials**: Do they have research, notes, or design docs? These might be in Claude/ChatGPT sessions, Obsidian notes, scattered across the project, or in reference implementations.

2. **Testing strategy**: What tests exist or need to be created? Is there a "golden master" (known-good output) to compare against? What command runs tests?

3. **Scope**: What's the definition of done?

After gathering this context, help consolidate everything into design.md and plan.md, then create bd issues for tracking.

### Working on an Epic

1. Read design.md for requirements and constraints
2. Check plan.md for current phase and status
3. Run `bd ready` to find available work
4. Follow TDD: make tests pass, don't just write code
5. Update plan.md as you progress

### Context Management

Token limits are real. Monitor your context usage:

- **Under 50%**: You're fine, keep working
- **50-70%**: Consider wrapping up soon
- **Over 70%**: Wrap up now, update plan.md, start fresh next session

Your compaction is better than automatic compaction. Persist state deliberately in plan.md and bd issues rather than relying on the system to summarize correctly.

### Mid-Work Review Pattern

For larger epics, consider stopping at ~50% for a review checkpoint:

1. Pause implementation
2. Run an external review (different agent, linter, or manual check)
3. Merge findings into plan.md and bd issues
4. Continue with fresh context

This catches drift early. The agent may have made assumptions that don't match the design, or discovered issues that should redirect the plan. Better to catch this halfway than at the end.

### Session Handoff

Before ending a session:

1. Create bd issues for any remaining or discovered work
2. Close completed issues
3. Update plan.md with current state
4. Provide validation: commands, steps, or artifacts for the user to verify the work

The validation step is critical. The user shouldn't have to read diffs to know if you succeeded. Give them something they can run or see.

### Archiving an Epic

When all work is complete (user-initiated only):

1. Verify all bd issues are closed
2. Extract key learnings to devdocs/archive/<epic-name>.md
3. Delete the epic directory
4. Ask the user: should design.md become permanent reference documentation?
5. Update devdocs/README.md

## TDD for AI

Test-Driven Development works exceptionally well for AI agents. The pattern:

1. **Set up the test harness first**. Before writing any implementation code, ensure tests exist and can run.

2. **Use golden master testing where possible**. Compare output against known-good reference output. "Make the outputs match" is an unambiguous goal.

3. **Ensure tests produce actionable feedback**. `make test` should show exactly what failed and why, not just "tests failed".

4. **Then implement until tests pass**. With clear tests, you have an unambiguous goal. Work until green.

This approach works because tests are a specification the agent can verify against. There's no ambiguity about whether the work is done.

## Scaffolding

The project must be set up for agent success. This means:

**Simple commands that just work**:
- `make build` or equivalent should build without configuration
- `make test` should run tests and show clear results
- No manual steps, no "first do X, then do Y"

**The rule**: If it's hard for you to run, it's hard for the agent. Invest time in project setup before diving into implementation.

### Automated Error Reporting

This is critical. The agent needs fast, actionable feedback from:

**Compiler/interpreter errors**:
```bash
$ make build
src/parser.py:47: error: Argument 1 to "parse" has incompatible type "str"; expected "bytes"
```

**Type checkers** (mypy, pyright, tsc):
```bash
$ uv run pyright
src/validator.py:23:5 - error: Cannot assign to "None"
```

**Linters** (ruff, eslint, clippy):
```bash
$ ruff check .
src/utils.py:15:1: F401 `os` imported but unused
```

**Formatters** (black, prettier, rustfmt):
```bash
$ ruff format --check .
Would reformat src/main.py
```

Set these up to run with single commands. The more you automate, the less you need to write in AGENTS.md. Rules like "use 4-space indentation" are useless if the agent can just run `ruff format` and see what's wrong.

**Ideal setup** mirrors CI:
```makefile
check: lint typecheck test

lint:
	ruff check .
	ruff format --check .

typecheck:
	pyright

test:
	pytest
```

If `make check` passes locally, CI will pass. The agent should run this frequently, not just at the end.

**LSP integration**: If the agent has access to language server output (via editor integration or direct LSP queries), it gets real-time feedback on type errors and undefined references. This catches mistakes before even running the code.

### Crash Stacks and Fault Handling

For Python projects, install [auto-faulthandler](https://github.com/mrexodia/auto-faulthandler) to get stack traces on crashes:

```bash
pip install auto-faulthandler
```

This automatically enables Python's faulthandler for all scripts, so when native code crashes, you get a traceback instead of a silent exit. Without this, debugging segfaults is nearly impossible.

### Service Management

For projects with long-running services (servers, daemons), set up start/stop commands with PID tracking:

```makefile
SERVER_PID = .server.pid

start:
	./server --port 8080 & echo $$! > $(SERVER_PID)

stop:
	kill `cat $(SERVER_PID)` 2>/dev/null || true
	rm -f $(SERVER_PID)

test: start
	curl http://localhost:8080/health
	$(MAKE) stop
```

This prevents the agent from getting confused about whether the server is running, and ensures clean shutdown between test runs.

### Isolated Regression Tests

When you hit a bug, don't just fix it inline. Create an isolated reproducer:

```
tests/regressions/
├── test_syncscope_crash.py    # Standalone script that reproduces issue #42
├── test_null_context.py       # Reproduces issue #37
└── README.md                  # Index of regression tests
```

Each file should be runnable standalone:

```python
# tests/regressions/test_syncscope_crash.py
"""
Reproduces crash when parsing syncscope metadata.
Issue: #42
Fixed in: commit abc123
"""
from mylib import parse_module

def test_syncscope_crash():
    # This used to crash, now should parse cleanly
    module = parse_module("testdata/syncscope.bc")
    assert module is not None
```

This pattern forces isolation and creates a permanent regression test.

## Philosophy

### Manager Mindset

You're not pair programming with the user. You're receiving direction and executing autonomously. The user is managing you:

- They provide the design and constraints
- You execute and report back
- They verify through validation artifacts, not code review

Step back and iterate. Don't ask permission for every small decision. Use your judgment, then show results.

### Design First

Never jump straight into coding. The pattern:

1. User researches (possibly in other AI sessions)
2. User consolidates research into design.md
3. You implement the design

If there's no design.md, help create one before writing code. This front-loads the thinking and prevents wasted implementation effort.

### Persist State Deliberately

Files survive context resets. Memory doesn't. Always:

- Write decisions to design.md
- Write progress to plan.md
- Write issues to bd
- Write learnings to archive

If it's only in your context window, it will be lost.

### Verify Without Code Review

The user shouldn't have to read your diffs to know if you succeeded. Provide:

**Commands and expected output**:
```
Run `make test` - all 47 tests should pass
Run `./bin/tool --version` - should print "1.2.0"
```

**Code walkthrough** (a "speedrun" of the changes):
```
Key files to review:
- src/parser.py:45-80 - new parsing logic
- src/validator.py:120-150 - validation rules
- tests/test_parser.py - test cases showing expected behavior
```

This points the user to the important parts without requiring them to find needles in a haystack of diffs.

**Summary presentation** (like a 1:1 with a tech lead):
```
## What Changed
Added input validation to the parser module.

## Why
Users were hitting crashes on malformed input (issue #42).

## Key Decisions
- Chose to fail fast rather than attempt recovery
- Added structured error messages with line numbers

## What to Look At
- src/parser.py: the new validate() function
- tests/test_parser.py: edge cases we now handle
```

This format gives the user a guided tour rather than dumping code on them.

**CTO Briefing** (full template for significant work):

```markdown
# Work Report: [Title]

## Summary
One paragraph: what was accomplished, what wasn't, what's blocked.

## Completed
- [x] Task 1 (bd issue: proj-xxx)
- [x] Task 2 (bd issue: proj-yyy)

## Not Completed
- [ ] Task 3: [specific blocker]

## Demo
[Command to run, or link to recording]

## Verification
- Tests passing: Yes/No
- Golden master match: Yes/No
- Manual verification needed: [specific items]

## Code Walkthrough
Key files:
- src/main.py:45-80 - core logic
- tests/test_main.py - test cases

## Next Steps
proj-aaa → proj-bbb → proj-ccc

## Questions
1. [Specific decision needed]
2. [Clarification requested]
```

The "Questions" section is critical. Surface unknowns explicitly rather than making silent assumptions.

**Visual Demos**:

For CLI tools, use [asciinema](https://asciinema.org/) to record terminal sessions:
```bash
asciinema rec demo.cast
# ... do the demo ...
# Ctrl+D to stop
```

For web UIs, use [Playwright](https://playwright.dev/) to capture screenshots or video:
```python
page.screenshot(path="screenshot.png")
page.video.save_as("demo.webm")
```

These artifacts prove the feature works without requiring the user to run anything.

### Anti-Sycophancy

Agents can claim success when things aren't actually working. Protect against this:

1. **Automated verification**: If tests pass, the work is valid. If they don't, it's not. No interpretation needed.

2. **Golden master comparison**: Output either matches the reference or it doesn't. The agent can't talk its way around a diff.

3. **Structured claims**: Instead of freeform "I completed the task", require specific fields:
   - Which tests pass?
   - What command demonstrates success?
   - What's the expected output?

4. **Skeptical checking**: When reviewing agent work, assume claims might be wrong. Run the verification yourself.

5. **Coverage tracking**: Use `coverage run` and `coverage report` to verify tests actually exercise the code:
   ```bash
   coverage run -m pytest
   coverage report --fail-under=80
   ```

The best defense is making verification automatic and unavoidable.

## Learning Extraction

When you discover something important during a session, persist it immediately.

**Style and formatting**: Don't put these in AGENTS.md. Configure linters and formatters instead. `ruff format` enforces indentation better than any written rule.

**Project-specific knowledge** goes in the project's AGENTS.md:
```markdown
## Build
- Run `make check` before committing (runs lint, typecheck, test)
- LLVM must be installed; see devdocs/setup.md

## Gotchas
- The API returns ISO timestamps, not Unix epochs
- Context must be disposed before Module (ownership hierarchy)
```

**Technical patterns** go in devdocs reference docs:
```markdown
# devdocs/error-handling.md
This project uses structured errors with codes...
```

**Session-specific learnings** go in plan.md until the epic is archived.

Don't wait until the end of a session to write things down. If you discover that the API behaves unexpectedly, write it immediately where future sessions will find it.

## Periodic Maintenance

Documentation goes stale. Periodically review devdocs:

1. **Check accuracy**: Do the reference docs match the current code?
2. **Prune obsolete content**: Remove docs for deleted features
3. **Update examples**: Make sure code snippets still run
4. **Consolidate**: Merge overlapping docs, remove duplication

A good prompt for this:
```
Review devdocs/ and check if the documentation is still accurate.
Flag anything that's outdated or contradicts the current codebase.
```

## Looking Up Past Decisions

When you need context:

1. Check `devdocs/archive/` for completed epic learnings
2. Check `devdocs/*.md` for reference documentation
3. Check `devdocs/README.md` for the index
4. Check bd issues for current and past work

The answers are in the files. Read them.

## Summary

The devdocs methodology is simple:

1. **Design first**: Consolidate research into design.md before coding
2. **Plan in phases**: Break work into session-sized chunks in plan.md
3. **Track with beads**: Use bd for granular issue tracking
4. **Test first**: Set up tests before implementation
5. **Persist state**: Write everything to files, not just context
6. **Validate visibly**: Give the user something to verify
7. **Archive learnings**: Extract insights when done

This keeps you effective across sessions, gives the user confidence in your work, and builds a knowledge base for future development.
