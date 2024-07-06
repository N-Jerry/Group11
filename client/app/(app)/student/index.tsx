import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DashboardContainer from '@/components/DashboardContainer';
import { router } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { Session } from '@/types';
import { useSession } from '@/contexts/SessionContext';
import { useCourseContext } from '@/contexts/CourseContext';
import * as Location from 'expo-location';

const StudentDashboardScreen = () => {
  const { user } = useAuthContext();
  const { sessions, reports, generateAttendanceReport } = useSession();
  const { courses } = useCourseContext();
  const [ongoingSession, setOngoingSession] = useState<Session | null | undefined>(null);
  const [userCoords, setUserCoords] = useState<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      router.push('signin');
    } else {
      fetchLocation();
      findOngoingSession();
      FetchStudentHistory();
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

        // Check if the session's course code is in user's enrolled courses
        const sessionCourseCode = session.course.code;
        const isUserEnrolledInCourse = userCourses.some(course => course.code === sessionCourseCode);

        // Check if current date is within session date and deadline
        const isSessionOngoing = now >= sessionDate && now <= sessionDeadline;

        return isUserEnrolledInCourse && isSessionOngoing;
      });

      setOngoingSession(ongoingSession);
    } else {
      console.log('No course codes found for user');
      setOngoingSession(null);
    }
  };

  const [loading, setLoading] = useState(false);
  const FetchStudentHistory = async () => {
    setLoading(true);
    const reportData = { userId: user?._id };
    const report = await generateAttendanceReport(reportData, user);
    console.log("Report:", report);
    setLoading(false);
  };

  const handleCheckIn = () => {
    router.navigate({ pathname: 'student/checkin', params: { sessionId: ongoingSession?._id } });
  };

  const areCoordinatesClose = (lat1: number, lon1: number, lat2: number, lon2: number, threshold: number = 0.1): boolean => {
    const latDifference = Math.abs(lat1 - lat2);
    const lonDifference = Math.abs(lon1 - lon2);

    return latDifference <= threshold && lonDifference <= threshold;
  };

  let distance = 0;
  let [lat, lon] = [0, 0];
  const isUserNearSession = () => {
    if (userCoords && ongoingSession && ongoingSession.location) {
      [lat, lon] = ongoingSession.location.split(', ').map(coord => parseFloat(coord.split(': ')[1]));
      const isClose = areCoordinatesClose(userCoords.latitude, userCoords.longitude, lat, lon);
      return isClose;
    }
    return false;
  };

  return (
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
                <Text style={styles.sessionText}>In {ongoingSession.location}</Text>
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
        </View>
      </DashboardContainer>
    </View>
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
});

export default StudentDashboardScreen;
