import { formatCurrency, formatNumber } from '@/utils'

interface TooltipProps {
    active?: boolean
    payload?: any[]
    label?: string
    currency?: boolean
}

export const CustomChartTooltip = ({ active, payload, label, currency = false }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                {label && (
                    <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {label}
                        </p>
                    </div>
                )}

                {/* Data Rows */}
                <div className="divide-y divide-slate-800">
                    {payload.map((entry: any, index: number) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-6 px-4 py-3 hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {/* Color Indicator - Square for sharp design */}
                                <div
                                    className="w-3 h-3 shrink-0"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm font-semibold text-slate-300">
                                    {entry.name}
                                </span>
                            </div>
                            <span
                                className="text-sm font-black font-mono"
                                style={{ color: entry.color }}
                            >
                                {currency ? formatCurrency(entry.value) : formatNumber(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer - Total if multiple items */}
                {payload.length > 1 && (
                    <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
                        <span className="text-sm font-black text-white font-mono">
                            {currency
                                ? formatCurrency(payload.reduce((sum, entry) => sum + (entry.value || 0), 0))
                                : formatNumber(payload.reduce((sum, entry) => sum + (entry.value || 0), 0))
                            }
                        </span>
                    </div>
                )}
            </div>
        )
    }
    return null
}
