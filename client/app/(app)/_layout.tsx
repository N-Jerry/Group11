import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import CustomSplashScreen from '@/components/SplashScreen';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const [isSplashReady, setSplashReady] = useState(false);
  const [fontsLoaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        await SplashScreen.preventAutoHideAsync();
        if (fontsLoaded) {
          setSplashReady(true);
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Error preparing app:', error);
      }
    }

    prepareApp();
  }, [fontsLoaded]);

  if (!fontsLoaded || !isSplashReady) {
    return <CustomSplashScreen onReady={() => setSplashReady(true)} />;
  }

  const renderHeaderRight = () => (
    <TouchableOpacity onPress={() => router.push('/settings')}>
      <Ionicons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <Stack>
      <Stack.Screen
        name="student"
        options={{
          headerTitle: "Students",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: renderHeaderRight,
        }}
      />
      <Stack.Screen
        name="instructor"
        options={{
          headerTitle: "Instructors",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: renderHeaderRight,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
