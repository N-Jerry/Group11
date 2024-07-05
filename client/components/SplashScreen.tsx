import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const CustomSplashScreen = ({ onReady }: { onReady: () => void }) => {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    const timer = setTimeout(() => {
      onReady();
      SplashScreen.hideAsync();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <ImageBackground
      source={require('../assets/images/splash.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to MyApp</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default CustomSplashScreen;
