import { Stack, Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { CourseProvider } from "@/contexts/CourseContext";
import { AuthProvider } from "@/contexts/AuthContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="signin" options={{ headerShown: false }} />
    </Stack>
  );
}
