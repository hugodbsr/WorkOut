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
        backgroundColor: "#f3f4f6",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "black",
    },
});

export default HistorySectionHeader;