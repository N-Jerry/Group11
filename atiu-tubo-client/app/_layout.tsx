import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { Slot } from 'expo-router';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
import { SessionProvider } from '@/contexts/SessionContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <CourseProvider>
          <SessionProvider>
            <FeedbackProvider>
              <Slot />
            </FeedbackProvider>
          </SessionProvider>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
