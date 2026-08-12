import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Body, { Slug } from 'react-native-body-highlighter';
import { useUITranslation } from '@/services/useUITranslation';

export type HeatmapData = {
    [slug: string]: number; // Map Slug (e.g. 'chest', 'upper-back') to number of exercises
};

type MuscleHeatmapProps = {
    heatmapData: HeatmapData;
};

export default function MuscleHeatmap({ heatmapData }: MuscleHeatmapProps) {
    const uiFront = useUITranslation('front', 'Face');
    const uiBack = useUITranslation('back', 'Dos');

    const bodyData = useMemo(() => {
        let maxCount = 0;

        // On a directement le compte par Slug
        for (const count of Object.values(heatmapData)) {
            if (count > maxCount) maxCount = count;
        }

        // Convertir en tableau d'objets pour Body
        return Object.entries(heatmapData).map(([slug, exercisesCount]) => {
            let intensity = 1;
            if (maxCount > 0) {
                // Échelle relative: le muscle le plus travaillé est toujours à 4 (max rouge)
                intensity = Math.ceil((exercisesCount / maxCount) * 4);
                if (intensity < 1) intensity = 1;
            }

            return {
                slug: slug as Slug,
                intensity,
            };
        });
    }, [heatmapData]);

    // Couleurs d'intensité (Nuances de rouge plus douces)
    // 1 = clair, 4 = rouge soutenu mais pas fluo
    const colors = ['#fca5a5', '#f87171', '#ef4444', '#dc2626'];

    return (
        <View className="flex-row items-center justify-evenly py-1">
            <View className="items-center">
                <Text className="text-gray-500 font-semibold mb-1 text-sm">{uiFront}</Text>
                <Body
                    data={bodyData}
                    colors={colors}
                    side="front"
                    scale={0.70}
                    defaultFill="#f3f4f6"
                />
            </View>
            <View className="items-center">
                <Text className="text-gray-500 font-semibold mb-1 text-sm">{uiBack}</Text>
                <Body
                    data={bodyData}
                    colors={colors}
                    side="back"
                    scale={0.70}
                    defaultFill="#f3f4f6"
                />
            </View>
        </View>
    );
}
