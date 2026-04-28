import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useBudgets } from '@/hooks/use-budgets';
import { BudgetStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function BudgetsScreen() {
  const { budgets, loadBudgets } = useBudgets();
  const [filterStatus, setFilterStatus] = useState<BudgetStatus | 'todos'>('todos');

  useEffect(() => {
    loadBudgets();
  }, []);

  const filteredBudgets =
    filterStatus === 'todos'
      ? budgets
      : budgets.filter((budget) => budget.status === filterStatus);

  const getStatusStyle = (status: BudgetStatus) => {
    switch (status) {
      case 'pendente':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'aprovado':
        return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'recusado':
        return { bg: 'bg-red-100', text: 'text-red-700' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const getStatusLabel = (status: BudgetStatus) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aprovado': return 'Aprovado';
      case 'recusado': return 'Recusado';
      default: return status;
    }
  };

  return (
    <ScreenContainer className="p-0 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-[#2A9D76] px-6 py-8">
          <Text className="text-2xl font-bold text-white">Orçamentos</Text>
        </View>

        {/* Filter Buttons */}
        <View className="flex-row gap-2 px-6 py-4 border-b border-gray-200">
          {(['todos', 'pendente', 'aprovado', 'recusado'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilterStatus(status)}
              className={cn(
                'px-4 py-2 rounded-lg',
                filterStatus === status ? 'bg-[#2A9D76]' : 'bg-white border border-gray-200'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-semibold',
                  filterStatus === status ? 'text-white' : 'text-gray-700'
                )}
              >
                {status === 'todos'
                  ? 'Todos'
                  : status === 'pendente'
                    ? 'Pendentes'
                    : status === 'aprovado'
                      ? 'Aprovados'
                      : 'Recusados'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Budgets List */}
        <View className="px-6 py-4 flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {filteredBudgets.length} Orçamento{filteredBudgets.length !== 1 ? 's' : ''}
          </Text>

          {filteredBudgets.length > 0 ? (
            <FlatList
              data={filteredBudgets}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const statusStyle = getStatusStyle(item.status);
                return (
                  <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm active:opacity-70">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800">
                          {item.title}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                      <View className={cn('px-3 py-1 rounded-full', statusStyle.bg)}>
                        <Text className={cn('text-xs font-semibold', statusStyle.text)}>
                          {getStatusLabel(item.status)}
                        </Text>
                      </View>
                    </View>

                    {item.description && (
                      <Text className="text-sm text-gray-500 mb-2">{item.description}</Text>
                    )}

                    <View className="flex-row justify-between items-center">
                      <Text className="text-lg font-bold text-gray-800">
                        R$ {item.total_value.toFixed(2)}
                      </Text>
                      <View className="flex-row gap-2">
                        <TouchableOpacity className="px-3 py-1 bg-[#2A9D76] rounded-lg">
                          <Text className="text-white text-xs font-semibold">Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="px-3 py-1 bg-white border border-gray-200 rounded-lg">
                          <Text className="text-gray-700 text-xs font-semibold">Enviar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View className="bg-white rounded-xl p-6 items-center justify-center flex-1 border border-gray-100">
              <Text className="text-gray-400 text-center">Nenhum orçamento encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB - Create Budget */}
      <TouchableOpacity className="absolute bottom-8 right-6 bg-[#2A9D76] rounded-full w-14 h-14 items-center justify-center shadow-lg">
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
