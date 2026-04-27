import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useClientsSupabase } from '@/hooks/use-clients-supabase';

export default function ClientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { clients, isLoading, updateClient, isUpdating, deleteClient, isDeleting } =
    useClientsSupabase();

  const client = clients.find((c) => c.id === id);
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <ScreenContainer className="p-0">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2A9D76" />
        </View>
      </ScreenContainer>
    );
  }

  if (!client) {
    return (
      <ScreenContainer className="p-0">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Cliente não encontrado</Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleDelete = () => {
    Alert.alert('Deletar Cliente', 'Tem certeza que deseja deletar este cliente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        onPress: () => {
          deleteClient(client.id);
          router.back();
        },
        style: 'destructive',
      },
    ]);
  };

  const handleCall = () => {
    if (client.phone_number) {
      Linking.openURL(`tel:${client.phone_number}`);
    }
  };

  const handleWhatsApp = () => {
    if (client.phone_number) {
      const message = 'Olá! Gostaria de falar sobre nossos serviços.';
      Linking.openURL(
        `https://wa.me/${client.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      );
    }
  };

  const handleEmail = () => {
    if (client.email) {
      Linking.openURL(`mailto:${client.email}`);
    }
  };

  const initials = client.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'C';

  return (
    <ScreenContainer className="p-0 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-[#2A9D76] px-6 py-6 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1 ml-4">Detalhes do Cliente</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text className="text-white text-lg">✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Avatar */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-white rounded-full border-4 border-[#2A9D76] items-center justify-center shadow-sm">
              <Text className="text-3xl font-bold text-[#2A9D76]">{initials}</Text>
            </View>
          </View>

          {/* Nome */}
          <View className="items-center mb-6">
            <Text className="text-2xl font-bold text-gray-800">{client.name}</Text>
            {client.email && <Text className="text-sm text-gray-500 mt-1">{client.email}</Text>}
          </View>

          {/* Informações de Contato */}
          <View className="bg-white rounded-lg p-4 mb-4 border border-gray-100 shadow-sm">
            <Text className="text-sm font-semibold text-gray-800 mb-3">Contato</Text>

            {client.phone_number && (
              <View className="mb-3">
                <Text className="text-xs text-gray-500 mb-1">Telefone</Text>
                <Text className="text-base font-semibold text-gray-800">{client.phone_number}</Text>
              </View>
            )}

            {client.email && (
              <View>
                <Text className="text-xs text-gray-500 mb-1">E-mail</Text>
                <Text className="text-base font-semibold text-gray-800">{client.email}</Text>
              </View>
            )}
          </View>

          {/* Endereço */}
          {client.address && (
            <View className="bg-white rounded-lg p-4 mb-4 border border-gray-100 shadow-sm">
              <Text className="text-xs text-gray-500 mb-1">Endereço</Text>
              <Text className="text-base text-gray-800">{client.address}</Text>
            </View>
          )}

          {/* CPF/CNPJ */}
          {client.cpf_cnpj && (
            <View className="bg-white rounded-lg p-4 mb-4 border border-gray-100 shadow-sm">
              <Text className="text-xs text-gray-500 mb-1">CPF/CNPJ</Text>
              <Text className="text-base font-semibold text-gray-800">{client.cpf_cnpj}</Text>
            </View>
          )}

          {/* Notas */}
          {client.notes && (
            <View className="bg-white rounded-lg p-4 mb-6 border border-gray-100 shadow-sm">
              <Text className="text-xs text-gray-500 mb-1">Notas</Text>
              <Text className="text-base text-gray-800">{client.notes}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3 mb-6">
            {client.phone_number && (
              <TouchableOpacity
                onPress={handleCall}
                className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between"
              >
                <Text className="text-gray-800 font-semibold">Ligar</Text>
                <Text className="text-lg">📞</Text>
              </TouchableOpacity>
            )}

            {client.phone_number && (
              <TouchableOpacity
                onPress={handleWhatsApp}
                className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between"
              >
                <Text className="text-gray-800 font-semibold">WhatsApp</Text>
                <Text className="text-lg">💬</Text>
              </TouchableOpacity>
            )}

            {client.email && (
              <TouchableOpacity
                onPress={handleEmail}
                className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between"
              >
                <Text className="text-gray-800 font-semibold">E-mail</Text>
                <Text className="text-lg">✉️</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Editar Cliente</Text>
              <Text className="text-lg">✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Ver Ordens</Text>
              <Text className="text-lg">📋</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 rounded-lg p-4 items-center justify-center"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold">Deletar Cliente</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
