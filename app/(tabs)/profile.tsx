import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Toast } from '@/components/toast';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toast = useToast();

  const handleLogout = async () => {
    Alert.alert('Fazer Logout', 'Tem certeza que deseja sair?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Sair',
        onPress: async () => {
          try {
            setIsLoggingOut(true);
            await logout();
            toast.success('Logout realizado com sucesso!');
          } catch (error) {
            toast.error('Erro ao fazer logout');
            setIsLoggingOut(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/edit-profile' as any);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-0">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2A9D76" />
        </View>
      </ScreenContainer>
    );
  }

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <ScreenContainer className="p-0 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-[#2A9D76] px-6 py-8">
          <Text className="text-2xl font-bold text-white">Perfil</Text>
        </View>

        {/* Profile Info */}
        <View className="px-6 py-8">
          {/* Avatar */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-white rounded-full border-4 border-[#2A9D76] items-center justify-center shadow-sm">
              <Text className="text-5xl font-bold text-[#2A9D76]">{initials}</Text>
            </View>
          </View>

          {/* User Info */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-gray-800">{user?.full_name || 'Usuário'}</Text>
            <Text className="text-sm text-gray-500 mt-1">{user?.email}</Text>
          </View>

          {/* Info Cards */}
          <View className="gap-3 mb-8">
            {user?.phone_number && (
              <View className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <Text className="text-xs text-gray-500 mb-1">Telefone</Text>
                <Text className="text-base font-semibold text-gray-800">{user.phone_number}</Text>
              </View>
            )}

            {user?.cpf_cnpj && (
              <View className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <Text className="text-xs text-gray-500 mb-1">CPF/CNPJ</Text>
                <Text className="text-base font-semibold text-gray-800">{user.cpf_cnpj}</Text>
              </View>
            )}

            {user?.address && (
              <View className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <Text className="text-xs text-gray-500 mb-1">Endereço</Text>
                <Text className="text-base font-semibold text-gray-800">{user.address}</Text>
              </View>
            )}

            {user?.specialties && user.specialties.length > 0 && (
              <View className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <Text className="text-xs text-gray-500 mb-2">Especialidades</Text>
                <View className="flex-row flex-wrap gap-2">
                  {user.specialties.map((specialty, idx) => (
                    <View key={idx} className="bg-[#2A9D76] bg-opacity-10 px-3 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-[#2A9D76]">{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {user?.bio && (
              <View className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <Text className="text-xs text-gray-500 mb-1">Sobre</Text>
                <Text className="text-sm text-gray-800">{user.bio}</Text>
              </View>
            )}
          </View>

          {/* Social Links */}
          {(user?.google_my_business_link || user?.instagram_link) && (
            <View className="mb-8">
              <Text className="text-sm font-semibold text-gray-800 mb-3">Links</Text>
              <View className="gap-2">
                {user?.google_my_business_link && (
                  <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
                    <Text className="text-gray-800 font-semibold">Google Meu Negócio</Text>
                    <Text className="text-lg">🔗</Text>
                  </TouchableOpacity>
                )}
                {user?.instagram_link && (
                  <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
                    <Text className="text-gray-800 font-semibold">Instagram</Text>
                    <Text className="text-lg">📱</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleEditProfile}
              className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between"
            >
              <Text className="text-gray-800 font-semibold">Editar Perfil</Text>
              <Text className="text-lg">✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Configurações</Text>
              <Text className="text-lg">⚙️</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Suporte</Text>
              <Text className="text-lg">💬</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isLoggingOut}
            className={`rounded-lg py-4 items-center justify-center ${
              isLoggingOut ? 'bg-gray-300' : 'bg-red-500'
            }`}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Fazer Logout</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={toast.hide}
      />
    </ScreenContainer>
  );
}
