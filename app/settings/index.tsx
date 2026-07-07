import { ScrollView, Text, TouchableOpacity, View, Linking } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { getLanguageCode } from "@/services/translation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUITranslation } from "@/services/useUITranslation";

const SettingsIndex = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [defaultRestTime, setDefaultRestTime] = useState(90);

    const uiSettings = useUITranslation("settings", "Settings");
    const uiPreferences = useUITranslation("preferences", "Preferences");
    const uiLanguage = useUITranslation("language", "Language");
    const uiDefaultRest = useUITranslation("default_rest", "Default rest time");
    const uiAdvanced = useUITranslation("advanced", "Advanced");
    const uiDataManagement = useUITranslation("data_management", "Data management");
    const uiClearHistoryDesc = useUITranslation("clear_history_desc", "Delete all past history");
    const uiSupport = useUITranslation("support", "Support");
    const uiContactUs = useUITranslation("contact_us", "Contact us");
    const uiContactDesc = useUITranslation("contact_desc", "Send an email to support");
    const uiAppVersion = useUITranslation("app_version", "App version");

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setCurrentLanguage(getLanguageCode());
            loadSettings();
        });
        setCurrentLanguage(getLanguageCode());
        loadSettings();
        
        return unsubscribe;
    }, [navigation]);

    const loadSettings = async () => {
        try {
            const restTime = await AsyncStorage.getItem('default_rest_time');
            if (restTime) setDefaultRestTime(parseInt(restTime, 10));
        } catch {}
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">{uiSettings}</Text>
            ),
            headerStyle: {
                backgroundColor: '#3456AD',
            },
            headerTintColor: '#fff',
        });
    }, [navigation, uiSettings]);

    const formatRestTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        if (s === 0) return `${m} min`;
        return `${m} min ${s}`;
    };

    const handleContactSupport = () => {
        Linking.openURL('mailto:contact@workout.com?subject=Support WorkOut App');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            <ScrollView className="flex-1 px-4 pt-6">

                {/* Section Préférences */}
                <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                    {uiPreferences}
                </Text>
                <View className="bg-white rounded-2xl overflow-hidden mb-8 shadow-sm shadow-black/5">
                    
                    <TouchableOpacity 
                        className="flex-row items-center px-4 py-4 border-b border-gray-100"
                        onPress={() => router.push('/settings/language')}
                        activeOpacity={0.7}
                    >
                        <View className="bg-blue-50 p-2 rounded-xl mr-3">
                            <Feather name="globe" size={20} color="#3456AD" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-800">{uiLanguage}</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">
                                {currentLanguage === 'fr' ? 'Français' : 'English'}
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#d1d5db" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center px-4 py-4 border-b border-gray-100"
                        onPress={() => router.push('/settings/rest')}
                        activeOpacity={0.7}
                    >
                        <View className="bg-blue-50 p-2 rounded-xl mr-3">
                            <Feather name="clock" size={20} color="#3456AD" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-800">{uiDefaultRest}</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">{formatRestTime(defaultRestTime)}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#d1d5db" />
                    </TouchableOpacity>

                </View>

                {/* Section Gestion des données */}
                <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                    {uiAdvanced}
                </Text>
                <View className="bg-white rounded-2xl overflow-hidden mb-8 shadow-sm shadow-black/5">
                    
                    <TouchableOpacity 
                        className="flex-row items-center px-4 py-4 border-b border-gray-100"
                        onPress={() => router.push('/settings/data')}
                        activeOpacity={0.7}
                    >
                        <View className="bg-gray-100 p-2 rounded-xl mr-3">
                            <Feather name="database" size={20} color="#6b7280" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-800">{uiDataManagement}</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">{uiClearHistoryDesc}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#d1d5db" />
                    </TouchableOpacity>

                </View>

                {/* Section Support et À propos */}
                <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                    {uiSupport}
                </Text>
                <View className="bg-white rounded-2xl overflow-hidden mb-8 shadow-sm shadow-black/5">
                    
                    <TouchableOpacity 
                        className="flex-row items-center px-4 py-4 border-b border-gray-100"
                        onPress={handleContactSupport}
                        activeOpacity={0.7}
                    >
                        <View className="bg-green-50 p-2 rounded-xl mr-3">
                            <Feather name="mail" size={20} color="#16a34a" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-800">{uiContactUs}</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">{uiContactDesc}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#d1d5db" />
                    </TouchableOpacity>

                    <View className="flex-row items-center justify-between px-4 py-4">
                        <View className="flex-row items-center">
                            <View className="bg-gray-50 p-2 rounded-xl mr-3">
                                <Feather name="info" size={20} color="#6b7280" />
                            </View>
                            <Text className="text-base font-semibold text-gray-800">{uiAppVersion}</Text>
                        </View>
                        <Text className="text-base text-gray-400 font-medium">1.0.0</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default SettingsIndex;