import React, { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimer } from './context/TimerContext';

const Chrono = () => {
    const navigation = useNavigation();
    const { elapsedTime, isRunning, toggle, reset, formatTime } = useTimer();

    useEffect(() => {
        navigation?.setOptions({
            title: "Chrono",
            headerShown: true,
        });
    }, [navigation]);

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
            <View className="items-center justify-center">
                <Text className="text-5xl font-bold text-primary">
                    {formatTime(elapsedTime)}
                </Text>
            </View>

            <View className="flex-row items-center mt-12">
                <TouchableOpacity
                    onPress={toggle}
                    activeOpacity={0.8}
                    className="w-28 h-28 rounded-full shadow-lg mx-4 items-center justify-center bg-primary"
                >
                    <Feather
                        name={isRunning ? "pause" : "play"}
                        size={45}
                        color="white"
                        style={!isRunning ? { marginLeft: 5 } : {}}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={reset}
                    activeOpacity={0.7}
                    className="w-20 h-20 rounded-full bg-white shadow-md mx-4 items-center justify-center"
                >
                    <Feather name="rotate-cw" size={30} color="#3456AD" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Chrono;

