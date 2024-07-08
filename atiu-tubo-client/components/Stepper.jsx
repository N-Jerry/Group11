import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stepper = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.stepperContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.circle,
              index + 1 <= currentStep ? styles.completedCircle : styles.pendingCircle,
            ]}
          >
            {index + 1 <= currentStep ? (
              <Ionicons name="checkmark" color="#fff" size={20} />
            ) : (
              <Text style={styles.stepText}>{index + 1}</Text>
            )}
          </View>
          <Text
            style={[
              styles.stepLabel,
              index + 1 <= currentStep ? styles.completedText : styles.pendingText,
            ]}
          >
            {getStepLabel(index + 1)}
          </Text>
          {index + 1 < totalSteps && (
            <View
              style={[
                styles.line,
                index + 1 < currentStep ? styles.completedLine : styles.pendingLine,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const getStepLabel = (stepNumber) => {
  switch (stepNumber) {
    case 1:
      return 'User Name';
    case 2:
      return 'Location';
    case 3:
      return 'Business';
    case 4:
      return 'Bank';
    case 5:
      return 'Verification';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: {
    backgroundColor: '#4CAF50',
  },
  pendingCircle: {
    backgroundColor: '#e0e0e0',
  },
  stepText: {
    color: '#000',
  },
  stepLabel: {
    marginLeft: 8,
    fontSize: 12,
  },
  completedText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#e0e0e0',
  },
  line: {
    height: 2,
    flex: 1,
  },
  completedLine: {
    backgroundColor: '#4CAF50',
  },
  pendingLine: {
    backgroundColor: '#e0e0e0',
  },
});

export default Stepper;
