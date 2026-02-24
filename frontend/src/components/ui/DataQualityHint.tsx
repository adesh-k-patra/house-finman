import { AlertCircle, Check, Info } from 'lucide-react'
import { cn } from '@/utils'

interface DataQualityHintProps {
    type: 'error' | 'warning' | 'info' | 'success'
    message: string
}

export function DataQualityHint({ type, message }: DataQualityHintProps) {
    const styles = {
        error: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-900', icon: AlertCircle },
        warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900', icon: AlertCircle },
        info: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900', icon: Info },
        success: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900', icon: Check },
    }

    const style = styles[type]
    const Icon = style.icon

    return (
        <div className={cn("flex items-start gap-2 p-2 text-xs border-l-2", style.bg, style.text, style.border)}>
            <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span className="font-medium leading-tight">{message}</span>
        </div>
    )
}
