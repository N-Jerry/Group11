import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Ionicons for icons

interface CardProps {
  title: string;
  value: number;
  icon: string;
  action?: () => void; // Function to be executed when the card is clicked
}

const Card: React.FC<CardProps> = ({ title, value, icon, action }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={action}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={30} color="white" />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#436cfc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Card;
