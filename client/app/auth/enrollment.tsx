import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import * as LocalAuthentication from 'expo-local-authentication';
import DashboardContainer from '../../components/DashboardContainer';
import FormField from '../../components/FormField';
import MultiSelect from '../../components/FormMultiSelect';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDataContext } from '@/contexts/DataContext';

const BiometricEnrollmentScreen: React.FC = () => {
    const router = useRouter();
    const { user, updateProfile } = useAuthContext();
    const { courses, coursesLoading: loading } = useDataContext();
    const [isLoading, setIsLoading] = useState(false);
    const [redirectToDashboard, setRedirectToDashboard] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [fingerprintData, setFingerprintData] = useState<string | null>(null);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!user) {
            router.push('/auth/signin');
        } else {
            if (user.userType === 'student') {
                setIdentifier(user.studentId || '');
            } else if (user.userType === 'instructor') {
                setIdentifier(user.instructorId || '');
            }
        }
    }, [user]);

    const handleEnroll = async () => {
        setIsLoading(true);
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && !isEnrolled) {
            try {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: 'Authenticate',
                    cancelLabel: 'Cancel',
                    fallbackLabel: 'Use Passcode',
                });
                if (result.success) {
                    setProgress(100);
                    Alert.alert('Success', 'Fingerprint authenticated successfully.');

                    // Generate a mock fingerprint data for demonstration
                    const mockFingerprintData = `${user?.studentId}_fingerprint`;
                    setFingerprintData(mockFingerprintData);
                } else {
                    Alert.alert('Failed', 'Fingerprint authentication failed.');
                }
            } catch (error) {
                Alert.alert('Error', 'An error occurred during fingerprint authentication.');
            }
        } else {
            Alert.alert('Unavailable', 'Biometric authentication is not available or already enrolled.');
        }

        setIsLoading(false);
    };

    const handleUpdateProfile = async () => {
        const updatedProfile = {
            ...user,
            studentId: user?.userType === 'student' ? identifier : undefined,
            instructorId: user?.userType === 'instructor' ? identifier : undefined,
            courseIds: selectedCourses,
            fingerprintData: fingerprintData,
        };

        try {
            await updateProfile(updatedProfile);
            setRedirectToDashboard(true);
        } catch (error) {
            Alert.alert('Error', 'An error occurred while updating the profile.');
        }
    };

    if (redirectToDashboard) {
        router.push(`${user?.userType === 'student' ? '/dashboard' : '/instructor'}`);
    }

    const renderContent = () => {
        if (loading) {
            return <Text>Loading...</Text>;
        }

        if (user?.userType === 'instructor') {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Set up Instructor account</Text>
                    <FormField
                        title="Instructor ID"
                        value={identifier}
                        placeholder="Instructor ID"
                        handleChangeText={setIdentifier}
                        icon="person-outline"
                    />
                    <MultiSelect
                        title="Courses"
                        selectedValues={selectedCourses}
                        onValueChange={setSelectedCourses}
                        items={courses.map(course => ({
                            label: course.name,
                            value: course.courseId,
                        }))}
                    />
                    <CustomButton title="Submit" handlePress={handleUpdateProfile} />
                </View>
            );
        } else if (user?.userType === 'student') {
            switch (step) {
                case 1:
                    return (
                        <View style={styles.container}>
                            <Text style={styles.title}>Set up Student account</Text>
                            <FormField
                                title="Matricule"
                                value={identifier}
                                placeholder="Matricule"
                                handleChangeText={setIdentifier}
                                icon="person-outline"
                            />
                            <MultiSelect
                                title="Courses"
                                selectedValues={selectedCourses}
                                onValueChange={setSelectedCourses}
                                items={courses.map(course => ({
                                    label: course.name,
                                    value: course.courseId,
                                }))}
                            />
                            <CustomButton title="Continue" handlePress={() => setStep(2)} />
                        </View>
                    );
                case 2:
                    return (
                        <View style={styles.container}>
                            <Text style={styles.title}>Enroll Fingerprint</Text>
                            <Text style={styles.description}>{progress}% scanning...</Text>
                            <TouchableOpacity onPress={handleEnroll}>
                                <View style={styles.fingerprint}>
                                    <Text style={styles.fingerprintText}>
                                        Place your finger on your fingerprint sensor to enroll
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                case 3:
                    return (
                        <View style={styles.container}>
                            <Text style={styles.title}>Enroll Fingerprint</Text>
                            <Text style={styles.description}>100% complete...</Text>
                            <CustomButton title="Submit" handlePress={handleUpdateProfile} />
                        </View>
                    );
                default:
                    return null;
            }
        }
        return null;
    };

    return (
        <DashboardContainer>
            {renderContent()}
            {step === 2 && (
                <TouchableOpacity onPress={() => setRedirectToDashboard(true)}>
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            )}
        </DashboardContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
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
    skipText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#007BFF',
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
});

export default BiometricEnrollmentScreen;
