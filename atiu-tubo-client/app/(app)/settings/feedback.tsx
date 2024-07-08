import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Feedback } from "@/types";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import {
  FeedbackProvider,
  useFeedbackContext,
} from "@/contexts/FeedbackContext";

const FeedbackScreen: React.FC = () => {
  const { user } = useAuthContext();
  const { feedbacks, viewFeedback, submitFeedback } = useFeedbackContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [newFeedback, setNewFeedback] = useState("");

  useEffect(() => {
    // Fetch feedbacks for a specific user
    const fetchFeedbacks = async () => {
      if (user) await viewFeedback(user?._id);
    };
    fetchFeedbacks();
  }, [user]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSubmitFeedback = async () => {
    if (!newFeedback.trim()) {
      alert("Error: Please enter your feedback");
      return;
    }

    try {
      await submitFeedback({
        userID: user?._id,
        message: newFeedback,
        type: "general",
      });
      setNewFeedback("");
      handleCloseModal();
      viewFeedback(user?._id);
    } catch (error) {
      alert("Error: Failed to submit feedback");
      console.error("Error submitting feedback:", error);
    }
  };

  const renderItem = ({ item }: { item: Feedback }) => (
    <View style={styles.feedbackItem}>
      <Text>{item.message}</Text>
      <Text>{item.timestamp.toLocaleString()}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  return (
    <AuthProvider>
      <FeedbackProvider>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Feedbacks</Text>
          </View>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {feedbacks.length > 0 ? (
              feedbacks.map((item: Feedback) => (
                <View
                  key={
                    item._id ? item._id.toString() : Math.random().toString()
                  }
                  style={styles.feedbackItem}
                >
                  <Text>{item.message}</Text>
                  <Text>{new Date(item.timestamp).toLocaleString()}</Text>
                  <Text>Status: {item.status}</Text>
                </View>
              ))
            ) : (
              <Text>No feedbacks found</Text>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
            <Text>Add Feedback</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your feedback"
                  value={newFeedback}
                  onChangeText={setNewFeedback}
                />
                <View
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitFeedback}
                  >
                    <Text>Submit Feedback</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleCloseModal}
                  >
                    <Text>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </FeedbackProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#436cfc",
  },
  feedbackItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#436cfc",
    padding: 15,
    borderRadius: 50,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "80%",
  },
  input: {
    borderBottomWidth: 3,
    borderColor: "#ccc",
    marginBottom: 20,
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: "#436cfc",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#ff0000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default FeedbackScreen;
