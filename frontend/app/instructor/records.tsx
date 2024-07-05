import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CustomCard from '../../components/CustomCard';
import CustomButton from '../../components/CustomButton2';
import NewSessionForm from '@/components/NewSession';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { useDataContext } from '@/contexts/DataContext';

const SessionsScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('Semester');
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const { courseId } = useLocalSearchParams();
  const { courses, sessions } = useDataContext();

  const course = courses.find(c => c.courseId === courseId);
  const filteredSessions = sessions.filter(session => session.courseId === courseId);

  // Function to handle opening the new session form
  const handleNewSession = () => {
    setShowNewSessionForm(true);
  };

  // Function to handle closing the new session form
  const handleCloseNewSessionForm = () => {
    setShowNewSessionForm(false);
  };

  return course && (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{course.name}</Text>
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
            <CustomCard key={index} title={session.location} containerStyle={styles.sessionCard}>
              <Text style={styles.sessionTime}>{session.startTime.toLocaleString()}</Text>
              <Text style={styles.sessionStats}>{session.studentsPresent}</Text>
              <View style={styles.cardActions}>
                <CustomButton
                  title="Download"
                  onPress={() => console.log('Download')}
                  buttonStyle={styles.downloadButton}
                  textStyle={styles.downloadButtonText}
                />
                <CustomButton
                  title="More"
                  onPress={() => console.log('Download')}
                  buttonStyle={styles.downloadButton}
                  textStyle={styles.editButton}
                />
              </View>
            </CustomCard>
          ))}
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
