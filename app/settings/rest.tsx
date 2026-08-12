import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBannerActive, useTimer } from '@/app/context/TimerContext';
import { useUITranslation } from '@/services/useUITranslation';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function RestTimeSettings() {
    const bannerActive = useBannerActive();
    const bannerGap = bannerActive ? 52 : 0;
    
    // On récupère duration et mode de useTimer car on a besoin de les lire/modifier
    const { duration, mode: timerMode, setMode, updateDuration } = useTimer();
    const defaultRestTime = duration / 1000;

    const uiRestDuration = useUITranslation('rest_duration', 'Durée de repos par défaut');
    const uiDefault = useUITranslation('default', 'Défaut');
    const uiDefaultRest = useUITranslation('default_rest', 'Repos par défaut');
    const uiTimerMode = useUITranslation('timer_mode', 'Mode du chronomètre');
    const uiStopwatch = useUITranslation('stopwatch', 'Chronomètre (Croissant)');
    const uiCountdown = useUITranslation('countdown', 'Compte à rebours (Décroissant)');

    const options = [
        { label: '30s', value: 30 },
        { label: '45s', value: 45 },
        { label: '60s', value: 60 },
        { label: '90s', value: 90 },
        { label: '120s', value: 120 },
        { label: '180s', value: 180 },
    ];

    const handleSelectRestTime = async (seconds: number) => {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        try {
            await AsyncStorage.setItem('default_rest_time', seconds.toString());
            updateDuration(seconds * 1000);
        } catch (error) {
            console.error('Error saving rest time:', error);
        }
    };

    const handleSelectTimerMode = async (newMode: 'stopwatch' | 'countdown') => {
        try {
            await setMode(newMode);
        } catch (error) {
            console.error('Error saving timer mode:', error);
        }
    };

    return (
        <>
            <Stack.Screen options={{ 
                headerTitle: () => (
                    <Text className="font-bold text-xl text-white italic">{uiDefaultRest}</Text>
                ),
                headerStyle: { backgroundColor: '#3456AD' },
                headerTintColor: '#fff',
            }} />
            <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
                <View className="px-4" style={{ paddingTop: 15 + bannerGap }}>
                    
                    <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                        {uiTimerMode}
                    </Text>
                    <View className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-black/5 mb-6">
                        <TouchableOpacity 
                            className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100"
                            onPress={() => handleSelectTimerMode('stopwatch')}
                            activeOpacity={0.7}
                        >
                            <Text className="text-base font-semibold text-gray-800">{uiStopwatch}</Text>
                            {timerMode === 'stopwatch' && <Feather name="check" size={20} color="#3456AD" />}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            className="flex-row items-center justify-between px-4 py-4"
                            onPress={() => handleSelectTimerMode('countdown')}
                            activeOpacity={0.7}
                        >
                            <Text className="text-base font-semibold text-gray-800">{uiCountdown}</Text>
                            {timerMode === 'countdown' && <Feather name="check" size={20} color="#3456AD" />}
                        </TouchableOpacity>
                    </View>

                    <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                        {uiRestDuration}
                    </Text>
                    <View className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-black/5">
                        
                        {options.map((option, index) => (
                            <TouchableOpacity 
                                key={option.value}
                                className={`flex-row items-center justify-between px-4 py-4 ${index !== options.length - 1 ? 'border-b border-gray-100' : ''}`}
                                onPress={() => handleSelectRestTime(option.value)}
                                activeOpacity={0.7}
                            >
                                <Text className="text-base font-semibold text-gray-800">
                                    {option.label}
                                    {option.value === 90 && ` (${uiDefault})`}
                                </Text>
                                {/* Since we don't have local state for defaultRestTime, we use duration / 1000 */}
                                {defaultRestTime === option.value && (
                                    <Feather name="check" size={20} color="#3456AD" />
                                )}
                            </TouchableOpacity>
                        ))}

                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}
