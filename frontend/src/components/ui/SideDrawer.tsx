
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'


interface SideDrawerProps {
    isOpen: boolean
    onClose: () => void
    title: React.ReactNode
    subtitle?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    footer?: React.ReactNode
    variant?: 'default' | 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'SD_T1'
    icon?: React.ReactNode
    className?: string
    headerClassName?: string
    closeButtonClassName?: string
    noContentPadding?: boolean
}

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
}

const variantStyles: Record<string, { wrapper: string, header: string, icon: string }> = {
    default: {
        wrapper: 'border-slate-200 dark:border-slate-800',
        header: 'bg-white dark:bg-slate-900',
        icon: 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
    },
    blue: {
        wrapper: 'border-l-4 border-l-blue-500',
        header: 'bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm',
        icon: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
    },
    green: {
        wrapper: 'border-l-4 border-l-emerald-500',
        header: 'bg-emerald-50/80 dark:bg-emerald-900/20 backdrop-blur-sm',
        icon: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
    },
    red: {
        wrapper: 'border-l-4 border-l-red-500',
        header: 'bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm',
        icon: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
    },
    orange: {
        wrapper: 'border-l-4 border-l-orange-500',
        header: 'bg-orange-50/80 dark:bg-orange-900/20 backdrop-blur-sm',
        icon: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400'
    },
    purple: {
        wrapper: 'border-l-4 border-l-purple-500',
        header: 'bg-purple-50/80 dark:bg-purple-900/20 backdrop-blur-sm',
        icon: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400'
    },
    SD_T1: {
        wrapper: 'border-l-4 border-l-blue-600',
        header: 'bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm',
        icon: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
    },
}

export function SideDrawer({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    size = 'md',
    footer,
    variant = 'default',
    icon,
    className,
    headerClassName,
    closeButtonClassName,
    noContentPadding
}: SideDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)

    // Ensure variant exists or fallback to default
    const style = variantStyles[variant] || variantStyles.default

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true)
            // Small timeout to allow render before starting animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true)
                })
            })
            document.body.style.overflow = 'hidden'
        } else {
            setIsVisible(false)
            document.body.style.overflow = 'unset'
            // Wait for animation to finish before unmounting
            const timer = setTimeout(() => {
                setShouldRender(false)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    if (!shouldRender) return null

    return (
        <div className={cn(
            "fixed inset-0 z-[100] flex justify-end transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className={cn(
                    'relative w-full h-full bg-slate-50 dark:bg-slate-900 flex flex-col',
                    'border-l shadow-2xl transform transition-transform duration-300 ease-in-out',
                    isVisible ? 'translate-x-0' : 'translate-x-full',
                    style.wrapper,
                    sizeClasses[size],
                    className
                )}
            >

                {/* Header */}
                <div className={cn(
                    "flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 z-10 shadow-sm",
                    style.header,
                    headerClassName
                )}>
                    <div className="flex items-start gap-4">
                        {icon && (
                            <div className={cn(
                                "p-2.5 rounded-sm border shadow-sm",
                                style.icon
                            )}>
                                {icon}
                            </div>
                        )}
                        <div>
                            {typeof title === 'string' ? (
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight font-display">
                                    {title}
                                </h2>
                            ) : (
                                <div>{title}</div>
                            )}
                            {subtitle && (
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={cn("p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors", closeButtonClassName)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className={noContentPadding ? "" : "p-6"}>
                        {children}
                    </div>
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 z-10 sticky bottom-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

