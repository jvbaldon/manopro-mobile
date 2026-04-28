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
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/pagination';

const COLORS = {
  brand: '#2A9D76',
  brandDark: '#1B7055',
  brandLight: '#E8F4F0',
  accent: '#F5820D',
  accentLight: '#FFF3E8',
  bg: '#F7F6F3',
  white: '#FFFFFF',
  border: '#E5E3DC',
  text: '#2C2B27',
  muted: '#8C8A82',
  inputBg: '#FAF9F7',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
};

const SPECIALTIES = [
  'Encanador', 'Eletricista', 'Pintor', 'Instalador AC',
  'Jardineiro', 'Pedreiro', 'Marcineiro', 'Outros',
];

const FormInput = ({
  label, value, onChangeText, placeholder, keyboardType, multiline, editable, autoCapitalize,
}: any) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={{
      fontSize: 11, fontWeight: '600', color: COLORS.muted,
      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
    }}>
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType || 'default'}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      editable={editable !== false}
      autoCapitalize={autoCapitalize || 'none'}
      placeholderTextColor={COLORS.muted}
      style={{
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 4,
        paddingHorizontal: 14,
        paddingVertical: multiline ? 12 : 12,
        fontSize: 15,
        color: COLORS.text,
        minHeight: multiline ? 80 : undefined,
        textAlignVertical: multiline ? 'top' : 'center',
      }}
    />
  </View>
);

export default function ClientsScreen() {
  const router = useRouter();
  const { clients, isLoading, createClient, isCreating, deleteClient, isDeleting } =
    useClientsSupabase();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone_number: '', address: '', cpf_cnpj: '', notes: '',
  });

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pagination = usePagination(filteredClients, { itemsPerPage: 10 });

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
      setFormData({ name: '', email: '', phone_number: '', address: '', cpf_cnpj: '', notes: '' });
      setShowNewClientForm(false);
      toast.success('Cliente criado com sucesso!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar cliente');
    }
  };

  const handleDeleteClient = (clientId: string) => {
    Alert.alert('Deletar Cliente', 'Tem certeza que deseja deletar este cliente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: () => {
          deleteClient(clientId);
          toast.success('Cliente deletado!');
        },
      },
    ]);
  };

  // Iniciais do cliente
  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  if (isLoading) {
    return (
      <ScreenContainer className="p-0">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={pagination.paginatedItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={{
              backgroundColor: COLORS.brand,
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 32,
            }}>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4, fontWeight: '500' }}>
                CLIENTES
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.white, marginBottom: 16 }}>
                {filteredClients.length} Cliente{filteredClients.length !== 1 ? 's' : ''}
              </Text>

              {/* Busca */}
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', marginRight: 8, fontSize: 16 }}>🔍</Text>
                <TextInput
                  placeholder="Buscar cliente..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={{ flex: 1, paddingVertical: 10, fontSize: 15, color: COLORS.white }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Botão novo cliente */}
            <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 }}>
              <TouchableOpacity
                onPress={() => setShowNewClientForm(!showNewClientForm)}
                style={{
                  backgroundColor: showNewClientForm ? COLORS.muted : COLORS.brand,
                  borderRadius: 9999,
                  paddingVertical: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 14 }}>
                  {showNewClientForm ? '✕ Cancelar' : '+ Novo Cliente'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulário de novo cliente */}
            {showNewClientForm && (
              <View style={{
                marginHorizontal: 20,
                marginTop: 16,
                backgroundColor: COLORS.white,
                borderRadius: 12,
                padding: 20,
                borderWidth: 1,
                borderColor: COLORS.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 16 }}>
                  Novo Cliente
                </Text>

                <FormInput
                  label="Nome Completo *"
                  value={formData.name}
                  onChangeText={(t: string) => setFormData({ ...formData, name: t })}
                  placeholder="Ex: João Silva"
                  autoCapitalize="words"
                />
                <FormInput
                  label="E-mail"
                  value={formData.email}
                  onChangeText={(t: string) => setFormData({ ...formData, email: t })}
                  placeholder="joao@email.com"
                  keyboardType="email-address"
                />
                <FormInput
                  label="Telefone"
                  value={formData.phone_number}
                  onChangeText={(t: string) => setFormData({ ...formData, phone_number: t })}
                  placeholder="(11) 99999-9999"
                  keyboardType="phone-pad"
                />
                <FormInput
                  label="Endereço"
                  value={formData.address}
                  onChangeText={(t: string) => setFormData({ ...formData, address: t })}
                  placeholder="Rua, número, bairro..."
                  autoCapitalize="words"
                />
                <FormInput
                  label="CPF / CNPJ"
                  value={formData.cpf_cnpj}
                  onChangeText={(t: string) => setFormData({ ...formData, cpf_cnpj: t })}
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                />
                <FormInput
                  label="Observações"
                  value={formData.notes}
                  onChangeText={(t: string) => setFormData({ ...formData, notes: t })}
                  placeholder="Preferências, detalhes..."
                  multiline
                  autoCapitalize="sentences"
                />

                <TouchableOpacity
                  onPress={handleCreateClient}
                  disabled={isCreating}
                  style={{
                    backgroundColor: isCreating ? COLORS.border : COLORS.brand,
                    borderRadius: 9999,
                    paddingVertical: 14,
                    alignItems: 'center',
                    marginTop: 4,
                  }}
                >
                  {isCreating ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>
                      Salvar Cliente
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text }}>
                Lista de Clientes
              </Text>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/client/${item.id}` as any)}
            activeOpacity={0.7}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 12,
              padding: 16,
              marginHorizontal: 20,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: COLORS.border,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {/* Avatar com iniciais */}
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: COLORS.brandLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.brand }}>
                {getInitials(item.name)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text }}>
                {item.name}
              </Text>
              {item.phone_number && (
                <Text style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>
                  📞 {item.phone_number}
                </Text>
              )}
              {item.email && (
                <Text style={{ fontSize: 12, color: COLORS.muted }} numberOfLines={1}>
                  {item.email}
                </Text>
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 18, color: COLORS.muted }}>›</Text>
              <TouchableOpacity
                onPress={() => handleDeleteClient(item.id)}
                disabled={isDeleting}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ fontSize: 16 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={{ paddingHorizontal: 20, paddingTop: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 15, color: COLORS.muted, textAlign: 'center', marginBottom: 8 }}>
              {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
            </Text>
            {!searchQuery && (
              <Text style={{ fontSize: 13, color: COLORS.muted, textAlign: 'center' }}>
                Toque em "+ Novo Cliente" para adicionar
              </Text>
            )}
          </View>
        )}
        ListFooterComponent={
          <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
            />
          </View>
        }
      />

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={toast.hide} />
    </ScreenContainer>
  );
}
