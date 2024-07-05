import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface FormFieldProps extends TextInputProps {
  title?: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  otherStyles?: StyleProp<ViewStyle>;
  icon?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  secureTextEntry = false,
  otherStyles,
  icon,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, otherStyles]}>
      {icon && <Ionicons name={icon} style={styles.icon} size={24} color="#B0B0B0" />}
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#B0B0B0"
        onChangeText={handleChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={!showPassword ? 'eye-outline' : 'eye-off-outline'}
            style={styles.icon}
            size={24}
            color="#B0B0B0"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
    height: 48,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
});

export default FormField;
