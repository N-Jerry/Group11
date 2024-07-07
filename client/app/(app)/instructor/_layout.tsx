import { router, Tabs } from 'expo-router';
import React, { useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon'; // Assuming you have a TabBarIcon component
import { Colors } from '@/constants/Colors'; // Assuming you have a Colors constant for themes
import { useColorScheme } from '@/hooks/useColorScheme'; // Assuming you have a hook for color scheme
import NewSessionForm from '@/components/NewSession'; // Assuming you have a NewSessionForm component
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InstructorLayout() {
  const colorScheme = useColorScheme(); // Get the current color scheme
  const [isNewSessionModalVisible, setNewSessionModalVisible] = useState(false);

  const toggleNewSessionModal = () => {
    setNewSessionModalVisible(!isNewSessionModalVisible);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // Adjust the active tab color based on color scheme
          headerShown: false, // Hide header for tabs
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            title: 'Courses',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="sessions"
          options={{
            title: 'Sessions',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="records"
          options={{
            title: 'Records',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'clipboard' : 'clipboard-outline'} color={color} />
            ),
          }}
        />
      </Tabs>

      {isNewSessionModalVisible && (
        <NewSessionForm onClose={toggleNewSessionModal} />
      )}

      {/* Add a floating button for new session */}
      <TouchableOpacity style={styles.floatingButton} onPress={toggleNewSessionModal}>
        <Ionicons name="add" size={36} color="#fff" />
        <Text style={styles.floatingButtonText}>New Session</Text>
      </TouchableOpacity>
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
