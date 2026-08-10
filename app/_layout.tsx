import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, usePathname, useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { TimerProvider } from './context/TimerContext';
import { Feather } from '@expo/vector-icons';
import { initLanguage } from '@/services/translation';
import Constants from 'expo-constants';
import './globals.css';
import BannerTimer from './components/common/BannerTimer';

let Notifications: any = null;
let Notifee: any = null;
if (Constants.appOwnership !== 'expo') {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    
    Notifee = require('@notifee/react-native').default;
    Notifee.registerForegroundService((notification: any) => {
      return new Promise(() => {});
    });
  } catch (e) {
    console.warn("Notifications non supportées dans cet environnement");
  }
}

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

function CustomHomeButton() {
  const router = useRouter();
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  return (
    <TouchableOpacity
      onPress={() => router.dismissAll ? router.dismissAll() : router.replace('/')}
      style={{ marginRight: 4, padding: 6 }}
      activeOpacity={0.7}
    >
      <Feather name="home" size={22} color="white" />
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setPositionAsync('absolute');
      NavigationBar.setButtonStyleAsync('dark');
    }

    (async () => {
      if (Notifications) {
        try {
          await Notifications.requestPermissionsAsync();
        } catch (e) {
          console.warn('Notification permission error', e);
        }
      }
      await initLanguage();
      setIsReady(true);
    })();
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
                fontSize: 20,
              },
              headerShadowVisible: false,
              headerLeft: () => <CustomBackButton />,
              headerRight: () => <CustomHomeButton />,
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
              name="today_records"
              options={{ title: "Today's Records" }}
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
              name="stats"
              options={{ title: "Évolution" }}
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
