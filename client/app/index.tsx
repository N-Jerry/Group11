import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Index = () => {
  const { user } = useAuthContext()
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/signin');
  };

  if (user) {
    if (user.userType === 'student') {
      router.push('dashboard');
    }
    else if (user.userType === 'instructor') {
      router.push('instructor');
    }
  }

  return (
        <View style={styles.container}>
          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.subtitle}>
            Welcome to Attendance App - Your solution for effortless attendance tracking.
          </Text>
          <Text style={styles.description}>
            Designed for both instructors and students, Attendance App simplifies the process of tracking attendance in real-time, ensuring accuracy and efficiency.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#436cfc', // Example background color
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#436cfc',
  },
});

export default Index;