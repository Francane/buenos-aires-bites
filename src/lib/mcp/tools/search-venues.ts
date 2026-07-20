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
  name: "search_venues",
  title: "Search venues",
  description:
    "Search Bites venues in Buenos Aires by keyword (name/description), cuisine, neighborhood, tag, price range, minimum rating, or open-now. Returns compact venue rows.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free-text keyword matched against name and description."),
    cuisine: z.string().trim().optional(),
    neighborhood: z.string().trim().optional(),
    tag: z.string().trim().optional(),
    max_price: z.number().int().min(1).max(4).optional(),
    min_rating: z.number().min(0).max(5).optional(),
    open_now: z.boolean().optional(),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    const limit = input.limit ?? 20;
    let q = sb(ctx)
      .from("venues")
      .select("id,slug,name,description,cuisine,neighborhood,rating,review_count,price_range,is_open,tags,address,image_url")
      .eq("status", "approved")
      .order("rating", { ascending: false })
      .limit(limit);

    if (input.query) q = q.or(`name.ilike.%${input.query}%,description.ilike.%${input.query}%`);
    if (input.cuisine) q = q.ilike("cuisine", `%${input.cuisine}%`);
    if (input.neighborhood) q = q.ilike("neighborhood", `%${input.neighborhood}%`);
    if (input.tag) q = q.contains("tags", [input.tag]);
    if (input.max_price) q = q.lte("price_range", input.max_price);
    if (input.min_rating) q = q.gte("rating", input.min_rating);
    if (input.open_now) q = q.eq("is_open", true);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Found ${data?.length ?? 0} venues.` }],
      structuredContent: { venues: data ?? [] },
    };
  },
});
