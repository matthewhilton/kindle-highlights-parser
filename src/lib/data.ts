import { Redis } from "@upstash/redis";

export const expiry_time = import.meta.env.DATA_EXPIRY_TIME_SECONDS || 60 * 5

export function get_redis() {
    return new Redis({
        url: import.meta.env.UPSTASH_URL,
        token: import.meta.env.UPSTASH_TOKEN,
    })
}