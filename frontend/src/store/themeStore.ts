/**
 * Theme Store for House FinMan
 * 
 * Purpose: Global state management for theme (dark/light mode)
 * Uses Zustand for lightweight state management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
    isDark: boolean
    toggleTheme: () => void
    setDark: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDark: true, // Default to dark theme as per design reference
            toggleTheme: () => set((state) => {
                const newIsDark = !state.isDark
                // Update document class for Tailwind dark mode
                if (newIsDark) {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
                return { isDark: newIsDark }
            }),
            setDark: (isDark: boolean) => set(() => {
                if (isDark) {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
                return { isDark }
            }),
        }),
        {
            name: 'house-finman-theme',
            onRehydrateStorage: () => (state) => {
                // Apply theme on rehydration
                if (state?.isDark) {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
            },
        }
    )
)
