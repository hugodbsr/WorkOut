import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTimer } from "../../context/TimerContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FloatingTimer = () => {
    const { elapsedTime, isRunning, toggle, reset, formatTime } = useTimer();
    const [isExpanded, setIsExpanded] = useState(false);

    const expandAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(expandAnim, {
            toValue: isExpanded ? 1 : 0,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
        }).start();
    }, [isExpanded]);

    const handlePress = () => {
        // Petit effet de scale au tap
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        setIsExpanded(!isExpanded);
    };

    const handleToggle = () => {
        toggle();
    };

    const handleReset = () => {
        reset();
        setIsExpanded(false);
    };

    // Animations pour les boutons du menu
    const menuTranslateY = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -70],
    });

    const menuOpacity = expandAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const resetTranslateY = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -140],
    });

    // Format compact pour le bouton (minutes:secondes)
    const formatCompact = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const min = ("0" + minutes).slice(-2);
        const sec = ("0" + seconds).slice(-2);
        return `${min}:${sec}`;
    };

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Bouton Reset */}
            <Animated.View
                style={[
                    styles.menuButton,
                    {
                        transform: [{ translateY: resetTranslateY }],
                        opacity: menuOpacity,
                    },
                ]}
                pointerEvents={isExpanded ? "auto" : "none"}
            >
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleReset}
                    activeOpacity={0.8}
                >
                    <Feather name="rotate-cw" size={22} color="#3456AD" />
                </TouchableOpacity>
            </Animated.View>

            {/* Bouton Play/Pause */}
            <Animated.View
                style={[
                    styles.menuButton,
                    {
                        transform: [{ translateY: menuTranslateY }],
                        opacity: menuOpacity,
                    },
                ]}
                pointerEvents={isExpanded ? "auto" : "none"}
            >
                <TouchableOpacity
                    style={[styles.secondaryButton, styles.playButton]}
                    onPress={handleToggle}
                    activeOpacity={0.8}
                >
                    <Feather
                        name={isRunning ? "pause" : "play"}
                        size={22}
                        color="white"
                        style={!isRunning ? { marginLeft: 2 } : {}}
                    />
                </TouchableOpacity>
            </Animated.View>

            {/* Bouton Principal (FAB) */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    style={[
                        styles.fab,
                        isRunning && styles.fabRunning,
                        isExpanded && styles.fabExpanded,
                    ]}
                    onPress={handlePress}
                    activeOpacity={0.9}
                >
                    <Text
                        style={[styles.timerText, isRunning && styles.timerTextRunning]}
                    >
                        {formatCompact(elapsedTime)}
                    </Text>
                    <Feather
                        name={isExpanded ? "x" : "clock"}
                        size={14}
                        color={isRunning ? "white" : "#3456AD"}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 100,
        right: 20,
        alignItems: "center",
    },
    fab: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 2,
        borderColor: "#3456AD",
    },
    fabRunning: {
        backgroundColor: "#3456AD",
        borderColor: "#3456AD",
    },
    fabExpanded: {
        borderColor: "#667eea",
    },
    timerText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#3456AD",
    },
    timerTextRunning: {
        color: "white",
    },
    icon: {
        marginTop: 2,
    },
    menuButton: {
        position: "absolute",
        bottom: 0,
    },
    secondaryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    playButton: {
        backgroundColor: "#3456AD",
        borderColor: "#3456AD",
    },
});

export default FloatingTimer;
