import type { APIRoute } from "astro"
import { get_annotations } from "../../../../lib/store"

export const GET: APIRoute = async ({params, request}) => {
  // This is part of the route, so always exists.
  const sessionToken = params.sessionid!;

    const annotation = get_annotations()
    return new Response(
      JSON.stringify({
        name: 'Astro',
        url: 'https://astro.build/'
      })
    )
  }