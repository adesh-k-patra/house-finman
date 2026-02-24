import { useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'

interface ActionSheetOption {
    label: string
    icon?: React.ElementType
    onClick: () => void
    variant?: 'default' | 'destructive'
}

interface MobileActionSheetProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    options: ActionSheetOption[]
}

export function MobileActionSheet({ isOpen, onClose, title, options }: MobileActionSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                ref={sheetRef}
                className="relative w-full bg-white dark:bg-slate-900 rounded-t-xl overflow-hidden animate-slide-up shadow-2xl pb-safe"
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
                </div>

                {title && (
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white uppercase text-sm tracking-wide">{title}</h3>
                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="p-4 space-y-2">
                    {options.map((option, idx) => {
                        const Icon = option.icon
                        return (
                            <button
                                key={idx}
                                onClick={() => { option.onClick(); onClose() }}
                                className={cn(
                                    "w-full flex items-center gap-4 px-4 py-4 rounded-none border border-slate-200 dark:border-slate-800 transition-colors font-bold text-sm",
                                    option.variant === 'destructive'
                                        ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/30"
                                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                )}
                            >
                                {Icon && <Icon className={cn("w-5 h-5", option.variant === 'destructive' ? "text-red-500" : "text-slate-500")} />}
                                {option.label}
                            </button>
                        )
                    })}
                </div>

                <div className="p-4 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full py-4 text-center font-bold text-slate-500 uppercase text-xs tracking-wider"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
