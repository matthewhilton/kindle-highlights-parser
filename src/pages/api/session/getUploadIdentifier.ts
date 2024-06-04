import type { APIContext, APIRoute } from "astro";
import jwt from 'jsonwebtoken'
import { secureRoute } from "../../../common/requireSessionToken";
import { humanId } from "human-id";

export interface GetUploadIdentifierResponse {
    uploadIdentifier: string
}

export const GET: APIRoute = (ctx) => secureRoute(ctx, (appctx) => {
    const uploadIdentifier = humanId({ addAdverb: false }).toLowerCase();

    // TODO ensure this doesn't already exist for any other users.

    const res: GetUploadIdentifierResponse = {
        uploadIdentifier,
    }

    return new Response(JSON.stringify(res))
})