import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useServiceOrdersSupabase } from '@/hooks/use-service-orders-supabase';

const COLORS = {
  brand: '#2A9D76',
  brandDark: '#1B7055',
  accent: '#F5820D',
  bg: '#F7F6F3',
  white: '#FFFFFF',
  border: '#E5E3DC',
  text: '#2C2B27',
  muted: '#8C8A82',
  faint: '#C4C2BA',
  blue: '#1D4ED8',
  blueBg: '#EFF6FF',
  yellow: '#92400E',
  yellowBg: '#FFFBEB',
  green: '#15803D',
  greenBg: '#F0FDF4',
  red: '#B91C1C',
  redBg: '#FEF2F2',
};

const VIEW_MODES = [
  { key: 'day', label: 'Dia' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mês' },
] as const;

export default function CalendarScreen() {
  const { orders, isLoading, getOrdersByDate } = useServiceOrdersSupabase();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const selectedOrders = getOrdersByDate(selectedDate);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'agendado':
        return { bg: COLORS.blueBg, text: COLORS.blue, label: 'Agendado' };
      case 'em_andamento':
        return { bg: COLORS.yellowBg, text: COLORS.yellow, label: 'Em andamento' };
      case 'concluido':
        return { bg: COLORS.greenBg, text: COLORS.green, label: 'Concluído' };
      case 'cancelado':
        return { bg: COLORS.redBg, text: COLORS.red, label: 'Cancelado' };
      default:
        return { bg: COLORS.bg, text: COLORS.muted, label: status };
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-0">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.brand} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={selectedOrders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerLabel}>AGENDA</Text>
              <Text style={styles.headerTitle}>Agendamentos</Text>
              <Text style={styles.headerSub}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>

            {/* View Mode Selector */}
            <View style={styles.tabRow}>
              {VIEW_MODES.map((mode) => (
                <TouchableOpacity
                  key={mode.key}
                  onPress={() => setViewMode(mode.key)}
                  style={[
                    styles.tabBtn,
                    viewMode === mode.key ? styles.tabBtnActive : styles.tabBtnInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      viewMode === mode.key ? styles.tabBtnTextActive : styles.tabBtnTextInactive,
                    ]}
                  >
                    {mode.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Count */}
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                {selectedOrders.length} Agendamento{selectedOrders.length !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.listSub}>
                {selectedDate}
              </Text>
            </View>
          </>
        )}
        renderItem={({ item }) => {
          const statusConfig = getStatusConfig(item.status);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.card}
            >
              <View style={styles.cardRow}>
                {/* Indicador de cor */}
                <View style={[styles.cardAccent, { backgroundColor: COLORS.brand }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardTime}>
                    {new Date(item.start_date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: statusConfig.bg }]}>
                  <Text style={[styles.badgeText, { color: statusConfig.text }]}>
                    {statusConfig.label}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum agendamento para esta data</Text>
            <Text style={styles.emptyHint}>Crie uma nova ordem de serviço</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    textTransform: 'capitalize',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  tabBtnActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  tabBtnInactive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: COLORS.white,
  },
  tabBtnTextInactive: {
    color: COLORS.muted,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  listSub: {
    fontSize: 13,
    color: COLORS.muted,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  cardAccent: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardTime: {
    fontSize: 13,
    color: COLORS.muted,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
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
