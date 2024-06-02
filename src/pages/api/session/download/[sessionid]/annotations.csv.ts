import type { APIRoute } from "astro"
import { get_annotations } from "../../../../../lib/store";
import { to_csv } from "../../../../../lib/converter";

export const GET: APIRoute = async ({params}) => {
    // This is part of the route, so always exists.
    const sessionToken = params.sessionid!;
    const annotations = await get_annotations(sessionToken);

    // Turn the array into a CSV.
    const csv = to_csv(annotations);
    return new Response(csv);
  }