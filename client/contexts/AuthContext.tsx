import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/index';
import useAxios from '../hooks/useAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {

  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  signup: (userData: User) => Promise<void>;
  signin: (email: string, userType: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>; // Add the updateProfile function
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
    AsyncStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem('user');
  };

  const signup = async (userData: User) => {
    try {
      // Make signup request using useAxios hook
      const response = await useAxios<User>('/signup', {
        method: 'POST',
        data: userData
      });

      setUser(response.data);
      AsyncStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error during signup:', error);
      // Return a default user if signup fails
      // Handle error by setting a default user based on userType
      const defaultUser = userData.userType === 'student' ? {
        userId: 'student1',
        name: 'John Doe',
        email: 'student@example.com',
        password: '00000',
        userType: 'student',
        studentId: 'student1',
        courseIds: []
      } : {
        userId: 'instructor1',
        name: 'Jane Doe',
        email: 'instructor@example.com',
        password: '00000',
        userType: 'instructor',
        instructorId: 'instructor1',
        courseIds: []
      };
      setUser(defaultUser);
      AsyncStorage.setItem('user', JSON.stringify(defaultUser));
    }
  };

  const signin = async (email: string, userType: string, password: string) => {
    try {
      // Make signin request using useAxios hook
      const response = await useAxios<User>('/signin', {
        method: 'POST',
        data: { email, password }
      });

      setUser(response.data);
      AsyncStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error during signin:', error);
      // Return a default user if signin fails
      // Handle error by setting a default user based on userType
      const defaultUser = userType === 'student' ? {
        userId: 'student1',
        name: 'John Doe',
        email: 'student@example.com',
        password: '00000',
        userType: 'student',
        studentId: 'student1',
        courseIds: []
      } : {
        userId: 'instructor1',
        name: 'Jane Doe',
        email: 'instructor@example.com',
        password: '00000',
        userType: 'instructor',
        instructorId: 'instructor1',
        courseIds: []
      };
      setUser(defaultUser);
      AsyncStorage.setItem('user', JSON.stringify(defaultUser));
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      const response = await useAxios<User>(`/updateProfile/${user.userId}`, {
        method: 'PATCH',
        data: userData
      });

      const updatedUser = { ...user, ...userData, ...response.data };
      setUser(updatedUser);
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error during profile update:', error);
      const defaultUser = user?.userType === 'student' ? {
        userId: 'student1',
        name: 'John Doe',
        email: 'student@example.com',
        password: '00000',
        userType: 'student',
        studentId: 'student1',
        courseIds: ["course1", "course2"]
      } : {
        userId: 'instructor1',
        name: 'Jane Doe',
        email: 'instructor@example.com',
        password: '00000',
        userType: 'instructor',
        instructorId: 'instructor1',
        courseIds: ["course1", "course2"]
      };
      setUser(defaultUser);
      AsyncStorage.setItem('user', JSON.stringify(defaultUser));
    }
  };

  // Check async storage for user data on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error fetching user from AsyncStorage:', error);
      }
    };
  
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, signin, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};