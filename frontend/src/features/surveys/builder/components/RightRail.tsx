import React, { useState } from 'react'
import { HelpCircle, History, AlertTriangle, TrendingUp, Clock, FileText, X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui'
import { useSurveyBuilder } from '../contexts/SurveyBuilderContext'
import { cn } from '@/utils'

// --- Sharp KPI Card Component ---
function KpiCard({ title, value, subtext, color = 'blue', icon: Icon }: { title: string, value: string, subtext: string, color?: 'blue' | 'emerald' | 'purple' | 'orange' | 'cyan' | 'magenta', icon: any }) {
    const colorStyles = {
        blue: 'border-l-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)]',
        emerald: 'border-l-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.2)]',
        purple: 'border-l-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:shadow-[4px_4px_0px_0px_rgba(124,58,237,0.2)]',
        orange: 'border-l-orange-600 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:shadow-[4px_4px_0px_0px_rgba(234,88,12,0.2)]',
        cyan: 'border-l-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 hover:shadow-[4px_4px_0px_0px_rgba(8,145,178,0.2)]',
        magenta: 'border-l-pink-600 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:shadow-[4px_4px_0px_0px_rgba(219,39,119,0.2)]',
    }

    return (
        <div className={cn("p-4 border border-slate-200 dark:border-slate-800 border-l-[3px] rounded-none shadow-sm relative overflow-hidden group transition-all cursor-default", colorStyles[color])}>
            <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300">
                <Icon className="w-12 h-12" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{title}</div>
            <div className="text-2xl font-black mb-1 leading-none tracking-tight">{value}</div>
            <div className="text-[10px] font-bold opacity-80 flex items-center gap-1">
                {subtext}
            </div>

            {/* Sharp Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[12px] border-r-[12px] border-b-current border-r-transparent opacity-20" />
        </div>
    )
}

export function RightRail() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { questions } = useSurveyBuilder()

    // Calculate dynamic stats
    const questionCount = questions.length
    const estTime = Math.max(1, Math.round(questionCount * 0.75))

    return (
        <aside
            className={cn(
                "h-full bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 flex flex-col z-40 shadow-xl transition-all duration-300 relative",
                isCollapsed ? "w-12" : "w-80"
            )}
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -left-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-md text-slate-500 hover:text-blue-600 z-50 hover:scale-110 transition-transform"
            >
                {isCollapsed ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {isCollapsed ? (
                // Collapsed State Icons
                <div className="flex flex-col items-center py-6 gap-6">
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                    <History className="w-5 h-5 text-slate-400" />
                    <AlertTriangle className="w-5 h-5 text-slate-400" />
                </div>
            ) : (
                // Expanded Content
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
                        <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            Intelligence
                        </span>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="sm" isIconOnly className="h-6 w-6 rounded-none">
                                <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* 1. KPI Cards (Sharp) */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Projected Metrics
                            </h3>
                            <KpiCard
                                title="Completion Rate"
                                value={questionCount > 5 ? "72%" : "85%"}
                                subtext={questionCount > 5 ? "-8% due to length" : "High engagement"}
                                color="emerald"
                                icon={TrendingUp}
                            />
                            <KpiCard
                                title="Est. Time"
                                value={`${estTime}m 00s`}
                                subtext="Optimal for mobile"
                                color="cyan"
                                icon={Clock}
                            />
                            <KpiCard
                                title="Quality Score"
                                value="9.8/10"
                                subtext="Excellent structure"
                                color="magenta"
                                icon={FileText}
                            />
                        </div>

                        {/* 2. Version History */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                                Activity Log
                            </h3>
                            <div className="space-y-0 border-l border-slate-200 dark:border-slate-800 ml-1">
                                <div className="pl-4 pb-6 relative">
                                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                                    <div className="font-bold text-sm text-slate-900 dark:text-white">Added Q{questionCount} (Draft)</div>
                                    <div className="text-xs text-slate-400 mt-1">Just now • You</div>
                                </div>
                                <div className="pl-4 pb-6 relative opacity-70">
                                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900" />
                                    <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Updated Logic Flow</div>
                                    <div className="text-xs text-slate-400 mt-1">10m ago • AI Assistant</div>
                                </div>
                                <div className="pl-4 relative opacity-50">
                                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900" />
                                    <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Created Survey</div>
                                    <div className="text-xs text-slate-400 mt-1">1h ago • System</div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Safety/Alerts */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Health Check
                            </h3>
                            <div className="bg-orange-50 dark:bg-orange-900/10 border-l-[3px] border-orange-500 p-3 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold text-orange-900 dark:text-orange-200 uppercase tracking-wide mb-1">Warning</div>
                                        <p className="text-[11px] text-orange-800 dark:text-orange-300 leading-snug font-medium">
                                            Survey has no dedicated <b>Exit Screen</b>. Participants may loop.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </aside>
    )
}
