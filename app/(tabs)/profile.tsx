import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Toast } from '@/components/toast';

const COLORS = {
  brand: '#2A9D76',
  brandDark: '#1B7055',
  brandLight: '#E8F4F0',
  accent: '#F5820D',
  accentLight: '#FFF3E8',
  bg: '#F7F6F3',
  white: '#FFFFFF',
  border: '#E5E3DC',
  text: '#2C2B27',
  muted: '#8C8A82',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
};

const MenuItem = ({ emoji, label, onPress }: { emoji: string; label: string; onPress?: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      backgroundColor: COLORS.white,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.brandLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: '500', color: COLORS.text }}>{label}</Text>
    </View>
    <Text style={{ fontSize: 16, color: COLORS.muted }}>›</Text>
  </TouchableOpacity>
);

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <View style={{
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  }}>
    <Text style={{ fontSize: 11, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
      {label}
    </Text>
    <Text style={{ fontSize: 15, fontWeight: '500', color: COLORS.text }}>{value}</Text>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toast = useToast();

  const handleLogout = async () => {
    Alert.alert('Fazer Logout', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsLoggingOut(true);
            await logout();
            toast.success('Logout realizado com sucesso!');
          } catch {
            toast.error('Erro ao fazer logout');
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-0">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand} />
        </View>
      </ScreenContainer>
    );
  }

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const firstName = user?.full_name?.split(' ')[0] || 'Usuário';

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: COLORS.bg }}
      >
        {/* Header verde com avatar sobreposto */}
        <View style={{
          backgroundColor: COLORS.brand,
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 56,
        }}>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4, fontWeight: '500' }}>
            PERFIL
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.white }}>
            Olá, {firstName}!
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            Gerencie suas informações
          </Text>
        </View>

        {/* Avatar card sobreposto */}
        <View style={{ paddingHorizontal: 20, marginTop: -32, marginBottom: 24 }}>
          <View style={{
            backgroundColor: COLORS.white,
            borderRadius: 16,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
            alignItems: 'center',
          }}>
            {/* Avatar */}
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: COLORS.brandLight,
              borderWidth: 3,
              borderColor: COLORS.brand,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: COLORS.brand }}>{initials}</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text }}>
              {user?.full_name || 'Usuário'}
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>
              {user?.email}
            </Text>

            {/* Especialidades */}
            {user?.specialties && user.specialties.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12, justifyContent: 'center' }}>
                {user.specialties.map((s, i) => (
                  <View key={i} style={{
                    backgroundColor: COLORS.brandLight,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.brand }}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Editar perfil */}
            <TouchableOpacity
              onPress={() => router.push('/edit-profile' as any)}
              style={{
                marginTop: 16,
                backgroundColor: COLORS.brand,
                paddingHorizontal: 28,
                paddingVertical: 10,
                borderRadius: 9999,
              }}
            >
              <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 14 }}>✏️  Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informações */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 11, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
            Informações
          </Text>
          {user?.phone_number && <InfoCard label="Telefone" value={user.phone_number} />}
          {user?.cpf_cnpj && <InfoCard label="CPF / CNPJ" value={user.cpf_cnpj} />}
          {user?.address && <InfoCard label="Endereço" value={user.address} />}
          {user?.bio && <InfoCard label="Sobre" value={user.bio} />}
          {!user?.phone_number && !user?.cpf_cnpj && !user?.address && (
            <View style={{
              backgroundColor: COLORS.white,
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              <Text style={{ fontSize: 14, color: COLORS.muted, textAlign: 'center' }}>
                Complete seu perfil para aparecer nas buscas
              </Text>
            </View>
          )}
        </View>

        {/* Links de negócio */}
        {(user?.google_my_business_link || user?.instagram_link) && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text style={{ fontSize: 11, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
              Links
            </Text>
            {user?.google_my_business_link && (
              <MenuItem emoji="📍" label="Google Meu Negócio" />
            )}
            {user?.instagram_link && (
              <MenuItem emoji="📸" label="Instagram" />
            )}
          </View>
        )}

        {/* Menu de ações */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 11, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
            Opções
          </Text>
          <MenuItem emoji="⚙️" label="Configurações" />
          <MenuItem emoji="💬" label="Suporte" />
        </View>

        {/* Botão logout */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 48 }}>
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isLoggingOut}
            style={{
              backgroundColor: isLoggingOut ? COLORS.border : COLORS.dangerBg,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isLoggingOut ? COLORS.border : '#FECACA',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={COLORS.danger} />
            ) : (
              <>
                <Text style={{ fontSize: 18 }}>🚪</Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.danger }}>
                  Fazer Logout
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={toast.hide}
      />
    </ScreenContainer>
  );
}
