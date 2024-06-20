// components/DashboardContainer.tsx

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface DashboardContainerProps {
  children: ReactNode;
  bg?: string;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ children, bg }) => {
  const containerStyles: ViewStyle = {
    ...styles.container,
    backgroundColor: bg || '#fff',
    shadowColor: bg || '#000',
  };

  return (
    <View style={containerStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 20,
  },
});

export default DashboardContainer;
