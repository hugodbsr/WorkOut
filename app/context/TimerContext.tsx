import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimerContextType {
    bannerActive: boolean;
    isRunning: boolean;
    savedTime: number;
    startTime: number | null;
    mode: 'stopwatch' | 'countdown';
    duration: number;
    start: () => Promise<void>;
    pause: () => void;
    toggle: () => Promise<void>;
    reset: () => void;
    setMode: (mode: 'stopwatch' | 'countdown') => Promise<void>;
    formatTime: (ms: number) => string;
    isChronoPage: boolean;
    setIsChronoPage: (val: boolean) => void;
    updateDuration: (newDurationMs: number) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);
const BannerActiveContext = createContext<boolean | undefined>(undefined);

interface TimerProviderProps {
    children: ReactNode;
}

import { Vibration } from 'react-native';
import Constants from 'expo-constants';

let Notifications: any = null;
let Notifee: any = null;
if (Constants.appOwnership !== 'expo') {
    try {
        Notifications = require('expo-notifications');
        Notifee = require('@notifee/react-native').default;
    } catch (e) {}
}

export const TimerProvider = ({ children }: TimerProviderProps) => {
    const [savedTime, setSavedTime] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setModeState] = useState<'stopwatch' | 'countdown'>('stopwatch');
    const [duration, setDuration] = useState(90000);
    const [isChronoPage, setIsChronoPage] = useState(false);

    const bannerActive = isRunning || savedTime > 0;

    const loadSettings = async () => {
        try {
            const m = await AsyncStorage.getItem('timer_mode');
            if (m === 'countdown' || m === 'stopwatch') setModeState(m);
            const d = await AsyncStorage.getItem('default_rest_time');
            if (d) setDuration(parseInt(d, 10) * 1000);
        } catch {}
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const pause = useCallback(() => {
        if (isRunning && startTime !== null) {
            const diff = Date.now() - startTime;
            setSavedTime(prev => prev + diff);
            setStartTime(null);
            setIsRunning(false);
        }
    }, [isRunning, startTime]);

    const formatTimeForNotif = useCallback((ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const min = ("0" + minutes).slice(-2);
        const sec = ("0" + seconds).slice(-2);
        return `${min}:${sec}`;
    }, []);

    // Check if countdown is over and update live notification
    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        let fgServiceStarted = false;

        if (isRunning && mode === 'countdown' && startTime !== null) {
            
            // Start foreground service with initial time
            if (Constants.appOwnership !== 'expo' && Notifee) {
                Notifee.createChannel({
                    id: 'timer',
                    name: 'Chronomètre de repos',
                }).then((channelId: string) => {
                    Notifee.displayNotification({
                        id: 'workout-timer',
                        title: 'Repos en cours ⏱️',
                        body: formatTimeForNotif(Math.max(0, duration - savedTime)),
                        android: {
                            channelId,
                            asForegroundService: true,
                            ongoing: true,
                            onlyAlertOnce: true,
                        },
                    }).catch(() => {});
                    fgServiceStarted = true;
                }).catch(() => {});
            }

            intervalId = setInterval(() => {
                const currentLocalTime = Date.now() - startTime + savedTime;
                const remaining = Math.max(0, duration - currentLocalTime);
                
                // Update notification every second
                if (fgServiceStarted && remaining > 0 && Math.floor(currentLocalTime / 1000) > Math.floor((currentLocalTime - 100) / 1000)) {
                    if (Constants.appOwnership !== 'expo' && Notifee) {
                        Notifee.displayNotification({
                            id: 'workout-timer',
                            title: 'Repos en cours ⏱️',
                            body: formatTimeForNotif(remaining),
                            android: {
                                channelId: 'timer',
                                asForegroundService: true,
                                ongoing: true,
                                onlyAlertOnce: true,
                            },
                        }).catch(() => {});
                    }
                }

                if (currentLocalTime >= duration) {
                    Vibration.vibrate([0, 500, 200, 500, 200, 500]);
                    
                    if (Constants.appOwnership !== 'expo' && Notifee) {
                        Notifee.stopForegroundService().catch(() => {});
                        Notifee.displayNotification({
                            id: 'workout-timer-end',
                            title: "C'est l'heure ! ⏱️",
                            body: "Ton temps de repos est écoulé. C'est reparti !",
                            android: {
                                channelId: 'timer',
                            }
                        }).catch(() => {});
                    }

                    pause(); // Auto-stop
                }
            }, 100);
        } else {
             // Stop foreground service if paused/reset
             if (Constants.appOwnership !== 'expo' && Notifee) {
                 Notifee.stopForegroundService().catch(() => {});
                 Notifee.cancelNotification('workout-timer').catch(() => {});
             }
        }
        
        return () => clearInterval(intervalId);
    }, [isRunning, mode, startTime, savedTime, duration, pause, formatTimeForNotif]);

    const start = useCallback(async () => {
        if (!isRunning) {
            
            // If countdown is already over, reset it before starting
            if (mode === 'countdown' && savedTime >= duration) {
                setSavedTime(0);
            }
            
            setStartTime(Date.now());
            setIsRunning(true);
        }
    }, [isRunning, mode, savedTime, duration]);


    const toggle = useCallback(async () => {
        if (isRunning) {
            pause();
        } else {
            await start();
        }
    }, [isRunning, pause, start]);

    const reset = useCallback(() => {
        setIsRunning(false);
        setSavedTime(0);
        setStartTime(null);
    }, []);

    const setMode = useCallback(async (newMode: 'stopwatch' | 'countdown') => {
        setModeState(newMode);
        try {
            await AsyncStorage.setItem('timer_mode', newMode);
        } catch {}
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

    const updateDuration = useCallback((newDurationMs: number) => {
        setDuration(newDurationMs);
    }, []);

    return (
        <BannerActiveContext.Provider value={bannerActive}>
            <TimerContext.Provider
                value={{
                    bannerActive,
                    isRunning,
                    savedTime,
                    startTime,
                    mode,
                    duration,
                    start,
                    pause,
                    toggle,
                    reset,
                    setMode,
                    formatTime,
                    isChronoPage,
                    setIsChronoPage,
                    updateDuration,
                }}
            >
                {children}
            </TimerContext.Provider>
        </BannerActiveContext.Provider>
    );
};

export const useTimer = (): TimerContextType => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error("useTimer must be used within a TimerProvider");
    }
    return context;
};

export const useBannerActive = (): boolean => {
    const context = useContext(BannerActiveContext);
    if (context === undefined) {
        throw new Error("useBannerActive must be used within a TimerProvider");
    }
    return context;
};
