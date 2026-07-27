import React, { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimer } from './context/TimerContext';
import { useUITranslation } from '@/services/useUITranslation';

const Chrono = () => {
    const navigation = useNavigation();
    const { elapsedTime, isRunning, toggle, reset, formatTime } = useTimer();

    const uiRunning = useUITranslation('running', 'En cours...');
    const uiPaused = useUITranslation('paused', 'En pause');

    useEffect(() => {
        navigation?.setOptions({
            title: "Chrono",
            headerShown: true,
        });
    }, [navigation]);

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
            {/* Cadran du chronomètre */}
            <View className="items-center justify-center w-72 h-72 rounded-full bg-white shadow-xl border-8 border-blue-50 mb-16 px-4">
                <View className="items-center justify-center w-60 h-60 rounded-full border-2 border-dashed border-[#3456AD] px-2">
                    <Text 
                        className="text-5xl font-black text-[#3456AD] text-center"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {formatTime(elapsedTime)}
                    </Text>
                    <Text className={`font-bold uppercase tracking-widest mt-2 text-xs ${isRunning ? 'text-red-400' : 'text-gray-400'}`}>
                        {isRunning ? uiRunning : uiPaused}
                    </Text>
                </View>
            </View>

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
