import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceOrder, ServiceOrderWithDetails, ServiceOrderStatus } from '@/lib/types';

const STORAGE_KEY = 'service_orders';

/**
 * Hook para gerenciar ordens de serviço
 * Fornece CRUD de OS com persistência local
 */
export function useServiceOrders() {
  const [orders, setOrders] = useState<ServiceOrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar ordens de serviço
  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setOrders(JSON.parse(stored));
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar ordens';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar nova ordem de serviço
  const createOrder = useCallback(
    async (order: Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        setIsLoading(true);
        const newOrder: ServiceOrderWithDetails = {
          ...order,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const updated = [...orders, newOrder];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setOrders(updated);
        setError(null);
        return newOrder;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao criar ordem';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [orders]
  );

  // Atualizar ordem de serviço
  const updateOrder = useCallback(
    async (id: string, updates: Partial<ServiceOrder>) => {
      try {
        setIsLoading(true);
        const updated = orders.map((order) =>
          order.id === id
            ? {
                ...order,
                ...updates,
                updated_at: new Date().toISOString(),
              }
            : order
        );

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setOrders(updated);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar ordem';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [orders]
  );

  // Deletar ordem de serviço
  const deleteOrder = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        const updated = orders.filter((order) => order.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setOrders(updated);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar ordem';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [orders]
  );

  // Obter uma ordem específica
  const getOrder = useCallback(
    (id: string) => {
      return orders.find((order) => order.id === id);
    },
    [orders]
  );

  // Mudar status da ordem
  const updateOrderStatus = useCallback(
    async (id: string, status: ServiceOrderStatus) => {
      return updateOrder(id, { status });
    },
    [updateOrder]
  );

  // Filtrar ordens por status
  const getOrdersByStatus = useCallback(
    (status: ServiceOrderStatus) => {
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  // Filtrar ordens por cliente
  const getOrdersByClient = useCallback(
    (clientId: string) => {
      return orders.filter((order) => order.client_id === clientId);
    },
    [orders]
  );

  // Filtrar ordens por data
  const getOrdersByDate = useCallback(
    (date: string) => {
      return orders.filter((order) => {
        const orderDate = new Date(order.start_date).toDateString();
        const filterDate = new Date(date).toDateString();
        return orderDate === filterDate;
      });
    },
    [orders]
  );

  return {
    orders,
    isLoading,
    error,
    loadOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrder,
    updateOrderStatus,
    getOrdersByStatus,
    getOrdersByClient,
    getOrdersByDate,
  };
}
