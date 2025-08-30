import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useLayoutEffect, useMemo, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {useLocalSearchParams, useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExerciseTypeJson, fetchMuscleJson, fetchMuscleJsonList} from "@/services/api";
import {Dropdown, MultiSelect} from "react-native-element-dropdown";

export default function Details() {
    const navigation = useNavigation();

    const router = useRouter();

    const {id} = useLocalSearchParams();
    const query = Array.isArray(id) ? id[0] : id;

    const {
        data: type,
        loading: typeLoading,
        error: typeError,
    } = useFetch(() => fetchExerciseTypeJson());

    const {
        data: muscle,
        loading: muscleLoading,
        error: muscleError,
    } = useFetch(() => fetchMuscleJsonList());

    const [selectedMuscle, setSelectedMuscle] = useState([query || ""]);

    const [selectedType, setSelectedType] = useState([]);

    const renderItem = (item: {
        label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
    }) => {
        return (
            <View>
                <Text>{item.label}</Text>
            </View>
        );
    };

    const formattedDataMuscle = useMemo(() => {
        if (!muscle) return [];
        return muscle.map(item => ({
            id: item.id.toString(),
            name: item.name
        }));
    }, [muscle]);

    const formattedDataType = useMemo(() => {
        if (!type) return [];
        return type.map(item => ({
            id: item.id.toString(),
            name: item.name
        }));
    }, [type]);

    useLayoutEffect(() => {
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="text-xl">Ajouter un exercice</Text>
                ),
            });
    }, [navigation]);

    return(
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.text}>Exercise&#39;s name</Text>
                <TextInput style={styles.textInput}
                    keyboardType="default"
                />
                <Text style={styles.text}>Exercise&#39;s description</Text>
                <TextInput style={styles.textInput}
                           keyboardType="default"
                           multiline={true}
                           numberOfLines={4}
                           textAlignVertical="top"
                />
                <Text style={styles.text}>Muscle Used</Text>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={formattedDataMuscle}
                    labelField="name"
                    valueField="id"
                    searchPlaceholder="Search..."
                    value={selectedMuscle[0]}
                    onChange={item => setSelectedMuscle([item.id])}
                />
                <Text style={styles.text}>Exercise&#39;s type</Text>
                <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={formattedDataType}
                    labelField="name"
                    valueField="id"
                    value={selectedType}
                    searchPlaceholder="Search..."
                    onChange={item => {
                        // @ts-ignore
                        setSelected(item);
                    }}
                    />
                <TouchableOpacity className="items-center bg-primary rounded-xl p-3 w-11/12 ml-auto mr-auto mt-auto mb-20">
                    <Text className="color-white text-2xl">Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        marginTop: 20,
        marginLeft: 20,
        paddingHorizontal: 16,
        flexDirection: "column",
        gap: "3px",
    },

    text: {
        fontSize: 20,
        fontWeight: 400,
    },

    textInput: {
        borderStyle: "solid",
        borderWidth: 4,
        borderRadius: 5,
        width: "91.666667%",
        borderColor: "blue",
        padding: 2,
        fontSize: 22,
        textAlign: "left",
        marginBottom: 10,
    },

    addButton: {
        position: 'absolute',
        bottom: 75,
        right: 20,
        width: 80,
        height: 80,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    dropdown: {
        height: 50,
        width: "91.666667%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "white",
    },
    placeholderStyle: {
        fontSize: 16,
        color: "#999",
    },
    selectedTextStyle: {
        fontSize: 16,
        color: "#000",
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: "#000",
    },
});