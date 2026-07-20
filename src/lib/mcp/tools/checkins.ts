import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const listCheckinsTool = defineTool({
  name: "list_my_checkins",
  title: "List my check-ins",
  description: "Return the signed-in user's most recent venue check-ins.",
  inputSchema: { limit: z.number().int().min(1).max(50).optional() },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    const { data, error } = await sb(ctx)
      .from("check_ins")
      .select("id,note,rating,created_at,venues(id,name,neighborhood,cuisine)")
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: `${data?.length ?? 0} check-ins.` }], structuredContent: { check_ins: data ?? [] } };
  },
});

export const createCheckinTool = defineTool({
  name: "create_checkin",
  title: "Create check-in",
  description: "Record that the signed-in user visited a venue. Optional short note and 1-5 rating.",
  inputSchema: {
    venue_id: z.string().uuid(),
    note: z.string().trim().max(500).optional(),
    rating: z.number().int().min(1).max(5).optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ venue_id, note, rating }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    const { error } = await sb(ctx)
      .from("check_ins")
      .insert({ user_id: ctx.getUserId(), venue_id, note: note ?? null, rating: rating ?? null });
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: "Checked in." }] };
  },
});
