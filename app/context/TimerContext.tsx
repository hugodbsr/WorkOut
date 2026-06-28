import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
    ReactNode,
} from "react";

interface TimerContextType {
    elapsedTime: number;
    isRunning: boolean;
    start: () => void;
    pause: () => void;
    toggle: () => void;
    reset: () => void;
    formatTime: (ms: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
    children: ReactNode;
}

export const TimerProvider = ({ children }: TimerProviderProps) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isRunning) {
            startTimeRef.current = Date.now() - pausedTimeRef.current;
            interval = setInterval(() => {
                const now = Date.now();
                const diff = now - startTimeRef.current;
                setElapsedTime(diff);
            }, 30);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
        }
    }, [isRunning]);

    const pause = useCallback(() => {
        if (isRunning) {
            pausedTimeRef.current = elapsedTime;
            setIsRunning(false);
        }
    }, [isRunning, elapsedTime]);

    const toggle = useCallback(() => {
        if (isRunning) {
            pausedTimeRef.current = elapsedTime;
        }
        setIsRunning(!isRunning);
    }, [isRunning, elapsedTime]);

    const reset = useCallback(() => {
        setIsRunning(false);
        setElapsedTime(0);
        pausedTimeRef.current = 0;
    }, []);

    const formatTime = useCallback((ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);

        const min = ("0" + minutes).slice(-2);
        const sec = ("0" + seconds).slice(-2);
        const cen = ("0" + centiseconds).slice(-2);

        return `${min}:${sec},${cen}`;
    }, []);

    return (
        <TimerContext.Provider
            value={{
                elapsedTime,
                isRunning,
                start,
                pause,
                toggle,
                reset,
                formatTime,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = (): TimerContextType => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error("useTimer must be used within a TimerProvider");
    }
    return context;
};
