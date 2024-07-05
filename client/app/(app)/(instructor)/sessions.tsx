import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSession } from '@/contexts/SessionContext';
import { Session } from '@/types';

const RecordsScreen: React.FC = () => {
  const { sessionId } = useLocalSearchParams();
  const { getSessionById } = useSession();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (sessionId) {
        const fetchedSession = await getSessionById(sessionId as string);
        setSession(fetchedSession);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Session Details</Text>
      <Text style={styles.sessionDetail}>Date: {new Date(session.date).toLocaleString()}</Text>
      <Text style={styles.sessionDetail}>Deadline: {new Date(session.deadline).toLocaleString()}</Text>
      <Text style={styles.sessionDetail}>Location: {session.location}</Text>
      <Text style={styles.header}>Attendance Records</Text>
      {session.records.map((record, index) => (
        <View key={index} style={styles.recordContainer}>
          <Text style={styles.recordText}>Student ID: {record.student.studentId}</Text>
          <Text style={styles.recordText}>Status: {record.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#436cfc',
  },
  sessionDetail: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  recordContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  recordText: {
    fontSize: 16,
    color: '#333',
  },
});

export default RecordsScreen;
