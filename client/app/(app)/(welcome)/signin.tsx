import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';

const SignInScreen = () => {
  const router = useRouter();
  const signin = () => {
    alert("Signing in")
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectToSignUp, setRedirectToSignUp] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      //await signin(email, 'instructor', password); // Assuming userType 'student' for simplicity
      await signin(); // Assuming userType 'student' for simplicity
      router.push('instructor'); // Navigate to the home screen after successful sign-in
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert('Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (redirectToSignUp) {
    router.push('(wekcome)/signup');
  }

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/react-logo.png')} style={styles.logo} />
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
      <Text style={styles.orText}>Or</Text>
      <TouchableOpacity style={styles.googleButton}>
        <Image source={require('@/assets/images/react-logo.png')} style={styles.googleIcon} />
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text onPress={() => setRedirectToSignUp(true)} style={styles.footerLink}>
          Register
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginPrompt: {
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#B0B0B0',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  footerText: {
    textAlign: 'center',
    color: '#B0B0B0',
    marginTop: 20,
  },
  footerLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
