
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      themes: {
        light: {
          name: 'Light',
          primary: '#2563eb',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b',
          textSecondary: '#64748b',
        },
        dark: {
          name: 'Dark',
          primary: '#3b82f6',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          textSecondary: '#94a3b8',
        },
        blue: {
          name: 'Ocean Blue',
          primary: '#0ea5e9',
          background: '#f0f9ff',
          surface: '#e0f2fe',
          text: '#0c4a6e',
          textSecondary: '#0369a1',
        },
        green: {
          name: 'Forest Green',
          primary: '#059669',
          background: '#f0fdf4',
          surface: '#dcfce7',
          text: '#14532d',
          textSecondary: '#166534',
        },
        purple: {
          name: 'Royal Purple',
          primary: '#7c3aed',
          background: '#faf5ff',
          surface: '#f3e8ff',
          text: '#581c87',
          textSecondary: '#7c2d92',
        },
      },
      
      setTheme: (theme) => set({ theme }),
      getCurrentTheme: () => get().themes[get().theme] || get().themes.light,
    }),
    {
      name: 'theme-storage',
    }
  )
);
