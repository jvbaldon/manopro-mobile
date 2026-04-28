import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'SUA_URL_AQUI';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'SUA_CHAVE_AQUI';

// NÃO usamos Platform.OS aqui pois ele importa módulos nativos (PlatformConstants)
// que causam crash no New Architecture (newArchEnabled: true) durante a inicialização.
//
// Lógica de detecção de ambiente sem dependências nativas:
// - iOS/Android: window e document não existem → usa AsyncStorage
// - Browser web real: window, document e localStorage existem → usa localStorage
// - SSR do Expo Web (Node.js): window existe mas localStorage não → usa AsyncStorage
const isWebBrowser =
  typeof window !== 'undefined' &&
  typeof document !== 'undefined' &&
  typeof localStorage !== 'undefined';

const webStorage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) =>
    Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
};

const storage = isWebBrowser ? webStorage : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
