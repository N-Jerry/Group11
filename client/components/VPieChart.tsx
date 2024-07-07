// VPiechart.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface Props {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

const VPiechart: React.FC<Props> = ({ data }) => {
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={{
          labels: data.labels,
          datasets: data.datasets.map((dataset, index) => ({
            data: dataset.data,
            color: (opacity = 1) => chartConfig.color(opacity), // Customize color if needed
            strokeWidth: chartConfig.strokeWidth, // Customize strokeWidth if needed
          })),
        }}
        width={300}
        height={220}
        chartConfig={chartConfig}
        accessor="data"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VPiechart;
