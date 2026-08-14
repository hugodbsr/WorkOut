import React from 'react';
import { View, Text } from 'react-native';

export default function BMIGauge({ bmi }: { bmi: number }) {
    // Scale from 15 to 40
    const minScale = 15;
    const maxScale = 40;
    
    // Cap BMI within range for the marker positioning
    const cappedBmi = Math.max(minScale, Math.min(maxScale, bmi));
    const position = ((cappedBmi - minScale) / (maxScale - minScale)) * 100;

    return (
        <View className="mt-4 pb-1 w-full">
            {/* Color Bar */}
            <View className="flex-row h-2.5 rounded-full overflow-hidden w-full bg-gray-200">
                {/* 15 to 18.5 (Width: (18.5-15)/25 = 14%) */}
                <View className="bg-blue-400" style={{ width: '14%' }} />
                {/* 18.5 to 25 (Width: (25-18.5)/25 = 26%) */}
                <View className="bg-green-400" style={{ width: '26%' }} />
                {/* 25 to 30 (Width: (30-25)/25 = 20%) */}
                <View className="bg-orange-400" style={{ width: '20%' }} />
                {/* 30 to 40 (Width: (40-30)/25 = 40%) */}
                <View className="bg-red-400" style={{ width: '40%' }} />
            </View>
            
            {/* Marker */}
            <View className="absolute left-0 right-0 top-0 h-4">
                <View 
                    className="absolute w-1 h-4 bg-gray-800 rounded-full" 
                    style={{ left: `${position}%`, top: -3, marginLeft: -2 }} 
                />
            </View>

            {/* Labels aligned with segment boundaries */}
            <View className="relative w-full h-4 mt-1.5">
                <Text className="absolute text-[9px] text-gray-500 font-medium" style={{ left: '0%' }}>15</Text>
                <Text className="absolute text-[9px] text-gray-500 font-medium" style={{ left: '14%', transform: [{ translateX: -10 }] }}>18.5</Text>
                <Text className="absolute text-[9px] text-gray-500 font-medium" style={{ left: '40%', transform: [{ translateX: -7 }] }}>25</Text>
                <Text className="absolute text-[9px] text-gray-500 font-medium" style={{ left: '60%', transform: [{ translateX: -7 }] }}>30</Text>
                <Text className="absolute text-[9px] text-gray-500 font-medium" style={{ right: '0%' }}>40</Text>
            </View>
        </View>
    );
}
