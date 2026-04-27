import { useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FinancialTransaction, FinancialSummary } from '@/lib/types';

const STORAGE_KEY = 'financial_transactions';

/**
 * Hook para gerenciar transações financeiras
 * Fornece CRUD de transações e cálculos de resumo financeiro
 */
export function useFinancial() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar transações
  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar nova transação
  const createTransaction = useCallback(
    async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        setIsLoading(true);
        const newTransaction: FinancialTransaction = {
          ...transaction,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const updated = [...transactions, newTransaction];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setTransactions(updated);
        setError(null);
        return newTransaction;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao criar transação';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [transactions]
  );

  // Atualizar transação
  const updateTransaction = useCallback(
    async (id: string, updates: Partial<FinancialTransaction>) => {
      try {
        setIsLoading(true);
        const updated = transactions.map((transaction) =>
          transaction.id === id
            ? {
                ...transaction,
                ...updates,
                updated_at: new Date().toISOString(),
              }
            : transaction
        );

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setTransactions(updated);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar transação';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [transactions]
  );

  // Deletar transação
  const deleteTransaction = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        const updated = transactions.filter((transaction) => transaction.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setTransactions(updated);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar transação';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [transactions]
  );

  // Calcular resumo financeiro do mês
  const getMonthSummary = useCallback(
    (month?: string) => {
      const now = new Date();
      const targetMonth = month ? new Date(month) : now;
      const monthStr = `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`;

      const monthTransactions = transactions.filter((t) => t.transaction_date.startsWith(monthStr));

      const revenue = monthTransactions
        .filter((t) => t.type === 'receita')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === 'despesa')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: monthStr,
        revenue,
        expenses,
        profit: revenue - expenses,
      };
    },
    [transactions]
  );

  // Calcular resumo financeiro dos últimos 7 dias
  const getLast7DaysSummary = useCallback(() => {
    const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const filteredTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate >= sevenDaysAgo && transactionDate <= now;
      });

      const dailySummary: { [key: string]: FinancialSummary } = {};

      filteredTransactions.forEach((t) => {
        const date = t.transaction_date.split('T')[0];
        if (!dailySummary[date]) {
          dailySummary[date] = { month: date, revenue: 0, expenses: 0, profit: 0 };
        }

        if (t.type === 'receita') {
          dailySummary[date].revenue += t.amount;
        } else {
          dailySummary[date].expenses += t.amount;
        }
        dailySummary[date].profit = dailySummary[date].revenue - dailySummary[date].expenses;
      });

      return Object.values(dailySummary).sort((a, b) => a.month.localeCompare(b.month));
    },
    [transactions]
  );

  // Obter total de receitas
  const getTotalRevenue = useCallback(() => {
    return transactions
      .filter((t) => t.type === 'receita')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Obter total de despesas
  const getTotalExpenses = useCallback(() => {
    return transactions
      .filter((t) => t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Obter lucro total
  const getTotalProfit = useCallback(() => {
    return getTotalRevenue() - getTotalExpenses();
  }, [getTotalRevenue, getTotalExpenses]);

  // Filtrar transações por tipo
  const getTransactionsByType = useCallback(
    (type: 'receita' | 'despesa') => {
      return transactions.filter((t) => t.type === type);
    },
    [transactions]
  );

  // Filtrar transações por categoria
  const getTransactionsByCategory = useCallback(
    (category: string) => {
      return transactions.filter((t) => t.category === category);
    },
    [transactions]
  );

  return {
    transactions,
    isLoading,
    error,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthSummary,
    getLast7DaysSummary,
    getTotalRevenue,
    getTotalExpenses,
    getTotalProfit,
    getTransactionsByType,
    getTransactionsByCategory,
  };
}
