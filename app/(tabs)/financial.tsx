import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useFinancial } from '@/hooks/use-financial';

export default function FinancialScreen() {
  const {
    transactions,
    loadTransactions,
    getMonthSummary,
    getTotalRevenue,
    getTotalExpenses,
    getTotalProfit,
  } = useFinancial();

  useEffect(() => {
    loadTransactions();
  }, []);

  const monthSummary = getMonthSummary();
  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const totalProfit = getTotalProfit();

  const recentTransactions = transactions.slice(0, 10);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-[#2A9D76] px-6 py-8">
          <Text className="text-2xl font-bold text-white">Gestão Financeira</Text>
        </View>

        {/* Summary Cards */}
        <View className="px-6 -mt-6 gap-3">
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <Text className="text-sm text-gray-500 mb-1">Lucro Líquido</Text>
            <Text className="text-3xl font-bold text-[#2A9D76]">R$ {totalProfit.toFixed(2)}</Text>
          </View>
          
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Text className="text-xs text-gray-500 mb-1">Entradas</Text>
              <Text className="text-lg font-bold text-green-600">R$ {totalRevenue.toFixed(2)}</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Text className="text-xs text-gray-500 mb-1">Saídas</Text>
              <Text className="text-lg font-bold text-red-600">R$ {totalExpenses.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <View className="px-6 py-6 flex-1">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Transações Recentes</Text>
          </View>

          {recentTransactions.length > 0 ? (
            <FlatList
              data={recentTransactions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-white p-4 mb-3 rounded-xl border border-gray-100 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-700">
                      {item.description || 'Transação'}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-1">
                      {new Date(item.transaction_date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text className={`text-base font-bold ${item.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.type === 'receita' ? '+' : '-'} R$ {item.amount.toFixed(2)}
                  </Text>
                </View>
              )}
            />
          ) : (
            <View className="p-6 items-center">
              <Text className="text-gray-400">Nenhuma transação registrada</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB - Add Transaction */}
      <TouchableOpacity className="absolute bottom-8 right-6 bg-[#2A9D76] rounded-full w-14 h-14 items-center justify-center shadow-lg shadow-[#2A9D76]">
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}