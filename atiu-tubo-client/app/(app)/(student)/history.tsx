// History.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import DashboardContainer from '@/components/DashboardContainer';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { Session } from '@/types';
import { CourseProvider } from '@/contexts/CourseContext';

const HistoryScreen = () => {
  const { user } = useAuthContext();
  const { generateAttendanceReport } = useSession();
  const [loading, setLoading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<{ date: string; status: string }[]>([]);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    setLoading(true);
    const reportData = { userId: user?._id };
    const report = await generateAttendanceReport(reportData, user);
    console.log("Report:", report);

    if (report?.data) {
      const history = report.data.map((sessionData: any) => ({
        date: new Date(sessionData.date).toLocaleString(),
        status: sessionData.attendance.find((att: any) => att.student === user?.studentId)?.status || 'unknown',
      }));
      setAttendanceHistory(history);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'absent':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <AuthProvider>
      <CourseProvider>
        <SessionProvider>

      <ScrollView style={styles.container}>
        <Text style={styles.header}>Attendance History</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.history}>
            {attendanceHistory.map((item, index) => (
              <View key={index} style={[styles.historyItem, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <Text style={styles.historyStatus}>{item.status}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
        </SessionProvider>
      </CourseProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#436cfc',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  history: {
    width: '100%',
    alignItems: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  historyDate: {
    fontSize: 16,
    color: '#fff',
  },
  historyStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
});

export default HistoryScreen;
