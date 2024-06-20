import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DashboardContainer from '@/components/DashboardContainer';

const CheckInScreen = () => {
  const [confirmed, setConfirmed] = useState(false);

  const handleVerifyFingerprint = () => {
    setTimeout(() => {
      setConfirmed(true);
    }, 2000);
  };

  return (
    <DashboardContainer bg='#436cfc'>
      <View style={styles.container}>
        {confirmed ? (
          <View style={styles.confirmationContainer}>
            <Text style={styles.text}>Enroll Fingerprint</Text>
            <View style={styles.confirmation}>
              <Text style={styles.confirmationIcon}>✅</Text>
              <Text style={styles.studentId}>FE21A277</Text>
            </View>
            <Text style={styles.info}>Your fingerprint has been successfully enrolled.</Text>
          </View>
        ) : (
          <View style={styles.checkInContainer}>
            <Text style={styles.text}>Check In</Text>
            <Text style={styles.instruction}>Place your finger on your fingerprint sensor to mark attendance</Text>
            <View style={styles.fingerprintScanner}>
              <Text style={styles.fingerprintIcon}>🔍</Text>
              <Text style={styles.verifyingText}>Verifying...</Text>
            </View>
            <Button title="Verify Fingerprint" onPress={handleVerifyFingerprint} />
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
