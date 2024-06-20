import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import Splash from '../components/splash';
import '../global.css';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAppReady, setAppReady] = useState(false);
  const [isNavigationReady, setNavigationReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{ text: string; onPress: () => void }[]>([]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded]);

  if (!isAppReady) {
    return (
      <Splash />
    );
  }

  const renderHeaderRight = () => {
    const { logout } = useAuthContext()

    const handleAvatarClick = () => {
      setModalContent([
        { text: 'Update Profile', onPress: () => router.navigate('UpdateProfile') },
        { text: 'Logout', onPress: () => logout() },
      ]);
      setModalVisible(true);
    };
  
    const handleEllipsisClick = () => {
      setModalContent([
        { text: 'Notifications', onPress: () => router.navigate('Notifications') },
        { text: 'Reports', onPress: () => router.navigate('Reports') },
      ]);
      setModalVisible(true);
    };
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={handleAvatarClick}>
          <Ionicons name="person-circle-outline" size={24} color="black" style={{ marginRight: 16 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEllipsisClick}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              {modalContent.map((item, index) => (
                <TouchableOpacity key={index} onPress={item.onPress}>
                  <Text style={styles.modalItem}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <DataProvider>
          <Stack
            screenOptions={{
              headerShown: true,
              headerRight: renderHeaderRight,
            }}
          >
            <Stack.Screen name='index' />
            <Stack.Screen name='dashboard' />
            <Stack.Screen name='auth/signup' />
            <Stack.Screen name='auth/signin' />
            <Stack.Screen name='dashboard/checkin' />
          </Stack>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    padding: 8,
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  modalItemHover: {
    backgroundColor: 'lightblue',
  }
});