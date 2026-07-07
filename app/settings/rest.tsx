import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "expo-router";
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUITranslation } from "@/services/useUITranslation";

const RestTimeSettings = () => {
    const navigation = useNavigation();
    const [defaultRestTime, setDefaultRestTime] = useState(90);

    const uiDefaultRest = useUITranslation("default_rest", "Default rest time");
    const uiRestDuration = useUITranslation("rest_duration", "Rest duration");
    const uiDefault = useUITranslation("default", "Default");

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const restTime = await AsyncStorage.getItem('default_rest_time');
                if (restTime) setDefaultRestTime(parseInt(restTime, 10));
            } catch {}
        };
        loadSettings();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">{uiDefaultRest}</Text>
            ),
            headerStyle: { backgroundColor: '#3456AD' },
            headerTintColor: '#fff',
        });
    }, [navigation, uiDefaultRest]);

    const handleSelectRestTime = async (seconds: number) => {
        setDefaultRestTime(seconds);
        try {
            await AsyncStorage.setItem('default_rest_time', seconds.toString());
        } catch {}
    };

    const options = [
        { label: "1 minute", value: 60 },
        { label: "1 min 30", value: 90 },
        { label: "2 minutes", value: 120 },
        { label: "2 min 30", value: 150 },
        { label: "3 minutes", value: 180 },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            <View className="px-4 pt-6">
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
                            {defaultRestTime === option.value && (
                                <Feather name="check" size={20} color="#3456AD" />
                            )}
                        </TouchableOpacity>
                    ))}

                </View>
            </View>
        </SafeAreaView>
    );
};

export default RestTimeSettings;
