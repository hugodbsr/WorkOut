import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    ScrollView,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {router, useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExercice, fetchExerciceList, fetchExerciseJson} from "@/services/api";
import {id} from "postcss-selector-parser";
import {addSessionToExercise, deleteSessionOfExercice, getExerciseHistory, Set, getTodayDate} from "@/services/storage";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {Image} from "expo-image";
import RepWeightInput from "@/app/components/RepWeightInput";
import {exerciseImages} from "@/assets/constants/images";
import UnilateralButton from "@/app/components/UnilateralButton";

export default function Details(){
    const{id} = useLocalSearchParams();
    const navigation = useNavigation();
    const query = Array.isArray(id) ? id[0] : id;

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(() => fetchExerciseJson({query: `${id}`}));

    const [oldSeries, setOldSeries] = useState([{reps:'', weight:''}]);

    const [series, setSeries] = useState([{ id: Date.now(), reps: '', weight: '' }]);

    const [unilateral, setUnilateral] = useState(false);

    const handleAddSerieField = () => {
        setSeries([...series, { id: Date.now(), reps: '', weight: '' }]);
    };

    const handleChangeSerie = async (index: number, field: 'reps' | 'weight', value: string) => {
        const updated = [...series];
        updated[index][field] = value;
        setSeries(updated);

        const current = updated[index];
        const isComplete = current.reps !== '' && current.weight !== '';

        if (isComplete) {
            await addSessionToExercise(Number(id), index,{
                reps: parseInt(current.reps, 10),
                weight: parseFloat(current.weight),
            });
        }
    };


    function getExerciseImage(name?: string) {
        if (name && exerciseImages[name as keyof typeof exerciseImages]) {
            return exerciseImages[name as keyof typeof exerciseImages];
        } else {
            return require("../../assets/data/exercises/images/skull_crusher.gif");
        }
    }


    const handleDeleteSerieField = async (index: number) => {
        const updatedSeries = [...series];
        const removed = updatedSeries.splice(index, 1)[0];
        setSeries(updatedSeries);

        const wasComplete = removed.reps !== '' && removed.weight !== '';

        if (wasComplete) {
            try {
                await deleteSessionOfExercice(Number(id), index);
            } catch (e) {
                console.warn("Erreur lors de la suppression du stockage", e);
            }
        }
    };

    useLayoutEffect(() => {
        if(exercice){
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="font-bold text-xl">Série effectué aujourd&#39;hui</Text>
                ),
            });
        }
    }, [navigation, exercice]);

    useEffect(() => {
        const today = getTodayDate();

        const getHistory = async () => {
            const history = await getExerciseHistory(Number(id));
            if (!history || !history.sessions) return;

            const todaySession = history.sessions.find(s => s.date === today);
            const pastSessions = history.sessions
                .filter(s => s.date !== today)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            let currentSeries = todaySession
                ? todaySession.sets.map(set => ({
                    id: Date.now(),
                    reps: set.reps.toString(),
                    weight: set.weight.toString(),
                }))
                : [];

            let previousSeries = pastSessions.length > 0
                ? pastSessions[0].sets.map(set => ({
                    reps: set.reps.toString(),
                    weight: set.weight.toString(),
                }))
                : [];

            while (currentSeries.length < previousSeries.length) {
                currentSeries.push({id: 0, reps: '', weight: '' });
            }

            setOldSeries(previousSeries);
            setSeries(currentSeries);
        };

        getHistory();
    }, [id]);



    if (exerciceLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    const renderRightActions = (index : number) => {
        return(
            <View style={styles.viewDeleteButton}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteSerieField(index)}>
                    <Image source={require("../../assets/images/trash-2-128.png")} style={{
                        width: 25,
                        height: 25,
                    }}/>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <ScrollView className="bg-white" contentContainerStyle={{paddingBottom: 50}}>
                    <Image
                        source={getExerciseImage(exercice?.image)}
                        style={{
                            width: 150,
                            height: 150,
                            borderWidth: 5,
                            borderRadius: 90,
                            borderColor: '#1e40af',
                            alignSelf: "center",
                            marginTop: 20,
                        }}
                    />
                    <Text className="text-3xl m-4 font-bold flex-wrap text-center">{exercice?.name}</Text>
                    {exercice?.unilateral && (
                        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
                            <UnilateralButton
                                title="Unilatéral"
                                onPress={() => setUnilateral(true)}
                                active={unilateral === true}
                            />
                            <UnilateralButton
                                title="Bilatéral"
                                onPress={() => setUnilateral(false)}
                                active={unilateral === false}
                            />
                        </View>
                    )}
                    {series.map((serie, index) => (
                        <Swipeable key={serie.id} renderRightActions={() => renderRightActions(index)}>
                            <View
                                className="p-1 h-13 pl-0 border-l-8 border-blue-800 m-2 ml-0 mr-0"
                                style={[styles.view]}
                            >
                                <Text style={styles.text}>Série n°{index + 1} : </Text>
                                <RepWeightInput
                                    value={serie.reps}
                                    onChangeText={(text: string) => handleChangeSerie(index, 'reps', text)}
                                    placeholder={oldSeries[index]?.reps || '10'}
                                />
                                <Text style={styles.text}> X </Text>
                                <RepWeightInput
                                    value={serie.weight}
                                    onChangeText={(text: string) => handleChangeSerie(index, 'weight', text)}
                                    placeholder={oldSeries[index]?.weight || '30'}
                                />
                                <Text style={styles.text}> Kg </Text>
                            </View>

                        </Swipeable>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerButton}
                    className="bg-primary"
                    onPress={() => router.push(`../chrono`)}>
                    <Text className="color-white text-2xl">Chrono</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.footerButton}
                    className="bg-primary"
                    onPress={() => router.push(`/exerciceRecord/${query}`)}>
                    <Text className="color-white text-2xl">Records</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.addButton}
                className="bg-primary"
                onPress={handleAddSerieField}>
                <Text className="color-white text-6xl">+</Text>
            </TouchableOpacity>
        </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 0,
        paddingBottom: 45,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    footerButton: {
        flex: 1,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    addButton: {
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: [{ translateX: -50 }],
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        fontSize: 23,
        fontWeight: 400,
    },
    view: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        justifyContent: "center",
    },
    viewDeleteButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        justifyContent: "center",
        marginRight: 12,
    },
    deleteButton: {
        backgroundColor: "firebrick",
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
