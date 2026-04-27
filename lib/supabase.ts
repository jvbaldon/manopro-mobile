import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'SUA_URL_AQUI';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'SUA_CHAVE_AQUI';

// Durante o SSR do Expo Web, o código roda no Node.js onde nem window
// nem localStorage existem. O typeof guard evita o crash nessa fase.
// No browser (cliente) e no mobile, funciona normalmente.
const webStorage = {
  getItem: (key: string) =>
    Promise.resolve(typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null),
  setItem: (key: string, value: string) =>
    Promise.resolve(typeof localStorage !== 'undefined' ? localStorage.setItem(key, value) : undefined),
  removeItem: (key: string) =>
    Promise.resolve(typeof localStorage !== 'undefined' ? localStorage.removeItem(key) : undefined),
};

const storage = Platform.OS === 'web' ? webStorage : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});