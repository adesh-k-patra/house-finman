import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { cn } from '@/utils'

interface KPI {
    id: string
    label: string
    value: string | number
    trend: number
    trendLabel?: string
    color?: 'primary' | 'success' | 'warning' | 'danger'
}

export function KPIStrip({ kpis, onRefresh }: { kpis: KPI[], onRefresh?: () => void }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
                <Card
                    key={kpi.id}
                    className={cn(
                        "rounded-none border-t-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md",
                        kpi.color === 'primary' ? "border-t-purple-600" :
                            kpi.color === 'success' ? "border-t-emerald-500" :
                                kpi.color === 'warning' ? "border-t-amber-500" :
                                    "border-t-slate-200 dark:border-t-slate-700"
                    )}
                >
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">{kpi.label}</h4>
                            {kpi.trend !== 0 && (
                                <div className={cn(
                                    "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-none",
                                    kpi.trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                )}>
                                    {kpi.trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    {Math.abs(kpi.trend)}%
                                </div>
                            )}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</span>
                            {kpi.trendLabel && <span className="text-xs text-slate-400 font-medium">{kpi.trendLabel}</span>}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export function AutoRefreshToggle({ onRefresh, isRefreshing }: { onRefresh: () => void, isRefreshing: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Auto-refresh</span>
            <Button
                size="sm"
                variant="outline"
                className={cn("h-7 w-7 p-0 rounded-none", isRefreshing && "animate-spin text-purple-600 border-purple-200")}
                onClick={onRefresh}
            >
                <RefreshCw className="w-3 h-3" />
            </Button>
        </div>
    )
}
