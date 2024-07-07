import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChartProps {
  presence: number;
  absence: number;
}

const Chart: React.FC<ChartProps> = ({ presence, absence }) => {
  const chartData = [
    { label: 'Presence', value: presence, color: '#4caf50' },
    { label: 'Absence', value: absence, color: '#f44336' },
  ];
  const total = presence + absence

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Chart</Text>
      <View style={styles.chart}>
        {chartData.map((dataPoint, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { height: dataPoint.value*10, backgroundColor: dataPoint.color }]} />
            <Text style={styles.label}>{dataPoint.label}</Text>
            <Text style={styles.value}>{dataPoint.value} - {parseInt(dataPoint.value*100/total)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 40,
    borderRadius: 5,
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    marginTop: 2,
    fontSize: 12,
    color: '#555',
  },
});

export default Chart;
