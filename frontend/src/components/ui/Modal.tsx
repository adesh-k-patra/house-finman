
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'
import { createPortal } from 'react-dom'

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: React.ReactNode
    footer?: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    className
}: ModalProps & { className?: string }) {
    const modalRef = useRef<HTMLDivElement>(null)

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                ref={modalRef}
                className={cn(
                    'relative w-full bg-[#0F172A] border border-slate-700 shadow-2xl overflow-hidden flex flex-col',
                    'transform transition-all duration-300 animate-scale-in',
                    'shadow-[0_0_50px_rgba(0,0,0,0.5)]',
                    sizeClasses[size],
                    className,
                    'rounded-none' // Enforcing Sharpness
                )}
            >
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-800/50 bg-slate-900/30">
                    <div>
                        <h2 className="text-xl font-bold text-white leading-tight tracking-tight">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm text-slate-400 mt-1.5">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800/50 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div >,
        document.body
    )
}
