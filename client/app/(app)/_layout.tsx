import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import CustomSplashScreen from '@/components/SplashScreen';

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

  return (
    <Stack>
      <Stack.Screen name="(welcome)/index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
