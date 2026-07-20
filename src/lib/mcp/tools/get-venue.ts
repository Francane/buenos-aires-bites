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
  name: "get_venue",
  title: "Get venue details",
  description: "Fetch full venue details (plus recent reviews) by venue id or slug.",
  inputSchema: {
    id: z.string().trim().optional(),
    slug: z.string().trim().optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, slug }, ctx) => {
    if (!id && !slug) return { content: [{ type: "text", text: "Provide id or slug." }], isError: true };
    const client = sb(ctx);
    let query = client.from("venues").select("*").eq("status", "approved").limit(1);
    query = id ? query.eq("id", id) : query.eq("slug", slug!);
    const { data: venues, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const venue = venues?.[0];
    if (!venue) return { content: [{ type: "text", text: "Venue not found." }], isError: true };

    const { data: reviews } = await client
      .from("venue_reviews")
      .select("rating,content,created_at,user_id")
      .eq("venue_id", venue.id)
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      content: [{ type: "text", text: `${venue.name} — ${venue.neighborhood} · ${venue.cuisine} · ★${venue.rating}` }],
      structuredContent: { venue, reviews: reviews ?? [] },
    };
  },
});
