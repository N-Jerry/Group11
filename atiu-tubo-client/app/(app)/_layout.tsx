import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import this
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const renderHeaderLeft = () => (
    <TouchableOpacity onPress={() => router.back()}>
      <Text>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Text>
    </TouchableOpacity>
  );

  const renderHeaderRight = () => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <TouchableOpacity onPress={() => router.push("/notifications")}>
        <Text>
          <Ionicons name="notifications" size={24} color="black" />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <Text>
          <Ionicons name="settings" size={24} color="black" />
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(student)"
            options={{
              title: "Student",
              headerLeft: renderHeaderLeft,
              headerRight: renderHeaderRight,
            }}
          />
          <Stack.Screen
            name="(instructor)"
            options={{
              title: "Instructor",
              headerLeft: renderHeaderLeft,
              headerRight: renderHeaderRight,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
