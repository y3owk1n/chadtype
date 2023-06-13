"use client";

import { wpmArrAtom } from "@/lib";
import { useAtomValue } from "jotai";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { type AxisOptions, Chart } from "react-charts";

type WpmData = {
    second: number;
    wpm: number;
};

type Series = {
    label: string;
    data: WpmData[];
};

export function TypingChart() {
    const { theme } = useTheme();

    const wpmArr = useAtomValue(wpmArrAtom);

    const primaryAxis = useMemo(
        (): AxisOptions<WpmData> => ({
            getValue: (datum) => datum.second,
        }),
        []
    );

    const secondaryAxes = useMemo(
        (): AxisOptions<WpmData>[] => [
            {
                getValue: (datum) => datum.wpm,
            },
        ],
        []
    );

    const data: Series[] = [
        {
            label: "WPM",
            data: wpmArr.map((wpm, index) => ({
                second: index + 1,
                wpm,
            })),
        },
    ];

    return (
        <div className="h-64 w-full">
            <Chart
                options={{
                    data,
                    primaryAxis,
                    secondaryAxes,
                    dark: theme === "dark",
                }}
            />
        </div>
    );
}
