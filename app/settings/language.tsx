import { Alert, View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { getLanguageCode, setLanguageCode } from "@/services/translation";
import { useUITranslation } from "@/services/useUITranslation";

const LanguageSettings = () => {
    const navigation = useNavigation();
    const [currentLanguage, setCurrentLanguage] = useState('en');

    const uiLanguage = useUITranslation("language", "Language");
    const uiSelectLanguage = useUITranslation("select_language", "Select a language");

    useEffect(() => {
        setCurrentLanguage(getLanguageCode());
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">{uiLanguage}</Text>
            ),
            headerStyle: { backgroundColor: '#3456AD' },
            headerTintColor: '#fff',
        });
    }, [navigation, uiLanguage]);

    const handleSelectLanguage = async (code: string) => {
        if (currentLanguage === code) return;
        await setLanguageCode(code);
        setCurrentLanguage(code);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            <View className="px-4 pt-6">
                <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                    {uiSelectLanguage}
                </Text>
                <View className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-black/5">
                    
                    <TouchableOpacity 
                        className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100"
                        onPress={() => handleSelectLanguage('fr')}
                        activeOpacity={0.7}
                    >
                        <Text className="text-base font-semibold text-gray-800">Français</Text>
                        {currentLanguage === 'fr' && (
                            <Feather name="check" size={20} color="#3456AD" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center justify-between px-4 py-4"
                        onPress={() => handleSelectLanguage('en')}
                        activeOpacity={0.7}
                    >
                        <Text className="text-base font-semibold text-gray-800">English</Text>
                        {currentLanguage === 'en' && (
                            <Feather name="check" size={20} color="#3456AD" />
                        )}
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default LanguageSettings;
