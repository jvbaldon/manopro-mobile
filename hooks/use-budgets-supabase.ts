import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Budget, BudgetItem, BudgetStatus } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

/**
 * Hook para gerenciar orçamentos com Supabase
 */
export function useBudgetsSupabase() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar todos os orçamentos do usuário
  const {
    data: budgets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('budgets')
        .select('*, budget_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (Budget & { budget_items: BudgetItem[] })[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Criar novo orçamento
  const createBudgetMutation = useMutation({
    mutationFn: async (
      budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('budgets')
        .insert([
          {
            ...budget,
            user_id: user.id,
            status: budget.status || 'pendente',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id] });
    },
  });

  // Atualizar orçamento
  const updateBudgetMutation = useMutation({
    mutationFn: async (
      { id, updates }: { id: string; updates: Partial<Budget> }
    ) => {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data as Budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id] });
    },
  });

  // Deletar orçamento
  const deleteBudgetMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id] });
    },
  });

  // Atualizar status do orçamento
  const updateBudgetStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: BudgetStatus;
    }) => {
      const { data, error } = await supabase
        .from('budgets')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data as Budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id] });
    },
  });

  // Adicionar item ao orçamento
  const addBudgetItemMutation = useMutation({
    mutationFn: async (item: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('budget_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data as BudgetItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id] });
    },
  });

  // Remover item do orçamento
  const removeBudgetItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id] });
    },
  });

  // Filtrar orçamentos por status
  const getBudgetsByStatus = (status: BudgetStatus) => {
    return budgets.filter((budget) => budget.status === status);
  };

  // Obter um orçamento específico
  const getBudget = (id: string) => {
    return budgets.find((budget) => budget.id === id);
  };

  return {
    // Estado
    budgets,
    isLoading,
    error: error?.message || null,

    // Queries
    refetch,

    // Mutations
    createBudget: createBudgetMutation.mutate,
    createBudgetAsync: createBudgetMutation.mutateAsync,
    isCreating: createBudgetMutation.isPending,

    updateBudget: updateBudgetMutation.mutate,
    updateBudgetAsync: updateBudgetMutation.mutateAsync,
    isUpdating: updateBudgetMutation.isPending,

    deleteBudget: deleteBudgetMutation.mutate,
    deleteBudgetAsync: deleteBudgetMutation.mutateAsync,
    isDeleting: deleteBudgetMutation.isPending,

    updateBudgetStatus: updateBudgetStatusMutation.mutate,
    updateBudgetStatusAsync: updateBudgetStatusMutation.mutateAsync,
    isUpdatingStatus: updateBudgetStatusMutation.isPending,

    addBudgetItem: addBudgetItemMutation.mutate,
    addBudgetItemAsync: addBudgetItemMutation.mutateAsync,
    isAddingItem: addBudgetItemMutation.isPending,

    removeBudgetItem: removeBudgetItemMutation.mutate,
    removeBudgetItemAsync: removeBudgetItemMutation.mutateAsync,
    isRemovingItem: removeBudgetItemMutation.isPending,

    // Helpers
    getBudgetsByStatus,
    getBudget,
  };
}
