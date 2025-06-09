// Base API URL configuration for different environments
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ADMIN_LOGIN: `${API_BASE_URL}/auth/admin/login`,
  },
  
  // User endpoints
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    OPPORTUNITIES: `${API_BASE_URL}/users/opportunities`,
    UPDATE_OPPORTUNITY: (id: string) => `${API_BASE_URL}/users/opportunities/${id}`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  },
  
  // Onboarding endpoints
  ONBOARDING: {
    INTERVIEW: `${API_BASE_URL}/onboarding/interview`,
  },
  
  // Admin endpoints
  ADMIN: {
    USERS: `${API_BASE_URL}/admin/users`,
    USER_DETAIL: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
    UPDATE_USER_STATUS: (id: string) => `${API_BASE_URL}/admin/users/${id}/status`,
    CONVERSATIONS: `${API_BASE_URL}/admin/conversations`,
    CONVERSATION_DETAIL: (id: string) => `${API_BASE_URL}/admin/conversations/${id}`,
    SYSTEM_CONFIG: `${API_BASE_URL}/admin/config`,
    RUN_NETWORKING_BATCH: `${API_BASE_URL}/networking/batch`,
  },
};