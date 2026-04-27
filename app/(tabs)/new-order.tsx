import { ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';

const serviceTypes = [
  'Encanamento', 'Elétrica', 'Jardinagem',
  'Ar Condicionado', 'Pintura', 'Limpeza',
  'Marcenaria', 'Outros',
];

/**
 * New Order Screen — Criar Nova Ordem de Serviço
 */
export default function NewOrderScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [notes, setNotes] = useState('');

  const inputStyle = {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#2C2B27',
    marginTop: 6,
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#8C8A82',
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        {/* Header */}
        <View style={{
          backgroundColor: '#2A9D76',
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 24,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>← Voltar</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginTop: 12 }}>
            Nova Ordem de Serviço
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            Preencha os dados do serviço
          </Text>
        </View>

        <View style={{ padding: 20, gap: 20 }}>
          {/* Tipo de Serviço */}
          <View>
            <Text style={labelStyle}>Tipo de Serviço</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {serviceTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setServiceType(type)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 9999,
                    borderWidth: 1.5,
                    borderColor: serviceType === type ? '#2A9D76' : '#E5E3DC',
                    backgroundColor: serviceType === type ? '#E8F4F0' : '#FFFFFF',
                  }}
                >
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: serviceType === type ? '#1B7055' : '#5A5852',
                  }}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Título */}
          <View>
            <Text style={labelStyle}>Título da OS</Text>
            <TextInput
              style={inputStyle}
              placeholder="Ex: Troca de torneira, Instalação de tomada..."
              placeholderTextColor="#8C8A82"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Cliente */}
          <View>
            <Text style={labelStyle}>Nome do Cliente</Text>
            <TextInput
              style={inputStyle}
              placeholder="Nome completo"
              placeholderTextColor="#8C8A82"
              value={client}
              onChangeText={setClient}
            />
          </View>

          {/* Telefone */}
          <View>
            <Text style={labelStyle}>Telefone / WhatsApp</Text>
            <TextInput
              style={inputStyle}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#8C8A82"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Endereço */}
          <View>
            <Text style={labelStyle}>Endereço do Serviço</Text>
            <TextInput
              style={inputStyle}
              placeholder="Rua, número, bairro..."
              placeholderTextColor="#8C8A82"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Data e Hora */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>Data</Text>
              <TextInput
                style={inputStyle}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#8C8A82"
                value={date}
                onChangeText={setDate}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>Horário</Text>
              <TextInput
                style={inputStyle}
                placeholder="HH:MM"
                placeholderTextColor="#8C8A82"
                value={time}
                onChangeText={setTime}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Valor */}
          <View>
            <Text style={labelStyle}>Valor Estimado (R$)</Text>
            <TextInput
              style={inputStyle}
              placeholder="0,00"
              placeholderTextColor="#8C8A82"
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Observações */}
          <View>
            <Text style={labelStyle}>Observações</Text>
            <TextInput
              style={[inputStyle, { height: 90, textAlignVertical: 'top' }]}
              placeholder="Detalhes adicionais do serviço..."
              placeholderTextColor="#8C8A82"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>
        </View>
      </ScrollView>

      {/* Botão Salvar fixo no rodapé */}
      <View style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: 20,
        backgroundColor: '#F7F6F3',
        borderTopWidth: 1,
        borderTopColor: '#E5E3DC',
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#2A9D76',
            borderRadius: 9999,
            paddingVertical: 15,
            alignItems: 'center',
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Criar Ordem de Serviço
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}