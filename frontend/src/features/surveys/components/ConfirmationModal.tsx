import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info' | 'success'
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning'
}: ConfirmationModalProps) {
    if (!isOpen) return null

    const variantConfig = {
        danger: {
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-100 dark:bg-red-900/30',
            btn: 'bg-red-600 hover:bg-red-700',
            border: 'border-l-red-500'
        },
        warning: {
            icon: AlertTriangle,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/30',
            btn: 'bg-orange-600 hover:bg-orange-700',
            border: 'border-l-orange-500'
        },
        info: {
            icon: Info,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            btn: 'bg-blue-600 hover:bg-blue-700',
            border: 'border-l-blue-500'
        },
        success: {
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            btn: 'bg-emerald-600 hover:bg-emerald-700',
            border: 'border-l-emerald-500'
        }
    }

    const config = variantConfig[variant]
    const Icon = config.icon

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className={cn(
                "bg-white dark:bg-slate-900 w-full max-w-sm shadow-2xl animate-scale-in border border-slate-200 dark:border-slate-700",
                "border-l-4", config.border
            )}>
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={cn("p-3 rounded-full shrink-0", config.bg)}>
                            <Icon className={cn("w-6 h-6", config.color)} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 -mt-1 -mr-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="rounded-none h-9 text-xs uppercase font-bold">
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => { onConfirm(); onClose() }}
                        className={cn("rounded-none h-9 text-xs uppercase font-bold text-white shadow-md", config.btn)}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}
