
import { IntegrationData } from '../builder/contexts/SurveyPageContext'
import { cn } from '@/utils'
import { RefreshCw, Settings, Link } from 'lucide-react'
import { useState } from 'react'

interface IntegrationCardProps {
    data: IntegrationData
    onConnect?: () => void
    onSync?: () => void
    onSettings?: () => void
}

type KPIVariant = 'blue' | 'emerald' | 'orange' | 'purple' | 'magenta' | 'royal' | 'slate' | 'violet' | 'rose' | 'teal' | 'amber' | 'indigo' | 'cyan' | 'pink' | 'red' | 'yellow' | 'lime' | 'default'

export function IntegrationCard({ data, onConnect, onSync, onSettings }: IntegrationCardProps) {
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = () => {
        setIsSyncing(true)
        setTimeout(() => setIsSyncing(false), 2000)
        onSync?.()
    }

    const getVariant = (): KPIVariant => {
        switch (data.type) {
            case 'google_ads': return 'blue'
            case 'meta_ads': return 'royal'
            case 'linkedin_ads': return 'cyan'
            case 'csv': return 'emerald'
            case 'api': return 'violet'
            default: return 'slate'
        }
    }

    const variant = getVariant()

    // Variant styles matching KPICard
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
        default: 'bg-slate-700 border-slate-600',
    }

    const getIcon = () => {
        // White text for colored cards
        const baseClass = "font-bold text-lg text-white"
        switch (data.type) {
            case 'google_ads': return <div className={baseClass}>G</div>
            case 'meta_ads': return <div className={baseClass}>M</div>
            case 'linkedin_ads': return <div className={baseClass}>In</div>
            case 'csv': return <div className={baseClass}>CSV</div>
            default: return <div className={baseClass}>?</div>
        }
    }

    return (
        <div className={cn(
            "relative p-0.5 border-t border-l rounded-none transition-all duration-300 group shadow-md hover:shadow-xl",
            variantStyles[variant]
        )}>
            {/* 3D Inner Stroke / Glassmorphic frame */}
            <div className="border h-full w-full relative overflow-hidden p-4 bg-white/10 backdrop-blur-md border-white/20 text-white">

                {/* Background Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                {/* Top Row: Icon + Status */}
                <div className="relative z-10 flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-inner">
                            {getIcon()}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white leading-tight drop-shadow-sm">{data.name}</h3>
                            <div className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold mt-1 border border-white/20 bg-black/20 text-white/90"
                            )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", data.status === 'connected' ? "bg-emerald-400 box-shadow-glow" : data.status === 'syncing' ? "bg-blue-400 animate-pulse" : "bg-white/40")} />
                                {data.status}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {data.status === 'connected' && (
                            <>
                                <button
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    className={cn("p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors", isSyncing && "animate-spin text-white")}
                                    title="Sync Now"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={onSettings} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors" title="Settings">
                                    <Settings className="w-3.5 h-3.5" />
                                </button>
                            </>
                        )}
                        {data.status === 'disconnected' && (
                            <button onClick={onConnect} className="p-1.5 text-white hover:bg-white/10 rounded transition-colors font-medium text-xs flex items-center gap-1 border border-white/30">
                                <Link className="w-3 h-3" /> Connect
                            </button>
                        )}
                    </div>
                </div>

                {/* Metrics */}
                <div className="relative z-10 border-t border-white/10 pt-3 mt-1 grid grid-cols-2 gap-2">
                    <div>
                        <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Audience</p>
                        <p className="text-lg font-bold text-white drop-shadow-sm">
                            {data.status === 'connected' ? (data.audienceSize / 1000).toFixed(1) + 'k' : '-'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Last Sync</p>
                        <p className="text-xs font-medium text-white/80 mt-1">
                            {data.status === 'connected' ? '2m ago' : '-'}
                        </p>
                    </div>
                </div>

                {/* Sync Progress Bar */}
                {isSyncing && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
                        <div className="h-full bg-white animate-progress-indeterminate" />
                    </div>
                )}

                {/* Decorative Blur */}
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
            </div>
        </div>
    )
}
