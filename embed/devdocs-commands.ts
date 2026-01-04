import type { HookAPI } from "@mariozechner/pi-coding-agent/hooks";

export default function (pi: HookAPI) {
  pi.registerCommand("devdocs-onboard", {
    description: "Analyze codebase, create reference docs, discover in-progress work",
    handler: async (_args, ctx) => {
      pi.sendMessage({
        customType: "devdocs",
        content: `Set up devdocs for this project:
1. Analyze the codebase and create initial reference documentation in devdocs/
2. Review recent git history for in-progress work that should become bd issues
3. Update devdocs/README.md with the new documentation

Ask me before creating any files.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  pi.registerCommand("devdocs-epic", {
    description: "Plan a new epic with design doc and TDD strategy",
    handler: async (args, ctx) => {
      if (!args.trim()) {
        ctx.ui.notify("Usage: /devdocs-epic <name-or-description>", "warning");
        return;
      }
      pi.sendMessage({
        customType: "devdocs",
        content: `Plan the "${args}" epic. Before creating any files, ask me about:

1. **Existing materials**: Do I have research, notes, or design docs? (Claude/ChatGPT sessions, Obsidian notes, scattered docs, reference implementations)
   - If none: Ask me to describe what I want to build, or help me brainstorm the requirements first.

2. **Testing strategy**: What tests exist or need to be created? Is there a golden master to compare against? What command runs tests?

3. **Scope**: What's the definition of done?

After gathering context, consolidate into:
- \`devdocs/${args}/design.md\`
- \`devdocs/${args}/plan.md\`
- bd issues for tracking`,
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
   - Code walkthrough (key files and functions)
   - Validation (how to verify it works)
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
