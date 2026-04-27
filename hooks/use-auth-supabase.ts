import { useState, useEffect, useCallback } from 'react';
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

  // Verificar sessão ao carregar
  useEffect(() => {
    const init = async () => {
      try {
        // Limpar vestígios do mock antigo
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('authToken');

        // Obter sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Buscar dados completos do usuário
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              ...userData,
            } as User,
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
      } catch (err) {
        console.error('Erro ao inicializar auth:', err);
        setAuthState({
          user: null,
          isLoading: false,
          isSignedIn: false,
        });
      }
    };

    init();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Buscar dados completos do usuário
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              ...userData,
            } as User,
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
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session?.user) {
        // Buscar dados completos do usuário
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        setAuthState({
          user: {
            id: data.session.user.id,
            email: data.session.user.email || '',
            ...userData,
          } as User,
          isLoading: false,
          isSignedIn: true,
        });

        // Navegar para home
        router.replace('/(tabs)' as any);
      }
    } catch (err) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, [router]);

  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        isLoading: false,
        isSignedIn: false,
      });
      router.replace('/(auth)/login' as any);
    } catch (err) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, [router]);

  return {
    ...authState,
    login,
    logout,
  };
}
