import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const listMyListsTool = defineTool({
  name: "list_my_lists",
  title: "List my lists",
  description: "List the signed-in user's curated venue lists.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    const { data, error } = await sb(ctx)
      .from("lists")
      .select("id,name,description,is_public,cover_image_url,created_at")
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false });
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: `${data?.length ?? 0} lists.` }], structuredContent: { lists: data ?? [] } };
  },
});

export const createListTool = defineTool({
  name: "create_list",
  title: "Create list",
  description: "Create a new venue list for the signed-in user.",
  inputSchema: {
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().max(500).optional(),
    is_public: z.boolean().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ name, description, is_public }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    const { data, error } = await sb(ctx)
      .from("lists")
      .insert({ user_id: ctx.getUserId(), name, description: description ?? null, is_public: is_public ?? false })
      .select()
      .single();
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: `Created list "${data.name}".` }], structuredContent: { list: data } };
  },
});

export const addVenueToListTool = defineTool({
  name: "add_venue_to_list",
  title: "Add venue to list",
  description: "Add a venue to one of the signed-in user's lists.",
  inputSchema: {
    list_id: z.string().uuid(),
    venue_id: z.string().uuid(),
    note: z.string().trim().max(500).optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ list_id, venue_id, note }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    const { error } = await sb(ctx).from("list_items").insert({ list_id, venue_id, note: note ?? null });
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: "Added." }] };
  },
});
