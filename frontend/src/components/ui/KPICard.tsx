/**
 * KPI Card Component for House FinMan
 * 
 * Purpose: Premium glassmorphic KPI card with 3D depth, sharp edges, and vibrant variants
 * Features:
 * - 12+ vibrant color variants
 * - Glassmorphic strokes (internal borders)
 * - 3D depth effects with shadows and translations
 * - Trend indicators (up/down/neutral)
 */

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/utils'

export type KPIVariant =
    | 'blue' | 'emerald' | 'orange' | 'purple' | 'magenta'
    | 'royal' | 'slate' | 'violet' | 'rose' | 'teal'
    | 'amber' | 'indigo' | 'cyan' | 'pink' | 'red' | 'yellow' | 'lime' | 'default'

export type TrendDirection = 'up' | 'down' | 'neutral'

interface KPICardProps {
    title: string
    value: string | number
    subtitle?: string // For backward compatibility or extra info
    trend?: {
        value: string | number
        direction: TrendDirection
        label?: string
    }
    icon?: ReactNode | React.ElementType
    variant?: KPIVariant
    className?: string
    onClick?: () => void
    sparkline?: ReactNode
    compact?: boolean
}

const variantStyles: Record<KPIVariant, string> = {
    blue: 'bg-blue-600 border-blue-500',
    emerald: 'bg-emerald-600 border-emerald-500',
    orange: 'bg-orange-600 border-orange-500',
    purple: 'bg-purple-600 border-purple-500',
    magenta: 'bg-rose-600 border-rose-500',
    royal: 'bg-indigo-600 border-indigo-500',
    slate: 'bg-slate-700 border-slate-600',
    violet: 'bg-violet-600 border-violet-500',
    rose: 'bg-rose-500 border-rose-400',
    teal: 'bg-teal-600 border-teal-500',
    amber: 'bg-amber-600 border-amber-500',
    indigo: 'bg-indigo-700 border-indigo-600',
    cyan: 'bg-cyan-600 border-cyan-500',
    pink: 'bg-pink-600 border-pink-500',
    red: 'bg-red-600 border-red-500',
    yellow: 'bg-yellow-500 border-yellow-400',
    lime: 'bg-lime-600 border-lime-500',
    default: 'bg-slate-700 border-slate-600', // Non-white default
}

const IconComponent = ({ icon: Icon, className }: { icon: any; className?: string }) => {
    return <Icon className={className} />
}

export function KPICard({
    title,
    value,
    subtitle,
    trend,
    icon,
    variant = 'default',
    className,
    onClick,
    sparkline,
    compact,
}: KPICardProps) {
    const isDefault = variant === 'default'
    const TrendIcon = trend?.direction === 'up'
        ? TrendingUp
        : trend?.direction === 'down'
            ? TrendingDown
            : Minus

    const isComponent = typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in icon)

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative p-0.5 border-t border-l rounded-none transition-all duration-300 group shadow-md hover:shadow-xl",
                isDefault
                    ? "border-slate-200 dark:border-slate-700"
                    : (variant === 'slate' ? "border-white/10" : "border-white/20"),
                variantStyles[variant],
                onClick && "cursor-pointer hover:-translate-y-1",
                className
            )}
        >
            {/* 3D Inner Stroke / Glassmorphic frame */}
            <div className={cn(
                "border h-full w-full relative overflow-hidden",
                compact ? "p-3" : "p-4",
                isDefault
                    ? "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                    : "bg-black/5 border-black/10"
            )}>
                {/* Background Subtle Gradient Overlay */}
                {!isDefault && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                )}

                <div className={cn("relative z-10", compact ? "space-y-2" : "space-y-4")}>
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-4">
                        {icon && (
                            <div className={cn(
                                "rounded-none border shadow-inner",
                                compact ? "p-1.5" : "p-2",
                                isDefault
                                    ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-primary-600 dark:text-primary-400"
                                    : "bg-white/15 backdrop-blur-md border-white/20 text-white"
                            )}>
                                <div className={cn(compact ? "w-4 h-4" : "w-5 h-5", !isDefault && "drop-shadow-sm")}>
                                    {isComponent ? (
                                        <IconComponent icon={icon} className="w-full h-full" />
                                    ) : (
                                        icon as ReactNode
                                    )}
                                </div>
                            </div>
                        )}

                        {!icon && <div></div>} {/* Spacer */}

                        {trend && (
                            <div className={cn(
                                "px-1.5 py-0.5 flex items-center gap-1 font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm",
                                compact ? "text-[9px]" : "text-[10px]",
                                isDefault
                                    ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    : "bg-white/15 border-white/20",
                                trend.direction === 'up'
                                    ? (isDefault ? "text-emerald-600" : "text-emerald-300")
                                    : trend.direction === 'down'
                                        ? (isDefault ? "text-rose-600" : "text-rose-300")
                                        : (isDefault ? "text-slate-500" : "text-white/70")
                            )}>
                                <TrendIcon className="w-2.5 h-2.5" />
                                <span>{trend.value}{trend.label ? ` ${trend.label}` : ''}</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-0.5">
                        <p className={cn(
                            "font-bold uppercase tracking-widest truncate",
                            compact ? "text-[8px]" : "text-[10px]",
                            isDefault ? "text-slate-500 dark:text-slate-400" : "text-white/70 drop-shadow-sm"
                        )}>
                            {title}
                        </p>
                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                            <p className={cn(
                                "font-black tracking-tight leading-none truncate",
                                compact ? "text-lg" : "text-2xl",
                                isDefault ? "text-slate-900 dark:text-white" : "text-white drop-shadow-md"
                            )}>
                                {value}
                            </p>
                            {sparkline && (
                                <div className={cn("opacity-80 shrink-0", compact ? "h-6 w-12" : "h-8 w-16")}>
                                    {sparkline}
                                </div>
                            )}
                        </div>
                        {subtitle && (
                            <p className={cn(
                                "text-[9px] font-medium mt-0.5 truncate",
                                isDefault ? "text-slate-400 dark:text-slate-500" : "text-white/50"
                            )}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative Blur Element */}
            {!isDefault && (
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
            )}
        </div>
    )
}
