import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { FinancialTransaction, FinancialTransactionType } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

/**
 * Hook para gerenciar transações financeiras com Supabase
 */
export function useFinancialSupabase() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar todas as transações do usuário
  const {
    data: transactions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['financial_transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data as FinancialTransaction[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Criar nova transação
  const createTransactionMutation = useMutation({
    mutationFn: async (
      transaction: Omit<FinancialTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([
          {
            ...transaction,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as FinancialTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_transactions', user?.id] });
    },
  });

  // Atualizar transação
  const updateTransactionMutation = useMutation({
    mutationFn: async (
      { id, updates }: { id: string; updates: Partial<FinancialTransaction> }
    ) => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data as FinancialTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_transactions', user?.id] });
    },
  });

  // Deletar transação
  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_transactions', user?.id] });
    },
  });

  // Filtrar transações por tipo
  const getTransactionsByType = (type: FinancialTransactionType) => {
    return transactions.filter((transaction) => transaction.type === type);
  };

  // Filtrar transações por categoria
  const getTransactionsByCategory = (category: string) => {
    return transactions.filter((transaction) => transaction.category === category);
  };

  // Obter transações do mês atual
  const getMonthSummary = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return transactions.filter((t) => {
      const date = new Date(t.transaction_date);
      return date >= monthStart && date <= monthEnd;
    });
  };

  // Obter transações dos últimos 7 dias
  const getLast7DaysSummary = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return transactions.filter((t) => {
      const date = new Date(t.transaction_date);
      return date >= sevenDaysAgo && date <= now;
    });
  };

  // Calcular total de receitas
  const getTotalRevenue = () => {
    return getTransactionsByType('receita').reduce((sum, t) => sum + t.amount, 0);
  };

  // Calcular total de despesas
  const getTotalExpenses = () => {
    return getTransactionsByType('despesa').reduce((sum, t) => sum + t.amount, 0);
  };

  // Calcular lucro líquido
  const getTotalProfit = () => {
    return getTotalRevenue() - getTotalExpenses();
  };

  // Obter uma transação específica
  const getTransaction = (id: string) => {
    return transactions.find((transaction) => transaction.id === id);
  };

  return {
    // Estado
    transactions,
    isLoading,
    error: error?.message || null,

    // Queries
    refetch,

    // Mutations
    createTransaction: createTransactionMutation.mutate,
    createTransactionAsync: createTransactionMutation.mutateAsync,
    isCreating: createTransactionMutation.isPending,

    updateTransaction: updateTransactionMutation.mutate,
    updateTransactionAsync: updateTransactionMutation.mutateAsync,
    isUpdating: updateTransactionMutation.isPending,

    deleteTransaction: deleteTransactionMutation.mutate,
    deleteTransactionAsync: deleteTransactionMutation.mutateAsync,
    isDeleting: deleteTransactionMutation.isPending,

    // Helpers
    getTransactionsByType,
    getTransactionsByCategory,
    getMonthSummary,
    getLast7DaysSummary,
    getTotalRevenue,
    getTotalExpenses,
    getTotalProfit,
    getTransaction,
  };
}
