import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme'; // Adjust the path as per your file structure
import { Colors } from '@/constants/Colors'; // Adjust the path as per your file structure
import CustomButton from '@/components/CustomButton2'; // Adjust the path as per your file structure
import { useAuthContext } from '@/contexts/AuthContext'; // Adjust the path as per your file structure
import { PersonalSettings, NotificationPreferences, SecuritySettings, PrivacySettings } from '@/types'; // Adjust the path as per your file structure
import { router } from 'expo-router'; // Ensure router is correctly imported from expo-router

const SettingsScreen: React.FC = () => {
    const { logout, updatePersonalSettings, getPersonalSettings } = useAuthContext(); // Ensure updatePersonalSettings and getPersonalSettings are part of AuthContext
    const colorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [personalSettings, setPersonalSettings] = useState<PersonalSettings | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const fetchedSettings = await getPersonalSettings();
                if (fetchedSettings) {
                    setPersonalSettings(fetchedSettings);
                }
            } catch (error) {
                console.error('Error fetching personal settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(previousState => !previousState);
    };

    const handleLogout = async () => {
        await logout();
        router.push('signin'); // Ensure you have navigation set up for router.push
    };

    const handleUpdateSettings = async (updatedPreferences: Partial<PersonalSettings>) => {
        try {
            // Ensure personalSettings is defined before spreading its properties
            const updatedNotificationPreferences: NotificationPreferences = {
                ...personalSettings?.notificationPreferences,
                email: updatedPreferences.notificationPreferences?.email ?? personalSettings?.notificationPreferences?.email ?? false,
                sms: updatedPreferences.notificationPreferences?.sms ?? personalSettings?.notificationPreferences?.sms ?? false,
                push: updatedPreferences.notificationPreferences?.push ?? personalSettings?.notificationPreferences?.push ?? false
            };

            const updatedSecuritySettings: SecuritySettings = {
                ...personalSettings?.securitySettings,
                twoFactorAuth: updatedPreferences.securitySettings?.twoFactorAuth ?? personalSettings?.securitySettings?.twoFactorAuth ?? 'disabled',
                loginAlerts: updatedPreferences.securitySettings?.loginAlerts ?? personalSettings?.securitySettings?.loginAlerts ?? 'disabled'
            };

            const updatedPrivacySettings: PrivacySettings = {
                ...personalSettings?.privacySettings,
                dataSharing: updatedPreferences.privacySettings?.dataSharing ?? personalSettings?.privacySettings?.dataSharing ?? 'disabled',
                activityStatus: updatedPreferences.privacySettings?.activityStatus ?? personalSettings?.privacySettings?.activityStatus ?? 'visible'
            };

            await updatePersonalSettings({
                notificationPreferences: updatedNotificationPreferences,
                securitySettings: updatedSecuritySettings,
                privacySettings: updatedPrivacySettings,
                ...updatedPreferences  // Merge other settings if needed
            });
            // Optionally, update local state or show success message
        } catch (error) {
            console.error('Error updating settings:', error);
            // Handle error (e.g., show error message)
        }
    };

    // Function to toggle notification preferences
    const toggleNotificationPreference = async (type: 'email' | 'sms' | 'push') => {
        try {
            const updatedPreferences: Partial<PersonalSettings> = {
                notificationPreferences: {
                    ...personalSettings?.notificationPreferences,
                    [type]: !personalSettings?.notificationPreferences[type]
                }
            };
            await handleUpdateSettings(updatedPreferences);
        } catch (error) {
            console.error(`Error toggling ${type} notification preference:`, error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Settings</Text>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>Account Profile Information</Text>
                <TouchableOpacity style={styles.arrow}>
                    <Text>➡️</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>Language Preferences</Text>
                <TouchableOpacity style={styles.arrow}>
                    <Text>➡️</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>Notification Preferences</Text>
                <TouchableOpacity style={styles.arrow}>
                    <Text>➡️</Text>
                </TouchableOpacity>
                <View style={styles.subMenu}>
                    <View style={styles.subOption}>
                        <Text>Email</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: Colors[colorScheme ?? 'light'].tint }}
                            thumbColor={personalSettings?.notificationPreferences.email ? Colors[colorScheme ?? 'light'].tint : "#f4f3f4"}
                            onValueChange={() => toggleNotificationPreference('email')}
                            value={personalSettings?.notificationPreferences.email}
                        />
                    </View>
                    <View style={styles.subOption}>
                        <Text>SMS</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: Colors[colorScheme ?? 'light'].tint }}
                            thumbColor={personalSettings?.notificationPreferences.sms ? Colors[colorScheme ?? 'light'].tint : "#f4f3f4"}
                            onValueChange={() => toggleNotificationPreference('sms')}
                            value={personalSettings?.notificationPreferences.sms}
                        />
                    </View>
                    <View style={styles.subOption}>
                        <Text>Push</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: Colors[colorScheme ?? 'light'].tint }}
                            thumbColor={personalSettings?.notificationPreferences.push ? Colors[colorScheme ?? 'light'].tint : "#f4f3f4"}
                            onValueChange={() => toggleNotificationPreference('push')}
                            value={personalSettings?.notificationPreferences.push}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>Security Settings</Text>
                <TouchableOpacity style={styles.arrow}>
                    <Text>➡️</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>Privacy Settings</Text>
                <TouchableOpacity style={styles.arrow}>
                    <Text>➡️</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>Dark Mode</Text>
                <Switch
                    trackColor={{ false: "#767577", true: Colors[colorScheme ?? 'light'].tint }}
                    thumbColor={isDarkMode ? Colors[colorScheme ?? 'light'].tint : "#f4f3f4"}
                    onValueChange={toggleDarkMode}
                    value={isDarkMode}
                />
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>Help Center</Text>
                <TouchableOpacity style={styles.arrow}>
                    <Text>➡️</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>Feedback</Text>
                <TouchableOpacity style={styles.arrow}>
                    <Text>➡️</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>About</Text>
                <TouchableOpacity style={styles.arrow}>
                    <Text>➡️</Text>
                </TouchableOpacity>
            </View>
            <CustomButton
                title="Logout"
                onPress={() => handleLogout()}
                buttonStyle={styles.logoutButton}
                textStyle={styles.logoutButtonText}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    header: {
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 2,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#436cfc',
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 2,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
        color: '#333',
    },
    arrow: {
        padding: 5,
    },
    subMenu: {
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    subOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff0000',
    },
    logoutButtonText: {
        color: '#fff',
    },
});

export default SettingsScreen;
