import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { User } from "@/types";
import Stepper from "@/components/Stepper";
import FormField from "@/components/FormField";
import FormDropdown from "@/components/FormDropdown";
import CustomButton from "@/components/CustomButton";
import MultiSelect from "@/components/FormMultiSelect";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { CourseProvider, useCourseContext } from "@/contexts/CourseContext";

const SignUpScreen = () => {
  const { signup, user } = useAuthContext();
  const { courses } = useCourseContext();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [userType, setUserType] = useState("student");
  const [department, setDepartment] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.userType === "instructor") router.push("/instructor");
    if (user && user.userType === "student") router.push("/student");
  }, [user]);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const newUser: User = {
        _id: "",
        name,
        email,
        password,
        tel,
        userType,
        studentId: userType === "student" ? identifier : undefined,
        instructorId: userType === "instructor" ? identifier : undefined,
        courseCodes: selectedCourses,
        department,
      };

      await signup(newUser);
      router.push(
        `${userType === "student" ? "/student" : "/instructor"}`
      );
    } catch (error: any) {
      console.error("Error during signup:", error);
      alert(
        `Signup failed: ${error.response?.data?.error || "Please try again"}.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <CourseProvider>
            <View>
              <FormField
                title="Name"
                value={name}
                placeholder="Name"
                handleChangeText={setName}
                icon="person-outline"
              />
              <FormField
                title="Email"
                value={email}
                placeholder="Email"
                handleChangeText={setEmail}
                icon="mail-outline"
              />
              <FormField
                title="Password"
                value={password}
                placeholder="Password"
                secureTextEntry
                handleChangeText={setPassword}
                icon="lock-closed-outline"
              />
              <FormField
                title="Confirm Password"
                value={confirmPassword}
                placeholder="Confirm Password"
                secureTextEntry
                handleChangeText={setConfirmPassword}
                icon="lock-closed-outline"
              />
              <FormField
                title="Telephone"
                value={tel}
                placeholder="Telephone"
                handleChangeText={setTel}
                icon="call-outline"
              />
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Cancel"
                  handlePress={() => router.push("/")}
                  variant="secondary"
                />
                <CustomButton
                  title="Continue"
                  handlePress={() => setStep(2)}
                  isLoading={isLoading}
                />
              </View>
            </View>
          </CourseProvider>
        );
      case 2:
        return (
          <CourseProvider>
            <View>
              <FormField
                title="Department"
                value={department}
                placeholder="Department"
                handleChangeText={setDepartment}
                icon="business-outline"
              />
              <FormDropdown
                title="User Type"
                selectedValue={userType}
                onValueChange={setUserType}
                items={[
                  { label: "Student", value: "student" },
                  { label: "Instructor", value: "instructor" },
                  { label: "School Admin", value: "admin" },
                ]}
              />
              <FormField
                title={userType === "student" ? "Student ID" : "Instructor ID"}
                value={identifier}
                placeholder={
                  userType === "student" ? "Student ID" : "Instructor ID"
                }
                handleChangeText={setIdentifier}
                icon="person-outline"
              />
              <MultiSelect
                title="Courses"
                selectedValues={selectedCourses}
                onValueChange={setSelectedCourses}
                items={courses?.map((course) => ({
                  label: course.code,
                  value: course.code,
                }))}
              />
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Back"
                  handlePress={() => setStep(1)}
                  variant="secondary"
                />
                <CustomButton
                  title="Submit"
                  handlePress={() => handleSignUp()}
                  isLoading={isLoading}
                />
              </View>
            </View>
          </CourseProvider>
        );
      default:
        return null;
    }
  };

  return (
    <CourseProvider>
      <AuthProvider>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            <Image
              source={require("@/assets/images/atiutubo.png")}
              style={styles.logo}
            />
            <Stepper currentStep={step} totalSteps={3} />
            {renderStepContent()}
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text
                onPress={() => router.push("/signin")}
                style={styles.footerLink}
              >
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </AuthProvider>
    </CourseProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  footerText: {
    textAlign: "center",
    color: "#B0B0B0",
    marginTop: 20,
  },
  footerLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default SignUpScreen;
