import type { APIRoute } from "astro";
import { get_upload_data } from "../../../../backend/annotations/data";

export interface GetUploadStatusResponse {
    annotationsExist: boolean
}

export const GET: APIRoute = async (ctx) => {
    const identifier = ctx.params.uploadidentifier;
    
    const url = new URL(ctx.request.url)
    const params = new URLSearchParams(url.search)
    const key = params.get("key")

    if (!identifier || !key) {
        return new Response("", { status: 400 });
    }

    const data = await get_upload_data(identifier);

    if (!data) {
        return new Response("", { status: 404 });
    }

    // If the upload is not owned by this user, reject it as 403.
    if(data.key != key) {
        return new Response("", { status: 403 });
    }

    const res: GetUploadStatusResponse = {
        annotationsExist: data.annotations != null
    }

    return new Response(JSON.stringify(res))
}