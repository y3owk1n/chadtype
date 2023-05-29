"use client";

import { useCallback, useEffect, useState } from "react";

export function useKeyPress(callback: (key: string) => void): string | null {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState<string | null>(null);

    // If pressed key is our target key then set to true
    const downHandler = useCallback(
        ({ key }: { key: string }) => {
            if (keyPressed !== key && key.length === 1) {
                setKeyPressed(key);
                callback && callback(key);
            }
        },
        [callback, keyPressed]
    );

    // If released key is our target key then set to false
    const upHandler = useCallback(() => {
        setKeyPressed(null);
    }, []);

    // Add event listeners
    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [downHandler, upHandler]); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}
