import { Badge } from '@/components/ui'

export type ResponseStatus = 'completed' | 'partial' | 'dropped_off' | 'disqualified'

export function ResponseStatusBadge({ status }: { status: ResponseStatus }) {
    const styles = {
        completed: { variant: 'default', label: 'Completed', className: 'bg-emerald-600 hover:bg-emerald-700' },
        partial: { variant: 'secondary', label: 'Partial', className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
        dropped_off: { variant: 'outline', label: 'Dropped Off', className: 'border-amber-500 text-amber-600 bg-amber-50' },
        disqualified: { variant: 'destructive', label: 'Disqualified', className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' },
    }

    const style = styles[status] || styles.partial

    return (
        <Badge
            variant={style.variant as any}
            className={`rounded-none uppercase text-[10px] tracking-wider px-2 py-0.5 ${style.className}`}
        >
            {style.label}
        </Badge>
    )
}
