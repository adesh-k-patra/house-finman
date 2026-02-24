/**
 * Auth Store - Updated for real API integration
 * Zustand store for authentication state management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../services/apiClient'

export type UserRole = 'super_admin' | 'tenant_admin' | 'viewer' | 'partner_admin' | 'agent' | 'vendor_manager' | 'finance' | 'cx' | 'mentor'

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: UserRole
    tenantId: string
    tenantName?: string
    permissions: string[]
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    // Actions
    login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
    register: (email: string, password: string, name: string) => Promise<boolean>
    logout: () => Promise<void>
    checkAuth: () => Promise<boolean>
    clearError: () => void
    setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial state
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login
            login: async (email: string, password: string, rememberMe = false) => {
                set({ isLoading: true, error: null })

                try {
                    const response = await apiClient.login(email, password, rememberMe)

                    if (response.success && response.data) {
                        const user = response.data.user as User
                        set({ user, isAuthenticated: true, isLoading: false })
                        return true
                    } else {
                        set({
                            error: response.error?.message || 'Login failed',
                            isLoading: false
                        })
                        return false
                    }
                } catch (error) {
                    set({
                        error: 'An unexpected error occurred',
                        isLoading: false
                    })
                    return false
                }
            },

            // Register
            register: async (email: string, password: string, name: string) => {
                set({ isLoading: true, error: null })

                try {
                    const response = await apiClient.register(email, password, name)

                    if (response.success && response.data) {
                        const user = response.data.user as User
                        set({ user, isAuthenticated: true, isLoading: false })
                        return true
                    } else {
                        set({
                            error: response.error?.message || 'Registration failed',
                            isLoading: false
                        })
                        return false
                    }
                } catch {
                    set({
                        error: 'An unexpected error occurred',
                        isLoading: false
                    })
                    return false
                }
            },

            // Logout
            logout: async () => {
                await apiClient.logout()
                set({ user: null, isAuthenticated: false, error: null })
            },

            // Check current auth status
            checkAuth: async () => {
                try {
                    const response = await apiClient.getMe()

                    if (response.success && response.data) {
                        const user = (response.data as { user: User }).user
                        set({ user, isAuthenticated: true })
                        return true
                    } else {
                        set({ user: null, isAuthenticated: false })
                        return false
                    }
                } catch {
                    set({ user: null, isAuthenticated: false })
                    return false
                }
            },

            // Clear error
            clearError: () => set({ error: null }),

            // Set user (for manual updates)
            setUser: (user: User) => set({ user, isAuthenticated: true }),
        }),
        {
            name: 'house-finman-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

// Helper hooks
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useIsAdmin = () => {
    const user = useAuthStore((state) => state.user)
    return user?.role === 'super_admin' || user?.role === 'tenant_admin'
}
