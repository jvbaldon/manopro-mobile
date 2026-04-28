import { ScrollView, View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useServiceOrdersSupabase } from '@/hooks/use-service-orders-supabase';
import { useAuth } from '@/lib/auth-context';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  agendado:     { bg: '#EFF6FF', text: '#1D4ED8', label: 'Agendado' },
  em_andamento: { bg: '#FEFCE8', text: '#A16207', label: 'Em Andamento' },
  concluido:    { bg: '#F0FDF4', text: '#15803D', label: 'Concluído' },
  cancelado:    { bg: '#FEF2F2', text: '#B91C1C', label: 'Cancelado' },
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, isLoading, refetch } = useServiceOrdersSupabase();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const agendadas   = orders.filter((o) => o.status === 'agendado').length;
  const emAndamento = orders.filter((o) => o.status === 'em_andamento').length;
  const concluidas  = orders.filter((o) => o.status === 'concluido').length;

  if (isLoading && !refreshing) {
    return (
      <ScreenContainer className="p-0">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2A9D76" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={{
              backgroundColor: '#2A9D76',
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 40,
            }}>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                Bem-vindo de volta 👋
              </Text>
              <Text style={{ fontSize: 26, fontWeight: '700', color: 'white' }}>
                Olá, {user?.email?.split('@')[0]}!
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                Aqui está o resumo do seu dia
              </Text>
            </View>

            {/* Cards de resumo */}
            <View style={{ paddingHorizontal: 20, marginTop: -20, gap: 12, marginBottom: 24 }}>
              <View style={{
                backgroundColor: 'white',
                borderRadius: 14,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}>
                <Text style={{ fontSize: 12, color: '#8C8A82', marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Total de ordens
                </Text>
                <Text style={{ fontSize: 28, fontWeight: '700', color: '#2A9D76' }}>
                  {orders.length}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: '#EFF6FF', borderRadius: 14, padding: 16 }}>
                  <Text style={{ fontSize: 11, color: '#1D4ED8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Agendadas
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#1E3A8A', marginTop: 4 }}>
                    {agendadas}
                  </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#FEFCE8', borderRadius: 14, padding: 16 }}>
                  <Text style={{ fontSize: 11, color: '#A16207', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Em Andamento
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#78350F', marginTop: 4 }}>
                    {emAndamento}
                  </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#F0FDF4', borderRadius: 14, padding: 16 }}>
                  <Text style={{ fontSize: 11, color: '#15803D', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Concluídas
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#14532D', marginTop: 4 }}>
                    {concluidas}
                  </Text>
                </View>
              </View>
            </View>

            {/* Título da lista */}
            <View style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#2C2B27' }}>
                Minhas Ordens
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/new-order' as any)}
                style={{ backgroundColor: '#2A9D76', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999 }}
              >
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>+ Nova</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={({ item }) => {
          const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS['agendado'];
          return (
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                marginHorizontal: 20,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#E5E3DC',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() => router.push(`/order/${item.id}` as any)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C2B27' }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: '#8C8A82', marginTop: 4 }}>
                    {new Date(item.start_date).toLocaleDateString('pt-BR', {
                      weekday: 'short', day: '2-digit', month: 'short',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View style={{ backgroundColor: statusStyle.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999, marginLeft: 8 }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: statusStyle.text }}>
                    {statusStyle.label}
                  </Text>
                </View>
              </View>

              {item.estimated_value ? (
                <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0EFE9' }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#2A9D76' }}>
                    R$ {item.estimated_value.toFixed(2)}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={{ paddingHorizontal: 20, paddingTop: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#8C8A82', textAlign: 'center', marginBottom: 16 }}>
              Você ainda não criou nenhuma ordem de serviço
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/new-order' as any)}
              style={{ backgroundColor: '#2A9D76', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 9999 }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                + Criar Primeira Ordem
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </ScreenContainer>
  );
}
