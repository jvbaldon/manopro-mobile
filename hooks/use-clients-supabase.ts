import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Client } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

/**
 * Hook para gerenciar clientes com Supabase
 */
export function useClientsSupabase() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar todos os clientes do usuário
  const {
    data: clients = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clients', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Client[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Criar novo cliente
  const createClientMutation = useMutation({
    mutationFn: async (
      client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            ...client,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.id] });
    },
  });

  // Atualizar cliente
  const updateClientMutation = useMutation({
    mutationFn: async (
      { id, updates }: { id: string; updates: Partial<Client> }
    ) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.id] });
    },
  });

  // Deletar cliente
  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.id] });
    },
  });

  // Obter um cliente específico
  const getClient = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  return {
    // Estado
    clients,
    isLoading,
    error: error?.message || null,

    // Queries
    refetch,

    // Mutations
    createClient: createClientMutation.mutate,
    createClientAsync: createClientMutation.mutateAsync,
    isCreating: createClientMutation.isPending,

    updateClient: updateClientMutation.mutate,
    updateClientAsync: updateClientMutation.mutateAsync,
    isUpdating: updateClientMutation.isPending,

    deleteClient: deleteClientMutation.mutate,
    deleteClientAsync: deleteClientMutation.mutateAsync,
    isDeleting: deleteClientMutation.isPending,

    // Helpers
    getClient,
  };
}
