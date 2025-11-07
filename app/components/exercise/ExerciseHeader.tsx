import React from 'react';
import { View, Text } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import UnilateralButton from '../common/UnilateralButton';

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
    return (
        <>
            <Image
                source={imageSource}
                style={{
                    width: 140,
                    height: 140,
                    borderWidth: 5,
                    borderRadius: 30,
                    borderColor: '#1e40af',
                    alignSelf: 'center',
                    marginTop: 20,
                }}
            />
            <Text className="text-3xl m-4 font-bold flex-wrap text-center">{name}</Text>
            {isUnilateral && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <UnilateralButton
                        title="Unilatéral"
                        onPress={() => setUnilateral(true)}
                        active={unilateral}
                    />
                    <UnilateralButton
                        title="Bilatéral"
                        onPress={() => setUnilateral(false)}
                        active={!unilateral}
                    />
                </View>
            )}
        </>
    );
});