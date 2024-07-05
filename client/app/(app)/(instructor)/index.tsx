import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card from '../../../components/Card';
import Chart from '../../../components/Chart';
import NewSessionForm from '@/components/NewSession';
import { useRouter } from 'expo-router';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { CourseProvider, useCourseContext } from '@/contexts/CourseContext';

const InstructorDashboardScreen: React.FC = () => {
  const router = useRouter();
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);

  const { user, users, logout } = useAuthContext();
  const { sessions } = useSession();
  const { courses } = useCourseContext();

  const filteredCourses = courses.filter(course => user?.courseCodes?.includes(course.code));
  const totalCourses = filteredCourses.length;

  const filteredSessions = sessions.filter(session => filteredCourses.some(course => course._id === session.course));
  const sessionCount = filteredSessions.length;

  const filteredStudents = users?.filter(user => user.userType === 'student' && filteredCourses.some(course => user.courseCodes?.includes(course.code)));
  const totalStudents = filteredStudents?.length || 0;

  useEffect(() => {
    if (!user) {
      router.push('/(welcome)');
    } else if (user.userType !== 'instructor') {
      router.push('/(welcome)/signin');
    } else if (!user.courseCodes || user.courseCodes?.length === 0) {
      router.push('/(welcome)/signin');
    }
  }, [user]);

  const handleNewSession = () => {
    setShowNewSessionForm(true);
  };

  const handleCloseNewSessionForm = () => {
    setShowNewSessionForm(false);
  };

  const handleSessionsNavigation = () => {
    router.push('instructor/sessions');
  };

  const handleCoursesNavigation = () => {
    router.push('instructor/courses');
  };

  return (
    <ScrollView style={styles.container}>
      {showNewSessionForm ? (
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Confirm New Session</Text>
          <NewSessionForm selectedCourse={filteredCourses[0]} onClose={handleCloseNewSessionForm} isLoading={!courses} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>Instructor Dashboard</Text>

          <View style={styles.cardContainer}>
            <Card title="Sessions" value={sessionCount} icon='calendar-outline' action={handleSessionsNavigation} />
            <Card title="Courses" value={totalCourses} icon='people-outline' action={handleCoursesNavigation} />
            <Card title="Students" value={totalStudents} icon='book-outline' />
            <Card title="New Sessions" value={1} icon='add-outline' action={handleNewSession} />
          </View>

          {/* Bar Chart component */}
          <View style={styles.chartContainer}>
            <Chart />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(67, 108, 252, 0.1)',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#436cfc',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 15,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center'
  },
});

export default InstructorDashboardScreen;
