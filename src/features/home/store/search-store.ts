import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  recentSearches: string[];
  addSearch: (username: string) => void;
  removeSearch: (username: string) => void;
  clearSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addSearch: (username) =>
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== username);
          return { recentSearches: [username, ...filtered].slice(0, 5) }; // 최대 5개 유지
        }),
      removeSearch: (username) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== username),
        })),
      clearSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'search-history',
    }
  )
);
