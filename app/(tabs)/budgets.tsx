import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useEffect, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useBudgets } from '@/hooks/use-budgets';
import { BudgetStatus } from '@/lib/types';

const COLORS = {
  brand: '#2A9D76',
  brandDark: '#1B7055',
  accent: '#F5820D',
  accentLight: '#FFF3E8',
  bg: '#F7F6F3',
  white: '#FFFFFF',
  border: '#E5E3DC',
  text: '#2C2B27',
  muted: '#8C8A82',
  faint: '#C4C2BA',
  yellow: '#92400E',
  yellowBg: '#FFFBEB',
  yellowBorder: '#FDE68A',
  green: '#15803D',
  greenBg: '#F0FDF4',
  greenBorder: '#BBF7D0',
  red: '#B91C1C',
  redBg: '#FEF2F2',
  redBorder: '#FECACA',
};

const STATUS_FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendente', label: 'Pendentes' },
  { key: 'aprovado', label: 'Aprovados' },
  { key: 'recusado', label: 'Recusados' },
] as const;

export default function BudgetsScreen() {
  const { budgets, loadBudgets } = useBudgets();
  const [filterStatus, setFilterStatus] = useState<BudgetStatus | 'todos'>('todos');

  useEffect(() => {
    loadBudgets();
  }, []);

  const filteredBudgets =
    filterStatus === 'todos'
      ? budgets
      : budgets.filter((budget) => budget.status === filterStatus);

  const getStatusConfig = (status: BudgetStatus) => {
    switch (status) {
      case 'pendente':
        return { bg: COLORS.yellowBg, text: COLORS.yellow, border: COLORS.yellowBorder, label: 'Pendente' };
      case 'aprovado':
        return { bg: COLORS.greenBg, text: COLORS.green, border: COLORS.greenBorder, label: 'Aprovado' };
      case 'recusado':
        return { bg: COLORS.redBg, text: COLORS.red, border: COLORS.redBorder, label: 'Recusado' };
      default:
        return { bg: COLORS.bg, text: COLORS.muted, border: COLORS.border, label: status };
    }
  };

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={filteredBudgets}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerLabel}>ORÇAMENTOS</Text>
              <Text style={styles.headerTitle}>Gestão de Orçamentos</Text>
              <Text style={styles.headerSub}>Acompanhe propostas e aprovações</Text>
            </View>

            {/* Filtros */}
            <View style={styles.filterRow}>
              {STATUS_FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setFilterStatus(f.key)}
                  style={[
                    styles.filterBtn,
                    filterStatus === f.key ? styles.filterBtnActive : styles.filterBtnInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterBtnText,
                      filterStatus === f.key ? styles.filterBtnTextActive : styles.filterBtnTextInactive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Contador */}
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                {filteredBudgets.length} Orçamento{filteredBudgets.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </>
        )}
        renderItem={({ item }) => {
          const statusConfig = getStatusConfig(item.status);
          return (
            <TouchableOpacity activeOpacity={0.7} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardDate}>
                    {new Date(item.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: statusConfig.bg, borderColor: statusConfig.border }]}>
                  <Text style={[styles.badgeText, { color: statusConfig.text }]}>
                    {statusConfig.label}
                  </Text>
                </View>
              </View>

              {item.description ? (
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
              ) : null}

              <View style={styles.cardFooter}>
                <Text style={styles.cardValue}>
                  R$ {item.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.btnPrimary}>
                    <Text style={styles.btnPrimaryText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnSecondary}>
                    <Text style={styles.btnSecondaryText}>Enviar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum orçamento encontrado</Text>
            <Text style={styles.emptyHint}>Crie seu primeiro orçamento</Text>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexWrap: 'wrap',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  filterBtnActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  filterBtnInactive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: COLORS.white,
  },
  filterBtnTextInactive: {
    color: COLORS.muted,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: COLORS.muted,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 12,
    lineHeight: 18,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  btnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: COLORS.brand,
    borderRadius: 9999,
  },
  btnPrimaryText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  btnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: COLORS.white,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnSecondaryText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 13,
    color: COLORS.faint,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: COLORS.accent,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});
