import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Chart: React.FC = () => {
  const chartData = [20, 30, 40, 50, 60, 70, 80];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Chart</Text>
      <View style={styles.chart}>
        {chartData.map((dataPoint, index) => (
          <View key={index} style={[styles.bar, { height: dataPoint }]} />
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bar: {
    width: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default Chart;
