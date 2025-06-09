// Shared type definitions for Praxis Network frontend

// User types
export interface User {
  id: string;
  email: string;
  handle: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  disclosureLevel: 'OPEN' | 'STEALTH';
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication types
export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AdminAuthResponse {
  access_token: string;
  admin: AdminUser;
}

export interface RegistrationData {
  email: string;
  password: string;
  username: string;
  disclosureLevel?: 'OPEN' | 'STEALTH';
}

// Professional Essence types
export interface ProfessionalEssence {
  id?: string;
  userId?: string;
  narrative: string;
  currentFocus: string[];
  seekingConnections: string[];
  offeringExpertise: string[];
  metadata: {
    completeness: number;
    lastUpdated: string;
  };
}

export interface PrivacySettings {
  id?: string;
  userId?: string;
  narrativeLayer: PrivacyLayer;
  currentFocusLayer: PrivacyLayer;
  seekingConnectionsLayer: PrivacyLayer;
  offeringExpertiseLayer: PrivacyLayer;
}

export type PrivacyLayer = 'PUBLIC' | 'MEMBER' | 'TRUSTED';

// Agent types
export interface AgentProfile {
  id?: string;
  userId?: string;
  name: string;
  communicationStyle: 'PROFESSIONAL' | 'WARM' | 'DIRECT';
  personalityTraits?: string[];
}

// Onboarding types
export type OnboardingStage = 
  | 'HANDLE_SELECTION'
  | 'AGENT_NAMING'
  | 'INTERVIEW'
  | 'PRIVACY_SETUP'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'COMPLETED';

export interface OnboardingStatus {
  stage: OnboardingStage;
  completeness: number;
  lastUpdated: string;
}

// Conversation types
export interface ConversationMessage {
  id?: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export interface ConversationStatus {
  conversationId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  messages: ConversationMessage[];
  essenceProgress: {
    completeness: number;
    narrative: number;
    currentFocus: number;
    seeking: number;
    offering: number;
  };
}

// Admin types
export interface PendingUser {
  id: string;
  username: string;
  email: string;
  handle: string;
  createdAt: string;
  agentName: string;
  essenceCompleteness: number;
  status: string;
}

export interface UserReview {
  user: User;
  agent: AgentProfile;
  professionalEssence: ProfessionalEssence;
  qualityMetrics: {
    narrativeRichness: string;
    completeness: number;
    authenticitySignal: string;
    redFlags: string[];
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// System types
export interface SystemStatus {
  database: boolean;
  openRouterAI: boolean;
  authentication: boolean;
  apiLatency: number;
  dbLatency: number;
  aiLatency: number;
}

export interface AdminMetrics {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  rejectedUsers: number;
  averageApprovalTime: number;
  dailySignups: number;
  weeklySignups: number;
  monthlySignups: number;
}

// Utility types
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}