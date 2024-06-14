import type { APIRoute } from "astro"
import { to_csv } from "../../../../backend/annotations/converter";
import { get_annotations, key_matches_identifier } from "../../../../backend/annotations/data";

export const GET: APIRoute = async (ctx) => {
    // This is part of the route, so always exists.
    const identifier = ctx.params.uploadidentifier!;

    const url = new URL(ctx.request.url)
    const params = new URLSearchParams(url.search)
    const key = params.get("key")

    if (!identifier || !key) {
        return new Response("", { status: 400 });
    }

    const keymatches = await key_matches_identifier(identifier, key);

    if (!keymatches) {
        return new Response("", { status: 403 });
    } 

    const annotations = await get_annotations(identifier);

    // Turn the array into a CSV.
    const csv = to_csv(annotations);
    return new Response(csv);
  }