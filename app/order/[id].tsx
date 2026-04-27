import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useServiceOrdersSupabase } from '@/hooks/use-service-orders-supabase';
import { cn } from '@/lib/utils';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, isLoading, updateOrder, isUpdating, deleteOrder, isDeleting } =
    useServiceOrdersSupabase();

  const order = orders.find((o) => o.id === id);
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

  if (!order) {
    return (
      <ScreenContainer className="p-0">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Ordem não encontrada</Text>
        </View>
      </ScreenContainer>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-700';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-700';
      case 'concluido':
        return 'bg-green-100 text-green-700';
      case 'cancelado':
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
          updateOrder({
            id: order.id,
            updates: { status: newStatus as any },
          });
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Deletar Ordem', 'Tem certeza que deseja deletar esta ordem?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        onPress: () => {
          deleteOrder(order.id);
          router.back();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScreenContainer className="p-0 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-[#2A9D76] px-6 py-6 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1 ml-4">Detalhes da Ordem</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text className="text-white text-lg">✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Status Badge */}
          <View className="mb-6">
            <View className={cn('px-4 py-2 rounded-full inline-flex w-fit', getStatusColor(order.status))}>
              <Text className="text-sm font-bold capitalize">
                {order.status.replace('_', ' ')}
              </Text>
            </View>
          </View>

          {/* Título e Cliente */}
          <View className="bg-white rounded-lg p-4 mb-4 border border-gray-100 shadow-sm">
            <Text className="text-xs text-gray-500 mb-1">Título</Text>
            <Text className="text-xl font-bold text-gray-800 mb-4">{order.title}</Text>

            <Text className="text-xs text-gray-500 mb-1">Cliente</Text>
            <Text className="text-base font-semibold text-gray-800">{order.client_id || 'Não especificado'}</Text>
          </View>

          {/* Descrição */}
          {order.description && (
            <View className="bg-white rounded-lg p-4 mb-4 border border-gray-100 shadow-sm">
              <Text className="text-xs text-gray-500 mb-1">Descrição</Text>
              <Text className="text-base text-gray-800">{order.description}</Text>
            </View>
          )}

          {/* Data e Hora */}
          <View className="bg-white rounded-lg p-4 mb-4 border border-gray-100 shadow-sm">
            <Text className="text-xs text-gray-500 mb-1">Data e Hora</Text>
            <Text className="text-base font-semibold text-gray-800">
              {new Date(order.start_date).toLocaleString('pt-BR')}
            </Text>
          </View>

          {/* Valor */}
          {order.estimated_value && (
            <View className="bg-white rounded-lg p-4 mb-4 border border-gray-100 shadow-sm">
              <Text className="text-xs text-gray-500 mb-1">Valor Estimado</Text>
              <Text className="text-2xl font-bold text-[#2A9D76]">
                R$ {order.estimated_value.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          )}

          {/* Status Actions */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-800 mb-3">Alterar Status</Text>
            <View className="gap-2">
              {['agendado', 'em_andamento', 'concluido', 'cancelado'].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleStatusChange(status)}
                  disabled={isUpdating || order.status === status}
                  className={cn(
                    'rounded-lg p-3 border',
                    order.status === status
                      ? 'bg-[#2A9D76] border-[#2A9D76]'
                      : 'bg-white border-gray-200'
                  )}
                >
                  <Text
                    className={cn(
                      'font-semibold capitalize',
                      order.status === status ? 'text-white' : 'text-gray-800'
                    )}
                  >
                    {status.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Editar Ordem</Text>
              <Text className="text-lg">✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Adicionar Foto</Text>
              <Text className="text-lg">📷</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Compartilhar</Text>
              <Text className="text-lg">📤</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 rounded-lg p-4 items-center justify-center"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold">Deletar Ordem</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
