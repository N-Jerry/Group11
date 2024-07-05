import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DashboardContainer from '../../components/DashboardContainer';
import LineChartComponent from '../../components/LineChart';
import { router } from 'expo-router'; // Import useNavigation hook instead of useRouter
import { useAuthContext } from '@/contexts/AuthContext';

const StudentDashboardScreen = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      router.push('signin');
    }
  }, [user])

  const ongoingSession = {
    course: 'CEF202',
    instructor: 'Dr. Valery',
    time: '20/05/2025 7:00 AM',
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

  if (!user || user.userType !== 'student' || !user.courseCodes || user.courseCodes.length === 0) {
    return null;
  }

  const handleCheckIn = () => {
    router.push('dashboard/checkin')
  }

  return (
    <View style={styles.screen}>
      <DashboardContainer bg="#436cfc">
        <View style={styles.header}>
          <Text style={styles.welcomeText}>WELCOME {user.name.toUpperCase()}</Text>
        </View>

        <TouchableOpacity style={styles.card} onPress={handleCheckIn}>
          <Text style={styles.cardTitle}>ONGOING SESSION</Text>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionText}>{ongoingSession.course}</Text>
            <Text style={styles.sessionText}>{ongoingSession.instructor}</Text>
            <Text style={styles.sessionText}>{ongoingSession.time}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.history}>
          <Text style={styles.historyTitle}>YOUR HISTORY</Text>
          <LineChartComponent chartData={chartData} chartConfig={chartConfig} />
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
