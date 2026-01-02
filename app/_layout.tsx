import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import './globals.css';

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
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="add"
            options={{ headerShown: true, title: "Add" }}
          />
          <Stack.Screen
            name="records"
            options={{ headerShown: true, title: "Records" }}
          />
          <Stack.Screen
            name="settings"
            options={{ headerShown: true, title: "Settings" }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
