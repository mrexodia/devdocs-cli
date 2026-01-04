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

## Common Prompts

Copy-paste these prompts to work with the methodology:

### Onboarding an Existing Project

```
Analyze this codebase and create initial reference documentation in devdocs/.
Focus on: architecture overview, key patterns, conventions, and gotchas.
```

```
Review recent git history and identify any in-progress work that should be
tracked as bd issues or epics. Create them after confirming with me.
```

### Epic Lifecycle

```
Create a new epic for: <description>
Set up devdocs/<name>/plan.md and create bd issues for the phases.
```

```
Archive the <name> epic. Extract key learnings to devdocs/archive/,
delete the epic directory, and ask about promoting design.md.
```

```
Review the <name> epic and tell me if it's ready for archival.
List any open issues or incomplete work.
```

### Maintenance

```
Audit devdocs/ for stale or outdated content. Check if reference docs
still match the current codebase and flag anything that needs updating.
```

```
Update devdocs/README.md to reflect the current state of reference docs,
active epics, and archived epics.
```

### Discovery

```
Summarize the current project state: open issues, active epics, blockers,
and what's ready to work on.
```

```
What decisions were made about <topic>? Search the devdocs archive
and reference documentation.
```

## Requirements

- [beads](https://github.com/steveyegge/beads) (`bd` command)
- [pi](https://github.com/mariozechner/pi-coding-agent) (optional, for hooks)
