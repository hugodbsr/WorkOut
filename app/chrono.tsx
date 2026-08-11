import React, { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import * as Haptics from 'expo-haptics';
import { useNavigation } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useTimer } from './context/TimerContext';
import { useUITranslation } from '@/services/useUITranslation';

const Chrono = () => {
    const { isRunning, savedTime, startTime, toggle, reset, formatTime, mode, duration, setMode, setIsChronoPage, updateDuration } = useTimer();
    const [localTime, setLocalTime] = useState(savedTime);
    const [dragStartDuration, setDragStartDuration] = useState<number | null>(null);
    const lastHapticDuration = useRef<number | null>(null);

    const uiRunning = useUITranslation('running', 'En cours...');
    const uiPaused = useUITranslation('paused', 'En pause');
    const uiReady = useUITranslation('ready', 'À démarrer');

    useEffect(() => {
        setIsChronoPage(true);
        return () => setIsChronoPage(false);
    }, [setIsChronoPage]);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        if (isRunning && startTime !== null) {
            intervalId = setInterval(() => {
                setLocalTime(Date.now() - startTime + savedTime);
            }, 30);
        } else {
            setLocalTime(savedTime);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, startTime, savedTime]);

    const displayMs = mode === 'countdown' ? Math.max(0, duration - localTime) : localTime;
    const isOver = mode === 'countdown' && displayMs === 0;
    const isPristine = !isRunning && savedTime === 0;

    const onPanGestureEvent = (event: any) => {
        if (mode !== 'countdown' || dragStartDuration === null || !isPristine) return;
        
        const dy = event.nativeEvent.translationY;
        const deltaMs = Math.round(-dy / 15) * 5000; 
        const newDuration = Math.max(5000, dragStartDuration + deltaMs);
        
        if (lastHapticDuration.current !== newDuration) {
            Haptics.selectionAsync();
            lastHapticDuration.current = newDuration;
            updateDuration(newDuration);
        }
    };

    const onPanStateChange = (event: any) => {
        if (mode !== 'countdown' || !isPristine) return;
        if (event.nativeEvent.state === State.BEGAN) {
            setDragStartDuration(duration);
            lastHapticDuration.current = duration;
        } else if (
            event.nativeEvent.state === State.END ||
            event.nativeEvent.state === State.CANCELLED ||
            event.nativeEvent.state === State.FAILED
        ) {
            setDragStartDuration(null);
            lastHapticDuration.current = null;
        }
    };

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
            {/* Cadran du chronomètre */}
            <PanGestureHandler
                onGestureEvent={onPanGestureEvent}
                onHandlerStateChange={onPanStateChange}
            >
                <View className={`items-center justify-center w-72 h-72 rounded-full shadow-xl border-8 mb-16 px-4 ${isOver ? 'bg-red-50 border-red-100' : 'bg-white border-blue-50'}`}>
                    <View className={`items-center justify-center w-60 h-60 rounded-full border-2 border-dashed px-2 ${isOver ? 'border-red-400' : 'border-[#3456AD]'}`}>
                        {mode === 'countdown' && isPristine && (
                            <Feather name="chevron-up" size={32} color="#3456AD" style={{ opacity: 0.3, marginBottom: 2 }} />
                        )}
                        <Text 
                            className={`text-5xl font-black text-center ${isOver ? 'text-red-500' : 'text-[#3456AD]'}`}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {formatTime(displayMs)}
                        </Text>
                        {mode === 'countdown' && isPristine && (
                            <Feather name="chevron-down" size={32} color="#3456AD" style={{ opacity: 0.3, marginTop: 2 }} />
                        )}
                        <Text className={`font-bold uppercase tracking-widest mt-2 text-xs ${isRunning ? (isOver ? 'text-red-600' : 'text-red-400') : 'text-gray-400'}`}>
                            {isRunning ? uiRunning : (isPristine ? uiReady : uiPaused)}
                        </Text>
                    </View>
                </View>
            </PanGestureHandler>

            {/* Boutons d'action */}
            <View className="flex-row items-center justify-center gap-10">
                {/* Reset button (secondary) */}
                <TouchableOpacity
                    onPress={reset}
                    activeOpacity={0.7}
                    className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-200 items-center justify-center"
                >
                    <Feather name="rotate-cw" size={24} color="#6b7280" />
                </TouchableOpacity>

                {/* Play/Pause button (primary) */}
                <TouchableOpacity
                    onPress={toggle}
                    activeOpacity={0.8}
                    className={`w-24 h-24 rounded-full shadow-lg items-center justify-center ${isRunning ? 'bg-red-500' : 'bg-[#3456AD]'}`}
                >
                    <Feather
                        name={isRunning ? "pause" : "play"}
                        size={36}
                        color="white"
                        style={!isRunning ? { marginLeft: 6 } : {}}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Chrono;
