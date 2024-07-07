import { Stack, Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors'; // Assuming you have a Colors constant for themes
import { useColorScheme } from '@/hooks/useColorScheme'; // Assuming you have a hook for color scheme
import { StyleSheet } from 'react-native';

export default function InstructorLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false}} />
            <Stack.Screen name="checkin" options={{ headerShown: false}} />
            <Stack.Screen name="history" options={{ headerShown: false}} />
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
