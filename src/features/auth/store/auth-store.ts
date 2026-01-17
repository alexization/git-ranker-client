import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/shared/types/api';
import { apiClient } from '@/shared/lib/api-client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (user: User, accessToken?: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      login: (user, accessToken) => set((state) => ({ 
          user, 
          isAuthenticated: true,
          accessToken: accessToken || state.accessToken 
      })),
      logout: () => {
          set({ user: null, isAuthenticated: false, accessToken: null });
          delete apiClient.defaults.headers.common["Authorization"];
      },
      setAccessToken: (token) => {
          set({ accessToken: token });
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
          if (state?.accessToken) {
              apiClient.defaults.headers.common["Authorization"] = `Bearer ${state.accessToken}`;
          }
      }
    }
  )
);