import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useClientsSupabase } from '@/hooks/use-clients-supabase';
import { useToast } from '@/hooks/use-toast';
import { Toast } from '@/components/toast';

export default function ClientsScreen() {
  const router = useRouter();
  const { clients, isLoading, createClient, isCreating, deleteClient, isDeleting } =
    useClientsSupabase();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    cpf_cnpj: '',
    notes: '',
  });

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClient = async () => {
    if (!formData.name.trim()) {
      toast.error('Digite o nome do cliente');
      return;
    }

    try {
      await createClient({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone_number: formData.phone_number.trim() || undefined,
        address: formData.address.trim() || undefined,
        cpf_cnpj: formData.cpf_cnpj.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      setFormData({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        cpf_cnpj: '',
        notes: '',
      });
      setShowNewClientForm(false);
      toast.success('Cliente criado com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cliente';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    Alert.alert('Deletar Cliente', 'Tem certeza que deseja deletar este cliente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        onPress: () => {
          deleteClient(clientId);
          toast.success('Cliente deletado com sucesso!');
        },
        style: 'destructive',
      },
    ]);
  };

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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-[#2A9D76] px-6 py-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-white">Clientes</Text>
            <TouchableOpacity
              onPress={() => setShowNewClientForm(!showNewClientForm)}
              className="bg-white bg-opacity-20 px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-bold text-lg">+</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TextInput
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-white bg-opacity-90 rounded-lg px-4 py-2 text-gray-800"
            placeholderTextColor="#999"
          />
        </View>

        {/* New Client Form */}
        {showNewClientForm && (
          <View className="px-6 py-4 bg-white border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-800 mb-4">Novo Cliente</Text>

            <TextInput
              placeholder="Nome *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3 text-gray-800"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="E-mail"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3 text-gray-800"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Telefone"
              value={formData.phone_number}
              onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3 text-gray-800"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Endereço"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3 text-gray-800"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="CPF/CNPJ"
              value={formData.cpf_cnpj}
              onChangeText={(text) => setFormData({ ...formData, cpf_cnpj: text })}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3 text-gray-800"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Notas"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              multiline
              numberOfLines={3}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3 text-gray-800"
              placeholderTextColor="#999"
            />

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleCreateClient}
                disabled={isCreating}
                className="flex-1 bg-[#2A9D76] rounded-lg py-3 items-center justify-center"
              >
                {isCreating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold">Criar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowNewClientForm(false)}
                className="flex-1 bg-gray-300 rounded-lg py-3 items-center justify-center"
              >
                <Text className="text-gray-800 font-bold">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Clients List */}
        <View className="px-6 py-4 flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {filteredClients.length} Cliente{filteredClients.length !== 1 ? 's' : ''}
          </Text>

          {filteredClients.length > 0 ? (
            <FlatList
              data={filteredClients}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/client/${item.id}` as any)}
                  className="bg-white p-4 mb-3 rounded-xl border border-gray-100 shadow-sm active:opacity-70"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
                      {item.phone_number && (
                        <Text className="text-xs text-gray-500 mt-1">{item.phone_number}</Text>
                      )}
                      {item.email && (
                        <Text className="text-xs text-gray-500">{item.email}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteClient(item.id)}
                      disabled={isDeleting}
                      className="ml-2"
                    >
                      <Text className="text-red-500 text-lg">🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View className="p-6 items-center">
              <Text className="text-gray-400">
                {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={toast.hide}
      />
    </ScreenContainer>
  );
}
