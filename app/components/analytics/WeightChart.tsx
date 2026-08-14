import React, { useState } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Text as SvgText, Line, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { WeightEntry } from '@/services/storage';

export default function WeightChart({ data, targetWeight }: { data: WeightEntry[], targetWeight?: number }) {
    const [layout, setLayout] = useState({ width: 0, height: 0 });

    if (!data || data.length === 0) return null;


    const paddingX = 20;
    const paddingTop = 30;
    const paddingBottom = 20;

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
    };

    const { width, height } = layout;

    if (width === 0 || height === 0) {
        return <View className="h-48 w-full mt-2" onLayout={onLayout} />;
    }

    const weights = data.map(d => d.weight);
    const allWeights = targetWeight !== undefined ? [...weights, targetWeight] : weights;
    
    const maxWeight = Math.max(...allWeights);
    const minWeight = Math.min(...allWeights);
    const range = maxWeight - minWeight === 0 ? 1 : maxWeight - minWeight;

    // Margins above and below the graph line
    const yMin = minWeight - range * 0.2;
    const yMax = maxWeight + range * 0.2;
    const yRange = yMax - yMin;

    const getX = (index: number) => {
        if (data.length === 1) return width / 2;
        return paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
    };
    const getY = (weight: number) => height - paddingBottom - ((weight - yMin) / yRange) * (height - paddingTop - paddingBottom);

    const pointArray = data.map((d, i) => ({ x: getX(i), y: getY(d.weight), weight: d.weight }));
    
    // Smooth line path using straight lines
    const linePath = pointArray.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${pointArray[pointArray.length - 1].x} ${height - paddingBottom} L ${pointArray[0].x} ${height - paddingBottom} Z`;

    return (
        <View className="h-48 w-full mt-2" onLayout={onLayout}>
            <Svg width="100%" height="100%">
                <Defs>
                    <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#3456AD" stopOpacity="0.2" />
                        <Stop offset="1" stopColor="#3456AD" stopOpacity="0" />
                    </LinearGradient>
                </Defs>
                
                {/* Background Fill */}
                <Path d={areaPath} fill="url(#gradient)" />

                {/* Grid line middle */}
                <Line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />

                {/* Target Weight Line */}
                {targetWeight !== undefined && (
                    <>
                        <Line x1={paddingX} y1={getY(targetWeight)} x2={width - paddingX} y2={getY(targetWeight)} stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
                        <SvgText x={width - paddingX} y={getY(targetWeight) - 6} fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="end">
                            Cible: {targetWeight} kg
                        </SvgText>
                    </>
                )}

                {/* Line */}
                <Path d={linePath} fill="none" stroke="#3456AD" strokeWidth="3" />

                {/* Data points */}
                {pointArray.map((p, i) => (
                    <Circle key={`point-${i}`} cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#3456AD" strokeWidth="2.5" />
                ))}

                {/* Labels */}
                <SvgText x={pointArray[0].x} y={pointArray[0].y - 12} fill="#6b7280" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {pointArray[0].weight} {data.length === 1 ? 'kg' : ''}
                </SvgText>
                
                {data.length > 1 && (
                    <SvgText x={pointArray[pointArray.length - 1].x} y={pointArray[pointArray.length - 1].y - 12} fill="#3456AD" fontSize="12" fontWeight="bold" textAnchor="middle">
                        {pointArray[pointArray.length - 1].weight} kg
                    </SvgText>
                )}

            </Svg>
        </View>
    );
}
