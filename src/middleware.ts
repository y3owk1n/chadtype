import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
    type NextFetchEvent,
    type NextRequest,
    NextResponse,
    userAgent,
} from "next/server";

import { env } from "./env.mjs";

const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "20 s"),
});

const blockedUAs = [
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
];

export default async function middleware(
    request: NextRequest,
    event: NextFetchEvent
): Promise<Response | undefined> {
    const ip = request.ip ?? "127.0.0.1";

    const { ua } = userAgent(request);
    if (blockedUAs.includes(ua)) {
        return NextResponse.redirect(new URL("/blocked", request.url));
    }
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
        ip
    );

    return success
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/blocked", request.url));
}

export const config = {
    matcher: "/",
};
