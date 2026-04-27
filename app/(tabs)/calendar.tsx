import { ScrollView, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useServiceOrdersSupabase } from '@/hooks/use-service-orders-supabase';
import { cn } from '@/lib/utils';

export default function CalendarScreen() {
  const { orders, isLoading, getOrdersByDate } = useServiceOrdersSupabase();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const selectedOrders = getOrdersByDate(selectedDate);

  if (isLoading) {
    return (
      <ScreenContainer className="p-0">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2A9D76" />
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

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 bg-white">
        {/* Header com cor ajustada */}
        <View className="bg-[#2A9D76] px-6 py-8">
          <Text className="text-2xl font-bold text-white">Agenda</Text>
        </View>

        {/* View Mode Selector */}
        <View className="flex-row gap-2 px-6 py-4 border-b border-gray-100">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setViewMode(mode)}
              className={cn(
                'px-4 py-2 rounded-lg',
                viewMode === mode ? 'bg-[#2A9D76]' : 'bg-gray-100'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-semibold',
                  viewMode === mode ? 'text-white' : 'text-gray-700'
                )}
              >
                {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders List */}
        <View className="px-6 py-4 flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {selectedOrders.length} Agendamento{selectedOrders.length !== 1 ? 's' : ''}
          </Text>

          {selectedOrders.length > 0 ? (
            <FlatList
              data={selectedOrders}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity className="bg-white p-4 mb-3 rounded-xl border border-gray-100 shadow-sm active:opacity-70">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-800">{item.title}</Text>
                      <Text className="text-xs text-gray-400 mt-1">
                        {new Date(item.start_date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <View className={cn('px-3 py-1 rounded-full', getStatusColor(item.status))}>
                      <Text className={`text-xs font-semibold capitalize`}>
                        {item.status.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View className="p-6 items-center">
              <Text className="text-gray-400">Nenhum agendamento para esta data</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
