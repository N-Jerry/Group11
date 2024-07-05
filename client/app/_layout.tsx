import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { Slot } from 'expo-router'; // Adjust this import as needed

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <CourseProvider>
          <SessionProvider>
            <Slot />
          </SessionProvider>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
