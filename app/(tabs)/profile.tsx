import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';

/**
 * Profile Screen - Perfil do Trabalhador
 * Mostra informações do usuário e opções de configuração
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-6">
          <Text className="text-2xl font-bold text-white">Perfil</Text>
        </View>

        {/* Profile Info */}
        <View className="px-6 py-6">
          {/* Avatar Placeholder */}
          <View className="w-20 h-20 bg-surface rounded-full border-2 border-primary items-center justify-center mb-4">
            <Text className="text-3xl font-bold text-primary">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>

          {/* User Info */}
          <Text className="text-2xl font-bold text-foreground mb-1">{user?.full_name || 'Usuário'}</Text>
          <Text className="text-sm text-muted mb-4">{user?.email}</Text>

          {/* Info Cards */}
          <View className="gap-3 mb-6">
            {user?.phone_number && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-xs text-muted mb-1">Telefone</Text>
                <Text className="text-base font-semibold text-foreground">{user.phone_number}</Text>
              </View>
            )}

            {user?.cpf_cnpj && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-xs text-muted mb-1">CPF/CNPJ</Text>
                <Text className="text-base font-semibold text-foreground">{user.cpf_cnpj}</Text>
              </View>
            )}

            {user?.address && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-xs text-muted mb-1">Endereço</Text>
                <Text className="text-base font-semibold text-foreground">{user.address}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Specialties */}
        {user?.specialties && user.specialties.length > 0 && (
          <View className="px-6 pb-6 border-b border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">Especialidades</Text>
            <View className="flex-row flex-wrap gap-2">
              {user.specialties.map((specialty, index) => (
                <View key={index} className="bg-primary bg-opacity-10 rounded-full px-3 py-1">
                  <Text className="text-sm font-semibold text-primary">{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bio */}
        {user?.bio && (
          <View className="px-6 py-6 border-b border-border">
            <Text className="text-lg font-semibold text-foreground mb-2">Sobre</Text>
            <Text className="text-base text-foreground">{user.bio}</Text>
          </View>
        )}

        {/* Social Links */}
        <View className="px-6 py-6 border-b border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">Links Sociais</Text>
          <View className="gap-2">
            {user?.google_my_business_link && (
              <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center">
                <Text className="text-base font-semibold text-foreground">Google Meu Negócio</Text>
                <Text className="text-foreground">→</Text>
              </TouchableOpacity>
            )}
            {user?.instagram_link && (
              <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center">
                <Text className="text-base font-semibold text-foreground">Instagram</Text>
                <Text className="text-foreground">→</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Settings */}
        <View className="px-6 py-6 gap-3">
          <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center">
            <Text className="text-base font-semibold text-foreground">Editar Perfil</Text>
            <Text className="text-foreground">→</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center">
            <Text className="text-base font-semibold text-foreground">Configurações</Text>
            <Text className="text-foreground">→</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center">
            <Text className="text-base font-semibold text-foreground">Suporte</Text>
            <Text className="text-foreground">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-error bg-opacity-10 rounded-lg p-4 border border-error border-opacity-30 flex-row justify-between items-center"
          >
            <Text className="text-base font-semibold text-error">Sair</Text>
            <Text className="text-error">→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
