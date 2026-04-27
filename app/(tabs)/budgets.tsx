import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useBudgets } from '@/hooks/use-budgets';
import { BudgetStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Budgets Screen - Gestão de Orçamentos
 * Mostra lista de orçamentos com filtro por status
 */
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

  const getStatusColor = (status: BudgetStatus) => {
    switch (status) {
      case 'pendente':
        return 'bg-warning';
      case 'aprovado':
        return 'bg-success';
      case 'recusado':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const getStatusLabel = (status: BudgetStatus) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'aprovado':
        return 'Aprovado';
      case 'recusado':
        return 'Recusado';
      default:
        return status;
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-6">
          <Text className="text-2xl font-bold text-white">Orçamentos</Text>
        </View>

        {/* Filter Buttons */}
        <View className="flex-row gap-2 px-6 py-4 border-b border-border overflow-x-auto">
          {(['todos', 'pendente', 'aprovado', 'recusado'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilterStatus(status)}
              className={cn(
                'px-4 py-2 rounded-lg',
                filterStatus === status ? 'bg-primary' : 'bg-surface border border-border'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-semibold',
                  filterStatus === status ? 'text-white' : 'text-foreground'
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
          <Text className="text-lg font-semibold text-foreground mb-4">
            {filteredBudgets.length} Orçamento{filteredBudgets.length !== 1 ? 's' : ''}
          </Text>

          {filteredBudgets.length > 0 ? (
            <FlatList
              data={filteredBudgets}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity className="bg-surface rounded-lg p-4 mb-3 border border-border">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {item.title}
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                    <View
                      className={cn(
                        'px-3 py-1 rounded-full',
                        getStatusColor(item.status),
                        'bg-opacity-10'
                      )}
                    >
                      <Text
                        className={cn(
                          'text-xs font-semibold',
                          item.status === 'pendente' && 'text-warning',
                          item.status === 'aprovado' && 'text-success',
                          item.status === 'recusado' && 'text-error'
                        )}
                      >
                        {getStatusLabel(item.status)}
                      </Text>
                    </View>
                  </View>

                  {item.description && (
                    <Text className="text-sm text-muted mb-2">{item.description}</Text>
                  )}

                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-foreground">
                      R$ {item.total_value.toFixed(2)}
                    </Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity className="px-3 py-1 bg-primary rounded-lg">
                        <Text className="text-white text-xs font-semibold">Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="px-3 py-1 bg-surface border border-border rounded-lg">
                        <Text className="text-foreground text-xs font-semibold">Enviar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View className="bg-surface rounded-lg p-6 items-center justify-center flex-1">
              <Text className="text-muted text-center">Nenhum orçamento encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB - Create Budget */}
      <TouchableOpacity className="absolute bottom-8 right-6 bg-primary rounded-full w-14 h-14 items-center justify-center shadow-lg">
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
