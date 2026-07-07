import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { TimerProvider } from './context/TimerContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setPositionAsync('absolute');
      NavigationBar.setBackgroundColorAsync('transparent');
    }
  }, []);

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
              name="settings"
              options={{ title: "Settings" }}
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
