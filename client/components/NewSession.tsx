import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormField from './FormField';
import CustomButton from './CustomButton';
import { Course, SessionC } from '@/types';
import FormDropdown from './FormDropdown';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCourseContext } from '@/contexts/CourseContext';
import { useSession } from '@/contexts/SessionContext';

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
    const [courseId, setCourseId] = useState(selectedCourse? selectedCourse._id : courses.find(c => user?.courseCodes?.includes(c.code))?._id);
    const [startInMinutes, setStartInMinutes] = useState(0);
    const [endInMinutes, setEndInMinutes] = useState(5);
    const [location, setLocation] = useState('Default Room');

    const timeOptions = [
        { label: "Now", value: 0 },
        { label: "5 mins", value: 5 },
        { label: "10 mins", value: 10 },
        { label: "15 mins", value: 15 },
        { label: "20 mins", value: 20 },
    ];

    const courseOptions: Item[] = courses.filter(c => user?.courseCodes?.includes(c.code)).map(course => ({
        label: course.code,
        value: course._id
    }));

    const calculateDate = (minutes: number) => {
        return new Date(Date.now() + minutes * 60000);
    };

    const handleConfirm = async () => {
        if(courseId){
            const date = calculateDate(startInMinutes);
            const deadline = calculateDate(startInMinutes + endInMinutes);
            const newSession: SessionC = {
                date: date,
                deadline: deadline,
                location: location,
                course: courseId
            };
            await createSession(newSession);
            onClose();
        } else {
            alert("Select a course First")
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
                <FormField
                    title="Location"
                    value={location}
                    handleChangeText={setLocation}
                    placeholder='Hall'
                    icon='location-icon'
                />
            </View>
            <View style={styles.formFieldContainer}>
                <FormDropdown
                    items={timeOptions}
                    selectedValue={startInMinutes}
                    onValueChange={setStartInMinutes}
                    title='Starts In'
                />
            </View>
            <View style={styles.formFieldContainer}>
                <FormDropdown
                    items={timeOptions}
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
    formField: {
        width: '100%',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default NewSessionForm;
