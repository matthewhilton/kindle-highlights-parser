import type { APIContext } from "astro";
import { is_jwt_valid } from "../lib/auth";

type AstroApiContext = APIContext<Record<string, any>, Record<string, string | undefined>>

export interface AppContext {
    ctx: AstroApiContext,
    sessionToken: string
}

export const secureRoute = async (ctx: AstroApiContext, fn: (ctx: AppContext) => Response | Promise<Response>): Promise<Response> => {
    const jwt = ctx.request.headers.get("Authorization") || "";
    const isValid = is_jwt_valid(jwt);

    if (!isValid) {
        return new Response(null, {
            status: 403
        })
    }

    const appCtx = {
        ctx: ctx,
        sessionToken: jwt
    }

    return await fn(appCtx);
}