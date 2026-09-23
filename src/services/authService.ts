import apiClient from '@/lib/axios';
import { LoginCredentials, User } from '@/types/auth';

export const authService = {
  /**
   * Log in user with username and password
   * API: POST /auth/login
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<User>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 120, // Optional token expiry
    });
    return response.data;
  },

  /**
   * Get current authenticated user details from API
   * API: GET /auth/me
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
