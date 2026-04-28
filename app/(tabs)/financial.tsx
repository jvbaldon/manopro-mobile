import { ScrollView, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useFinancialSupabase } from '@/hooks/use-financial-supabase';

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
  success: '#15803D',
  successBg: '#F0FDF4',
  danger: '#B91C1C',
  dangerBg: '#FEF2F2',
};

export default function FinancialScreen() {
  const {
    transactions,
    isLoading,
    getTotalRevenue,
    getTotalExpenses,
    getTotalProfit,
  } = useFinancialSupabase();

  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'receita' | 'despesa'>('todos');

  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const totalProfit = getTotalProfit();

  const filtered =
    activeFilter === 'todos'
      ? transactions
      : transactions.filter((t) => t.type === activeFilter);

  const recent = filtered.slice(0, 20);

  if (isLoading && !refreshing) {
    return (
      <ScreenContainer className="p-0">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              setRefreshing(false);
            }}
            tintColor={COLORS.brand}
          />
        }
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={{
              backgroundColor: COLORS.brand,
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 48,
            }}>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4, fontWeight: '500' }}>
                FINANCEIRO
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.white }}>
                Gestão Financeira
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                Controle seus recebimentos e despesas
              </Text>
            </View>

            {/* Cards de resumo sobrepostos */}
            <View style={{ paddingHorizontal: 20, marginTop: -28, marginBottom: 24, gap: 12 }}>
              {/* Lucro líquido — destaque */}
              <View style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
                borderLeftWidth: 4,
                borderLeftColor: COLORS.brand,
              }}>
                <Text style={{ fontSize: 11, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                  Lucro Líquido
                </Text>
                <Text style={{
                  fontSize: 32,
                  fontWeight: '700',
                  color: totalProfit >= 0 ? COLORS.brand : COLORS.danger,
                }}>
                  R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>

              {/* Entradas e Saídas */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{
                  flex: 1,
                  backgroundColor: COLORS.successBg,
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#BBF7D0',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 6 }} />
                    <Text style={{ fontSize: 11, color: COLORS.success, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                      Entradas
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#14532D' }}>
                    R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </View>

                <View style={{
                  flex: 1,
                  backgroundColor: COLORS.dangerBg,
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#FECACA',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger, marginRight: 6 }} />
                    <Text style={{ fontSize: 11, color: COLORS.danger, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                      Saídas
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#7F1D1D' }}>
                    R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            </View>

            {/* Filtros */}
            <View style={{ paddingHorizontal: 20, flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {(['todos', 'receita', 'despesa'] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setActiveFilter(f)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 9999,
                    backgroundColor: activeFilter === f ? COLORS.brand : COLORS.white,
                    borderWidth: 1,
                    borderColor: activeFilter === f ? COLORS.brand : COLORS.border,
                  }}
                >
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: activeFilter === f ? COLORS.white : COLORS.muted,
                  }}>
                    {f === 'todos' ? 'Todos' : f === 'receita' ? 'Entradas' : 'Saídas'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Título da lista */}
            <View style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text }}>
                Transações Recentes
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.muted }}>
                {recent.length} registros
              </Text>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: COLORS.white,
            borderRadius: 12,
            padding: 16,
            marginHorizontal: 20,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {/* Indicador de tipo */}
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: item.type === 'receita' ? COLORS.successBg : COLORS.dangerBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Text style={{ fontSize: 18 }}>
                  {item.type === 'receita' ? '↑' : '↓'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: COLORS.text }} numberOfLines={1}>
                  {item.description || 'Transação'}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                  {new Date(item.transaction_date).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
            <Text style={{
              fontSize: 15,
              fontWeight: '700',
              color: item.type === 'receita' ? COLORS.success : COLORS.danger,
              marginLeft: 8,
            }}>
              {item.type === 'receita' ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ paddingHorizontal: 20, paddingTop: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 15, color: COLORS.muted, textAlign: 'center', marginBottom: 8 }}>
              Nenhuma transação registrada
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.muted, textAlign: 'center' }}>
              Adicione sua primeira entrada ou saída
            </Text>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* FAB */}
      <TouchableOpacity style={{
        position: 'absolute',
        bottom: 32,
        right: 24,
        backgroundColor: COLORS.accent,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
      }}>
        <Text style={{ color: COLORS.white, fontSize: 28, fontWeight: '300', lineHeight: 32 }}>+</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
