import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DashboardContainer from '@/components/DashboardContainer';
import { router } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { Session } from '@/types';
import { useSession } from '@/contexts/SessionContext';
import { useCourseContext } from '@/contexts/CourseContext';

const StudentDashboardScreen = () => {
  const { user } = useAuthContext();
  const { sessions } = useSession();
  const { courses } = useCourseContext();
  const [ongoingSession, setOngoingSession] = useState<Session | null | undefined>(null);

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      router.push('signin');
    } else {
      findOngoingSession();
    }
  }, [user]);

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
        const isSessionOngoing = now <= sessionDeadline;

        return isUserEnrolledInCourse && isSessionOngoing;
      });

      setOngoingSession(ongoingSession); // Set state here instead of returning a string
    } else {
      setOngoingSession(null); // Set state to null if no ongoing session
    }
  };

  const handleCheckIn = () => {
    router.navigate({ pathname: 'student/checkin', params: { sessionId: ongoingSession?._id }});
  };

  return (
    <View style={styles.screen}>
      <DashboardContainer bg="#436cfc">
        <View style={styles.header}>
          <Text style={styles.welcomeText}>WELCOME {user?.name.toUpperCase()}</Text>
        </View>

        <TouchableOpacity style={styles.card} onPress={handleCheckIn} disabled={!ongoingSession}>
          <Text style={styles.cardTitle}>ONGOING SESSION</Text>
          {ongoingSession ? (
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionText}>{ongoingSession.course.code}</Text>
              <Text style={styles.sessionText}>Started at {new Date(ongoingSession.date).toLocaleString()}</Text>
              <Text style={styles.sessionText}>Ends at {new Date(ongoingSession.deadline).toLocaleString()}</Text>
            </View>
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
