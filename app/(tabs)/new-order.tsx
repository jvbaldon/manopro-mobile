import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../lib/supabase'; // Conexão real
import { useRouter } from 'expo-router';

export default function NewOrderScreen() {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!title) return Alert.alert('Erro', 'O título do serviço é obrigatório');
    
    setLoading(true);
    
    // Inserindo no Supabase
    const { error } = await supabase.from('service_orders').insert([
      { 
        title, 
        estimated_value: parseFloat(value) || 0,
        status: 'pending' 
      }
    ]);

    setLoading(false);

    if (error) {
      Alert.alert('Erro ao salvar', error.message);
    } else {
      Alert.alert('Sucesso', 'Ordem de Serviço criada!');
      // Em vez de router.back(), use replace para forçar a Home a recarregar
      router.replace('/(tabs)'); 
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Nova Ordem de Serviço</Text>
      
      <TextInput 
        placeholder="Título do Serviço" 
        value={title} 
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />
      
      <TextInput 
        placeholder="Valor Estimado (R$)" 
        value={value} 
        onChangeText={setValue}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
      />
      
      <TouchableOpacity 
        onPress={handleSave} 
        disabled={loading}
        style={{ backgroundColor: '#2A9D76', padding: 15, borderRadius: 5 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {loading ? 'Salvando...' : 'Salvar OS'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}