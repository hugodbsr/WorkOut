// App.tsx
import React, { useRef } from 'react';
import {SafeAreaView, StyleSheet, View, Button, TouchableOpacity, Text} from 'react-native';
import StopwatchTimer, { StopwatchTimerMethods } from 'react-native-animated-stopwatch-timer';
import ChronoButton from "@/app/components/common/ChronoButton";

const App = () => {
    const stopwatchRef = useRef<StopwatchTimerMethods>(null);

    const handlePlay = () => {
        stopwatchRef.current?.play();
    };

    const handlePause = () => {
        const elapsedMs = stopwatchRef.current?.pause();
        console.log('Paused at (ms):', elapsedMs);
    };

    const handleReset = () => {
        stopwatchRef.current?.reset();
    };

    const handleFinish = () => {
        console.log('Timer finished!');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.timerContainer}>
                <StopwatchTimer
                    ref={stopwatchRef}
                    trailingZeros={1}
                    animationDuration={80}
                    animationDelay={0}
                    animationDistance={120}
                    enterAnimationType="slide-in-up"
                    leadingZeros={1}
                    decimalSeparator=","
                    onFinish={handleFinish}
                    containerStyle={styles.timer}
                    digitStyle={styles.digit}
                    separatorStyle={styles.separator}
                    textCharStyle={styles.textChar}
                />
            </View>

            <View style={styles.buttonsContainer}>
                <ChronoButton title="PLAY" onPress={handlePlay} />
                <ChronoButton title="PAUSE" onPress={handlePause} />
                <ChronoButton title="RESET" onPress={handleReset} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    timer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
    },
    digit: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
    },
    separator: {
        fontSize: 48,
        color: '#666',
    },
    textChar: {
        // Optionnel — style pour chaque caractère séparément
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default App;
