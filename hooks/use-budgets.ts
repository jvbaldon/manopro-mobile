import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget, BudgetItem, BudgetWithItems, BudgetStatus } from '@/lib/types';

const STORAGE_KEY = 'budgets';
const ITEMS_STORAGE_KEY = 'budget_items';

/**
 * Hook para gerenciar orçamentos
 * Fornece CRUD de orçamentos e itens com persistência local
 */
export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar orçamentos
  const loadBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const itemsStored = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);

      if (stored) {
        const budgetsData: Budget[] = JSON.parse(stored);
        const itemsData: BudgetItem[] = itemsStored ? JSON.parse(itemsStored) : [];

        const budgetsWithItems: BudgetWithItems[] = budgetsData.map((budget) => ({
          ...budget,
          items: itemsData.filter((item) => item.budget_id === budget.id),
        }));

        setBudgets(budgetsWithItems);
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar orçamentos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar novo orçamento
  const createBudget = useCallback(
    async (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        setIsLoading(true);
        const newBudget: BudgetWithItems = {
          ...budget,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: [],
        };

        const updated = [...budgets, newBudget];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBudgets(updated);
        setError(null);
        return newBudget;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao criar orçamento';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [budgets]
  );

  // Atualizar orçamento
  const updateBudget = useCallback(
    async (id: string, updates: Partial<Budget>) => {
      try {
        setIsLoading(true);
        const updated = budgets.map((budget) =>
          budget.id === id
            ? {
                ...budget,
                ...updates,
                updated_at: new Date().toISOString(),
              }
            : budget
        );

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBudgets(updated);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar orçamento';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [budgets]
  );

  // Deletar orçamento
  const deleteBudget = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        const updated = budgets.filter((budget) => budget.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBudgets(updated);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar orçamento';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [budgets]
  );

  // Adicionar item ao orçamento
  const addBudgetItem = useCallback(
    async (budgetId: string, item: Omit<BudgetItem, 'id' | 'created_at'>) => {
      try {
        setIsLoading(true);
        const newItem: BudgetItem = {
          ...item,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };

        const updated = budgets.map((budget) =>
          budget.id === budgetId
            ? {
                ...budget,
                items: [...(budget.items || []), newItem],
                total_value: (budget.total_value || 0) + (item.labor_value || 0) + (item.material_value || 0),
              }
            : budget
        );

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBudgets(updated);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar item';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [budgets]
  );

  // Remover item do orçamento
  const removeBudgetItem = useCallback(
    async (budgetId: string, itemId: string) => {
      try {
        setIsLoading(true);
        const updated = budgets.map((budget) => {
          if (budget.id === budgetId) {
            const removedItem = budget.items?.find((item) => item.id === itemId);
            const newItems = budget.items?.filter((item) => item.id !== itemId) || [];
            const removedValue = (removedItem?.labor_value || 0) + (removedItem?.material_value || 0);

            return {
              ...budget,
              items: newItems,
              total_value: Math.max(0, (budget.total_value || 0) - removedValue),
            };
          }
          return budget;
        });

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBudgets(updated);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao remover item';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [budgets]
  );

  // Mudar status do orçamento
  const updateBudgetStatus = useCallback(
    async (id: string, status: BudgetStatus) => {
      return updateBudget(id, { status, approved_at: status === 'aprovado' ? new Date().toISOString() : undefined });
    },
    [updateBudget]
  );

  // Filtrar orçamentos por status
  const getBudgetsByStatus = useCallback(
    (status: BudgetStatus) => {
      return budgets.filter((budget) => budget.status === status);
    },
    [budgets]
  );

  // Obter um orçamento específico
  const getBudget = useCallback(
    (id: string) => {
      return budgets.find((budget) => budget.id === id);
    },
    [budgets]
  );

  return {
    budgets,
    isLoading,
    error,
    loadBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    addBudgetItem,
    removeBudgetItem,
    updateBudgetStatus,
    getBudgetsByStatus,
    getBudget,
  };
}
