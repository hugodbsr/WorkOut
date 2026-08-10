import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTimer } from "../../context/TimerContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const BannerTimer = () => {
    const { isRunning, savedTime, startTime, toggle, reset, mode, duration, bannerActive, isChronoPage } = useTimer();
    const [localTime, setLocalTime] = useState(savedTime);
    
    const insets = useSafeAreaInsets();

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        if (isRunning && startTime !== null) {
            // Update rapidly for smooth display, without triggering whole-app re-renders
            intervalId = setInterval(() => {
                setLocalTime(Date.now() - startTime + savedTime);
            }, 50);
        } else {
            setLocalTime(savedTime);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, startTime, savedTime]);
    
    // Cacher si pas lancé ou si on est déjà sur la page chrono
    if (!bannerActive || isChronoPage) {
        return null;
    }

    const displayMs = mode === 'countdown' ? Math.max(0, duration - localTime) : localTime;

    const formatCompact = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const min = ("0" + minutes).slice(-2);
        const sec = ("0" + seconds).slice(-2);
        return `${min}:${sec}`;
    };

    // Calcul de la position : en dessous du header si la page en a un
    // Sans useSegments, on assume qu'il y a toujours un header sauf si on veut passer ça en prop (mais la plupart des pages ont un header)
    // On va juste mettre un fallback sécurisé
    const headerHeight = Platform.OS === 'ios' ? 44 : 56;
    const topPosition = insets.top + headerHeight;

    const bannerColor = isRunning ? '#16a34a' : '#f59e0b';
    const isOver = mode === 'countdown' && displayMs === 0;

    return (
        <View 
            className="absolute left-0 right-0 z-50"
            style={{ top: topPosition }} 
            pointerEvents="box-none"
        >
            <TouchableOpacity 
                className="flex-row items-center justify-between w-full py-2 px-4"
                style={{ backgroundColor: isOver ? '#ef4444' : bannerColor }}
                activeOpacity={0.9}
                onPress={() => router.push("/chrono")}
            >
                <View className="flex-row items-center gap-2">
                    <Feather name="clock" size={16} color="white" />
                    <Text className="text-white text-lg font-bold tracking-widest">
                        {formatCompact(displayMs)}
                    </Text>
                </View>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity 
                        onPress={toggle} 
                        className="w-8 h-8 rounded-full bg-white justify-center items-center"
                        activeOpacity={0.8}
                    >
                        <Feather name={isRunning ? "pause" : "play"} size={16} color="#3456AD" style={!isRunning ? { marginLeft: 2 } : {}} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={reset} 
                        className="w-8 h-8 rounded-full bg-white/20 justify-center items-center"
                        activeOpacity={0.8}
                    >
                        <Feather name="rotate-cw" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default BannerTimer;
