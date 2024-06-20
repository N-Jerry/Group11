import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FormField from '../../components/FormField';
import FormDropdown from '../../components/FormDropdown';
import CustomButton from '../../components/CustomButton';
import { useAuthContext } from '../../contexts/AuthContext';
import { User } from '../../types/index';

const SignUpScreen = () => {
  const router = useRouter();
  const { signup } = useAuthContext(); // Importing the signup function from AuthContext
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const newUser: User = {
        userId: '',
        name,
        email,
        password,
        userType,
      };

      await signup(newUser);

      router.push('auth/enrollment');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Image source={require('../../assets/images/react-logo.png')} style={styles.logo} />
        <Text style={styles.registerText}>Register</Text>
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
        <FormDropdown
          title="User Type"
          selectedValue={userType}
          onValueChange={setUserType}
          items={[
            { label: 'Student', value: 'student' },
            { label: 'Teacher', value: 'teacher' },
            { label: 'School Admin', value: 'admin' },
          ]}
        />
        <CustomButton
          title="Register"
          handlePress={handleSignUp}
          isLoading={isLoading}
        />
        <Text style={styles.orText}>Or</Text>
        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('../../assets/images/react-logo.png')} style={styles.googleIcon} />
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text onPress={() => router.push('/auth/signin')} style={styles.footerLink}>
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
  registerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007BFF',
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

export default SignUpScreen;
