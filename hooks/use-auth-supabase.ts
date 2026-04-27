await AsyncStorage.removeItem('user'); // Limpa o vestígio do mock antigo
await AsyncStorage.removeItem('authToken'); // Limpa o vestígio do mock antigo
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase'; // Importa seu cliente real
import { User, AuthState } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuthSupabase() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isSignedIn: false,
  });

  // Verifica sessão ao carregar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ? { id: session.user.id, email: session.user.email || '' } as User : null,
        isLoading: false,
        isSignedIn: !!session,
      });
    });
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    router.replace('/');
  };

  const register = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) throw error;
    router.replace('/');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login' as any);
  };

  return { ...authState, login, register, logout };
}