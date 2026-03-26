import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/shared/types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

const subscribeToAuthHydration = (onStoreChange: () => void) => {
  const unsubscribe = useAuthStore.persist?.onFinishHydration?.(() => onStoreChange());
  return () => unsubscribe?.();
};

export const useAuthHydrated = () => {
  return useSyncExternalStore(
    subscribeToAuthHydration,
    () => useAuthStore.persist?.hasHydrated?.() ?? false,
    () => false
  );
};
