"use client";

import { type RefObject, useEffect, Dispatch, SetStateAction } from "react";

export function useInputFocus<T extends HTMLElement>({
    setFocusCb,
    setBlurCb,
    elementRef,
}: {
    setFocusCb: () => void;
    setBlurCb: () => void;
    elementRef: T | null;
}) {
    useEffect(() => {
        const handleFocus = () => {
            // Element has gained focus
            setFocusCb();
        };

        const handleBlur = () => {
            // Element has lost focus
            setBlurCb();
        };

        const element = elementRef;

        if (element) {
            element.addEventListener("focus", handleFocus);
            element.addEventListener("blur", handleBlur);
        }

        return () => {
            if (element) {
                element.removeEventListener("focus", handleFocus);
                element.removeEventListener("blur", handleBlur);
            }
        };
    }, [elementRef, setBlurCb, setFocusCb]);
}
