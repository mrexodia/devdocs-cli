import type { HookAPI } from "@mariozechner/pi-coding-agent/hooks";

export default function (pi: HookAPI) {
  pi.on("session", async (event, ctx) => {
    if (event.reason === "start" || event.reason === "before_compact") {
      try {
        await ctx.exec("bd", ["prime"]);
        ctx.ui.notify("bd prime completed", "info");
      } catch (error) {
        ctx.ui.notify(`bd prime failed: ${error}`, "error");
      }
    }
  });
}
