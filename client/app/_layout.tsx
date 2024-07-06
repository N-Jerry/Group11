import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { Slot } from 'expo-router';
import { FeedbackProvider } from '@/contexts/FeedbackContext';

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
