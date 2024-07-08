import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import DashboardContainer from '@/components/DashboardContainer';
import { router } from 'expo-router';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { Session } from '@/types';
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { CourseProvider, useCourseContext } from '@/contexts/CourseContext';
import * as Location from 'expo-location';
import PieChart from '@/components/PieChart';
import CustomButton from '@/components/CustomButton2';

const StudentDashboardScreen = () => {
  const { user } = useAuthContext();
  const { sessions, generateAttendanceReport } = useSession();
  const { courses } = useCourseContext();
  const [ongoingSession, setOngoingSession] = useState<Session | null | undefined>(null);
  const [userCoords, setUserCoords] = useState<{ latitude: number, longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<{ date: string; status: string }[]>([]);
  const [totalPresents, setTotalPresents] = useState<number>(0);
  const [totalAbsences, setTotalAbsences] = useState<number>(0);

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      router.push('signin');
    } else {
      fetchLocation();
      findOngoingSession();
      fetchStudentHistory();
    }
  }, [user, sessions, courses]);

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert("Permission Denied: Location permission is required to check ongoing sessions.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const findOngoingSession = () => {
    if (user?.courseCodes && user.courseCodes.length > 0) {
      const now = new Date();
      const userCourses = courses.filter(c => user.courseCodes?.includes(c.code));

      const ongoingSession = sessions.find(session => {
        const sessionDate = new Date(session.date);
        const sessionDeadline = new Date(session.deadline);

        const sessionCourseCode = session.course.code;
        const isUserEnrolledInCourse = userCourses.some(course => course.code === sessionCourseCode);

        const isSessionOngoing = now >= sessionDate && now <= sessionDeadline;

        return isUserEnrolledInCourse && isSessionOngoing;
      });

      setOngoingSession(ongoingSession);
    } else {
      console.log('No course codes found for user');
      setOngoingSession(null);
    }
  };

  const fetchStudentHistory = async () => {
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

      // Calculate total presents and absences
      const totalPresentsCount = report.data.filter((sessionData: any) => {
        return sessionData.attendance.some((att: any) => att.student === user?.studentId && att.status === 'present');
      }).length;
      setTotalPresents(totalPresentsCount);

      const totalAbsencesCount = report.data.filter((sessionData: any) => {
        return sessionData.attendance.every((att: any) => att.student === user?.studentId && att.status === 'absent');
      }).length;
      setTotalAbsences(totalAbsencesCount);

    }

    setLoading(false);
  };

  const handleCheckIn = () => {
    router.navigate({ pathname: 'checkin', params: { sessionId: ongoingSession?._id } });
  };

  const areCoordinatesClose = (lat1: number, lon1: number, lat2: number, lon2: number, threshold: number = 0.1): boolean => {
    const latDifference = Math.abs(lat1 - lat2);
    const lonDifference = Math.abs(lon1 - lon2);

    return latDifference <= threshold && lonDifference <= threshold;
  };

  let [lat, lon] = [0, 0];
  const isUserNearSession = () => {
    if (userCoords && ongoingSession && ongoingSession.location) {
      [lat, lon] = ongoingSession.location.split(', ').map(coord => parseFloat(coord.split(': ')[1]));
      const isClose = areCoordinatesClose(userCoords.latitude, userCoords.longitude, lat, lon);
      return isClose;
    }
    return false;
  };


  const data = [
    { label: 'Present', value: totalPresents, color: '#00b894' },
    { label: 'Absent', value: totalAbsences, color: '#d63031' },
  ];


  return (
    <AuthProvider>
      <CourseProvider>
        <SessionProvider>

    <View style={styles.screen}>
      <DashboardContainer bg="#436cfc">
        <View style={styles.header}>
          <Text style={styles.welcomeText}>WELCOME {user?.name.toUpperCase()}</Text>
        </View>

        <TouchableOpacity style={styles.card} onPress={handleCheckIn} disabled={!ongoingSession || !isUserNearSession()}>
          <Text style={styles.cardTitle}>ONGOING SESSION</Text>
          {ongoingSession ? (
            isUserNearSession() ? (
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionText}>{ongoingSession.course.code}</Text>
                <Text style={styles.sessionText}>Started at {new Date(ongoingSession.date).toLocaleString()}</Text>
                <Text style={styles.sessionText}>Ends at {new Date(ongoingSession.deadline).toLocaleString()}</Text>
              </View>
            ) : (
              <Text style={styles.errorText}>You are not within 100 meters of the session location. Please move closer.</Text>
            )
          ) : (
            <View>
              <Text>No Ongoing Session Now</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.history}>
          <Text style={styles.historyTitle}>YOUR HISTORY</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <PieChart presence={totalPresents} absence={totalAbsences} />
              <CustomButton buttonStyle={styles.historyDetails} onPress={() => router.navigate('history')} title='View History Details' />
            </>
          )}
        </View>
      </DashboardContainer>
    </View>
        </SessionProvider>
      </CourseProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sessionInfo: {
    alignItems: 'center',
  },
  sessionText: {
    fontSize: 14,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
  history: {
    width: '90%',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historySummary: {
    fontSize: 14,
    marginBottom: 10,
  },
  historyDetails: {
    marginTop: 20,
    backgroundColor: 'gray',
  }
});

export default StudentDashboardScreen;
