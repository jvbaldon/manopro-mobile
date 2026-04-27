import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ServiceOrder, ServiceOrderStatus } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

/**
 * Hook para gerenciar ordens de serviço com Supabase
 * Usa React Query para cache, sincronização e refetch automático
 */
export function useServiceOrdersSupabase() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar todas as ordens do usuário autenticado
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['service_orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as ServiceOrder[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Criar nova ordem de serviço
  const createOrderMutation = useMutation({
    mutationFn: async (
      order: Omit<ServiceOrder, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('service_orders')
        .insert([
          {
            ...order,
            user_id: user.id,
            status: order.status || 'agendado',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as ServiceOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_orders', user?.id] });
    },
  });

  // Atualizar ordem de serviço
  const updateOrderMutation = useMutation({
    mutationFn: async (
      { id, updates }: { id: string; updates: Partial<ServiceOrder> }
    ) => {
      const { data, error } = await supabase
        .from('service_orders')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data as ServiceOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_orders', user?.id] });
    },
  });

  // Deletar ordem de serviço
  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_orders', user?.id] });
    },
  });

  // Atualizar status da ordem
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ServiceOrderStatus;
    }) => {
      const { data, error } = await supabase
        .from('service_orders')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data as ServiceOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_orders', user?.id] });
    },
  });

  // Filtrar ordens por status
  const getOrdersByStatus = (status: ServiceOrderStatus) => {
    return orders.filter((order) => order.status === status);
  };

  // Filtrar ordens por cliente
  const getOrdersByClient = (clientId: string) => {
    return orders.filter((order) => order.client_id === clientId);
  };

  // Filtrar ordens por data
  const getOrdersByDate = (date: string) => {
    return orders.filter((order) => {
      const orderDate = new Date(order.start_date).toDateString();
      const filterDate = new Date(date).toDateString();
      return orderDate === filterDate;
    });
  };

  // Obter uma ordem específica
  const getOrder = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  return {
    // Estado
    orders,
    isLoading,
    error: error?.message || null,

    // Queries
    refetch,

    // Mutations
    createOrder: createOrderMutation.mutate,
    createOrderAsync: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,

    updateOrder: updateOrderMutation.mutate,
    updateOrderAsync: updateOrderMutation.mutateAsync,
    isUpdating: updateOrderMutation.isPending,

    deleteOrder: deleteOrderMutation.mutate,
    deleteOrderAsync: deleteOrderMutation.mutateAsync,
    isDeleting: deleteOrderMutation.isPending,

    updateOrderStatus: updateOrderStatusMutation.mutate,
    updateOrderStatusAsync: updateOrderStatusMutation.mutateAsync,
    isUpdatingStatus: updateOrderStatusMutation.isPending,

    // Filtros
    getOrdersByStatus,
    getOrdersByClient,
    getOrdersByDate,
    getOrder,
  };
}
