import 'react-native-url-polyfill/auto'; // ESSENCIAL para evitar erro de rede no React Native
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE: Se você não estiver usando um arquivo .env, coloque as strings aqui
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'SUA_URL_AQUI';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'SUA_CHAVE_AQUI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    detectSessionInUrl: false,
  },
});