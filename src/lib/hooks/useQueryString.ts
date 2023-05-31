"use client";

import { arrayToKvObject } from "@/utils";
import { type Route } from "next";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";

/**
 * Custom hook to manage query strings
 * @returns {Object} - An object containing the redirectWithQs and params functions
 */
export function useQueryString({ callback }: { callback?: () => void }): {
    redirectWithQs: (kvArray: { key: string; value: string }[]) => void;
    createQueryStringWithUrl: (
        kvArray: { key: string; value: string }[]
    ) => string;
    params: URLSearchParams;
} {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const params = useMemo(
        () => new URLSearchParams(searchParams as unknown as URLSearchParams),
        [searchParams]
    );

    const createQueryString = useCallback(
        (queryParams: Record<string, string>) => {
            // Iterate through each key-value pair in the queryParams object
            Object.entries(queryParams).forEach(([key, value]) => {
                if (params.has(key)) {
                    // Update the value of an existing query string
                    params.set(key, value);
                } else {
                    // Append a new key-value pair to the query string
                    params.append(key, value);
                }
            });

            // Create the updated URL with the modified query string
            return params.toString();
        },
        [params]
    );

    const createQueryStringWithUrl = useCallback(
        (kvArray: { key: string; value: string }[]) => {
            const href = (pathname +
                "?" +
                createQueryString(arrayToKvObject(kvArray))) as Route;
            return href;
        },
        [createQueryString, pathname]
    );

    const redirectWithQs = useCallback(
        (kvArray: { key: string; value: string }[]) => {
            callback && callback();
            router.push(createQueryStringWithUrl(kvArray));
        },
        [callback, createQueryStringWithUrl, router]
    );

    return { redirectWithQs, createQueryStringWithUrl, params };
}
