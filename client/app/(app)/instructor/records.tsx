import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSession } from '@/contexts/SessionContext';
import { Session, Record } from '@/types';
import CustomButton from '@/components/CustomButton2';
import { useAuthContext } from '@/contexts/AuthContext';
import FormField from '@/components/FormField';
import { useCourseContext } from '@/contexts/CourseContext';

const RecordsScreen: React.FC = () => {
  const { user } = useAuthContext();
  const { sessionId } = useLocalSearchParams();
  const { courses } = useCourseContext();
  const { sessions, generateAttendanceReport, exportReport, markAttendance } = useSession();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Record[]>([]);
  const [attendanceUpdates, setAttendanceUpdates] = useState<{ [key: string]: string }>({});

  const filteredCourses = courses.filter(c => user?.courseCodes?.includes(c.code));
  const filteredSessions = sessionId
    ? sessions.filter(session => session._id === sessionId)
    : sessions.filter(session => filteredCourses.some(c => c._id === session.course._id));

  useEffect(() => {
    if (sessionId) {
      const foundSession = sessions.find(session => session._id === sessionId);
      setSession(foundSession || null);
    } else if (filteredSessions.length > 0) {
      setSession(filteredSessions[0]);
    }
  }, [sessionId, sessions, filteredSessions]);

  useEffect(() => {
    if (session && searchInput) {
      const filtered = session.records.filter(record =>
        record.student.studentId?.includes(searchInput)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [searchInput, session]);

  const handleGenerateReport = async () => {
    setLoading(true);
    const reportData = { sessionId }; // Adjust based on your report generation needs
    const report = await generateAttendanceReport(reportData, user);
    setLoading(false);
    setReportGenerated(true);
    setReportId(report._id); // Assuming the report has an _id property
  };

  const handleExportReport = async (exportType: 'pdf' | 'excel') => {
    if (reportId) {
      console.log(`Exporting report with ID ${reportId} as ${exportType}`);
      try {
        await exportReport(reportId, exportType);
        console.log('Export successful');
        // Handle post-export actions, like showing a success message or downloading the file
      } catch (error) {
        console.error('Error exporting report:', error);
      }
    } else {
      console.log('No report ID found');
    }
  };

  const handleAttendanceToggle = async (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';
    try {
      if (typeof sessionId === 'string') {
        await markAttendance(sessionId, studentId, newStatus);
        setSession(prevSession => {
          if (!prevSession) return prevSession;
          const updatedRecords = prevSession.records.map(record => {
            if (record.student.studentId === studentId) {
              return {
                ...record,
                status: newStatus,
              };
            }
            return record;
          });
          return {
            ...prevSession,
            records: updatedRecords,
          };
        });
        setAttendanceUpdates(prev => ({
          ...prev,
          [studentId]: newStatus,
        }));
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

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
          <Text style={styles.recordText}>
            Status: {attendanceUpdates[record.student.studentId!] ?? record.status}
          </Text>
        </View>
      ))}
      {loading ? (
        <ActivityIndicator size="large" color="#436cfc" />
      ) : (
        <>
          {!reportGenerated ? (
            <CustomButton
              title="Generate Report"
              onPress={handleGenerateReport}
              buttonStyle={styles.generateButton}
              textStyle={styles.buttonText}
            />
          ) : (
            <>
              <CustomButton
                title="Export as PDF"
                onPress={() => handleExportReport('pdf')}
                buttonStyle={styles.exportButton}
                textStyle={styles.buttonText}
              />
              <CustomButton
                title="Export as Excel"
                onPress={() => handleExportReport('excel')}
                buttonStyle={styles.exportButton}
                textStyle={styles.buttonText}
              />
            </>
          )}
        </>
      )}
      <View style={styles.searchContainer}>
        <Text style={styles.header}>Search by Matricule</Text>
        <FormField
          otherStyles={styles.searchInput}
          title="Student"
          placeholder="Enter matricule"
          value={searchInput}
          handleChangeText={setSearchInput}
        />
        {filteredStudents.map((record, index) => (
          <View key={index} style={styles.searchResultContainer}>
            <Text style={styles.searchResultText}>Matricule: {record.student.studentId}</Text>
            <Text style={styles.searchResultText}>Status: {record.status}</Text>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                record.status === 'present' ? styles.present : styles.absent,
              ]}
              onPress={() => handleAttendanceToggle(record.student._id!, record.status)}
            >
              <Text style={styles.buttonText}>
                {attendanceUpdates[record.student.studentId!] ?? record.status}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
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
  generateButton: {
    marginTop: 20,
    backgroundColor: '#436cfc',
  },
  exportButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
  },
  searchContainer: {
    marginTop: 20,
  },
  searchInput: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  searchResultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  searchResultText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
  },
  present: {
    backgroundColor: '#28a745',
  },
  absent: {
    backgroundColor: '#dc3545',
  },
});

export default RecordsScreen;
