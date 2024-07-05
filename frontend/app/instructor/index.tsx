import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card from '../../components/Card';
import NewSessionForm from '@/components/NewSession';
import { useRouter } from 'expo-router';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { SessionProvider, useSession } from '@/contexts/sessionContext';
import { CourseProvider, useCourseContext } from '@/contexts/CourseContext';

const InstructorDashboardScreen: React.FC = () => {
  const router = useRouter()
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);

  const { user, users } = useAuthContext();
  const { sessions } = useSession();
  const { courses } = useCourseContext();

  const filteredCourses = courses.filter(course => user?.courseCodes?.includes(course.code))
  const totalCourses = filteredCourses.length;

  const filteredSessions = sessions.filter(session => filteredCourses.some(course => course._id === session.course));
  const sessionCount = filteredSessions.length;

  const filteredStudents = users?.filter(user => user.userType === 'student' && filteredCourses.some(course => user.courseCodes?.includes(course.code)));
  const totalStudents = filteredStudents?.length || 0;;

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.userType !== 'instructor') {
      router.push('/auth/signin');
    } else if (!user.courseCodes || user.courseCodes?.length === 0) {
      router.push('auth/enrollment');
    }
  }, [user])

  // Function to handle opening the new session form
  const handleNewSession = () => {
    setShowNewSessionForm(true);
  };

  // Function to handle closing the new session form
  const handleCloseNewSessionForm = () => {
    setShowNewSessionForm(false);
  };

  // Navigation handlers
  const handleSessionsNavigation = () => {
    router.push('instructor/sessions');
  };

  const handleCoursesNavigation = () => {
    router.push('instructor/courses');
  };

  const chartData = {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
      {
        data: [4, 6, 3, 8, 5, 7, 6, 9, 5, 8],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return (
    <AuthProvider>
      <CourseProvider>
        <SessionProvider>
          <ScrollView style={styles.container}>
            {showNewSessionForm ? (
              <View style={styles.chartContainer}>
                <Text style={styles.title}>Confirm New Session</Text>
                <NewSessionForm selectedCourse={filteredCourses[0]} onClose={handleCloseNewSessionForm} isLoading={!courses} />
              </View>) :
              (<>
                <Text style={styles.title}>Instructor Dashboard</Text>

                <View style={styles.cardContainer}>
                  <Card title="Sessions" value={sessionCount} icon='calendar-outline' action={handleSessionsNavigation} />
                  <Card title="Courses" value={totalCourses} icon='people-outline' action={handleCoursesNavigation} />
                  <Card title="Students" value={totalStudents} icon='book-outline' />
                  <Card title="New Sessions" value={1} icon='add-outline' action={handleNewSession} />
                </View>
              </>)
            }
          </ScrollView>
        </SessionProvider>
      </CourseProvider>
    </AuthProvider >
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
