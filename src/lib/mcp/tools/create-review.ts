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
  name: "create_review",
  title: "Create review",
  description: "Post a review for a venue as the signed-in user (rating 1-5 and text).",
  inputSchema: {
    venue_id: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    content: z.string().trim().min(1).max(2000),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ venue_id, rating, content }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    const { data, error } = await sb(ctx)
      .from("venue_reviews")
      .insert({ user_id: ctx.getUserId(), venue_id, rating, content })
      .select()
      .single();
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: "Review posted." }], structuredContent: { review: data } };
  },
});
