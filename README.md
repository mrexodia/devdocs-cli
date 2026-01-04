# devdocs-cli

Structure your AI coding projects. Sets up issue tracking and documentation patterns that help agents maintain context across sessions.

## Install

First, install the dependencies:
- [beads](https://github.com/steveyegge/beads) (`bd`) for issue tracking
- [pi](https://github.com/mariozechner/pi-coding-agent) for the coding agent and slash commands

Then install devdocs-cli:
```bash
go install github.com/mrexodia/devdocs-cli@latest
```

## Usage

```bash
cd your-project
devdocs init
```

This sets up:
- **Beads** (`bd`) for issue tracking with `no-git-ops` config
- **devdocs/** directory for epics and reference documentation
- **AGENTS.md** with the methodology (appends if file exists)
- **pi hooks** for `bd prime` injection and slash commands

## What is this?

A hybrid approach combining:
- **bd (beads)** - Dependency-aware issue tracking that lives in your repo
- **devdocs/** - Epic tracking with design documents and archived learnings

### When to Use What

| Scope | Approach |
|-------|----------|
| Single-session work | Just do it |
| Multi-session issue | `bd create` |
| Large initiative with phases | Epic (`devdocs/` + `bd epic`) |
| Permanent reference knowledge | `devdocs/<topic>.md` |

## The Methodology

### 1. Design First

Don't jump into coding. Research first in Claude/ChatGPT/Grok, then consolidate into `design.md`:
- Problem statement and goals
- API design or architecture
- Key decisions and rationale
- References to documentation

### 2. TDD for AI

Set up the test harness *before* implementation:
- Define what tests need to pass
- Use "golden master" testing where possible (compare against known-good output)
- Ensure `make test` or equivalent produces actionable feedback
- Then tell the agent: "work until the tests pass"

### 3. Scaffold the Project

The agent needs simple commands that just work:
- Build and test must work without configuration hassle
- Errors must be obvious and parseable
- If it's hard for you to run, it's hard for the agent

### 4. Epic Structure

```
devdocs/<epic-name>/
├── design.md     # Consolidated from your research
└── plan.md       # Phased implementation plan
```

Epic creation is collaborative:
1. Gather existing materials (research, notes, scattered docs)
2. Consolidate into `design.md`
3. Define testing strategy
4. Create `plan.md` with phases (each completable in one session)
5. Track with `bd epic create`

### 5. Context Management

- Stay under 50% context for best performance
- Consider wrapping up at 70%
- Your compaction > auto compaction; persist state in `plan.md` and bd issues
- Start fresh sessions rather than hitting compaction

### 6. Session Handoff

Before ending a session:
- Create `bd` issues for remaining/discovered work
- Close completed issues
- Update `plan.md` with current state
- **Provide validation**: commands, steps, or artifacts to verify the work

### 7. Archival

When an epic is complete, archive it to `devdocs/archive/<epic-name>.md`:
- Goal and scope (1 paragraph)
- Key architectural decisions
- Technical insights and gotchas
- API summary (what was built)
- Validation (how to verify it works)
- References to related docs

Then delete the epic directory. Optionally promote `design.md` to permanent reference.

## Slash Commands

| Command | Description |
|---------|-------------|
| `/devdocs-onboard` | Analyze codebase, create reference docs, discover in-progress work |
| `/devdocs-plan <name>` | Plan a new epic (gather existing materials, define TDD, create design.md) |
| `/devdocs-archive <name>` | Archive completed epic with learnings |
| `/devdocs-status` | Show open issues, active epics, stale docs |

## Philosophy

This methodology is based on lessons from effective "vibe engineering":

1. **Manager mindset**: Manage the agent, don't pair program. Step back and let it iterate.
2. **Design first**: Research before coding. The agent implements your consolidated design.
3. **TDD for AI**: Tests are the spec. "Make the tests pass" is an unambiguous goal.
4. **Scaffold for success**: Invest time in project setup. Simple commands that just work.
5. **Persist state deliberately**: Files survive context resets. Your compaction beats auto-compaction.
6. **Verify without code review**: Validation artifacts show things working instead of requiring diff review.

For the full methodology, see [METHODOLOGY.md](METHODOLOGY.md).

