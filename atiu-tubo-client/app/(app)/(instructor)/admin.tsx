import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { CourseProvider, useCourseContext } from '@/contexts/CourseContext';
import { FeedbackProvider, useFeedbackContext } from '@/contexts/FeedbackContext';
import Card from '../../../components/Card';
import { Course, User } from '@/types';
import CustomButton from '@/components/CustomButton2';

const AdminDashboardScreen: React.FC = () => {
  const router = useRouter();
  const { user, users } = useAuthContext();
  const { courses, createCourse } = useCourseContext();
  const { feedbacks, getAllFeedbacks, updateFeedbackStatus } = useFeedbackContext();

  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [currentView, setCurrentView] = useState<'courses' | 'feedbacks' | 'users'>('courses');

  useEffect(() => {
    if (!user) {
      router.push('/(welcome)');
    } else if (user.userType !== 'admin') {
      router.push('/signin');
    }
  }, [user]);

  useEffect(() => {
    getAllFeedbacks();
  }, []);

  const handleCreateCourse = async () => {
      await createCourse(newCourse as Course);
      setShowCourseForm(false);
  };

  const handleReviewFeedback = async (feedbackId: string) => {
    await updateFeedbackStatus(feedbackId, 'reviewed');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'courses':
        return (
          <>
            <Text style={styles.subtitle}>All Courses</Text>
            {courses.map(course => (
              <View key={course._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>{course.title}</Text>
              </View>
            ))}
          </>
        );
      case 'users':
        return (
          <>
            <Text style={styles.subtitle}>All Users</Text>
            {users?.map(user => (
              <View key={user._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>{user.name}</Text>
              </View>
            ))}
          </>
        );
      case 'feedbacks':
      default:
        return (
          <>
            <Text style={styles.subtitle}>All Feedbacks</Text>
            {feedbacks.map(feedback => (
              <View key={feedback._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>{feedback.message}</Text>
                <CustomButton title="Review" onPress={() => handleReviewFeedback(feedback._id!!)} />
              </View>
            ))}
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <CourseProvider>
        <FeedbackProvider>
          <ScrollView style={styles.container}>
            <Text>{users?.toString()}</Text>
            {showCourseForm ? (
              <View style={styles.formContainer}>
                <Text style={styles.title}>New Course</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Course Name"
                  value={newCourse.title}
                  onChangeText={(text) => setNewCourse({ ...newCourse, title: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Course Code"
                  value={newCourse.code}
                  onChangeText={(text) => setNewCourse({ ...newCourse, code: text })}
                />
                <Button title="Submit" onPress={handleCreateCourse} />
                <Button title="Cancel" onPress={() => setShowCourseForm(false)} />
              </View>
            ) : (
              <>
                <Text style={styles.title}>Admin Dashboard</Text>
                <View style={styles.cardContainer}>
                  <Card title="Courses" value={courses.length} icon='book-outline' action={() => {setShowCourseForm(true); setCurrentView('courses')}} />
                  <Card title="Feedbacks" value={feedbacks.length} icon='chatbubbles-outline' action={() => setCurrentView('feedbacks')} />
                  <Card title="Users" value={users?.length} icon='people-outline' action={() => setCurrentView('users')} />
                  <Card title="Settings" icon='settings' action={() => router.push('/settings')} />
                </View>
                {renderContent()}
              </>
            )}
          </ScrollView>
        </FeedbackProvider>
      </CourseProvider>
    </AuthProvider>
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
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#436cfc',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 15,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default AdminDashboardScreen;
