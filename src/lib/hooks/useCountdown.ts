import React from "react";

const useEffectEvent = React.experimental_useEffectEvent;

interface UseCountdownProps {
    endTime: number;
    options: UseCountdownOptions;
}

interface UseCountdownOptions {
    interval: number;
    onComplete: () => void;
    onTick: () => void;
}

export function useCountdown({ endTime, options }: UseCountdownProps) {
    const [count, setCount] = React.useState<number>(0);
    const intervalIdRef = React.useRef<number>(0);

    const handleClearInterval = () => {
        window.clearInterval(intervalIdRef.current);
    };

    const onTick = useEffectEvent(() => {
        if (count === 0) {
            handleClearInterval();
            options.onComplete();
        } else {
            setCount(count - 1);
            options.onTick();
        }
    });

    React.useEffect(() => {
        intervalIdRef.current = window.setInterval(() => {
            onTick();
        }, options.interval);

        return () => handleClearInterval();
    }, [options.interval]);

    React.useEffect(() => {
        setCount(Math.round((endTime - Date.now()) / options.interval));
    }, [endTime, options.interval]);

    return count;
}
