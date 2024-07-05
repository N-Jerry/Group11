import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

const OnboardingScreen: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    const steps = [
        { title: 'Welcome to MyApp', description: 'This is the first step of onboarding.' },
        { title: 'Stay Connected', description: 'This is the second step of onboarding.' },
        { title: 'Get Started', description: 'This is the third step of onboarding.' },
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.replace('/(welcome)/signup');
        }
    };

    return (
        <View className='flex-1 justify-center items-center'>
            <Text>
                {steps[currentStep].title}
            </Text>
            <Text>
                {steps[currentStep].description}
            </Text>
            <TouchableOpacity onPress={nextStep}>
                Next
            </TouchableOpacity>
        </View>
    );
};

export default OnboardingScreen;
