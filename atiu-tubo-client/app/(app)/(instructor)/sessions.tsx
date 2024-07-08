import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CustomCard from '../../../components/CustomCard';
import CustomButton from '../../../components/CustomButton2';
import NewSessionForm from '@/components/NewSession';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CourseProvider, useCourseContext } from '@/contexts/CourseContext';
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';

const SessionsScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('Semester');
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const { courseId } = useLocalSearchParams();
  const { courses } = useCourseContext();
  const { sessions } = useSession();
  const { user } = useAuthContext();
  const router = useRouter();

  const course = courses.find(c => c._id === courseId);
  const filteredCourses = courses.filter(c => user?.courseCodes?.includes(c.code));
  const filteredSessions = courseId 
    ? sessions.filter(session => session.course._id === courseId) 
    : sessions.filter(session => filteredCourses.some(c => c._id === session.course._id));

  const handleNewSession = () => {
    setShowNewSessionForm(true);
  };

  const handleCloseNewSessionForm = () => {
    setShowNewSessionForm(false);
  };

  const handleMoreDetails = (sessionId: string) => {
    router.navigate({ pathname: '/records', params: { sessionId: sessionId } });
  };

  return (
    <AuthProvider><CourseProvider><SessionProvider>
        <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{course ? course.title : 'All Courses'}</Text>
      {showNewSessionForm ? (
        <View>
          <NewSessionForm selectedCourse={course} onClose={handleCloseNewSessionForm} isLoading={false} />
        </View>
      ) : (
        <>
          <View style={styles.tabContainer}>
            {['Semester', 'Month', 'Week'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.tab, selectedFilter === filter && styles.activeTab]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.tabText, selectedFilter === filter && styles.activeTabText]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton
            title="New Session"
            onPress={handleNewSession}
            buttonStyle={styles.newSessionButton}
            textStyle={styles.newSessionButtonText}
          />

          {filteredSessions.map((session, index) => (
            <CustomCard key={index} title={session.course.code} containerStyle={styles.sessionCard}>
              <Text style={styles.sessionTime}>{new Date(session.date).toLocaleString()}</Text>
              <Text style={styles.sessionStats}>{session.location}</Text>
              <Text style={styles.sessionStats}>{new Date(session.deadline).toLocaleString()}</Text>
              <View style={styles.cardActions}>
                <CustomButton
                  title="Download"
                  onPress={() => console.log('Download')}
                  buttonStyle={styles.downloadButton}
                  textStyle={styles.downloadButtonText}
                />
                <CustomButton
                  title="More"
                  onPress={() => handleMoreDetails(session._id)}
                  buttonStyle={styles.downloadButton}
                  textStyle={styles.editButton}
                />
              </View>
            </CustomCard>
          ))}
        </>
      )}
    </ScrollView>
      </SessionProvider></CourseProvider></AuthProvider>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#436cfc',
  },
  tabText: {
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  newSessionButton: {
    marginBottom: 20,
  },
  newSessionButtonText: {
    color: '#fff',
  },
  sessionCard: {
    width: '100%',
  },
  sessionTime: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sessionStats: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  downloadButton: {
    backgroundColor: '#fff',
    borderColor: '#436cfc',
  },
  downloadButtonText: {
    color: '#436cfc',
  },
  editButton: {
    color: '#436cfc',
    fontWeight: 'bold',
    padding: 10,
  },
});

export default SessionsScreen;
