# Frontend-Backend Integration

This file contains the necessary configuration for integrating the frontend (Next.js) with the backend (NestJS) API.

## API Configuration

```typescript
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
```

## Authentication Service

```typescript
// Authentication service for handling user login, registration, and token management
import { API_ENDPOINTS } from './api-config';

export class AuthService {
  static async login(email: string, password: string) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  static async register(email: string, password: string, handle: string, disclosureLevel: 'OPEN' | 'STEALTH' = 'STEALTH') {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, handle, disclosureLevel }),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  static async adminLogin(email: string, password: string) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.ADMIN_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Admin login failed');
      }
      
      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      
      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }
  
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  static adminLogout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
  }
  
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }
  
  static isAdminAuthenticated() {
    return !!localStorage.getItem('admin_token');
  }
  
  static getToken() {
    return localStorage.getItem('token');
  }
  
  static getAdminToken() {
    return localStorage.getItem('admin_token');
  }
  
  static getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  static getAdmin() {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }
}
```

## API Client

```typescript
// API client for making authenticated requests to the backend
import { API_ENDPOINTS } from './api-config';
import { AuthService } from './auth-service';

export class ApiClient {
  static async get(url: string, isAdmin = false) {
    try {
      const token = isAdmin ? AuthService.getAdminToken() : AuthService.getToken();
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  }
  
  static async post(url: string, data: any, isAdmin = false) {
    try {
      const token = isAdmin ? AuthService.getAdminToken() : AuthService.getToken();
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  }
  
  static async patch(url: string, data: any, isAdmin = false) {
    try {
      const token = isAdmin ? AuthService.getAdminToken() : AuthService.getToken();
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API PATCH error:', error);
      throw error;
    }
  }
  
  static async delete(url: string, isAdmin = false) {
    try {
      const token = isAdmin ? AuthService.getAdminToken() : AuthService.getToken();
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  }
}
```

## Integration Examples

### User Authentication

```typescript
// Example of user login integration
import { AuthService } from '../lib/auth-service';

// In a login form component
const handleLogin = async (email: string, password: string) => {
  try {
    const result = await AuthService.login(email, password);
    // Redirect to dashboard or profile page
    router.push('/profile');
  } catch (error) {
    setError('Invalid email or password');
  }
};
```

### Onboarding Interview

```typescript
// Example of onboarding interview integration
import { ApiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/api-config';

// In the onboarding chat component
const handleSendMessage = async (question: string, answer: string) => {
  try {
    const result = await ApiClient.post(API_ENDPOINTS.ONBOARDING.INTERVIEW, {
      question,
      answer,
      conversationHistory,
    });
    
    // Update state with AI response and position matrix
    setAiResponse(result.aiResponse);
    setPositionMatrix(result.updatedPositionMatrix);
    setConversationHistory(result.updatedHistory);
  } catch (error) {
    setError('Failed to process your response');
  }
};
```

### User Profile

```typescript
// Example of user profile integration
import { ApiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/api-config';

// In the profile component
const fetchUserProfile = async () => {
  try {
    const profile = await ApiClient.get(API_ENDPOINTS.USERS.PROFILE);
    setUserProfile(profile);
  } catch (error) {
    setError('Failed to load profile');
  }
};

const updatePositionMatrix = async (updatedMatrix: any) => {
  try {
    const result = await ApiClient.patch(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
      positionMatrix: updatedMatrix,
    });
    setUserProfile({
      ...userProfile,
      profile: {
        ...userProfile.profile,
        positionMatrix: result.positionMatrix,
      },
    });
    setSuccess('Profile updated successfully');
  } catch (error) {
    setError('Failed to update profile');
  }
};
```

### Admin Dashboard

```typescript
// Example of admin dashboard integration
import { ApiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/api-config';

// In the admin dashboard component
const fetchPendingUsers = async () => {
  try {
    const users = await ApiClient.get(`${API_ENDPOINTS.ADMIN.USERS}?status=PENDING`, true);
    setPendingUsers(users);
  } catch (error) {
    setError('Failed to load pending users');
  }
};

const approveUser = async (userId: string) => {
  try {
    await ApiClient.patch(API_ENDPOINTS.ADMIN.UPDATE_USER_STATUS(userId), {
      status: 'APPROVED',
    }, true);
    
    // Remove from pending list
    setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    setSuccess('User approved successfully');
  } catch (error) {
    setError('Failed to approve user');
  }
};
```

## Environment Configuration

Create a `.env.local` file in the Next.js project root with the following:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Create a `.env` file in the NestJS project root with the following:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/praxis_network"
JWT_SECRET="your-secret-key-here"
PORT=3001
```

## CORS Configuration

Update the NestJS main.ts file to allow CORS from the frontend:

```typescript
// In main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```
