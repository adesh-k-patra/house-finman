/**
 * Utility Functions for House FinMan
 * 
 * Purpose: Common utility functions including className merging
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format currency in INR
 */
export function formatCurrency(amount: number, compact = false): string {
    if (compact) {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`
        }
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} L`
        }
        if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}K`
        }
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`
}

/**
 * Format number with compact notation
 */
export function formatNumber(value: number, compact = false): string {
    if (compact) {
        if (value >= 10000000) {
            return `${(value / 10000000).toFixed(2)} Cr`
        }
        if (value >= 100000) {
            return `${(value / 100000).toFixed(2)} L`
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`
        }
    }
    return new Intl.NumberFormat('en-IN').format(value)
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

/**
 * Format date relative to now
 */
export function formatRelativeTime(date: Date | string): string {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return then.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}
