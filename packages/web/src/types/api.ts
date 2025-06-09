// API-specific type definitions and utilities

import type { 
  User, 
  AdminUser, 
  ProfessionalEssence, 
  PrivacySettings,
  AgentProfile,
  ConversationStatus,
  PendingUser,
  UserReview,
  SystemStatus,
  AdminMetrics
} from './index';

// API Endpoints type safety
export interface ApiEndpoints {
  AUTH: {
    LOGIN: string;
    REGISTER: string;
    LOGOUT: string;
    ADMIN_LOGIN: string;
    ADMIN_LOGOUT: string;
    REFRESH: string;
  };
  USERS: {
    ME: string;
    ESSENCE: string;
    PRIVACY: string;
    HANDLE: string;
    REPORT: string;
    INTRODUCTION_REQUEST: string;
  };
  AGENTS: {
    PERSONALIZE: string;
    UPDATE: string;
  };
  ONBOARDING: {
    START: string;
    MESSAGE: string;
    COMPLETE: string;
    STATUS: (conversationId: string) => string;
  };
  ADMIN: {
    PENDING_USERS: string;
    USER_ESSENCE: (userId: string) => string;
    APPROVE_USER: (userId: string) => string;
    REQUEST_INFO: (userId: string) => string;
    METRICS: string;
    SYSTEM_STATUS: string;
  };
  HEALTH: string;
  BATCH: {
    TRIGGER: string;
  };
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  disclosureLevel?: 'OPEN' | 'STEALTH';
}

export interface PersonalizeAgentRequest {
  name: string;
  communicationStyle: 'PROFESSIONAL' | 'WARM' | 'DIRECT';
}

export interface OnboardingMessageRequest {
  conversationId: string;
  message: string;
}

export interface UpdateHandleRequest {
  handle: string;
}

export interface UpdatePrivacyRequest {
  privacySettings: Partial<PrivacySettings>;
}

export interface UpdateEssenceRequest {
  essence: Partial<ProfessionalEssence>;
}

export interface IntroductionRequest {
  targetUserId: string;
  message?: string;
}

export interface ApproveUserRequest {
  adminNotes?: string;
}

export interface RequestInfoRequest {
  feedback: string;
}

// Response types with proper typing
export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface AdminLoginResponse {
  access_token: string;
  admin: AdminUser;
}

export interface OnboardingStartResponse {
  conversationId: string;
  message: string;
  agentName: string;
}

export interface OnboardingMessageResponse {
  message: string;
  progress: {
    completeness: number;
    narrative: number;
    currentFocus: number;
    seeking: number;
    offering: number;
  };
  isComplete: boolean;
  turnCount: number;
}

export interface PendingUsersResponse {
  users: PendingUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserEssenceResponse {
  userReview: UserReview;
  conversationLog?: {
    messages: Array<{
      content: string;
      isUser: boolean;
      timestamp: string;
    }>;
  };
}

// Type guards
export function isApiError(error: any): error is { message: string; statusCode?: number } {
  return error && typeof error.message === 'string';
}

export function isValidUser(user: any): user is User {
  return (
    user &&
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.handle === 'string' &&
    typeof user.status === 'string' &&
    typeof user.disclosureLevel === 'string'
  );
}

export function isValidAdminUser(admin: any): admin is AdminUser {
  return (
    admin &&
    typeof admin.id === 'string' &&
    typeof admin.email === 'string' &&
    typeof admin.name === 'string' &&
    typeof admin.role === 'string'
  );
}