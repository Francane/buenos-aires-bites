import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchVenues from "./tools/search-venues";
import getVenue from "./tools/get-venue";
import listNeighborhoods from "./tools/list-neighborhoods";
import listFavorites, { addFavoriteTool, removeFavoriteTool } from "./tools/list-favorites";
import { listMyListsTool, createListTool, addVenueToListTool } from "./tools/lists";
import { listCheckinsTool, createCheckinTool } from "./tools/checkins";
import createReview from "./tools/create-review";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "bites-mcp",
  title: "Bites — Buenos Aires gastro",
  version: "0.1.0",
  instructions:
    "Tools for Bites, a Buenos Aires restaurant discovery app. Search and read public venue data, and — as the signed-in user — manage favorites, lists, check-ins and reviews.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchVenues,
    getVenue,
    listNeighborhoods,
    listFavorites,
    addFavoriteTool,
    removeFavoriteTool,
    listMyListsTool,
    createListTool,
    addVenueToListTool,
    listCheckinsTool,
    createCheckinTool,
    createReview,
  ],
});
