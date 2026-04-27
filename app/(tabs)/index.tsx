import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useServiceOrders } from '@/hooks/use-service-orders';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { orders, isLoading } = useServiceOrders();
  const router = useRouter();

  if (isLoading) {
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
      {/* Header com a cor do projeto */}
      <View className="bg-[#2A9D76] px-6 py-8">
        <Text className="text-2xl font-bold text-white">Minhas Ordens</Text>
        <Text className="text-green-50 text-sm mt-1">Gerencie seus atendimentos</Text>
      </View>

      <View className="px-6 py-6 flex-1">
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm"
              onPress={() => router.push(`/order/${item.id}` as any)}
            >
              <View className="flex-row justify-between items-start">
                <Text className="text-lg font-semibold text-gray-800 flex-1">{item.title}</Text>
                <View className="bg-green-50 px-3 py-1 rounded-full">
                  <Text className="text-[#2A9D76] text-xs font-bold capitalize">
                    {item.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-gray-400 mt-2">
                ID: {item.id.slice(0, 8)} • Atualizado recentemente
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <Text className="text-gray-400">Nenhuma ordem encontrada no momento.</Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}