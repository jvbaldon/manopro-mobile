import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useServiceOrders } from '@/hooks/use-service-orders';
import { cn } from '@/lib/utils';

/**
 * Calendar Screen - Visualização de Agendamentos
 * Mostra calendário e lista de ordens de serviço por data
 */
export default function CalendarScreen() {
  const { orders, loadOrders, getOrdersByDate } = useServiceOrders();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    loadOrders();
  }, []);

  const selectedOrders = getOrdersByDate(selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-primary';
      case 'em_andamento':
        return 'bg-warning';
      case 'concluido':
        return 'bg-success';
      case 'cancelado':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-6">
          <Text className="text-2xl font-bold text-white">Agenda</Text>
        </View>

        {/* View Mode Selector */}
        <View className="flex-row gap-2 px-6 py-4 border-b border-border">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setViewMode(mode)}
              className={cn(
                'px-4 py-2 rounded-lg',
                viewMode === mode ? 'bg-primary' : 'bg-surface border border-border'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-semibold',
                  viewMode === mode ? 'text-white' : 'text-foreground'
                )}
              >
                {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Selector */}
        <View className="px-6 py-4 border-b border-border">
          <Text className="text-sm text-muted mb-2">Data Selecionada</Text>
          <TouchableOpacity className="bg-surface border border-border rounded-lg p-3">
            <Text className="text-base font-semibold text-foreground">
              {new Date(selectedDate).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Orders List */}
        <View className="px-6 py-4 flex-1">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {selectedOrders.length} Agendamento{selectedOrders.length !== 1 ? 's' : ''}
          </Text>

          {selectedOrders.length > 0 ? (
            <FlatList
              data={selectedOrders}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {item.title}
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        {new Date(item.start_date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
                          item.status === 'agendado' && 'text-primary',
                          item.status === 'em_andamento' && 'text-warning',
                          item.status === 'concluido' && 'text-success',
                          item.status === 'cancelado' && 'text-muted'
                        )}
                      >
                        {item.status === 'agendado'
                          ? 'Agendado'
                          : item.status === 'em_andamento'
                            ? 'Em Andamento'
                            : item.status === 'concluido'
                              ? 'Concluído'
                              : 'Cancelado'}
                      </Text>
                    </View>
                  </View>

                  {item.description && (
                    <Text className="text-sm text-muted">{item.description}</Text>
                  )}

                  {item.estimated_value && (
                    <Text className="text-sm font-semibold text-foreground mt-2">
                      R$ {item.estimated_value.toFixed(2)}
                    </Text>
                  )}
                </View>
              )}
            />
          ) : (
            <View className="bg-surface rounded-lg p-6 items-center justify-center flex-1">
              <Text className="text-muted text-center">
                Nenhum agendamento para esta data
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
