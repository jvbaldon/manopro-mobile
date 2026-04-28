import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useServiceOrdersSupabase } from '@/hooks/use-service-orders-supabase';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Client } from '@/lib/types';

const COLORS = {
  brand: '#2A9D76',
  brandDark: '#1B7055',
  accent: '#F5820D',
  bg: '#F7F6F3',
  white: '#FFFFFF',
  border: '#E5E3DC',
  borderFocus: '#2A9D76',
  text: '#2C2B27',
  muted: '#8C8A82',
  faint: '#C4C2BA',
  placeholder: '#B0AEA6',
  red: '#B91C1C',
  redBg: '#FEF2F2',
};

export default function NewOrderScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createOrderAsync, isCreating } = useServiceOrdersSupabase();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    if (!title.trim()) return Alert.alert('Erro', 'O título do serviço é obrigatório');
    if (!selectedClientId) return Alert.alert('Erro', 'Selecione um cliente');
    if (!startDate) return Alert.alert('Erro', 'Selecione uma data');

    try {
      const [year, month, day] = startDate.split('-');
      const [hours, minutes] = startTime.split(':');
      const fullDateTime = new Date(
        parseInt(year), parseInt(month) - 1, parseInt(day),
        parseInt(hours), parseInt(minutes)
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
      <ScreenContainer className="p-0">
        <View style={styles.loadingContainer}>
          <Text style={styles.mutedText}>Você precisa estar autenticado</Text>
        </View>
      </ScreenContainer>
    );
  }

  const inputStyle = (field: string) => ([
    styles.input,
    focusedField === field && styles.inputFocused,
  ]);

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={[]}
        keyExtractor={() => 'form'}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerLabel}>NOVA OS</Text>
              <Text style={styles.headerTitle}>Nova Ordem de Serviço</Text>
              <Text style={styles.headerSub}>Crie um novo atendimento</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Título */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Título do Serviço *</Text>
                <TextInput
                  placeholder="Ex: Encanamento - Vazamento"
                  placeholderTextColor={COLORS.placeholder}
                  value={title}
                  onChangeText={setTitle}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('title')}
                  editable={!isCreating}
                />
              </View>

              {/* Descrição */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  placeholder="Detalhes adicionais do serviço..."
                  placeholderTextColor={COLORS.placeholder}
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setFocusedField('desc')}
                  onBlur={() => setFocusedField(null)}
                  multiline
                  numberOfLines={4}
                  style={[inputStyle('desc'), styles.textArea]}
                  editable={!isCreating}
                  textAlignVertical="top"
                />
              </View>

              {/* Cliente */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Cliente *</Text>
                {loadingClients ? (
                  <View style={[styles.input, styles.inputCenter]}>
                    <ActivityIndicator size="small" color={COLORS.brand} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => setShowClientPicker(!showClientPicker)}
                    style={[
                      styles.input,
                      showClientPicker && styles.inputFocused,
                    ]}
                    disabled={isCreating}
                  >
                    <Text style={selectedClient ? styles.inputText : styles.inputPlaceholder}>
                      {selectedClient?.name || 'Selecione um cliente'}
                    </Text>
                  </TouchableOpacity>
                )}

                {showClientPicker && clients.length > 0 && (
                  <View style={styles.dropdown}>
                    {clients.map((client) => (
                      <TouchableOpacity
                        key={client.id}
                        onPress={() => {
                          setSelectedClientId(client.id);
                          setShowClientPicker(false);
                        }}
                        style={styles.dropdownItem}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.dropdownItemName}>{client.name}</Text>
                          <Text style={styles.dropdownItemSub}>{client.phone_number}</Text>
                        </View>
                        {selectedClientId === client.id && (
                          <View style={styles.checkDot} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {clients.length === 0 && !loadingClients && (
                  <Text style={styles.errorHint}>
                    Nenhum cliente cadastrado. Crie um cliente primeiro.
                  </Text>
                )}
              </View>

              {/* Data e Hora em row */}
              <View style={styles.rowFields}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Data *</Text>
                  <TextInput
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor={COLORS.placeholder}
                    value={startDate}
                    onChangeText={setStartDate}
                    onFocus={() => setFocusedField('date')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('date')}
                    editable={!isCreating}
                  />
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Hora</Text>
                  <TextInput
                    placeholder="HH:MM"
                    placeholderTextColor={COLORS.placeholder}
                    value={startTime}
                    onChangeText={setStartTime}
                    onFocus={() => setFocusedField('time')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('time')}
                    editable={!isCreating}
                  />
                </View>
              </View>

              {/* Valor Estimado */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Valor Estimado (R$)</Text>
                <TextInput
                  placeholder="0,00"
                  placeholderTextColor={COLORS.placeholder}
                  value={estimatedValue}
                  onChangeText={setEstimatedValue}
                  onFocus={() => setFocusedField('value')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="decimal-pad"
                  style={inputStyle('value')}
                  editable={!isCreating}
                />
              </View>

              {/* Botões */}
              <View style={styles.btnRow}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  disabled={isCreating}
                  style={styles.btnCancel}
                >
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={isCreating}
                  style={[styles.btnSave, isCreating && { opacity: 0.7 }]}
                >
                  {isCreating ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.btnSaveText}>Salvar OS</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        renderItem={() => null}
        ListFooterComponent={<View style={{ height: 60 }} />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedText: {
    fontSize: 15,
    color: COLORS.muted,
  },
  header: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    fontSize: 15,
    color: COLORS.text,
    justifyContent: 'center',
  },
  inputFocused: {
    borderColor: COLORS.borderFocus,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
  },
  inputCenter: {
    alignItems: 'center',
  },
  inputText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  inputPlaceholder: {
    fontSize: 15,
    color: COLORS.placeholder,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  dropdownItemSub: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  checkDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.brand,
  },
  errorHint: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: 6,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  btnCancel: {
    flex: 1,
    height: 50,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.muted,
  },
  btnSave: {
    flex: 1,
    height: 50,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});
