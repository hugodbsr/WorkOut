import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Set } from '@/services/storage';

type HistorySetItemProps = {
    item: Set;
    index: number;
};

// eslint-disable-next-line react/display-name
const HistorySetItem = React.memo(({ item, index }: HistorySetItemProps) => {
    return (
        <View className="p-3" style={styles.view}>
            <Text style={styles.text}>Série n°{index + 1} : </Text>
            <Text style={styles.textValue}>{item.reps}</Text>
            <Text style={styles.text}> X </Text>
            <Text style={styles.textValue}>{item.weight}</Text>
            <Text style={styles.text}> Kg </Text>
            {item.side && item.side !== "both" && (
                <Text style={styles.textSide}>
                    ({item.side === "left" ? "Gauche" : "Droite"})
                </Text>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    view: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    text: {
        fontSize: 20,
    },
    textValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3456AD',
        minWidth: 40,
        textAlign: 'center',
    },
    textSide: {
        fontSize: 18,
        color: 'gray',
        marginLeft: 10,
    },
});

export default HistorySetItem;