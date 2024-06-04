import type { AnnotationDataRow } from "../../apps/annotations/types";
import { expiry_time, get_redis } from "../../lib/data";
import { humanId } from "human-id";

export async function annotations_exist(sessionIdentifier: string): Promise<boolean> {
    const redis = get_redis()
    return await redis.exists(sessionIdentifier) == 1;
}

export async function get_annotations(identifier: string): Promise<Array<AnnotationDataRow>> {
    const redis = get_redis();
    const data: any = await redis.json.get(get_upload_identifier_key(identifier), "$.annotations")
    return data && data.length > 0 ? data[0] : [];
}

export async function key_matches_identifier(identifier: string, key: string): Promise<boolean> {
    const redis = get_redis();
    const sessionkey: any = await redis.json.get(get_upload_identifier_key(identifier), "$.key");

    if(!sessionkey || sessionkey.length == 0) {
        return false;
    }

    return sessionkey[0] === key;
}

interface UploadData {
    identifier: string,
    key: string,
    annotations?: Array<AnnotationDataRow>,
}

export async function store_annotations(uploadIdentifier: string, annotations: Array<AnnotationDataRow>) {
    const redis = get_redis()
    await redis.json.set(get_upload_identifier_key(uploadIdentifier), "$.annotations", JSON.stringify(annotations))
    await redis.expire(get_upload_identifier_key(uploadIdentifier), expiry_time)
}

export async function get_upload_data(uploadidentifier: string): Promise<UploadData | undefined> {
    const redis = get_redis();
    const data: any = await redis.json.get(get_upload_identifier_key(uploadidentifier))

    if (!data) {
        return;
    }

    const uploaddata: UploadData = {
        identifier: uploadidentifier,
        key: data.key,
        annotations: data.annotations
    };

    return uploaddata;
}

const findUnusedIdentifier = async (maxIterations = 10): Promise<string | undefined> => {
    for(var i = 0; i < maxIterations; i++) {
        const identifier = humanId({ addAdverb: false }).toLowerCase();
        const data = await get_upload_data(identifier);

        if (!data) {
            return identifier;
        }
    }

    return;
}

export async function initialise_upload(): Promise<{ identifier: string, accessKey: string } | undefined> {
    const redis = get_redis();

    const accessKey = crypto.randomUUID();
    const identifier = await findUnusedIdentifier();

    if(!identifier) {
        return;
    }

    const res = await redis.json.set(get_upload_identifier_key(identifier), "$", { key: accessKey })

    if(!res) {
        return;
    }
    
    await redis.expire(identifier, expiry_time)

    return { identifier, accessKey };
}

const get_upload_identifier_key = (identifier: string) => "upload_" + identifier;