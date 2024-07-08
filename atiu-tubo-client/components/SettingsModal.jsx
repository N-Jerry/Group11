import React from "react";
import { Modal, View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors"; // Adjust the path as per your file structure

const SettingsModal = ({
  isVisible,
  onClose,
  title,
  settings,
  onToggle,
  colorScheme,
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          {Object.keys(settings).map((key) => (
            <View key={key} style={styles.option}>
              <Text>{key}</Text>
              <Switch
                trackColor={{
                  false: "#767577",
                  true: Colors[colorScheme ?? "light"].tint,
                }}
                thumbColor={
                  settings[key]
                    ? Colors[colorScheme ?? "light"].tint
                    : "#f4f3f4"
                }
                onValueChange={() => onToggle(key)}
                value={settings[key]}
              />
            </View>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#436cfc",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SettingsModal;
