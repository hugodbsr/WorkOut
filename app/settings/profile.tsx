import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayDate, addWeightEntry } from "@/services/storage";
import { useUITranslation } from "@/services/useUITranslation";
import { useBannerActive } from "@/app/context/TimerContext";

const SettingsProfile = () => {
    const navigation = useNavigation();
    const bannerActive = useBannerActive();
    const bannerGap = bannerActive ? 52 : 0;

    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [targetWeight, setTargetWeight] = useState('');
    const [mainGoal, setMainGoal] = useState('');

    const uiProfile = useUITranslation("profile", "Profil");
    const uiName = useUITranslation("name", "Nom");
    const uiWeight = useUITranslation("weight", "Poids (kg)");
    const uiHeight = useUITranslation("height", "Taille (cm)");
    const uiSave = useUITranslation("save", "Sauvegarder");
    const uiTargetWeight = useUITranslation("target_weight", "Poids Cible (kg)");
    const uiMainGoal = useUITranslation("main_goal", "Objectif Principal");
    const uiGoalWeightLoss = useUITranslation("goal_weight_loss", "Perte de poids");
    const uiGoalMuscleGain = useUITranslation("goal_muscle_gain", "Prise de masse");
    const uiGoalStrength = useUITranslation("goal_strength", "Force");
    const uiGoalMaintenance = useUITranslation("goal_maintenance", "Maintien");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const savedName = await AsyncStorage.getItem('user_name');
                const savedWeight = await AsyncStorage.getItem('user_weight');
                const savedHeight = await AsyncStorage.getItem('user_height');
                const savedTargetWeight = await AsyncStorage.getItem('user_target_weight');
                const savedMainGoal = await AsyncStorage.getItem('user_main_goal');
                
                if (savedName) setName(savedName);
                if (savedWeight) setWeight(savedWeight);
                if (savedHeight) setHeight(savedHeight);
                if (savedTargetWeight) setTargetWeight(savedTargetWeight);
                if (savedMainGoal) setMainGoal(savedMainGoal);
            } catch (e) {
                console.error("Erreur lors du chargement du profil", e);
            }
        };
        loadProfile();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">{uiProfile}</Text>
            ),
            headerStyle: {
                backgroundColor: '#3456AD',
            },
            headerTintColor: '#fff',
        });
    }, [navigation, uiProfile]);

    const handleSave = async () => {
        try {
            await AsyncStorage.setItem('user_name', name);
            if (weight) {
                await AsyncStorage.setItem('user_weight', weight);
                await addWeightEntry(parseFloat(weight), getTodayDate());
            }
            if (height) {
                await AsyncStorage.setItem('user_height', height);
            }
            if (targetWeight) {
                await AsyncStorage.setItem('user_target_weight', targetWeight);
            } else {
                await AsyncStorage.removeItem('user_target_weight');
            }
            if (mainGoal) {
                await AsyncStorage.setItem('user_main_goal', mainGoal);
            }
            navigation.goBack();
        } catch (e) {
            console.error("Erreur lors de la sauvegarde du profil", e);
        }
    };


    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingTop: 15 + bannerGap, paddingBottom: 40 }}>
                
                <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                    {uiProfile}
                </Text>
                
                <View className="bg-white rounded-2xl overflow-hidden mb-8 shadow-sm shadow-black/5 p-4">
                    
                    <Text className="text-sm font-semibold text-gray-700 mb-2">{uiName}</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 text-base text-gray-800"
                        value={name}
                        onChangeText={setName}
                        placeholder={uiName}
                        placeholderTextColor="#9ca3af"
                    />

                    <Text className="text-sm font-semibold text-gray-700 mb-2">{uiWeight}</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 text-base text-gray-800"
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="75"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                    />

                    <Text className="text-sm font-semibold text-gray-700 mb-2">{uiHeight}</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 text-base text-gray-800"
                        value={height}
                        onChangeText={setHeight}
                        placeholder="180"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                    />

                    <Text className="text-sm font-semibold text-gray-700 mb-2">{uiTargetWeight}</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-2 text-base text-gray-800"
                        value={targetWeight}
                        onChangeText={setTargetWeight}
                        placeholder="70"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                    />

                </View>



                <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                    {uiMainGoal}
                </Text>
                
                <View className="bg-white rounded-2xl overflow-hidden mb-8 shadow-sm shadow-black/5 p-3 flex-row flex-wrap justify-between">
                    {[
                        { id: 'weight_loss', label: uiGoalWeightLoss },
                        { id: 'muscle_gain', label: uiGoalMuscleGain },
                        { id: 'strength', label: uiGoalStrength },
                        { id: 'maintenance', label: uiGoalMaintenance }
                    ].map(goal => (
                        <TouchableOpacity
                            key={goal.id}
                            onPress={() => setMainGoal(goal.id)}
                            className={`w-[48%] py-3 mb-2 rounded-xl items-center border ${mainGoal === goal.id ? 'bg-[#3456AD] border-[#3456AD]' : 'bg-gray-50 border-gray-200'}`}
                            activeOpacity={0.7}
                        >
                            <Text className={`font-semibold text-sm text-center ${mainGoal === goal.id ? 'text-white' : 'text-gray-700'}`}>
                                {goal.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity 
                    className="bg-[#3456AD] rounded-xl py-4 items-center shadow-sm"
                    onPress={handleSave}
                >
                    <Text className="text-white font-bold text-base">{uiSave}</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsProfile;
