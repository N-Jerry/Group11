import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ViewStyle } from 'react-native';

interface Item {
  label: string;
  value: string;
}

interface MultiSelectProps {
  title?: string;
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  items: Item[];
  otherStyles?: ViewStyle;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ title, selectedValues, onValueChange, items, otherStyles }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onValueChange(selectedValues.filter(item => item !== value));
    } else {
      onValueChange([...selectedValues, value]);
    }
  };

  return (
    <View style={[styles.container, otherStyles]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{selectedValues.length ? selectedValues.join(', ') : 'Select items'}</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.item}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={styles.itemText}>
                    {selectedValues.includes(item.value) ? '☑ ' : '☐ '}
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'pmedium',
    marginBottom: 8,
  },
  dropdown: {
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
  dropdownText: {
    flex: 1,
    color: '#000',
    fontFamily: 'psemibold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  item: {
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default MultiSelect;
