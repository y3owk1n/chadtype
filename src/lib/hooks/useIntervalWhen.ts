"use client";

import { useEffect, useRef } from "react";

interface UseIntervalWhenOptions {
    ms: number;
    when: boolean;
    startImmediately?: boolean;
}

export function useIntervalWhen(
    cb: () => void,
    { ms, when, startImmediately }: UseIntervalWhenOptions
): () => void {
    const id = useRef<number | null>(null);
    const onTick = useRef(cb);
    const immediatelyCalled = useRef<boolean | null>(
        startImmediately === true ? false : null
    );

    const handleClearInterval = () => {
        if (id.current !== null) {
            window.clearInterval(id.current);
            id.current = null;
        }
        immediatelyCalled.current = false;
    };

    useEffect(() => {
        onTick.current = cb;
    }, [cb]);

    useEffect(() => {
        if (
            when === true &&
            startImmediately === true &&
            immediatelyCalled.current === false
        ) {
            onTick.current();
            immediatelyCalled.current = true;
        }
    }, [startImmediately, when]);

    useEffect(() => {
        if (when === true) {
            id.current = window.setInterval(onTick.current, ms);
            return handleClearInterval;
        }
    }, [ms, when]);

    return handleClearInterval;
}
