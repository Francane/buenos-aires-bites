import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_neighborhoods",
  title: "List neighborhoods",
  description: "Return the list of neighborhoods with venue counts.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const { data, error } = await sb(ctx).from("venues").select("neighborhood").eq("status", "approved");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const counts = new Map<string, number>();
    for (const row of data ?? []) counts.set(row.neighborhood, (counts.get(row.neighborhood) ?? 0) + 1);
    const neighborhoods = [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    return {
      content: [{ type: "text", text: `${neighborhoods.length} neighborhoods.` }],
      structuredContent: { neighborhoods },
    };
  },
});
