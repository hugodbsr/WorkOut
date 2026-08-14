import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import UnilateralButton from '../common/UnilateralButton';
import { getUITranslation } from "@/services/translation";
import { Feather } from '@expo/vector-icons';

type ExerciseHeaderProps = {
    name?: string;
    description?: string;
    imageSource?: ImageSource | string;
    iconName?: string;
    isUnilateral: boolean;
    unilateral: boolean;
    setUnilateral: (value: boolean) => void;
};

// eslint-disable-next-line react/display-name
export const ExerciseHeader: React.FC<ExerciseHeaderProps> = React.memo(({
                                                                             name,
                                                                             description,
                                                                             imageSource,
                                                                             iconName,
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
            <View className="bg-white rounded-[40px] shadow-sm border border-gray-100 self-center p-3 items-center justify-center" style={{ width: 164, height: 164 }}>
                {iconName ? (
                    <Feather name={iconName as any} size={70} color="#3456AD" />
                ) : (
                    <Image
                        source={imageSource}
                        style={{ width: 140, height: 140, borderRadius: 28 }}
                        contentFit="contain"
                    />
                )}
            </View>
            <Text className="text-3xl mx-4 mt-6 font-black text-gray-800 text-center">{name}</Text>
            {description ? (
                <Text className="text-base text-gray-500 text-center mx-6 mt-2 mb-4 leading-relaxed">
                    {description}
                </Text>
            ) : null}
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