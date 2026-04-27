import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Toast } from '@/components/toast';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    cpf_cnpj: user?.cpf_cnpj || '',
    address: user?.address || '',
    bio: user?.bio || '',
    specialties: user?.specialties?.join(', ') || '',
    google_my_business_link: user?.google_my_business_link || '',
    instagram_link: user?.instagram_link || '',
  });

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      toast.error('Nome completo é obrigatório');
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name.trim(),
          phone_number: formData.phone_number.trim() || null,
          cpf_cnpj: formData.cpf_cnpj.trim() || null,
          address: formData.address.trim() || null,
          bio: formData.bio.trim() || null,
          specialties: formData.specialties
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0) || null,
          google_my_business_link: formData.google_my_business_link.trim() || null,
          instagram_link: formData.instagram_link.trim() || null,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso!');
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="p-0 bg-gray-50">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          {/* Header */}
          <View className="bg-[#2A9D76] px-6 py-6 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-white text-2xl">←</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white flex-1 ml-4">Editar Perfil</Text>
          </View>

          {/* Form */}
          <View className="px-6 py-6">
            {/* Nome Completo */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Nome Completo *</Text>
              <TextInput
                placeholder="Seu nome completo"
                value={formData.full_name}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                editable={!isLoading}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* Email (Read-only) */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">E-mail</Text>
              <TextInput
                value={formData.email}
                editable={false}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500"
              />
              <Text className="text-xs text-gray-500 mt-1">Não pode ser alterado</Text>
            </View>

            {/* Telefone */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Telefone</Text>
              <TextInput
                placeholder="(11) 99999-9999"
                value={formData.phone_number}
                onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                editable={!isLoading}
                keyboardType="phone-pad"
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* CPF/CNPJ */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">CPF/CNPJ</Text>
              <TextInput
                placeholder="000.000.000-00"
                value={formData.cpf_cnpj}
                onChangeText={(text) => setFormData({ ...formData, cpf_cnpj: text })}
                editable={!isLoading}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* Endereço */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Endereço</Text>
              <TextInput
                placeholder="Rua, número, complemento"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                editable={!isLoading}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* Bio */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Sobre Você</Text>
              <TextInput
                placeholder="Conte um pouco sobre você e sua experiência"
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                editable={!isLoading}
                multiline
                numberOfLines={4}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* Especialidades */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Especialidades</Text>
              <TextInput
                placeholder="Hidráulica, Elétrica, Pintura (separadas por vírgula)"
                value={formData.specialties}
                onChangeText={(text) => setFormData({ ...formData, specialties: text })}
                editable={!isLoading}
                multiline
                numberOfLines={2}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
              <Text className="text-xs text-gray-500 mt-1">Separe por vírgula</Text>
            </View>

            {/* Google My Business */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Google Meu Negócio</Text>
              <TextInput
                placeholder="https://google.com/..."
                value={formData.google_my_business_link}
                onChangeText={(text) =>
                  setFormData({ ...formData, google_my_business_link: text })
                }
                editable={!isLoading}
                keyboardType="url"
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* Instagram */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Instagram</Text>
              <TextInput
                placeholder="https://instagram.com/..."
                value={formData.instagram_link}
                onChangeText={(text) => setFormData({ ...formData, instagram_link: text })}
                editable={!isLoading}
                keyboardType="url"
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              />
            </View>

            {/* Action Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading}
                className={`rounded-lg py-4 items-center justify-center ${
                  isLoading ? 'bg-gray-300' : 'bg-[#2A9D76]'
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Salvar Alterações</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                disabled={isLoading}
                className="rounded-lg py-4 items-center justify-center bg-gray-200"
              >
                <Text className="text-gray-800 font-bold text-base">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={toast.hide}
      />
    </KeyboardAvoidingView>
  );
}
