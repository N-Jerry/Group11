import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme'; // Assuming you have a hook for color scheme
import { StyleSheet } from 'react-native';

export default function InstructorLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="index" options={{ title: "Settings"}} />
            <Stack.Screen name="profile" options={{ title: "Profile"}} />
            <Stack.Screen name="feedback" options={{ title: "Feedback"}} />
        </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#436cfc',
    borderRadius: 36,
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  floatingButtonText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
  settingsButton: {
    bottom: 100,
  }
});
