/**
 * Login Page Component
 * Full-featured login with validation and error handling
 */

import { useState, FormEvent, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LogIn, AlertCircle, Building2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Get redirect URL from state or default to dashboard
    const from = (location.state as { from?: string })?.from || '/dashboard'

    // Auto-login for development bypass
    useEffect(() => {
        const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development'

        // Redirect if already authenticated
        if (isAuthenticated) {
            navigate(from, { replace: true })
            return
        }

        if (isDev && !isLoading && !error) {
            console.log('🚀 [Dev] Auto-logging in as Super Admin...')
            login('admin@housefinman.com', 'Admin@123', true).then(success => {
                if (success) {
                    console.log('✅ [Dev] Auto-login successful.')
                    navigate(from, { replace: true })
                }
            })
        }
    }, [isAuthenticated, isLoading, error, navigate, from, login])
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [validationError, setValidationError] = useState('')

    // Get redirect URL from state or default to dashboard
    const validateForm = (): boolean => {
        if (!email) {
            setValidationError('Email is required')
            return false
        }
        if (!email.includes('@')) {
            setValidationError('Please enter a valid email')
            return false
        }
        if (!password) {
            setValidationError('Password is required')
            return false
        }
        if (password.length < 8) {
            setValidationError('Password must be at least 8 characters')
            return false
        }
        setValidationError('')
        return true
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        clearError()

        if (!validateForm()) return

        const success = await login(email, password, rememberMe)
        if (success) {
            navigate(from, { replace: true })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                {/* Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">House FinMan</h1>
                        <p className="text-slate-400 mt-2">Sign in to your account</p>
                    </div>

                    {/* Error Messages */}
                    {(error || validationError) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{error || validationError}</p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition pr-12"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-slate-400">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo credentials removed for security hardening */}

                    {/* Footer */}
                    <p className="text-center text-slate-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <a href="#" className="text-blue-400 hover:text-blue-300 transition">
                            Contact Admin
                        </a>
                    </p>
                </div>

                {/* Copyright */}
                <p className="text-center text-slate-600 text-xs mt-6">
                    © 2026 House FinMan. All rights reserved.
                </p>
            </motion.div>
        </div>
    )
}
