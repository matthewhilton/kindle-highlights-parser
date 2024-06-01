import type { APIRoute } from "astro";
import { annotations_exist } from "../../../lib/store";

export const GET: APIRoute = async ({params, request}) => {
    // This is part of the route, so always exists.
    const sessionToken = params.sessionid!;

    const isReady = await annotations_exist(sessionToken);

    const res: SessionStatus = {
        sessionToken: sessionToken,
        dataProcessed: isReady
    };

    return new Response(JSON.stringify(res))
  }