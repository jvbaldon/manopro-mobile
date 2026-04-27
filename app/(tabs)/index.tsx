import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useServiceOrdersSupabase } from '@/hooks/use-service-orders-supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';

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

  // Contar ordens por status
  const agendadas = orders.filter((o) => o.status === 'agendado').length;
  const emAndamento = orders.filter((o) => o.status === 'em_andamento').length;
  const concluidas = orders.filter((o) => o.status === 'concluido').length;

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

  if (isLoading && !refreshing) {
    return (
      <ScreenContainer className="p-0">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2A9D76" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-gray-50">
      {/* Header */}
      <View className="bg-[#2A9D76] px-6 py-8">
        <Text className="text-2xl font-bold text-white">Olá, {user?.email?.split('@')[0]}! 👋</Text>
        <Text className="text-green-50 text-sm mt-1">Bem-vindo ao ManoPro</Text>
      </View>

      {/* Stats Cards */}
      <View className="px-6 -mt-6 gap-3 mb-6">
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-sm text-gray-500 mb-1">Total de Ordens</Text>
              <Text className="text-3xl font-bold text-[#2A9D76]">{orders.length}</Text>
            </View>
            <View className="bg-[#2A9D76] bg-opacity-10 px-4 py-2 rounded-lg">
              <Text className="text-[#2A9D76] font-semibold text-lg">📋</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <Text className="text-xs text-gray-500 mb-2">Agendadas</Text>
            <Text className="text-2xl font-bold text-blue-600">{agendadas}</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <Text className="text-xs text-gray-500 mb-2">Em Andamento</Text>
            <Text className="text-2xl font-bold text-yellow-600">{emAndamento}</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <Text className="text-xs text-gray-500 mb-2">Concluídas</Text>
            <Text className="text-2xl font-bold text-green-600">{concluidas}</Text>
          </View>
        </View>
      </View>

      {/* Orders List */}
      <View className="px-6 pb-6 flex-1">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">Minhas Ordens</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/new-order' as any)}
            className="bg-[#2A9D76] px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold text-sm">+ Nova</Text>
          </TouchableOpacity>
        </View>

        {orders.length > 0 ? (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm"
                onPress={() => router.push(`/order/${item.id}` as any)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
                    <Text className="text-xs text-gray-400 mt-2">
                      {new Date(item.start_date).toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                    <Text className="text-xs font-bold capitalize">
                      {item.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                {item.estimated_value && (
                  <View className="mt-3 pt-3 border-t border-gray-100">
                    <Text className="text-sm font-semibold text-[#2A9D76]">
                      R$ {item.estimated_value.toFixed(2)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="mt-20 items-center">
                <Text className="text-gray-400 text-base mb-4">Nenhuma ordem encontrada</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/new-order' as any)}
                  className="bg-[#2A9D76] px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-semibold">Criar Primeira Ordem</Text>
                </TouchableOpacity>
              </View>
            }
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400 text-center mb-4">
              Você ainda não criou nenhuma ordem de serviço
            </Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
