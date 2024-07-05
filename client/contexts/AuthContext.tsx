import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/index';
import useAxios from '../hooks/useAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  user: User | null;
  users: User[] | null | undefined;
  login: (user: User) => void;
  logout: () => void;
  signup: (userData: User) => Promise<void>;
  signin: (email: string, userType: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  getUsers: () => Promise<User[] | null | undefined>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null | undefined>(null);

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
      const response = await useAxios<User>('auth/signup', {
        method: 'POST',
        data: userData
      });

      setUser(response.data);
      AsyncStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const signin = async (email: string, userType: string, password: string) => {
    try {
      // Make signin request using useAxios hook
      const response = await useAxios<User>('auth/login', {
        method: 'POST',
        data: { email, password }
      });

      setUser(response.data);
      AsyncStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error during signin:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      const response = await useAxios<User>(`auth/update/${user._id}`, {
        method: 'PATCH',
        data: userData
      });

      const updatedUser = { ...user, ...userData, ...response.data };
      setUser(updatedUser);
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error during profile update:', error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await useAxios<User[]>('auth/users', {
        method: 'GET'
      });
      setUsers(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return undefined;
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
    <AuthContext.Provider value={{ user, users, login, logout, signup, signin, updateProfile, getUsers }}>
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