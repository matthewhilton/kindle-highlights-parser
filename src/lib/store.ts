import type { AnnotationDataRow } from "./data";
import { Redis } from '@upstash/redis'

function get_redis() {
    return new Redis({
        url: import.meta.env.UPSTASH_URL,
        token: import.meta.env.UPSTASH_TOKEN,
    })
}

export async function store_annotations(sessionIdentifier: string, annotations: Array<AnnotationDataRow>) {
    const redis = get_redis()
    const expiryTimeSeconds = import.meta.env.DATA_EXPIRY_TIME_SECONDS || 60 * 5;

    await redis.set(sessionIdentifier, annotations)
    await redis.expire(sessionIdentifier, expiryTimeSeconds)
}

export async function annotations_exist(sessionIdentifier: string): Promise<boolean> {
    const redis = get_redis()
    return await redis.exists(sessionIdentifier) == 1;
}

export async function get_annotations(sessionIdentifier: string): Promise<Array<AnnotationDataRow>> {
    const redis = get_redis();
    return await redis.get(sessionIdentifier) || [];
}

export async function is_key_used(key: string): Promise<boolean> {
    const redis = get_redis();
    return await redis.exists(key) == 1;
}