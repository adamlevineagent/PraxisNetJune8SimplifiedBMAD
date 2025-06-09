// Authentication service for handling user login, registration, and token management
import { API_ENDPOINTS } from './api-config';

export interface User {
  id: string;
  email: string;
  handle: string;
  status: string;
  disclosureLevel: 'OPEN' | 'STEALTH';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegistrationData {
  email: string;
  password: string;
  username: string;
  disclosureLevel?: 'OPEN' | 'STEALTH';
}

export class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
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
  
  static async register(registrationData: RegistrationData): Promise<AuthResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registrationData.email,
          password: registrationData.password,
          username: registrationData.username,
          disclosureLevel: registrationData.disclosureLevel || 'STEALTH',
        }),
      });
      
      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the default message
        }
        throw new Error(errorMessage);
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Admin login failed');
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
  
  static getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  static getAdmin() {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }
}