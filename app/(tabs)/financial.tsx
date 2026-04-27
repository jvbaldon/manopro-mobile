import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useFinancial } from '@/hooks/use-financial';

/**
 * Financial Screen - Gestão Financeira
 * Mostra resumo financeiro, gráfico e histórico de transações
 */
export default function FinancialScreen() {
  const {
    transactions,
    loadTransactions,
    getMonthSummary,
    getLast7DaysSummary,
    getTotalRevenue,
    getTotalExpenses,
    getTotalProfit,
  } = useFinancial();

  useEffect(() => {
    loadTransactions();
  }, []);

  const monthSummary = getMonthSummary();
  const last7Days = getLast7DaysSummary();
  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const totalProfit = getTotalProfit();

  const recentTransactions = transactions.slice(0, 10);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-6">
          <Text className="text-2xl font-bold text-white">Financeiro</Text>
        </View>

        {/* Summary Cards */}
        <View className="px-6 py-6 gap-3">
          {/* Total Revenue */}
          <View className="bg-success bg-opacity-10 rounded-xl p-4 border border-success border-opacity-30">
            <Text className="text-sm text-success mb-1">Receitas Totais</Text>
            <Text className="text-2xl font-bold text-success">R$ {totalRevenue.toFixed(2)}</Text>
          </View>

          {/* Total Expenses */}
          <View className="bg-error bg-opacity-10 rounded-xl p-4 border border-error border-opacity-30">
            <Text className="text-sm text-error mb-1">Despesas Totais</Text>
            <Text className="text-2xl font-bold text-error">R$ {totalExpenses.toFixed(2)}</Text>
          </View>

          {/* Total Profit */}
          <View className="bg-primary bg-opacity-10 rounded-xl p-4 border border-primary border-opacity-30">
            <Text className="text-sm text-primary mb-1">Lucro Líquido</Text>
            <Text className="text-2xl font-bold text-primary">R$ {totalProfit.toFixed(2)}</Text>
          </View>
        </View>

        {/* Month Summary */}
        <View className="px-6 py-4 border-b border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">Este Mês</Text>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-lg p-3">
              <Text className="text-xs text-muted mb-1">Receita</Text>
              <Text className="text-lg font-bold text-foreground">R$ {monthSummary.revenue.toFixed(2)}</Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-3">
              <Text className="text-xs text-muted mb-1">Despesa</Text>
              <Text className="text-lg font-bold text-foreground">R$ {monthSummary.expenses.toFixed(2)}</Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-3">
              <Text className="text-xs text-muted mb-1">Lucro</Text>
              <Text className="text-lg font-bold text-foreground">R$ {monthSummary.profit.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 py-4 flex-1">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-foreground">Transações Recentes</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-semibold">Ver Todas</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length > 0 ? (
            <FlatList
              data={recentTransactions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-surface rounded-lg p-4 mb-3 border border-border flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {item.description || item.category || 'Transação'}
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      {new Date(item.transaction_date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text
                    className={`text-lg font-bold ${
                      item.type === 'receita' ? 'text-success' : 'text-error'
                    }`}
                  >
                    {item.type === 'receita' ? '+' : '-'} R$ {item.amount.toFixed(2)}
                  </Text>
                </View>
              )}
            />
          ) : (
            <View className="bg-surface rounded-lg p-6 items-center justify-center flex-1">
              <Text className="text-muted text-center">Nenhuma transação registrada</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB - Add Transaction */}
      <TouchableOpacity className="absolute bottom-8 right-6 bg-primary rounded-full w-14 h-14 items-center justify-center shadow-lg">
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
