"use client";

import { arrayToKvObject } from "@/utils";
import { type Route } from "next";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useMemo, useCallback, type DependencyList } from "react";

/**
 * Custom hook to manage query strings
 * @param {DependencyList} deps - Dependency list
 * @returns {Object} - An object containing the redirectWithQs and params functions
 */
export function useQueryString(deps?: DependencyList): {
    redirectWithQs: (kvArray: { key: string; value: string }[]) => void;
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
        [deps] ?? []
    );

    const redirectWithQs = useCallback(
        (kvArray: { key: string; value: string }[]) => {
            router.push(createQueryStringWithUrl(kvArray));
        },
        deps ?? []
    );

    return { redirectWithQs, params };
}
