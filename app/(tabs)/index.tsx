import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useServiceOrders } from '@/hooks/use-service-orders';
import { useFinancial } from '@/hooks/use-financial';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, loadOrders, getOrdersByStatus } = useServiceOrders();
  const { loadTransactions, getMonthSummary } = useFinancial();

  useEffect(() => {
    loadOrders();
    loadTransactions();
  }, []);

  const todayOrders = getOrdersByStatus('agendado').slice(0, 3);
  const monthSummary = getMonthSummary();

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>

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
            Olá, {user?.full_name?.split(' ')[0] || 'Usuário'}!
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
              Faturamento do mês
            </Text>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#2C2B27' }}>
              R$ {monthSummary.revenue.toFixed(2)}
            </Text>
            <Text style={{ fontSize: 12, color: '#8C8A82', marginTop: 4 }}>
              {getOrdersByStatus('concluido').length} serviços concluídos
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{
              flex: 1,
              backgroundColor: '#E8F4F0',
              borderRadius: 14,
              padding: 16,
            }}>
              <Text style={{ fontSize: 11, color: '#1B7055', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Lucro
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#0F4535', marginTop: 4 }}>
                R$ {monthSummary.profit.toFixed(2)}
              </Text>
            </View>

            <View style={{
              flex: 1,
              backgroundColor: '#FFF3E8',
              borderRadius: 14,
              padding: 16,
            }}>
              <Text style={{ fontSize: 11, color: '#C45E00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Agendados
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#7A3B00', marginTop: 4 }}>
                {getOrdersByStatus('agendado').length}
              </Text>
            </View>
          </View>
        </View>

        {/* Próximos agendamentos */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#2C2B27' }}>
              Próximos serviços
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')}>
              <Text style={{ fontSize: 13, color: '#2A9D76', fontWeight: '600' }}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {todayOrders.length > 0 ? (
            <FlatList
              data={todayOrders}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: '#E5E3DC',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <View style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: '#2A9D76',
                    flexShrink: 0,
                  }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C2B27' }}>
                      {item.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#8C8A82', marginTop: 2 }}>
                      {new Date(item.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <View style={{
                    paddingHorizontal: 10, paddingVertical: 4,
                    backgroundColor: '#E8F4F0',
                    borderRadius: 9999,
                  }}>
                    <Text style={{ fontSize: 11, color: '#1B7055', fontWeight: '600' }}>
                      Agendado
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 24,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E5E3DC',
            }}>
              <Text style={{ fontSize: 14, color: '#8C8A82', textAlign: 'center' }}>
                Nenhum serviço agendado ainda
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/new-order')}
                style={{
                  marginTop: 12,
                  paddingHorizontal: 20, paddingVertical: 9,
                  backgroundColor: '#2A9D76',
                  borderRadius: 9999,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>
                  + Criar primeiro serviço
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Ações rápidas */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#2C2B27', marginBottom: 12 }}>
            Ações rápidas
          </Text>
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/new-order')}
              style={{
                backgroundColor: '#2A9D76',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Nova Ordem de Serviço</Text>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 }}>Criar novo agendamento</Text>
              </View>
              <Text style={{ color: 'white', fontSize: 20 }}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/budgets')}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#E5E3DC',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#2C2B27', fontWeight: '600', fontSize: 15 }}>Orçamentos</Text>
                <Text style={{ color: '#8C8A82', fontSize: 12, marginTop: 2 }}>Gerenciar orçamentos</Text>
              </View>
              <Text style={{ color: '#2C2B27', fontSize: 20 }}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/financial')}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#E5E3DC',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#2C2B27', fontWeight: '600', fontSize: 15 }}>Financeiro</Text>
                <Text style={{ color: '#8C8A82', fontSize: 12, marginTop: 2 }}>Ver receitas e despesas</Text>
              </View>
              <Text style={{ color: '#2C2B27', fontSize: 20 }}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/new-order')}
        style={{
          position: 'absolute',
          bottom: 24, right: 20,
          width: 56, height: 56,
          borderRadius: 28,
          backgroundColor: '#2A9D76',
          alignItems: 'center', justifyContent: 'center',
          shadowColor: '#2A9D76',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text style={{ color: 'white', fontSize: 28, lineHeight: 30, fontWeight: '300' }}>+</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
