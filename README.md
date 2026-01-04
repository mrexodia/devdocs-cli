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

The init command installs pi hooks that provide these slash commands:

### Onboarding

| Command | Description |
|---------|-------------|
| `/devdocs-analyze` | Analyze codebase and create initial reference documentation |
| `/devdocs-discover` | Review git history to discover in-progress work |

### Epic Lifecycle

| Command | Description |
|---------|-------------|
| `/epic-create <description>` | Create a new epic with plan.md and bd issues |
| `/epic-archive <name>` | Archive a completed epic |
| `/epic-status <name>` | Review epic status and check if ready for archival |

### Maintenance

| Command | Description |
|---------|-------------|
| `/devdocs-audit` | Audit devdocs for stale or outdated content |
| `/devdocs-sync` | Update devdocs/README.md index to match actual files |

### Discovery

| Command | Description |
|---------|-------------|
| `/devdocs-status` | Summarize current project state |
| `/devdocs-search <topic>` | Search devdocs for past decisions |

## Requirements

- [beads](https://github.com/steveyegge/beads) (`bd` command)
- [pi](https://github.com/mariozechner/pi-coding-agent) (optional, for hooks)
