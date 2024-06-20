import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CustomCardProps {
  title: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: ViewStyle;
}

const CustomCard: React.FC<CustomCardProps> = ({ title, children, containerStyle, titleStyle }) => {
  return (
    <View style={[styles.card, containerStyle]}>
      <Text style={[styles.cardTitle, titleStyle]}>{title}</Text>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContent: {
    alignItems: 'center',
  },
});

export default CustomCard;
