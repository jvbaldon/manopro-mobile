import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';

export function useImageUpload() {
  const pickImage = async () => {
    try {
      // Solicitar permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos de acesso à galeria para selecionar imagens');
        return null;
      }

      // Abrir seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0];
      }

      return null;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar imagem');
      return null;
    }
  };

  const takePhoto = async () => {
    try {
      // Solicitar permissão de câmera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos de acesso à câmera para tirar fotos');
        return null;
      }

      // Abrir câmera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0];
      }

      return null;
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tirar foto');
      return null;
    }
  };

  const uploadImage = async (
    imageUri: string,
    bucket: string,
    path: string
  ): Promise<string | null> => {
    try {
      // Ler arquivo como base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Determinar tipo MIME
      const mimeType = imageUri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, Buffer.from(base64, 'base64'), {
          contentType: mimeType,
          upsert: true,
        });

      if (error) throw error;

      // Obter URL pública
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);

      return publicData?.publicUrl || null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer upload';
      Alert.alert('Erro', `Erro ao fazer upload: ${errorMessage}`);
      return null;
    }
  };

  const uploadOrderPhoto = async (orderId: string, imageUri: string): Promise<string | null> => {
    const timestamp = Date.now();
    const fileName = `order_${orderId}_${timestamp}.jpg`;
    const path = `orders/${orderId}/${fileName}`;

    return uploadImage(imageUri, 'order-photos', path);
  };

  const uploadProfilePhoto = async (userId: string, imageUri: string): Promise<string | null> => {
    const fileName = `profile_${userId}.jpg`;
    const path = `profiles/${userId}/${fileName}`;

    return uploadImage(imageUri, 'profile-photos', path);
  };

  return {
    pickImage,
    takePhoto,
    uploadImage,
    uploadOrderPhoto,
    uploadProfilePhoto,
  };
}
