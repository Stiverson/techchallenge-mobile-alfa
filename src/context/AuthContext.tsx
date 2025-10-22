import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type AuthContextType, type UserData } from '../types/auth';

const AUTH_KEY = 'authToken';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const storedToken = await AsyncStorage.getItem(AUTH_KEY);
      } catch (e) {
        console.error("Failed to load auth:", e);
        await AsyncStorage.removeItem(AUTH_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async (authToken: string) => {
    await AsyncStorage.setItem(AUTH_KEY, authToken);
    const decoded = jwtDecode(authToken) as UserData;
    setToken(authToken);
    setUser(decoded);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated: !!token,
    token,
    user,
    isLoading,
    login,
    logout,
  };

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};