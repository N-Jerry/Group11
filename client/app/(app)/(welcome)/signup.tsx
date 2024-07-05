import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from '@/types';
import FormField from '@/components/FormField';
import FormDropdown from '@/components/FormDropdown';
import CustomButton from '@/components/CustomButton';
import MultiSelect from '@/components/FormMultiSelect';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCourseContext } from '@/contexts/CourseContext';

const SignUpScreen = () => {
    const { signup } = useAuthContext()
    const { courses } = useCourseContext()
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tel, setTel] = useState('');
    const [userType, setUserType] = useState('student');
    const [department, setDepartment] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const newUser: User = {
                _id: '',
                name,
                email,
                password,
                tel,
                userType,
                studentId: userType === 'student' ? identifier : undefined,
                instructorId: userType === 'instructor' ? identifier : undefined,
                courseCodes: selectedCourses,
                department,
            };

            await signup(newUser);
            router.push(`${userType === 'student' ? '/dashboard' : '/instructor'}`);
        } catch (error: any) {
            console.error('Error during signup:', error);
            alert(`Signin failed: ${error.response?.data?.error || 'Please try again'}.`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
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
                        <FormDropdown
                            title="User Type"
                            selectedValue={userType}
                            onValueChange={setUserType}
                            items={[
                                { label: 'Student', value: 'student' },
                                { label: 'Instructor', value: 'instructor' },
                                { label: 'School Admin', value: 'admin' },
                            ]}
                        />
                        <CustomButton
                            title="Next"
                            handlePress={() => setStep(2)}
                            isLoading={isLoading}
                        />
                    </View>
                );
            case 2:
                return (
                    <View>
                        <FormField
                            title="Department"
                            value={department}
                            placeholder="Department"
                            handleChangeText={setDepartment}
                            icon="business-outline"
                        />
                        <FormField
                            title={userType === 'student' ? 'Student ID' : 'Instructor ID'}
                            value={identifier}
                            placeholder={userType === 'student' ? 'Student ID' : 'Instructor ID'}
                            handleChangeText={setIdentifier}
                            icon="person-outline"
                        />
                        <MultiSelect
                            title="Courses"
                            selectedValues={selectedCourses}
                            onValueChange={setSelectedCourses}
                            items={courses?.map(course => ({
                                label: course.code,
                                value: course.code
                            }))}
                        />
                        <CustomButton
                            title={'Register'}
                            handlePress={() => handleSignUp()}
                            isLoading={isLoading}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
                <Image source={require('@/assets/images/react-logo.png')} style={styles.logo} />
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
                </View>
                {renderStepContent()}
                <Text style={styles.footerText}>
                    Already have an account?{' '}
                    <Text onPress={() => router.push('/signin')} style={styles.footerLink}>
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
    progressContainer: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        marginVertical: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007BFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#007BFF',
    },
    description: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        color: '#666',
    },
    fingerprint: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
    },
    fingerprintText: {
        fontSize: 16,
        color: '#007BFF',
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
