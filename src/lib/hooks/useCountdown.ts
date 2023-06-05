import React from "react";

const useEffectEvent = React.experimental_useEffectEvent;

interface UseCountdownProps {
    duration: number;
    options: UseCountdownOptions;
}

interface UseCountdownOptions {
    interval: number;
    onComplete: () => void;
    onTick: () => void;
}

export function useCountdown({ duration, options }: UseCountdownProps) {
    const [isStart, setIsStart] = React.useState(false);
    const [count, setCount] = React.useState<number>(0);
    const intervalIdRef = React.useRef<number>(0);

    const handleClearInterval = () => {
        window.clearInterval(intervalIdRef.current);
    };

    const onTick = useEffectEvent(() => {
        if (!isStart) return;
        if (count === 1) {
            handleClearInterval();
            options.onComplete();
            setIsStart(false);
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
    }, [options.interval, isStart]);

    React.useEffect(() => {
        setCount(Math.round(duration / options.interval));
    }, [duration, options.interval, isStart]);

    return { count, setIsStart };
}
