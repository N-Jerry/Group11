import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, TouchableOpacityProps } from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, handlePress, isLoading = false, variant = 'primary', ...props }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary,
        isLoading ? styles.buttonLoading : null
      ]}
      disabled={isLoading}
      {...props}
    >
      <Text style={[styles.buttonText, variant === 'secondary' ? styles.buttonTextSecondary : null]}>
        {title}
      </Text>
      {isLoading && <ActivityIndicator color={variant === 'secondary' ? "#436CFC" : "#fff"} style={styles.loader} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  buttonPrimary: {
    backgroundColor: '#436CFC',
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: '#436CFC',
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#fff",
  },
  buttonTextSecondary: {
    color: '#436CFC',
  },
  loader: {
    marginLeft: 10,
  },
});

export default CustomButton;
