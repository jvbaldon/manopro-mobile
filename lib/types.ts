/**
 * Tipos e interfaces para o SaaS de Gestão de Serviço
 */

// ============================================
// Autenticação e Usuário
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  cpf_cnpj?: string;
  address?: string;
  profile_picture_url?: string;
  specialties?: string[];
  bio?: string;
  google_my_business_link?: string;
  instagram_link?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  error?: string;
}

// ============================================
// Clientes
// ============================================

export interface Client {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Ordens de Serviço
// ============================================

export type ServiceOrderStatus = 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';

export interface ServiceOrder {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  description?: string;
  estimated_value?: number;
  start_date: string;
  end_date?: string;
  status: ServiceOrderStatus;
  location?: string;
  recurrence_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceOrderPhoto {
  id: string;
  service_order_id: string;
  photo_url: string;
  created_at: string;
}

export interface ServiceOrderWithDetails extends ServiceOrder {
  client?: Client;
  photos?: ServiceOrderPhoto[];
}

// ============================================
// Orçamentos
// ============================================

export type BudgetStatus = 'pendente' | 'aprovado' | 'recusado';

export interface Budget {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  description?: string;
  total_value: number;
  status: BudgetStatus;
  pdf_url?: string;
  signature_image_url?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: string;
  budget_id: string;
  description: string;
  labor_value?: number;
  material_value?: number;
  quantity: number;
  created_at: string;
}

export interface BudgetWithItems extends Budget {
  items?: BudgetItem[];
  client?: Client;
}

// ============================================
// Transações Financeiras
// ============================================

export type TransactionType = 'receita' | 'despesa';
export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao' | 'boleto';

export interface FinancialTransaction {
  id: string;
  user_id: string;
  service_order_id?: string;
  type: TransactionType;
  category?: string;
  description?: string;
  amount: number;
  payment_method?: PaymentMethod;
  transaction_date: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Grupos de Compra
// ============================================

export type GroupBuyStatus = 'aberto' | 'em_progresso' | 'finalizado' | 'cancelado';

export interface GroupBuy {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: string;
  region?: string;
  min_participants: number;
  current_participants: number;
  status: GroupBuyStatus;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface GroupBuyProduct {
  id: string;
  group_buy_id: string;
  name: string;
  unit_price: number;
  collective_price: number;
  supplier?: string;
  created_at: string;
}

// ============================================
// Avaliações
// ============================================

export interface Review {
  id: string;
  service_order_id: string;
  client_id: string;
  rating: number;
  comment?: string;
  source?: string;
  created_at: string;
}

// ============================================
// Rede de Trabalhadores
// ============================================

export type RelationshipType = 'indicacao' | 'subcontratacao' | 'conexao';
export type RelationshipStatus = 'pendente' | 'aceito' | 'recusado';

export interface UserNetwork {
  id: string;
  user_id_1: string;
  user_id_2: string;
  relationship_type: RelationshipType;
  commission_rate?: number;
  status: RelationshipStatus;
  created_at: string;
  updated_at: string;
}

// ============================================
// Chat
// ============================================

export interface Chat {
  id: string;
  user_id_1: string;
  user_id_2: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
}

// ============================================
// Planos e Assinaturas
// ============================================

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  features?: string[];
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = 'ativa' | 'cancelada' | 'expirada';

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date?: string;
  status: SubscriptionStatus;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Onboarding
// ============================================

export interface OnboardingStep {
  id: string;
  user_id: string;
  step_name: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Mensagens WhatsApp
// ============================================

export type WhatsAppMessageType = 'lembrete' | 'orcamento' | 'confirmacao' | 'followup';
export type WhatsAppMessageStatus = 'enviado' | 'lido' | 'falha';

export interface WhatsAppMessage {
  id: string;
  user_id: string;
  client_id: string;
  message_type: WhatsAppMessageType;
  content: string;
  sent_at: string;
  status?: WhatsAppMessageStatus;
}

// ============================================
// Dashboard e Estatísticas
// ============================================

export interface DashboardStats {
  totalServiceOrders: number;
  completedServiceOrders: number;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  averageRating: number;
  pendingBudgets: number;
}

export interface FinancialSummary {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}
