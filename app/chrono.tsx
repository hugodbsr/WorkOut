import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "expo-router";
import { Feather } from '@expo/vector-icons';

const App = () => {
  const navigation = useNavigation();
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    navigation?.setOptions({
      title: "Chrono",
    });
  }, [navigation]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      interval = setInterval(() => {
        const now = Date.now();
        const diff = now - startTimeRef.current;
        setElapsedTime(diff);
      }, 30);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = () => {
    if (isRunning) {
      pausedTimeRef.current = elapsedTime;
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    pausedTimeRef.current = 0;
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const min = ("0" + minutes).slice(-2);
    const sec = ("0" + seconds).slice(-2);
    const cen = ("0" + centiseconds).slice(-2);

    return `${min}:${sec},${cen}`;
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
      <View className="items-center justify-center">
        <Text className="text-5xl font-bold text-primary">
          {formatTime(elapsedTime)}
        </Text>
      </View>

      <View className="flex-row items-center mt-12">
        <TouchableOpacity
          onPress={toggleTimer}
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
          onPress={resetTimer}
          activeOpacity={0.7}
          className="w-20 h-20 rounded-full bg-white shadow-md mx-4 items-center justify-center"
        >
          <Feather name="rotate-cw" size={30} color="#3456AD" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;