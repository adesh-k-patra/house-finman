/**
 * Header Component for House FinMan
 * 
 * Purpose: Top header bar with search, notifications, theme toggle, and user menu
 * Features:
 * - Global search bar
 * - Notification bell with badge
 * - Theme toggle (dark/light)
 * - User profile dropdown
 * - Quick create button
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Search,
    Bell,
    Sun,
    Moon,
    ChevronDown,
    Plus,
    Settings,
    LogOut,
    User as UserIcon,
    HelpCircle,
} from 'lucide-react'
import { useThemeStore, useAuthStore } from '@/store'
import { cn, getInitials } from '@/utils'

export default function Header() {
    const navigate = useNavigate()
    const { isDark, toggleTheme } = useThemeStore()
    const { user, logout } = useAuthStore()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Demo notifications
    const notifications = [
        { id: 1, title: 'New lead assigned', message: 'Priya Patel from Mumbai', time: '2 min ago', unread: true },
        { id: 2, title: 'Commission approved', message: '₹45,000 ready for payout', time: '1 hour ago', unread: true },
        { id: 3, title: 'Property verified', message: 'Green Valley Apartments', time: '3 hours ago', unread: false },
        { id: 4, title: 'Ticket escalated', message: 'Ticket #1234 needs attention', time: '5 hours ago', unread: false },
    ]

    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <header className={cn(
            'sticky top-0 z-30 h-16 w-full',
            'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl',
            'border-b border-slate-200 dark:border-white/5',
            'transition-all duration-300'
        )}>
            <div className="flex items-center justify-between h-full px-6">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search leads, partners, properties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                'w-full pl-10 pr-4 py-2 text-sm',
                                'bg-slate-100 dark:bg-slate-800/50',
                                'border border-slate-200 dark:border-white/10',
                                'rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                                'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                                'text-slate-900 dark:text-white'
                            )}
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-400 bg-slate-200 dark:bg-slate-700 rounded">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 ml-6">
                    {/* Quick Create Button */}
                    <button
                        onClick={() => setIsQuickCreateOpen(true)}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 text-sm font-medium',
                            'bg-primary-600 hover:bg-primary-700 text-white',
                            'rounded-sm shadow-sm transition-all duration-200',
                            'hover:shadow-lg hover:shadow-primary-500/25'
                        )}>
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Quick Create</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            'p-2 rounded-sm transition-all duration-200',
                            'hover:bg-slate-100 dark:hover:bg-slate-800',
                            'text-slate-600 dark:text-slate-400'
                        )}
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>

                    {/* Help */}
                    <button className={cn(
                        'p-2 rounded-sm transition-all duration-200',
                        'hover:bg-slate-100 dark:hover:bg-slate-800',
                        'text-slate-600 dark:text-slate-400'
                    )}>
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className={cn(
                                'relative p-2 rounded-sm transition-all duration-200',
                                'hover:bg-slate-100 dark:hover:bg-slate-800',
                                'text-slate-600 dark:text-slate-400'
                            )}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 text-xs font-medium text-white bg-red-500 rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {isNotificationOpen && (
                            <div className={cn(
                                'absolute right-0 mt-2 w-80 rounded-sm shadow-xl animate-scale-in',
                                'bg-white dark:bg-slate-800',
                                'border border-slate-200 dark:border-white/10'
                            )}>
                                <div className="p-3 border-b border-slate-200 dark:border-white/10">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                'p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors',
                                                notification.unread && 'bg-primary-50 dark:bg-primary-900/10'
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={cn(
                                                    'w-2 h-2 mt-2 rounded-full',
                                                    notification.unread ? 'bg-primary-500' : 'bg-transparent'
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-slate-200 dark:border-white/10">
                                    <button className="w-full text-sm text-center text-primary-600 hover:text-primary-700 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative ml-2">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className={cn(
                                'flex items-center gap-2 p-1.5 pr-3 rounded-sm transition-all duration-200',
                                'hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary-600 text-white text-sm font-medium">
                                {user ? getInitials(user.name) : 'U'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                    {user?.role?.replace('_', ' ') || 'Role'}
                                </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>

                        {/* User Dropdown */}
                        {isUserMenuOpen && (
                            <div className={cn(
                                'absolute right-0 mt-2 w-56 rounded-sm shadow-xl animate-scale-in',
                                'bg-white dark:bg-slate-800',
                                'border border-slate-200 dark:border-white/10'
                            )}>
                                <div className="p-3 border-b border-slate-200 dark:border-white/10">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{user?.tenantName}</p>
                                </div>
                                <div className="py-1">
                                    <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <UserIcon className="w-4 h-4" />
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsUserMenuOpen(false)
                                            navigate('/admin/settings')
                                        }}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </button>
                                </div>
                                <div className="py-1 border-t border-slate-200 dark:border-white/10">
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdowns */}
            {(isUserMenuOpen || isNotificationOpen) && (
                <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => {
                        setIsUserMenuOpen(false)
                        setIsNotificationOpen(false)
                    }}
                />
            )}

            {/* Global Modals */}
            <QuickCreateModal
                isOpen={isQuickCreateOpen}
                onClose={() => setIsQuickCreateOpen(false)}
            />
            <CommandPalette />
        </header>
    )
}

// Lazy import or regular import - ensuring we import it
import QuickCreateModal from './QuickCreateModal'
import { CommandPalette } from '@/features/dashboard/components/CommandPalette'
