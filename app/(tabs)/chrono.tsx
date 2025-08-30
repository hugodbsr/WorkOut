import {StyleSheet, Text, View } from "react-native";
import React from 'react'
import {Image} from "expo-image";

const Chrono = () => {
    return (
        <View>
            <Text className={"text-3xl font-bold color-primary"}>chrono</Text>
            <Image
                source={{ uri: 'https://wger.de/media/exercise-images/86/Bicep-hammer-curl-1.png' }}
                style={{ width: 200, height: 200}}
                contentFit="contain"
            />


        </View>
    )
}
export default Chrono
const styles = StyleSheet.create({})