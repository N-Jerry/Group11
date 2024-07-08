import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";

const SignInScreen = () => {
  const router = useRouter();
  const { signin, user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirectToSignUp, setRedirectToSignUp] = useState(false);

  useEffect(() => {
    if (user && user.userType === "instructor") router.push("/instructor");
    if (user && user.userType === "student") router.push("/student");
    if (user && user.userType === "admin") router.push("/admin");
  }, [user]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signin(email, password);
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      alert(
        `Signin failed: ${error.response?.data?.error || "Please try again"}.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (redirectToSignUp) {
    router.push("/signup");
  }

  return (
    <AuthProvider>
      <CourseProvider>
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/atiutubo.png")}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.loginPrompt}>Login to continue</Text>
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
          <CustomButton
            title="Sign In"
            handlePress={handleSignIn}
            isLoading={isLoading}
          />
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text
              onPress={() => setRedirectToSignUp(true)}
              style={styles.footerLink}
            >
              Register
            </Text>
          </Text>
        </View>
      </CourseProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
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
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  loginPrompt: {
    fontSize: 16,
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 20,
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    color: "#B0B0B0",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
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

export default SignInScreen;
