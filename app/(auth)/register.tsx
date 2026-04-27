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
import { supabase } from '@/lib/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading: authLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validações
    if (!fullName.trim()) {
      return Alert.alert('Erro', 'Digite seu nome completo');
    }

    if (!email.trim()) {
      return Alert.alert('Erro', 'Digite seu e-mail');
    }

    if (!password) {
      return Alert.alert('Erro', 'Digite uma senha');
    }

    if (password.length < 6) {
      return Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Erro', 'As senhas não coincidem');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Erro', 'E-mail inválido');
    }

    try {
      setIsLoading(true);

      // 1. Registrar no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // 2. Criar perfil do usuário na tabela users
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email: email.trim(),
          full_name: fullName.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        // Se falhar ao criar o perfil, deletar o usuário de auth
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso! Faça login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login' as any),
          },
        ]
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
      Alert.alert('Erro no Registro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginPress = () => {
    router.push('/(auth)/login' as any);
  };

  const isDisabled = isLoading || authLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="p-0 bg-white">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          {/* Header com Logo */}
          <View className="bg-[#2A9D76] px-6 py-8 items-center">
            <View className="w-14 h-14 bg-white rounded-full items-center justify-center mb-3">
              <Text className="text-2xl">🔧</Text>
            </View>
            <Text className="text-2xl font-bold text-white">ManoPro</Text>
            <Text className="text-green-50 text-xs mt-1">Gestão de Serviços</Text>
          </View>

          {/* Form */}
          <View className="px-6 py-6 flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-1">Criar Conta</Text>
            <Text className="text-gray-500 mb-6">Comece a gerenciar seus serviços</Text>

            {/* Full Name Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Nome Completo</Text>
              <TextInput
                placeholder="João Silva"
                value={fullName}
                onChangeText={setFullName}
                editable={!isDisabled}
                autoCapitalize="words"
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">E-mail</Text>
              <TextInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                editable={!isDisabled}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Senha</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg bg-white px-4">
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  editable={!isDisabled}
                  secureTextEntry={!showPassword}
                  className="flex-1 py-3 text-gray-900"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isDisabled}
                >
                  <Text className="text-gray-500 text-lg">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</Text>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Confirmar Senha</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg bg-white px-4">
                <TextInput
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isDisabled}
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 py-3 text-gray-900"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isDisabled}
                >
                  <Text className="text-gray-500 text-lg">
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms */}
            <View className="mb-6">
              <Text className="text-xs text-gray-600">
                Ao criar uma conta, você concorda com nossos{' '}
                <Text className="text-[#2A9D76] font-semibold">Termos de Serviço</Text> e{' '}
                <Text className="text-[#2A9D76] font-semibold">Política de Privacidade</Text>.
              </Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isDisabled}
              className={`rounded-lg py-4 items-center justify-center mb-4 ${
                isDisabled ? 'bg-gray-300' : 'bg-[#2A9D76]'
              }`}
            >
              {isDisabled ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Criar Conta</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="text-gray-500 px-3 text-sm">ou</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Register Buttons */}
            <TouchableOpacity
              disabled={isDisabled}
              className="border border-gray-300 rounded-lg py-3 items-center justify-center mb-3"
            >
              <Text className="text-gray-700 font-semibold">Continuar com Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isDisabled}
              className="border border-gray-300 rounded-lg py-3 items-center justify-center"
            >
              <Text className="text-gray-700 font-semibold">Continuar com Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="px-6 py-6 flex-row justify-center border-t border-gray-100">
            <Text className="text-gray-600">Já tem conta? </Text>
            <TouchableOpacity onPress={handleLoginPress} disabled={isDisabled}>
              <Text className="text-[#2A9D76] font-bold">Fazer login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
