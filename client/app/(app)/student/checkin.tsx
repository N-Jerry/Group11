import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import DashboardContainer from '@/components/DashboardContainer';
import { useAuthContext } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { useLocalSearchParams } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

const CheckInScreen = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const { user } = useAuthContext();
  const { sessionId } = useLocalSearchParams();
  const { markAttendance } = useSession();

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware) {
        alert('Biometric authentication is not available: Your device does not support biometric authentication.');
      } else if (!isEnrolled) {
        alert('Biometric authentication is not set up: Please set up biometric authentication in your device settings.');
      } else {
        setBiometricsAvailable(true);
      }
    } catch (error) {
      console.error('Biometrics check error:', error);
      alert('Biometrics check error: Could not check biometric availability. Please try again.');
    }
  };

  const authenticateWithBiometrics = async () => {
    if (!biometricsAvailable) {
      alert('Biometric authentication not available: Please make sure biometric authentication is set up on your device.');
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to mark attendance',
      });
      if (result.success) {
        handleMarkAttendance();
      } else {
        alert('Authentication failed: Please try again');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication error: Could not authenticate. Please try again.');
    }
  };

  const handleMarkAttendance = () => {
    if (typeof sessionId === 'string' && user?._id) {
      markAttendance(sessionId, user._id, 'present')
        .then(() => setConfirmed(true))
        .catch(error => {
          console.error(error);
          Alert.alert('Error', 'Failed to mark attendance');
        });
    } else {
      Alert.alert('Error', 'Invalid session or user ID');
    }
  };

  return (
    <DashboardContainer bg='#436cfc'>
      <View style={styles.container}>
        {confirmed ? (
          <View style={styles.confirmationContainer}>
            <Text style={styles.text}>Checked In</Text>
            <View style={styles.confirmation}>
                <Ionicons name="checkmark-circle" color="#fff" size={100} />
              <Text style={styles.studentId}>{user?.studentId}</Text>
            </View>
            <Text style={styles.info}>Your fingerprint has been successfully enrolled.</Text>
          </View>
        ) : (
          <View style={styles.checkInContainer}>
            <Text style={styles.text}>Check In</Text>
            <Text style={styles.instruction}>Place your finger on your fingerprint sensor to mark attendance</Text>
            <View style={styles.fingerprintScanner}>
              <Ionicons name="finger-print" color="#fff" size={100} />
              <Text style={styles.verifyingText}>Verifying...</Text>
            </View>
            <Button title="Authenticate and Mark Attendance" onPress={authenticateWithBiometrics} />
          </View>
        )}
      </View>
    </DashboardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#436cfc',
  },
  checkInContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  fingerprintScanner: {
    marginBottom: 20,
    alignItems: 'center',
  },
  fingerprintIcon: {
    fontSize: 48,
    color: '#fff',
  },
  verifyingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  confirmation: {
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmationIcon: {
    fontSize: 48,
    color: '#fff',
  },
  studentId: {
    fontSize: 24,
    color: '#fff',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default CheckInScreen;
