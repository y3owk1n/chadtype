import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
    type NextFetchEvent,
    type NextRequest,
    NextResponse,
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

export default async function middleware(
    request: NextRequest,
    event: NextFetchEvent
): Promise<Response | undefined> {
    const ip = request.ip ?? "127.0.0.1";

    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
        ip
    );

    return success
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/blocked", request.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|blocked).*)",
    ],
};
