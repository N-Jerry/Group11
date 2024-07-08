import { Stack, Tabs } from "expo-router";
import React from "react";


export default function TabLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="student" />
      <Stack.Screen name="checkin" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
