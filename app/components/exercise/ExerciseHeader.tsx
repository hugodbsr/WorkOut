import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import UnilateralButton from '../common/UnilateralButton';
import { getUITranslation } from "@/services/translation";

type ExerciseHeaderProps = {
    name?: string;
    imageSource?: ImageSource | string;
    isUnilateral: boolean;
    unilateral: boolean;
    setUnilateral: (value: boolean) => void;
};

// eslint-disable-next-line react/display-name
export const ExerciseHeader: React.FC<ExerciseHeaderProps> = React.memo(({
                                                                             name,
                                                                             imageSource,
                                                                             isUnilateral,
                                                                             unilateral,
                                                                             setUnilateral,
                                                                         }) => {
    const [uiUnilateral, setUiUnilateral] = useState<string>('Unilateral');
    const [uiBilateral, setUiBilateral] = useState<string>('Bilateral');

    useEffect(() => {
        const loadTranslations = async () => {
            const unilateralText = await getUITranslation("unilateral");
            const bilateralText = await getUITranslation("bilateral");

            setUiUnilateral(String(unilateralText));
            setUiBilateral(String(bilateralText));
        };

        loadTranslations();
    }, []);

    // @ts-ignore
    return (
        <View className="mb-6 mt-4">
            <View className="bg-white rounded-[40px] shadow-sm border border-gray-100 self-center p-3">
                <Image
                    source={imageSource}
                    style={{ width: 140, height: 140, borderRadius: 28 }}
                    contentFit="contain"
                />
            </View>
            <Text className="text-3xl m-4 mt-6 font-black text-gray-800 text-center">{name}</Text>
            {isUnilateral && (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <UnilateralButton
                        title={uiUnilateral}
                        onPress={() => setUnilateral(true)}
                        active={unilateral}
                    />
                    <UnilateralButton
                        title={uiBilateral}
                        onPress={() => setUnilateral(false)}
                        active={!unilateral}
                    />
                </View>
            )}
        </View>
    );
});