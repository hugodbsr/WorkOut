import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { TimerProvider } from './context/TimerContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { initLanguage } from '@/services/translation';
import './globals.css';
import BannerTimer from './components/common/BannerTimer';

function CustomBackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{ marginLeft: 4, padding: 6 }}
      activeOpacity={0.7}
    >
      <Feather name="arrow-left" size={22} color="white" />
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setPositionAsync('absolute');
      NavigationBar.setBackgroundColorAsync('transparent');
    }

    initLanguage().finally(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#3456AD', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TimerProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#3456AD',
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: '600',
                fontStyle: 'italic',
                fontSize: 20,
              },
              headerShadowVisible: false,
              headerLeft: () => <CustomBackButton />,
            }}
          >
            <Stack.Screen
              name="index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="add"
              options={{ title: "Add" }}
            />
            <Stack.Screen
              name="records"
              options={{ title: "Records" }}
            />
            <Stack.Screen
              name="settings/index"
              options={{ title: "Settings" }}
            />
            <Stack.Screen
              name="settings/language"
              options={{ title: "Language" }}
            />
            <Stack.Screen
              name="settings/rest"
              options={{ title: "Rest" }}
            />
            <Stack.Screen
              name="settings/data"
              options={{ title: "Data" }}
            />
            <Stack.Screen
              name="chrono"
              options={{ title: "Chrono" }}
            />
          </Stack>
          <BannerTimer />
        </TimerProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
