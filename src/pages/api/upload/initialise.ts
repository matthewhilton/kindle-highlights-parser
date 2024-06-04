import type { APIRoute } from "astro";
import { initialise_upload } from "../../../backend/annotations/data";

export interface GetUploadIdentifierResponse {
    uploadIdentifier: string,
    accessKey: string
}

export const GET: APIRoute = async () => {
    const { identifier, accessKey } = await initialise_upload() || {};

    if (!identifier || !accessKey) {
        return new Response("", { status: 500 })
    }

    const res: GetUploadIdentifierResponse = {
        uploadIdentifier: identifier,
        accessKey,
    }

    return new Response(JSON.stringify(res))
}