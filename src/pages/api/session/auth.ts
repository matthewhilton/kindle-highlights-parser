import type { APIRoute } from "astro";
import { create_jwt } from "../../../lib/auth";

export interface AuthRouteResponse {
    token: string
}

export const GET: APIRoute = async () => {
    const token = create_jwt();

    const res: AuthRouteResponse = {
        token: token
    }

    return new Response(JSON.stringify(res))
}