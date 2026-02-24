/**
 * Button Component for House FinMan
 * 
 * Purpose: Reusable button component with multiple variants
 */

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    isLoading?: boolean
    isIconOnly?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: cn(
        'bg-primary-600 text-white',
        'border-primary-600 hover:bg-primary-700',
        'shadow-sm hover:shadow-lg hover:shadow-primary-500/25'
    ),
    secondary: cn(
        'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white',
        'border-slate-200 dark:border-white/10',
        'hover:bg-slate-200 dark:hover:bg-slate-700'
    ),
    outline: cn(
        'bg-transparent text-slate-700 dark:text-slate-300',
        'border-slate-300 dark:border-white/20',
        'hover:bg-slate-50 dark:hover:bg-white/5'
    ),
    ghost: cn(
        'bg-transparent text-slate-700 dark:text-slate-300',
        'border-transparent',
        'hover:bg-slate-100 dark:hover:bg-white/10'
    ),
    danger: cn(
        'bg-red-600 text-white',
        'border-red-600 hover:bg-red-700',
        'shadow-sm hover:shadow-lg hover:shadow-red-500/25'
    ),
    success: cn(
        'bg-emerald-600 text-white',
        'border-emerald-600 hover:bg-emerald-700',
        'shadow-sm hover:shadow-lg hover:shadow-emerald-500/25'
    ),
    warning: cn(
        'bg-amber-500 text-white',
        'border-amber-500 hover:bg-amber-600',
        'shadow-sm hover:shadow-lg hover:shadow-amber-500/25'
    ),
}

const sizeStyles: Record<ButtonSize, string> = {
    xs: 'px-2 py-1 text-[10px] gap-1',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        leftIcon,
        rightIcon,
        isLoading,
        isIconOnly,
        disabled,
        className,
        children,
        ...props
    }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center font-medium',
                    'rounded-none border transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    variantStyles[variant],
                    variantStyles[variant],
                    isIconOnly ? 'p-0 aspect-square' : sizeStyles[size],
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {!isLoading && leftIcon}
                {children}
                {!isLoading && rightIcon}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
export default Button
