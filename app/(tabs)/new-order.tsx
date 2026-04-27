import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useServiceOrdersSupabase } from '@/hooks/use-service-orders-supabase';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Client } from '@/lib/types';

export default function NewOrderScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createOrderAsync, isCreating } = useServiceOrdersSupabase();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');

  // Clients list
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [showClientPicker, setShowClientPicker] = useState(false);

  // Carregar clientes do usuário
  useEffect(() => {
    const loadClients = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .order('name', { ascending: true });

        if (error) throw error;
        setClients(data || []);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
      } finally {
        setLoadingClients(false);
      }
    };

    loadClients();
  }, [user?.id]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleSave = async () => {
    // Validações
    if (!title.trim()) {
      return Alert.alert('Erro', 'O título do serviço é obrigatório');
    }

    if (!selectedClientId) {
      return Alert.alert('Erro', 'Selecione um cliente');
    }

    if (!startDate) {
      return Alert.alert('Erro', 'Selecione uma data');
    }

    try {
      // Combinar data e hora
      const [year, month, day] = startDate.split('-');
      const [hours, minutes] = startTime.split(':');
      const fullDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      ).toISOString();

      await createOrderAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        client_id: selectedClientId,
        start_date: fullDateTime,
        status: 'agendado',
        estimated_value: estimatedValue ? parseFloat(estimatedValue) : undefined,
      });

      Alert.alert('Sucesso', 'Ordem de Serviço criada com sucesso!');
      router.replace('/(tabs)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      Alert.alert('Erro ao salvar', errorMessage);
    }
  };

  if (!user?.id) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-gray-600">Você precisa estar autenticado</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-[#2A9D76] px-6 py-8">
          <Text className="text-2xl font-bold text-white">Nova Ordem de Serviço</Text>
          <Text className="text-green-50 text-sm mt-1">Crie um novo atendimento</Text>
        </View>

        {/* Form */}
        <View className="px-6 py-6 flex-1">
          {/* Título */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Título do Serviço *</Text>
            <TextInput
              placeholder="Ex: Encanamento - Vazamento"
              value={title}
              onChangeText={setTitle}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              editable={!isCreating}
            />
          </View>

          {/* Descrição */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Descrição</Text>
            <TextInput
              placeholder="Detalhes adicionais do serviço..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              editable={!isCreating}
              textAlignVertical="top"
            />
          </View>

          {/* Cliente */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Cliente *</Text>
            {loadingClients ? (
              <View className="border border-gray-300 rounded-lg px-4 py-3 justify-center items-center h-12">
                <ActivityIndicator size="small" color="#2A9D76" />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowClientPicker(!showClientPicker)}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white justify-center"
                disabled={isCreating}
              >
                <Text className={selectedClient ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                  {selectedClient?.name || 'Selecione um cliente'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Client Picker Dropdown */}
            {showClientPicker && clients.length > 0 && (
              <View className="border border-gray-300 rounded-lg mt-2 bg-white overflow-hidden">
                {clients.map((client) => (
                  <TouchableOpacity
                    key={client.id}
                    onPress={() => {
                      setSelectedClientId(client.id);
                      setShowClientPicker(false);
                    }}
                    className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-center"
                  >
                    <View className="flex-1">
                      <Text className="text-gray-900 font-medium">{client.name}</Text>
                      <Text className="text-xs text-gray-500 mt-1">{client.phone_number}</Text>
                    </View>
                    {selectedClientId === client.id && (
                      <View className="w-5 h-5 rounded-full bg-[#2A9D76]" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {clients.length === 0 && !loadingClients && (
              <Text className="text-xs text-red-500 mt-2">
                Nenhum cliente cadastrado. Crie um cliente primeiro.
              </Text>
            )}
          </View>

          {/* Data */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Data *</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              editable={!isCreating}
            />
          </View>

          {/* Hora */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Hora</Text>
            <TextInput
              placeholder="HH:MM"
              value={startTime}
              onChangeText={setStartTime}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              editable={!isCreating}
            />
          </View>

          {/* Valor Estimado */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Valor Estimado (R$)</Text>
            <TextInput
              placeholder="0.00"
              value={estimatedValue}
              onChangeText={setEstimatedValue}
              keyboardType="decimal-pad"
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              editable={!isCreating}
            />
          </View>

          {/* Botões */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              disabled={isCreating}
              className="flex-1 border border-gray-300 rounded-lg py-3 justify-center items-center"
            >
              <Text className="text-gray-700 font-semibold">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isCreating}
              className="flex-1 bg-[#2A9D76] rounded-lg py-3 justify-center items-center"
            >
              {isCreating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold">Salvar OS</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
