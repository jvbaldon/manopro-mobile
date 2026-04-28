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
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const COLORS = {
  brand: '#2A9D76',
  brandDark: '#1B7055',
  white: '#FFFFFF',
  bg: '#F7F6F3',
  border: '#E5E3DC',
  text: '#2C2B27',
  muted: '#8C8A82',
  inputBg: '#FAF9F7',
};

const FormField = ({
  label, value, onChangeText, placeholder, secureTextEntry,
  showToggle, onToggle, showPassword, keyboardType, autoCapitalize,
  hint, focusedField, fieldKey, onFocus, onBlur, editable,
}: any) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{
      fontSize: 11, fontWeight: '600', color: COLORS.muted,
      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
    }}>
      {label}
    </Text>
    <View style={{
      backgroundColor: COLORS.inputBg,
      borderWidth: 1,
      borderColor: focusedField === fieldKey ? COLORS.brand : COLORS.border,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
    }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'none'}
        onFocus={() => onFocus(fieldKey)}
        onBlur={onBlur}
        editable={editable !== false}
        placeholderTextColor={COLORS.muted}
        style={{ flex: 1, paddingVertical: 12, fontSize: 15, color: COLORS.text }}
      />
      {showToggle && (
        <TouchableOpacity
          onPress={onToggle}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ padding: 4 }}
        >
          <Text style={{ fontSize: 16, color: COLORS.muted }}>{showPassword ? 'O' : 'O/'}</Text>
        </TouchableOpacity>
      )}
    </View>
    {hint && (
      <Text style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{hint}</Text>
    )}
  </View>
);

export default function RegisterScreen() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isDisabled = isLoading || authLoading;

  const handleRegister = async () => {
    if (!fullName.trim()) return Alert.alert('Atencao', 'Digite seu nome completo');
    if (!email.trim()) return Alert.alert('Atencao', 'Digite seu e-mail');
    if (!password) return Alert.alert('Atencao', 'Digite uma senha');
    if (password.length < 6) return Alert.alert('Atencao', 'A senha deve ter no minimo 6 caracteres');
    if (password !== confirmPassword) return Alert.alert('Atencao', 'As senhas nao coincidem');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return Alert.alert('Atencao', 'E-mail invalido');

    try {
      setIsLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuario');

      await supabase.from('users').upsert({
        id: authData.user.id,
        email: email.trim(),
        full_name: fullName.trim(),
        updated_at: new Date().toISOString(),
      });

      Alert.alert(
        'Conta Criada!',
        'Sua conta foi criada com sucesso. Faca login para comecar.',
        [{ text: 'Fazer Login', onPress: () => router.replace('/(auth)/login' as any) }]
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta';
      Alert.alert('Erro no Cadastro', msg);
    } finally {
      setIsLoading(false);
    }
  };

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
        <View style={{
          backgroundColor: COLORS.brand,
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 32,
          alignItems: 'center',
        }}>
          <View style={{
            width: 64, height: 64, borderRadius: 32,
            backgroundColor: COLORS.white,
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 28 }}>{"\uD83D\uDD27"}</Text>
          </View>
          <Text style={{ fontSize: 26, fontWeight: '700', color: COLORS.white, letterSpacing: -0.5 }}>
            ManoPro
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            Gestao de Servicos
          </Text>
        </View>

        <View style={{
          backgroundColor: COLORS.white,
          paddingHorizontal: 24,
          paddingTop: 28,
          paddingBottom: 16,
        }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 4 }}>
            Criar Conta
          </Text>
          <Text style={{ fontSize: 15, color: COLORS.muted, marginBottom: 24 }}>
            Comece a gerenciar seus servicos
          </Text>

          <FormField label="NOME COMPLETO" fieldKey="name" value={fullName}
            onChangeText={setFullName} placeholder="Joao Silva" autoCapitalize="words"
            focusedField={focusedField} onFocus={setFocusedField}
            onBlur={() => setFocusedField(null)} editable={!isDisabled} />

          <FormField label="E-MAIL" fieldKey="email" value={email}
            onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address"
            focusedField={focusedField} onFocus={setFocusedField}
            onBlur={() => setFocusedField(null)} editable={!isDisabled} />

          <FormField label="SENHA" fieldKey="password" value={password}
            onChangeText={setPassword} placeholder="Minimo 6 caracteres"
            secureTextEntry={!showPassword} showToggle={true} showPassword={showPassword}
            onToggle={() => setShowPassword(!showPassword)} hint="Minimo 6 caracteres"
            focusedField={focusedField} onFocus={setFocusedField}
            onBlur={() => setFocusedField(null)} editable={!isDisabled} />

          <FormField label="CONFIRMAR SENHA" fieldKey="confirm" value={confirmPassword}
            onChangeText={setConfirmPassword} placeholder="Repita a senha"
            secureTextEntry={!showConfirmPassword} showToggle={true} showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            focusedField={focusedField} onFocus={setFocusedField}
            onBlur={() => setFocusedField(null)} editable={!isDisabled} />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isDisabled}
            style={{
              backgroundColor: isDisabled ? COLORS.border : COLORS.brand,
              borderRadius: 9999,
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              marginTop: 8,
              shadowColor: COLORS.brand,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDisabled ? 0 : 0.3,
              shadowRadius: 8,
              elevation: isDisabled ? 0 : 4,
            }}
          >
            {isDisabled ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>Criar Conta</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{
          paddingVertical: 24, paddingHorizontal: 24,
          flexDirection: 'row', justifyContent: 'center',
          borderTopWidth: 1, borderTopColor: COLORS.border,
          backgroundColor: COLORS.white,
        }}>
          <Text style={{ fontSize: 14, color: COLORS.muted }}>Ja tem conta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)} disabled={isDisabled}>
            <Text style={{ fontSize: 14, color: COLORS.brand, fontWeight: '700' }}>Fazer login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
