import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';

const COLORS = {
  brand: '#2A9D76',
  brandDark: '#1B7055',
  brandLight: '#E8F4F0',
  accent: '#F5820D',
  white: '#FFFFFF',
  bg: '#F7F6F3',
  border: '#E5E3DC',
  text: '#2C2B27',
  muted: '#8C8A82',
  inputBg: '#FAF9F7',
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim()) return Alert.alert('Atenção', 'Digite seu e-mail');
    if (!password) return Alert.alert('Atenção', 'Digite sua senha');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return Alert.alert('Atenção', 'E-mail inválido');
    try {
      await login(email.trim(), password);
    } catch (err) {
      Alert.alert('Erro de Login', err instanceof Error ? err.message : 'Erro ao fazer login');
    }
  };

  const inputStyle = (field: string) => ({
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: focusedField === field ? COLORS.brand : COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: COLORS.white }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: COLORS.white }}
      >
        {/* Cabeçalho verde */}
        <View style={{
          backgroundColor: COLORS.brand,
          paddingHorizontal: 24,
          paddingTop: 56,
          paddingBottom: 40,
          alignItems: 'center',
        }}>
          {/* Logo */}
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 4,
          }}>
            <Text style={{ fontSize: 32 }}>🔧</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: COLORS.white, letterSpacing: -0.5 }}>
            ManoPro
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            Gestão de Serviços
          </Text>
        </View>

        {/* Formulário */}
        <View style={{
          backgroundColor: COLORS.white,
          marginHorizontal: 0,
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 16,
          flex: 1,
        }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 6 }}>
            Bem-vindo!
          </Text>
          <Text style={{ fontSize: 15, color: COLORS.muted, marginBottom: 28 }}>
            Faça login para continuar
          </Text>

          {/* E-mail */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 11, fontWeight: '600', color: COLORS.muted,
              textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
            }}>
              E-MAIL
            </Text>
            <TextInput
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.muted}
              style={inputStyle('email')}
            />
          </View>

          {/* Senha */}
          <View style={{ marginBottom: 8 }}>
            <Text style={{
              fontSize: 11, fontWeight: '600', color: COLORS.muted,
              textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
            }}>
              SENHA
            </Text>
            <View style={{
              backgroundColor: COLORS.inputBg,
              borderWidth: 1,
              borderColor: focusedField === 'password' ? COLORS.brand : COLORS.border,
              borderRadius: 4,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
            }}>
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                editable={!isLoading}
                secureTextEntry={!showPassword}
                placeholderTextColor={COLORS.muted}
                style={{ flex: 1, paddingVertical: 12, fontSize: 15, color: COLORS.text }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ fontSize: 18 }}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Esqueceu senha */}
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 28 }}>
            <Text style={{ fontSize: 13, color: COLORS.brand, fontWeight: '600' }}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          {/* Botão entrar */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? COLORS.border : COLORS.brand,
              borderRadius: 9999,
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              shadowColor: COLORS.brand,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isLoading ? 0 : 0.3,
              shadowRadius: 8,
              elevation: isLoading ? 0 : 4,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Divisor */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            <Text style={{ color: COLORS.muted, paddingHorizontal: 12, fontSize: 13 }}>ou</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          </View>

          {/* Social */}
          <TouchableOpacity
            disabled={isLoading}
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 4,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              backgroundColor: COLORS.white,
            }}
          >
            <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 14 }}>Continuar com Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isLoading}
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 4,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.white,
            }}
          >
            <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 14 }}>Continuar com Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={{
          paddingVertical: 24,
          paddingHorizontal: 24,
          flexDirection: 'row',
          justifyContent: 'center',
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.white,
        }}>
          <Text style={{ fontSize: 14, color: COLORS.muted }}>Não tem conta? </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register' as any)}
            disabled={isLoading}
          >
            <Text style={{ fontSize: 14, color: COLORS.brand, fontWeight: '700' }}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
