import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { User, AuthState } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuthSupabase() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isSignedIn: false,
  });

  // Limpa vestígios do mock antigo e verifica sessão ao carregar
  useEffect(() => {
    const init = async () => {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');

      const { data: { session } } = await supabase.auth.getSession();
      setAuthState({
        user: session?.user
          ? { id: session.user.id, email: session.user.email || '' } as User
          : null,
        isLoading: false,
        isSignedIn: !!session,
      });
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    router.replace('/');
  };

  const register = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    router.replace('/');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login' as any);
  };

  return { ...authState, login, register, logout };
}
