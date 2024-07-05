import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/index';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; // Import Alert for displaying errors

const baseURL = 'http://localhost:5000/api';

interface AuthContextProps {
  user: User | null;
  users: User[] | null | undefined;
  login: (user: User) => void;
  logout: () => void;
  signup: (userData: User) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  getUsers: () => Promise<User[] | null | undefined>;
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
      const response = await axios.post<User>(`${baseURL}/auth/signup`, userData);
      setUser(response.data);
      AsyncStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  };
  
  const signin = async (email: string, password: string) => {
    try {
      const response = await axios.post<User>(`${baseURL}/auth/login`, { email, password });
      setUser(response.data);
      AsyncStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      const response = await axios.patch<User>(`${baseURL}/auth/update/${user._id}`, userData);
      const updatedUser = { ...user, ...userData, ...response.data };
      setUser(updatedUser);
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error during profile update:', error);
      throw error;
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get<User[]>(`${baseURL}/auth/users`);
      setUsers(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return null;
    }
  };

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
