import type { AnnotationDataRow } from "./data";
import { Redis } from '@upstash/redis'

export async function store_annotations(sessionIdentifier: string, annotations: Array<AnnotationDataRow>) {
    const redis = new Redis({
        url: import.meta.env.UPSTASH_URL,
        token: import.meta.env.UPSTASH_TOKEN,
    })
    
    const expiryTimeSeconds = import.meta.env.DATA_EXPIRY_TIME_SECONDS || 60 * 5;

    await redis.set(sessionIdentifier, annotations)
    await redis.expire(sessionIdentifier, expiryTimeSeconds)
}