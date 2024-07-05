import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import CustomSplashScreen from '@/components/SplashScreen';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSplashReady, setSplashReady] = useState(false);
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded && isSplashReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isSplashReady]);

  if (!fontsLoaded || !isSplashReady) {
    return <CustomSplashScreen onReady={() => setSplashReady(true)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
