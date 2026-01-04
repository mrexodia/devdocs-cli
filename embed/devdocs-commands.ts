import type { HookAPI } from "@mariozechner/pi-coding-agent/hooks";

export default function (pi: HookAPI) {
  pi.registerCommand("devdocs-onboard", {
    description: "Analyze codebase, create reference docs, discover in-progress work",
    handler: async (_args, ctx) => {
      pi.sendMessage({
        customType: "devdocs",
        content: `Onboard this project to the devdocs methodology:
1. Analyze the codebase and create initial reference documentation in devdocs/
2. Review recent git history for in-progress work that should become bd issues
3. Update devdocs/README.md with the new documentation

Ask me before creating any files.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  pi.registerCommand("devdocs-epic", {
    description: "Plan a new epic collaboratively with design doc and TDD strategy",
    handler: async (args, ctx) => {
      if (!args.trim()) {
        ctx.ui.notify("Usage: /devdocs-epic <name-or-description>", "warning");
        return;
      }
      pi.sendMessage({
        customType: "devdocs",
        content: `Let's plan the "${args}" epic together.

First, help me gather context:
1. **Existing materials** - Do you have any existing research, notes, or design docs for this?
   (Claude/ChatGPT sessions, Obsidian notes, scattered docs, reference implementations)

2. **Testing strategy** - What's our TDD approach?
   - Are there existing tests we need to pass?
   - Is there a "golden master" or reference implementation to compare against?
   - What command runs tests? (e.g., \`make test\`, \`uv run pytest\`)

3. **Scope** - What's the definition of done?

Once I understand the context, I'll help consolidate everything into:
- \`devdocs/${args}/design.md\` - consolidated design document
- \`devdocs/${args}/plan.md\` - phased implementation plan
- bd issues for tracking

What materials do you have to start with?`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  pi.registerCommand("devdocs-archive", {
    description: "Archive completed epic with learnings",
    handler: async (args, ctx) => {
      if (!args.trim()) {
        ctx.ui.notify("Usage: /devdocs-archive <epic-name>", "warning");
        return;
      }
      pi.sendMessage({
        customType: "devdocs",
        content: `Archive the "${args}" epic:
1. Verify all bd issues are closed
2. Extract key learnings to devdocs/archive/${args}.md:
   - Goal and scope (1 paragraph)
   - Key architectural decisions
   - Technical insights and gotchas
   - API summary (what was built)
   - References to related docs
3. Delete the epic directory
4. Ask about promoting design.md to permanent reference
5. Update devdocs/README.md`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  pi.registerCommand("devdocs-status", {
    description: "Show open issues, active epics, stale docs",
    handler: async (_args, ctx) => {
      pi.sendMessage({
        customType: "devdocs",
        content: `Show the current project status:
- Open bd issues and blockers (run bd ready, bd list --status=open)
- Active epics in devdocs/ and their current phase
- Any stale or outdated documentation
- Update devdocs/README.md if out of sync`,
        display: true,
      }, { triggerTurn: true });
    }
  });
}
