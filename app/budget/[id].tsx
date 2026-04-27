import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useBudgetsSupabase } from '@/hooks/use-budgets-supabase';
import { cn } from '@/lib/utils';

export default function BudgetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { budgets, isLoading, updateBudgetStatus, isUpdatingStatus, deleteBudget, isDeleting } =
    useBudgetsSupabase();

  const budget = budgets.find((b) => b.id === id);
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <ScreenContainer className="p-0">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2A9D76" />
        </View>
      </ScreenContainer>
    );
  }

  if (!budget) {
    return (
      <ScreenContainer className="p-0">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Orçamento não encontrado</Text>
        </View>
      </ScreenContainer>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'aprovado':
        return 'bg-green-100 text-green-700';
      case 'recusado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    Alert.alert('Alterar Status', `Deseja alterar o status para ${newStatus}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => {
          updateBudgetStatus({
            id: budget.id,
            status: newStatus as any,
          });
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Deletar Orçamento', 'Tem certeza que deseja deletar este orçamento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        onPress: () => {
          deleteBudget(budget.id);
          router.back();
        },
        style: 'destructive',
      },
    ]);
  };

  const total = (budget.budget_items || []).reduce((sum, item) => sum + (item.total_price || 0), 0);

  return (
    <ScreenContainer className="p-0 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-[#2A9D76] px-6 py-6 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1 ml-4">Detalhes do Orçamento</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text className="text-white text-lg">✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Status Badge */}
          <View className="mb-6">
            <View className={cn('px-4 py-2 rounded-full inline-flex w-fit', getStatusColor(budget.status))}>
              <Text className="text-sm font-bold capitalize">
                {budget.status}
              </Text>
            </View>
          </View>

          {/* Cliente e Descrição */}
          <View className="bg-white rounded-lg p-4 mb-4 border border-gray-100 shadow-sm">
            <Text className="text-xs text-gray-500 mb-1">Cliente</Text>
            <Text className="text-lg font-bold text-gray-800 mb-4">{budget.client_id || 'Não especificado'}</Text>

            <Text className="text-xs text-gray-500 mb-1">Descrição</Text>
            <Text className="text-base text-gray-800">{budget.description || 'Sem descrição'}</Text>
          </View>

          {/* Itens do Orçamento */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-800 mb-3">Itens</Text>
            {budget.budget_items && budget.budget_items.length > 0 ? (
              <FlatList
                data={budget.budget_items}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View className="bg-white rounded-lg p-4 mb-2 border border-gray-100 shadow-sm">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800">{item.description}</Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {item.quantity}x @ R$ {(item.unit_price || 0).toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                      <Text className="text-base font-bold text-[#2A9D76]">
                        R$ {(item.total_price || 0).toFixed(2).replace('.', ',')}
                      </Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <Text className="text-gray-500 text-center py-4">Nenhum item adicionado</Text>
            )}
          </View>

          {/* Total */}
          <View className="bg-[#2A9D76] rounded-lg p-4 mb-6">
            <Text className="text-white text-sm mb-1">Total do Orçamento</Text>
            <Text className="text-3xl font-bold text-white">
              R$ {total.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          {/* Status Actions */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-800 mb-3">Alterar Status</Text>
            <View className="gap-2">
              {['pendente', 'aprovado', 'recusado'].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleStatusChange(status)}
                  disabled={isUpdatingStatus || budget.status === status}
                  className={cn(
                    'rounded-lg p-3 border',
                    budget.status === status
                      ? 'bg-[#2A9D76] border-[#2A9D76]'
                      : 'bg-white border-gray-200'
                  )}
                >
                  <Text
                    className={cn(
                      'font-semibold capitalize',
                      budget.status === status ? 'text-white' : 'text-gray-800'
                    )}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Gerar PDF</Text>
              <Text className="text-lg">📄</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Enviar por WhatsApp</Text>
              <Text className="text-lg">📱</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Enviar por E-mail</Text>
              <Text className="text-lg">✉️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 rounded-lg p-4 items-center justify-center"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold">Deletar Orçamento</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
