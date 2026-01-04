import type { HookAPI } from "@mariozechner/pi-coding-agent/hooks";

export default function (pi: HookAPI) {
  // Onboarding commands
  pi.registerCommand("devdocs-analyze", {
    description: "Analyze codebase and create initial reference documentation",
    handler: async (_args, ctx) => {
      pi.sendMessage({
        customType: "devdocs",
        content: `Analyze this codebase and create initial reference documentation in devdocs/.
Focus on: architecture overview, key patterns, conventions, and gotchas.
Ask me before creating any files.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  pi.registerCommand("devdocs-discover", {
    description: "Review git history to discover in-progress work",
    handler: async (_args, ctx) => {
      pi.sendMessage({
        customType: "devdocs",
        content: `Review recent git history and identify any in-progress work that should be
tracked as bd issues or epics. Create them after confirming with me.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  // Epic lifecycle commands
  pi.registerCommand("epic-create", {
    description: "Create a new epic with plan.md and bd issues",
    handler: async (args, ctx) => {
      if (!args.trim()) {
        ctx.ui.notify("Usage: /epic-create <description>", "warning");
        return;
      }
      pi.sendMessage({
        customType: "devdocs",
        content: `Create a new epic for: ${args}
Set up devdocs/<name>/plan.md and create bd issues for the phases.
Ask me to confirm the name and structure before creating.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  pi.registerCommand("epic-archive", {
    description: "Archive a completed epic",
    handler: async (args, ctx) => {
      if (!args.trim()) {
        ctx.ui.notify("Usage: /epic-archive <epic-name>", "warning");
        return;
      }
      pi.sendMessage({
        customType: "devdocs",
        content: `Archive the "${args}" epic. Extract key learnings to devdocs/archive/,
delete the epic directory, and ask about promoting design.md.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  pi.registerCommand("epic-status", {
    description: "Review epic status and check if ready for archival",
    handler: async (args, ctx) => {
      if (!args.trim()) {
        ctx.ui.notify("Usage: /epic-status <epic-name>", "warning");
        return;
      }
      pi.sendMessage({
        customType: "devdocs",
        content: `Review the "${args}" epic and tell me if it's ready for archival.
List any open issues or incomplete work.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  // Maintenance commands
  pi.registerCommand("devdocs-audit", {
    description: "Audit devdocs for stale or outdated content",
    handler: async (_args, ctx) => {
      pi.sendMessage({
        customType: "devdocs",
        content: `Audit devdocs/ for stale or outdated content. Check if reference docs
still match the current codebase and flag anything that needs updating.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  pi.registerCommand("devdocs-sync", {
    description: "Update devdocs/README.md index to match actual files",
    handler: async (_args, ctx) => {
      pi.sendMessage({
        customType: "devdocs",
        content: `Update devdocs/README.md to reflect the current state of reference docs,
active epics, and archived epics.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  // Discovery commands
  pi.registerCommand("devdocs-status", {
    description: "Summarize current project state",
    handler: async (_args, ctx) => {
      pi.sendMessage({
        customType: "devdocs",
        content: `Summarize the current project state: open issues, active epics, blockers,
and what's ready to work on.`,
        display: true,
      }, { triggerTurn: true });
    }
  });

  pi.registerCommand("devdocs-search", {
    description: "Search devdocs for past decisions",
    handler: async (args, ctx) => {
      if (!args.trim()) {
        ctx.ui.notify("Usage: /devdocs-search <topic>", "warning");
        return;
      }
      pi.sendMessage({
        customType: "devdocs",
        content: `What decisions were made about "${args}"? Search the devdocs archive
and reference documentation.`,
        display: true,
      }, { triggerTurn: true });
    }
  });
}
