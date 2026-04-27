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

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validações
    if (!email.trim()) {
      return Alert.alert('Erro', 'Digite seu e-mail');
    }

    if (!password) {
      return Alert.alert('Erro', 'Digite sua senha');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Erro', 'E-mail inválido');
    }

    try {
      await login(email.trim(), password);
      // Navegação é feita automaticamente pelo hook
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      Alert.alert('Erro de Login', errorMessage);
    }
  };

  const handleRegisterPress = () => {
    router.push('/(auth)/register' as any);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="p-0 bg-white">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          {/* Header com Logo */}
          <View className="bg-[#2A9D76] px-6 py-12 items-center">
            <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-4">
              <Text className="text-3xl">🔧</Text>
            </View>
            <Text className="text-3xl font-bold text-white">ManoPro</Text>
            <Text className="text-green-50 text-sm mt-2">Gestão de Serviços</Text>
          </View>

          {/* Form */}
          <View className="px-6 py-8 flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo!</Text>
            <Text className="text-gray-500 mb-8">Faça login para continuar</Text>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">E-mail</Text>
              <TextInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Senha</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg bg-white px-4">
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                  secureTextEntry={!showPassword}
                  className="flex-1 py-3 text-gray-900"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Text className="text-gray-500 text-lg">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity className="mb-6">
              <Text className="text-[#2A9D76] font-semibold text-sm">Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`rounded-lg py-4 items-center justify-center mb-4 ${
                isLoading ? 'bg-gray-300' : 'bg-[#2A9D76]'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="text-gray-500 px-3 text-sm">ou</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              disabled={isLoading}
              className="border border-gray-300 rounded-lg py-3 items-center justify-center mb-3"
            >
              <Text className="text-gray-700 font-semibold">Continuar com Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isLoading}
              className="border border-gray-300 rounded-lg py-3 items-center justify-center mb-6"
            >
              <Text className="text-gray-700 font-semibold">Continuar com Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View className="px-6 py-6 flex-row justify-center border-t border-gray-100">
            <Text className="text-gray-600">Não tem conta? </Text>
            <TouchableOpacity onPress={handleRegisterPress} disabled={isLoading}>
              <Text className="text-[#2A9D76] font-bold">Criar conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
