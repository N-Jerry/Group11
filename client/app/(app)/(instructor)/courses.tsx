import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCourseContext } from '@/contexts/CourseContext';
import { useSession } from '@/contexts/SessionContext';
import CustomCard from '../../../components/CustomCard';
import CustomButton from '../../../components/CustomButton2';
import NewSessionForm from '@/components/NewSession';
import { Course } from '@/types';

const CoursesScreen: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const { user } = useAuthContext();
  const { courses } = useCourseContext();
  const { sessions } = useSession();
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const router = useRouter();

  const filteredCourses = courses.filter(course => user?.courseCodes?.includes(course.code));
  const distinctLevels = [...new Set(filteredCourses.map(course => course.level))];
  const coursesByLevel = selectedLevel !== 0 ? filteredCourses.filter(course => course.level === selectedLevel) : filteredCourses;

  useEffect(() => {
    if (!user) {
      router.push('/(welcome)');
    } else if (user.userType !== 'instructor') {
      router.push('/(welcome)/signin');
    } else if (!user.courseCodes || user.courseCodes.length === 0) {
      router.push('(welcome)/signin');
    }
  }, [user]);

  const handleNewSession = (course: Course) => {
    setSelectedCourse(course);
    setShowNewSessionForm(true);
  };

  const handleCloseNewSessionForm = () => {
    setShowNewSessionForm(false);
  };

  const handleViewSessions = (courseId: string) => {
    router.navigate({ pathname: '/instructor/sessions', params: { courseId: courseId } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {showNewSessionForm ? (
        <View>
          <NewSessionForm selectedCourse={selectedCourse} onClose={handleCloseNewSessionForm} isLoading={!courses} />
        </View>
      ) : (
        <>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filter, selectedLevel === 0 && styles.activeFilter]}
              onPress={() => setSelectedLevel(0)}
              accessibilityRole="button"
              accessibilityLabel={`Show All`}
            >
              <Text style={[styles.filterText, selectedLevel === 0 && styles.activeFilterText]}>
                {"All"}
              </Text>
            </TouchableOpacity>
            {distinctLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.filter, selectedLevel === level && styles.activeFilter]}
                onPress={() => setSelectedLevel(level)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${level}`}
              >
                <Text style={[styles.filterText, selectedLevel === level && styles.activeFilterText]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.cards}>
            {coursesByLevel.map((course, index) => {
              const sessionCount = sessions.filter(session => session.course._id === course._id).length;
              return (
                <CustomCard key={index} title={course.title} containerStyle={styles.courseCard}>
                  <Text style={styles.courseSessions}>{sessionCount} Sessions</Text>
                  <CustomButton
                    title="More"
                    onPress={() => handleViewSessions(course._id)}
                    buttonStyle={styles.newSessionButton}
                    textStyle={styles.newSessionButtonText}
                  />
                  <CustomButton
                    title="New"
                    onPress={() => handleNewSession(course)}
                    buttonStyle={styles.newSessionButton}
                    textStyle={styles.newSessionButtonText}
                  />
                </CustomCard>
              )
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#436cfc',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filter: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: '#436cfc',
  },
  filterText: {
    color: '#000',
  },
  activeFilterText: {
    color: '#fff',
  },
  cards: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  courseCard: {
    width: 150,
    margin: 5,
  },
  courseSessions: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  newSessionButton: {
    backgroundColor: '#436cfc',
  },
  newSessionButtonText: {
    color: '#fff',
  },
});

export default CoursesScreen;
