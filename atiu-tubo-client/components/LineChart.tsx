// components/LineChartComponent.tsx

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string; // optional
  }[];
}

interface ChartConfig {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces: number;
  color: (opacity: number) => string;
  labelColor: (opacity: number) => string;
  style?: object;
  propsForDots?: object;
}

interface LineChartComponentProps {
  chartData: ChartData;
  chartConfig: ChartConfig;
  height?: number;
  width?: number;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  chartData,
  chartConfig,
  height = 220,
  width,
}) => {
  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={chartData}
        width={width || Dimensions.get('window').width * 0.8}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chart: {
    borderRadius: 16,
  },
});

export default LineChartComponent;
