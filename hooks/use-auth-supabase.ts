import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '@/lib/types';

export function useAuthSupabase() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isSignedIn: false,
  });

  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('authToken');

        if (storedUser && token) {
          const user: User = JSON.parse(storedUser);
          setAuthState({
            user,
            isLoading: false,
            isSignedIn: true,
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isSignedIn: false,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar usuário armazenado:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isSignedIn: false,
          error: 'Erro ao verificar autenticação',
        });
      }
    };

    checkStoredUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const mockUser: User = {
        id: '1',
        email,
        full_name: 'Usuário Teste',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('authToken', 'mock-token-' + Date.now());

      setAuthState({
        user: mockUser,
        isLoading: false,
        isSignedIn: true,
      });

      router.replace('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setAuthState({
        user: null,
        isLoading: false,
        isSignedIn: false,
        error: errorMessage,
      });
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const mockUser: User = {
        id: '1',
        email,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('authToken', 'mock-token-' + Date.now());

      setAuthState({
        user: mockUser,
        isLoading: false,
        isSignedIn: true,
      });

      router.replace('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar';
      setAuthState({
        user: null,
        isLoading: false,
        isSignedIn: false,
        error: errorMessage,
      });
    }
  };

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');

      setAuthState({
        user: null,
        isLoading: false,
        isSignedIn: false,
      });

      router.replace('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer logout';
      setAuthState({
        user: null,
        isLoading: false,
        isSignedIn: false,
        error: errorMessage,
      });
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
}