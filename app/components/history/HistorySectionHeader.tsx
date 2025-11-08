import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type HistorySectionHeaderProps = {
    title: string;
};

// eslint-disable-next-line react/display-name
const HistorySectionHeader = React.memo(({ title }: HistorySectionHeaderProps) => {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.dateText}>{title}</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: "#3456AD",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    dateText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "white",
    },
});

export default HistorySectionHeader;