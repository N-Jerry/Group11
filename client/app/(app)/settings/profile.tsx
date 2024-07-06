import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuthContext } from '@/contexts/AuthContext';
import { User } from '@/types';

const ProfileScreen: React.FC = () => {
    const { user, updateProfile } = useAuthContext();
    const [editableUser, setEditableUser] = useState<Partial<User>>({});

    useEffect(() => {
        if (user) {
            setEditableUser({ ...user });
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        try {
            await updateProfile(editableUser);
            Alert.alert('Profile updated successfully');
        } catch (error) {
            Alert.alert('Error updating profile');
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>No user data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={editableUser.name}
                onChangeText={(text) => setEditableUser({ ...editableUser, name: text })}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={editableUser.email}
                onChangeText={(text) => setEditableUser({ ...editableUser, email: text })}
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
                style={styles.input}
                value={editableUser.tel}
                onChangeText={(text) => setEditableUser({ ...editableUser, tel: text })}
            />
            <Text style={styles.label}>Matricule</Text>
            <TextInput
                style={styles.input}
                value={editableUser.studentId || editableUser.instructorId}
                onChangeText={(text) => setEditableUser({ ...editableUser, studentId: text })}
            />
            <Text style={styles.label}>Department</Text>
            <TextInput
                style={styles.input}
                value={editableUser.department}
                onChangeText={(text) => setEditableUser({ ...editableUser, department: text })}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#436cfc',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
