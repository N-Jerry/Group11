import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Calculate total value of all segments
  const total = data.reduce((acc, { value }) => acc + value, 0);

  // Function to calculate percentage of each segment
  const getPercentage = (value: number) => ((value / total) * 100).toFixed(2);

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={[styles.segment, { backgroundColor: item.color }]}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{getPercentage(item.value)}%</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  segment: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    margin: 5,
    minWidth: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  value: {
    fontSize: 12,
    color: '#fff',
  },
});

export default PieChart;
