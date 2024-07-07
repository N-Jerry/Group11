import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import FormDropdown from './FormDropdown';
import CustomButton from './CustomButton';
import { Course, SessionC } from '@/types';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCourseContext } from '@/contexts/CourseContext';
import { useSession } from '@/contexts/SessionContext';
import * as Location from 'expo-location';

interface Item {
    label: string;
    value: any;
}

interface NewSessionFormProps {
    selectedCourse?: Course;
    onClose: () => void;
    isLoading?: boolean;
}

const NewSessionForm: React.FC<NewSessionFormProps> = ({ selectedCourse, onClose, isLoading }) => {
    const { courses } = useCourseContext();
    const { createSession } = useSession();
    const { user } = useAuthContext();
    const [courseId, setCourseId] = useState(selectedCourse ? selectedCourse._id : courses.find(c => user?.courseCodes?.includes(c.code))?._id);
    const [startInMinutes, setStartInMinutes] = useState(0);
    const [endInMinutes, setEndInMinutes] = useState(5);
    const [coords, setCoords] = useState<{ latitude: number, longitude: number } | null>(null);

    const timeInOptions = [
        { label: "Now", value: 0 },
        { label: "5 mins", value: 5 },
        { label: "10 mins", value: 10 },
        { label: "15 mins", value: 15 },
        { label: "20 mins", value: 20 },
        { label: "30 mins", value: 30 },
    ];

    const timeOutOptions = [
        { label: "5 mins", value: 5 },
        { label: "10 mins", value: 10 },
        { label: "15 mins", value: 15 },
        { label: "20 mins", value: 20 },
        { label: "30 mins", value: 30 },
        { label: "45 mins", value: 45 },
        { label: "60 mins", value: 60 },
    ];

    const courseOptions: Item[] = courses.filter(c => user?.courseCodes?.includes(c.code)).map(course => ({
        label: course.code,
        value: course._id
    }));

    const calculateDate = (minutes: number) => {
        return new Date(Date.now() + minutes * 60000);
    };

    const fetchLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location permission is required to create a session.");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCoords({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    const handleConfirm = async () => {
        if (!coords) {
            alert("Location not available: Please enable location services.");
            return;
        }

        if (courseId) {
            const date = calculateDate(startInMinutes);
            const deadline = calculateDate(startInMinutes + endInMinutes);
            const newSession: SessionC = {
                date: date,
                deadline: deadline,
                location: `Lat: ${coords.latitude}, Lon: ${coords.longitude}`,
                course: courseId
            };
            await createSession(newSession);
            onClose();
        } else {
            alert("Select a course First");
        }
    };

    const handleCancel = () => {
        onClose();
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>New {courses.find(c => c._id === courseId)?.title} Session</Text>
            <View style={styles.formFieldContainer}>
                <FormDropdown
                    items={courseOptions}
                    selectedValue={courseId}
                    onValueChange={setCourseId}
                    title='Course'
                />
            </View>
            <View style={styles.formFieldContainer}>
                <Text style={styles.locationText}>Location: {coords ? `Lat: ${coords.latitude}, Lon: ${coords.longitude}` : 'Fetching location...'}</Text>
            </View>
            <View style={styles.formFieldContainer}>
                <FormDropdown
                    items={timeInOptions}
                    selectedValue={startInMinutes}
                    onValueChange={setStartInMinutes}
                    title='Starts In'
                />
            </View>
            <View style={styles.formFieldContainer}>
                <FormDropdown
                    items={timeOutOptions}
                    selectedValue={endInMinutes}
                    onValueChange={setEndInMinutes}
                    title='Ends In'
                />
            </View>
            <View style={styles.actions}>
                <CustomButton
                    title="Cancel"
                    handlePress={handleCancel}
                    isLoading={isLoading}
                    variant="secondary"
                />
                <CustomButton
                    title="New Session"
                    handlePress={handleConfirm}
                    isLoading={isLoading}
                    variant="primary"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        width: 300,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#436cfc',
    },
    formFieldContainer: {
        width: '100%',
        marginBottom: 16,
    },
    locationText: {
        fontSize: 16,
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default NewSessionForm;
