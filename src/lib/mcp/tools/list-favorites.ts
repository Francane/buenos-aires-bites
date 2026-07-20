import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_my_favorites",
  title: "List my favorites",
  description: "List venues favorited by the signed-in user.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    const { data, error } = await sb(ctx)
      .from("favorites")
      .select("venue_id,created_at,venues(id,slug,name,neighborhood,cuisine,rating,image_url)")
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `${data?.length ?? 0} favorites.` }],
      structuredContent: { favorites: data ?? [] },
    };
  },
});

export const addFavoriteTool = defineTool({
  name: "add_favorite",
  title: "Add favorite",
  description: "Mark a venue as favorite for the signed-in user.",
  inputSchema: { venue_id: z.string().uuid() },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ venue_id }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    const { error } = await sb(ctx).from("favorites").upsert({ user_id: ctx.getUserId(), venue_id });
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: "Favorited." }] };
  },
});

export const removeFavoriteTool = defineTool({
  name: "remove_favorite",
  title: "Remove favorite",
  description: "Remove a venue from the signed-in user's favorites.",
  inputSchema: { venue_id: z.string().uuid() },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: true, openWorldHint: false },
  handler: async ({ venue_id }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    const { error } = await sb(ctx).from("favorites").delete().eq("user_id", ctx.getUserId()).eq("venue_id", venue_id);
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: "Removed." }] };
  },
});
