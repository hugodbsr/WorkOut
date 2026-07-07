import { Alert, View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { clearAllExerciseHistory, clearUserCreatedExercises } from "@/services/storage";
import { useUITranslation } from "@/services/useUITranslation";

const DataSettings = () => {
    const navigation = useNavigation();

    const uiDataManagement = useUITranslation("data_management", "Data management");
    const uiDangerZone = useUITranslation("danger_zone", "Danger zone");
    const uiClearHistory = useUITranslation("clear_history", "Clear history");
    const uiClearHistoryDesc = useUITranslation("clear_history_desc", "Delete all past history");
    const uiClearHistoryAlertDesc = useUITranslation("clear_history_alert_desc", "Are you sure you want to delete all your session history? This action is irreversible.");
    const uiCancel = useUITranslation("cancel", "Cancel");
    const uiDelete = useUITranslation("delete", "Delete");
    const uiSuccess = useUITranslation("success", "Success");
    const uiHistoryCleared = useUITranslation("history_cleared", "History cleared.");
    const uiClearCustom = useUITranslation("clear_custom", "Clear custom exercises");
    const uiClearCustomDesc = useUITranslation("clear_custom_desc", "Delete added exercises");
    const uiClearCustomAlertDesc = useUITranslation("clear_custom_alert_desc", "Are you sure you want to delete all custom exercises? This action is irreversible.");
    const uiCustomCleared = useUITranslation("custom_cleared", "Custom exercises cleared.");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">{uiDataManagement}</Text>
            ),
            headerStyle: { backgroundColor: '#3456AD' },
            headerTintColor: '#fff',
        });
    }, [navigation, uiDataManagement]);

    const handleClearHistory = () => {
        Alert.alert(
            uiClearHistory,
            uiClearHistoryAlertDesc,
            [
                { text: uiCancel, style: "cancel" },
                {
                    text: uiDelete,
                    style: "destructive",
                    onPress: async () => {
                        await clearAllExerciseHistory();
                        Alert.alert(uiSuccess, uiHistoryCleared);
                    }
                }
            ]
        );
    };

    const handleClearCustomExercises = () => {
        Alert.alert(
            uiClearCustom,
            uiClearCustomAlertDesc,
            [
                { text: uiCancel, style: "cancel" },
                {
                    text: uiDelete,
                    style: "destructive",
                    onPress: async () => {
                        await clearUserCreatedExercises();
                        Alert.alert(uiSuccess, uiCustomCleared);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            <View className="px-4 pt-6">
                <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                    {uiDangerZone}
                </Text>
                <View className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-black/5">
                    
                    <TouchableOpacity 
                        className="flex-row items-center px-4 py-4 border-b border-gray-100"
                        onPress={handleClearHistory}
                        activeOpacity={0.7}
                    >
                        <View className="bg-red-50 p-2 rounded-xl mr-3">
                            <Feather name="trash-2" size={20} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-800">{uiClearHistory}</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">{uiClearHistoryDesc}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#d1d5db" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center px-4 py-4"
                        onPress={handleClearCustomExercises}
                        activeOpacity={0.7}
                    >
                        <View className="bg-red-50 p-2 rounded-xl mr-3">
                            <Feather name="x-square" size={20} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-800">{uiClearCustom}</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">{uiClearCustomDesc}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#d1d5db" />
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default DataSettings;
