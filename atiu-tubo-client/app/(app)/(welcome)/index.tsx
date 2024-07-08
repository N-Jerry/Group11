import CustomButton from "@/components/CustomButton";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

const Onboarding = () => {
  const { user } = useAuthContext();
  useEffect(() => {
    if (user && user.userType === "instructor") router.push("/instructor");
    if (user && user.userType === "student") router.push("/student");
    if (user && user.userType === "admin") router.push("/admin");
  }, [user]);

  return (
    <AuthProvider>
      <CourseProvider>
        <Swiper style={styles.wrapper} showsButtons={true}>
          <View style={styles.slide}>
            <Image
              source={require("@/assets/images/college.png")}
              style={styles.image}
            />
            <Text style={styles.title}>Atiu Tubo</Text>
            <Text style={styles.text}>
              Discover amazing features to enhance your experience.
            </Text>
          </View>
          <View style={styles.slide}>
            <Image
              source={require("@/assets/images/Professor-pana.png")}
              style={styles.image}
            />
            <Text style={styles.title}>Keep attendance</Text>
            <Text style={styles.text}>
              Streamline your attendance sessions .
            </Text>
          </View>
          <View style={styles.slide}>
            <Image
              source={require("@/assets/images/std.png")}
              style={styles.image}
            />
            <Text style={styles.title}>Mark Attendance</Text>
            <Text style={styles.text}>
              Indicate your attendance by simply using your fingerprints.
            </Text>
            <CustomButton
              title="Get Started"
              handlePress={() => router.push("/signup")}
            />
          </View>
        </Swiper>
      </CourseProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 40,
  },
});

export default Onboarding;
