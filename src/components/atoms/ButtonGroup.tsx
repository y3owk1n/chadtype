"use client";

import { cn } from "@/utils";
import * as React from "react";

interface ButtonGroupProps {
    children: React.ReactNode;
}

function ButtonGroup({ children }: ButtonGroupProps) {
    return (
        <div
            className={cn(
                "flex w-full max-w-fit flex-row flex-wrap",
                "[&>*:first-child]:rounded-none [&>*:first-child]:rounded-l-md",
                "[&>*:last-child]:rounded-none [&>*:last-child]:rounded-r-md",
                "[&>*:not(:first-child):not(:last-child)]:rounded-none",
                "[&>*:only-child]:rounded-md"
            )}
        >
            {children}
        </div>
    );
}

export { ButtonGroup };
