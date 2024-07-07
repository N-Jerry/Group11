import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Item {
  label: string;
  value: any;
}

interface FormDropdownProps {
  title?: string;
  selectedValue: any;
  onValueChange: (itemValue: any) => void;
  items: Item[];
  otherStyles?: StyleProp<ViewStyle>;
}

const FormDropdown: React.FC<FormDropdownProps> = ({
  title,
  selectedValue,
  onValueChange,
  items,
  otherStyles,
}) => {
  return (
    <View style={[styles.container, otherStyles]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          style={styles.picker}
        >
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'pmedium',
    marginBottom: 8,
  },
  pickerContainer: {
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
  picker: {
    flex: 1,
    color: '#000',
    fontFamily: 'psemibold',
    fontSize: 16,
    borderColor: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
});

export default FormDropdown;
