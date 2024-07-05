import { Stack } from 'expo-router';

export default function InstructorLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="courses" />
            <Stack.Screen name="sessions" />
            <Stack.Screen name="records" />
        </Stack>
    );
}
