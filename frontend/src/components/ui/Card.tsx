/**
 * Card Component for House FinMan
 * 
 * Purpose: Base card component with 3D effect and thin strokes
 */

import { ReactNode } from 'react'
import { cn } from '@/utils'

export type CardVariant = 'default' | 'blue' | 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet' | 'orange' | 'magenta' | 'royal' | 'slate' | 'teal' | 'pink' | 'red' | 'yellow' | 'lime'

const variantStyles: Record<CardVariant, {
    headerBg: string,
    borderColor: string,
    titleColor: string,
    iconColor: string
}> = {
    default: {
        headerBg: 'bg-slate-900',
        borderColor: 'border-slate-200 dark:border-white/10',
        titleColor: 'text-white',
        iconColor: 'text-slate-400'
    },
    blue: {
        headerBg: 'bg-blue-50 dark:bg-blue-900/10',
        borderColor: 'border-blue-100 dark:border-blue-500/20',
        titleColor: 'text-blue-900 dark:text-blue-100',
        iconColor: 'text-blue-500'
    },
    indigo: {
        headerBg: 'bg-indigo-50 dark:bg-indigo-900/10',
        borderColor: 'border-indigo-100 dark:border-indigo-500/20',
        titleColor: 'text-indigo-900 dark:text-indigo-100',
        iconColor: 'text-indigo-500'
    },
    purple: {
        headerBg: 'bg-purple-50 dark:bg-purple-900/10',
        borderColor: 'border-purple-100 dark:border-purple-500/20',
        titleColor: 'text-purple-900 dark:text-purple-100',
        iconColor: 'text-purple-500'
    },
    emerald: {
        headerBg: 'bg-emerald-50 dark:bg-emerald-900/10',
        borderColor: 'border-emerald-100 dark:border-emerald-500/20',
        titleColor: 'text-emerald-900 dark:text-emerald-100',
        iconColor: 'text-emerald-500'
    },
    amber: {
        headerBg: 'bg-amber-50 dark:bg-amber-900/10',
        borderColor: 'border-amber-100 dark:border-amber-500/20',
        titleColor: 'text-amber-900 dark:text-amber-100',
        iconColor: 'text-amber-500'
    },
    rose: {
        headerBg: 'bg-rose-50 dark:bg-rose-900/10',
        borderColor: 'border-rose-100 dark:border-rose-500/20',
        titleColor: 'text-rose-900 dark:text-rose-100',
        iconColor: 'text-rose-500'
    },
    cyan: {
        headerBg: 'bg-cyan-50 dark:bg-cyan-900/10',
        borderColor: 'border-cyan-100 dark:border-cyan-500/20',
        titleColor: 'text-cyan-900 dark:text-cyan-100',
        iconColor: 'text-cyan-500'
    },
    violet: {
        headerBg: 'bg-violet-50 dark:bg-violet-900/10',
        borderColor: 'border-violet-100 dark:border-violet-500/20',
        titleColor: 'text-violet-900 dark:text-violet-100',
        iconColor: 'text-violet-500'
    },
    orange: {
        headerBg: 'bg-orange-50 dark:bg-orange-900/10',
        borderColor: 'border-orange-100 dark:border-orange-500/20',
        titleColor: 'text-orange-900 dark:text-orange-100',
        iconColor: 'text-orange-500'
    },
    magenta: {
        headerBg: 'bg-rose-50 dark:bg-rose-900/10',
        borderColor: 'border-rose-100 dark:border-rose-500/20',
        titleColor: 'text-rose-900 dark:text-rose-100',
        iconColor: 'text-rose-500'
    },
    royal: {
        headerBg: 'bg-indigo-50 dark:bg-indigo-900/10',
        borderColor: 'border-indigo-100 dark:border-indigo-500/20',
        titleColor: 'text-indigo-900 dark:text-indigo-100',
        iconColor: 'text-indigo-500'
    },
    slate: {
        headerBg: 'bg-slate-100 dark:bg-slate-800',
        borderColor: 'border-slate-200 dark:border-slate-700',
        titleColor: 'text-slate-900 dark:text-slate-100',
        iconColor: 'text-slate-500'
    },
    teal: {
        headerBg: 'bg-teal-50 dark:bg-teal-900/10',
        borderColor: 'border-teal-100 dark:border-teal-500/20',
        titleColor: 'text-teal-900 dark:text-teal-100',
        iconColor: 'text-teal-500'
    },
    pink: {
        headerBg: 'bg-pink-50 dark:bg-pink-900/10',
        borderColor: 'border-pink-100 dark:border-pink-500/20',
        titleColor: 'text-pink-900 dark:text-pink-100',
        iconColor: 'text-pink-500'
    },
    red: {
        headerBg: 'bg-red-50 dark:bg-red-900/10',
        borderColor: 'border-red-100 dark:border-red-500/20',
        titleColor: 'text-red-900 dark:text-red-100',
        iconColor: 'text-red-500'
    },
    yellow: {
        headerBg: 'bg-yellow-50 dark:bg-yellow-900/10',
        borderColor: 'border-yellow-100 dark:border-yellow-500/20',
        titleColor: 'text-yellow-900 dark:text-yellow-100',
        iconColor: 'text-yellow-500'
    },
    lime: {
        headerBg: 'bg-lime-50 dark:bg-lime-900/10',
        borderColor: 'border-lime-100 dark:border-lime-500/20',
        titleColor: 'text-lime-900 dark:text-lime-100',
        iconColor: 'text-lime-500'
    }
}

interface CardProps {
    children: ReactNode
    className?: string
    title?: string
    subtitle?: string
    icon?: ReactNode
    action?: ReactNode
    padding?: 'none' | 'sm' | 'md' | 'lg'
    variant?: CardVariant
    headerClassName?: string
    titleClassName?: string
    subtitleClassName?: string
}

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
}

export function Card({
    children,
    className,
    title,
    subtitle,
    icon,
    action,
    padding = 'md',
    headerClassName,
    titleClassName,
    subtitleClassName,
    variant = 'default',
}: CardProps) {
    const style = variantStyles[variant]

    return (
        <div className={cn(
            'bg-white dark:bg-slate-800/50',
            'border',
            style.borderColor,
            'rounded-none shadow-card',
            'transition-all duration-200',
            className
        )}>
            {(title || action) && (
                <div className={cn(
                    'flex items-center justify-between',
                    'px-4 py-3 border-b',
                    style.headerBg,
                    style.borderColor,
                    headerClassName
                )}>
                    <div className="flex items-center gap-2">
                        {icon && <span className={style.iconColor}>{icon}</span>}
                        <div>
                            {title && (
                                <h3 className={cn("text-sm font-semibold", style.titleColor, titleClassName)}>
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className={cn("text-xs text-slate-500 dark:text-slate-400 mt-0.5", subtitleClassName)}>
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {action && (
                        <div className="flex items-center gap-2">
                            {action}
                        </div>
                    )}
                </div>
            )}
            <div className={paddingClasses[padding]}>
                {children}
            </div>
        </div>
    )
}
