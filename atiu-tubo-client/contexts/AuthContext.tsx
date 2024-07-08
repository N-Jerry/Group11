import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PersonalSettings, User } from '../types/index';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://192.168.1.179:5000/api';

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextProps {
  user: User | null;
  users: User[] | null | undefined;
  login: (user: User) => void;
  logout: () => void;
  signup: (userData: User) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  getUsers: () => Promise<User[] | null | undefined>;
  getPersonalSettings: () => Promise<PersonalSettings | null>;
  updatePersonalSettings: (settings: Partial<PersonalSettings>) => Promise<PersonalSettings | null>;
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
    alert("You are logout! Login To Continue")
  };

  const signup = async (userData: User) => {
    try {
      const response = await axios.post<AuthResponse>(`${baseURL}/auth/signup`, userData);
      setUser(response.data.user);
      AsyncStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>(`${baseURL}/auth/login`, { email, password });
      setUser(response.data.user);
      console.log(user)
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

      const response = await axios.patch<AuthResponse>(`${baseURL}/auth/update/${user._id}`, userData);
      const updatedUser = { ...user, ...userData, ...response.data.user };
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
          setUser(JSON.parse(storedUser).user);
          console.log("fetch user", user)
        }
      } catch (error) {
        console.error('Error fetching user from AsyncStorage:', error);
      }
    };

    fetchUser();
  }, []);

  const getPersonalSettings = async () => {
    try {
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      const response = await axios.get<PersonalSettings>(`${baseURL}/auth/settings/${user._id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching personal settings:', error);
      return null;
    }
  };


  // Function to update personal settings
  const updatePersonalSettings = async (settings: Partial<PersonalSettings>) => {
    try {
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      await axios.put<PersonalSettings>(`${baseURL}/auth/settings/${user._id}`, settings);
      // Assuming the API returns updated settings, you may handle them as needed
      return await getPersonalSettings()
    } catch (error) {
      console.error('Error updating personal settings:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, signup, signin, getPersonalSettings, updatePersonalSettings, updateProfile, getUsers }}>
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
