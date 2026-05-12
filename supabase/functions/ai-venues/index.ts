// Lovable AI venue intelligence: semantic search, review summary, recommendations.
// deno-lint-ignore-file no-explicit-any

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const MODEL = "google/gemini-2.5-flash";

type Venue = {
  id: string;
  name: string;
  description?: string;
  cuisine?: string;
  neighborhood?: string;
  tags?: string[];
  priceRange?: number;
  rating?: number;
};

async function callLovableAI(messages: any[], jsonSchema?: any) {
  const body: any = {
    model: MODEL,
    messages,
  };
  if (jsonSchema) {
    body.tools = [{
      type: "function",
      function: {
        name: "respond",
        description: "Return the structured response.",
        parameters: jsonSchema,
      },
    }];
    body.tool_choice = { type: "function", function: { name: "respond" } };
  }

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    return { error: "rate_limited", status: 429 };
  }
  if (res.status === 402) {
    return { error: "credits_exhausted", status: 402 };
  }
  if (!res.ok) {
    const txt = await res.text();
    return { error: txt, status: res.status };
  }

  const data = await res.json();
  if (jsonSchema) {
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return { data: args ? JSON.parse(args) : null };
  }
  return { data: data?.choices?.[0]?.message?.content ?? "" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, payload } = await req.json();

    if (action === "semantic-search") {
      const { query, venues } = payload as { query: string; venues: Venue[] };
      if (!query || !Array.isArray(venues)) {
        return json({ error: "Missing query or venues" }, 400);
      }
      const slim = venues.map(v => ({
        id: v.id,
        name: v.name,
        cuisine: v.cuisine,
        neighborhood: v.neighborhood,
        tags: v.tags,
        priceRange: v.priceRange,
        description: v.description?.slice(0, 200),
      }));

      const result = await callLovableAI(
        [
          { role: "system", content: "Sos un experto en gastronomía de Buenos Aires. Tu tarea es seleccionar y rankear lugares que mejor coincidan con la búsqueda del usuario, en lenguaje natural. Devolvé hasta 12 ids ordenados de mejor a peor match, y una breve frase explicativa para cada uno (máx 90 caracteres, en español rioplatense, sin emojis)." },
          { role: "user", content: `Búsqueda: "${query}"\n\nLugares disponibles:\n${JSON.stringify(slim)}` },
        ],
        {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  reason: { type: "string" },
                },
                required: ["id", "reason"],
              },
            },
          },
          required: ["matches"],
        },
      );
      if ("error" in result) return json(result, result.status ?? 500);
      return json(result.data);
    }

    if (action === "summarize-reviews") {
      const { venueName, reviews } = payload as { venueName: string; reviews: { author: string; content: string; rating: number }[] };
      if (!reviews || reviews.length === 0) return json({ summary: null });

      const result = await callLovableAI(
        [
          { role: "system", content: "Sos un crítico gastronómico. Resumí las reseñas en español rioplatense, neutral y útil. Devolvé un resumen de 2-3 frases, una lista corta de pros y una de contras (cada item máx 50 caracteres). Sin emojis. Si no hay info suficiente para un campo, dejalo vacío." },
          { role: "user", content: `Lugar: ${venueName}\n\nReseñas:\n${reviews.map(r => `- (${r.rating}/5) ${r.author}: ${r.content}`).join("\n")}` },
        ],
        {
          type: "object",
          properties: {
            summary: { type: "string" },
            pros: { type: "array", items: { type: "string" } },
            cons: { type: "array", items: { type: "string" } },
            vibe: { type: "string", description: "Una palabra o dos describiendo el ambiente" },
          },
          required: ["summary", "pros", "cons", "vibe"],
        },
      );
      if ("error" in result) return json(result, result.status ?? 500);
      return json(result.data);
    }

    if (action === "recommend") {
      const { favorites, candidates } = payload as { favorites: Venue[]; candidates: Venue[] };
      if (!candidates || candidates.length === 0) return json({ recommendations: [] });
      const slimFav = favorites.map(v => ({ name: v.name, cuisine: v.cuisine, neighborhood: v.neighborhood, tags: v.tags, priceRange: v.priceRange }));
      const slimCand = candidates.map(v => ({ id: v.id, name: v.name, cuisine: v.cuisine, neighborhood: v.neighborhood, tags: v.tags, priceRange: v.priceRange }));

      const result = await callLovableAI(
        [
          { role: "system", content: "Sos un curador gastronómico. En base a los favoritos del usuario, recomendá hasta 6 lugares de la lista de candidatos. Ordená por afinidad. Para cada uno, dale una razón corta (máx 80 caracteres) en español rioplatense, sin emojis." },
          { role: "user", content: `Favoritos del usuario:\n${JSON.stringify(slimFav)}\n\nCandidatos:\n${JSON.stringify(slimCand)}` },
        ],
        {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: { id: { type: "string" }, reason: { type: "string" } },
                required: ["id", "reason"],
              },
            },
          },
          required: ["recommendations"],
        },
      );
      if ("error" in result) return json(result, result.status ?? 500);
      return json(result.data);
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("ai-venues error:", err);
    return json({ error: String(err) }, 500);
  }
});

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
