# devdocs-cli

Initialize the devdocs + beads methodology in any repository.

## Install

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
- **pi hook** for automatic `bd prime` injection

## What is this?

A hybrid approach combining:
- **bd (beads)** - Dependency-aware issue tracking that lives in your repo
- **devdocs/** - Epic tracking with design documents and archived learnings

### Workflow

| Scope | Approach |
|-------|----------|
| Single-session work | Just do it |
| Multi-session issue | `bd create` |
| Large initiative with phases | Epic (`devdocs/` + `bd epic`) |
| Permanent reference knowledge | `devdocs/<topic>.md` |

See the generated `AGENTS.md` for full methodology.

## Slash Commands

| Command | Description |
|---------|-------------|
| `/devdocs-onboard` | Analyze codebase, create reference docs, discover in-progress work |
| `/devdocs-epic <name>` | Plan epic collaboratively (gather research, define TDD strategy, create design.md) |
| `/devdocs-archive <name>` | Archive completed epic with learnings |
| `/devdocs-status` | Show open issues, active epics, stale docs |

## Philosophy

This methodology is based on lessons from effective "vibe engineering":

1. **Design first** — Research in Claude/ChatGPT, consolidate into `design.md` before coding
2. **TDD for AI** — Set up test harness first, then "work until tests pass"
3. **Scaffold the project** — `make test` must produce actionable feedback
4. **Your compaction > auto compaction** — Persist state in files (plan.md, bd issues)
5. **Manager mindset** — Step back, let the agent iterate autonomously

## Requirements

- [beads](https://github.com/steveyegge/beads) (`bd` command)
- [pi](https://github.com/mariozechner/pi-coding-agent) (optional, for hooks)
