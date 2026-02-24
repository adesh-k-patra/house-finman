import { useState } from 'react'
import { useSurveyBuilder, Hypothesis } from '../contexts/SurveyBuilderContext'
import { cn } from '@/utils'
import {
    Lightbulb, TrendingUp, Target, Zap, X, Check, RefreshCw,
    ChevronRight, AlertCircle, Sparkles, ArrowRight, BarChart3,
    Users, DollarSign, Clock, MessageSquare, Send, Bot, Copy, ThumbsUp, ThumbsDown, Megaphone
} from 'lucide-react'
import { HypothesisDeepDiveModal } from '../components/HypothesisDeepDiveModal'
import { AIAssistantSidebar } from '../components/AIAssistantSidebar'

// ============ IMPACT BADGE ============

type ImpactLevel = 'high' | 'medium' | 'insight'

function ImpactBadge({ level }: { level: ImpactLevel }) {
    const config = {
        high: { label: 'High Impact', color: 'bg-red-500 text-white border-red-600' },
        medium: { label: 'Medium Impact', color: 'bg-amber-500 text-white border-amber-600' },
        insight: { label: 'Insight', color: 'bg-blue-500 text-white border-blue-600' }
    }

    const c = config[level]

    return (
        <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-none border", c.color)}>
            {c.label}
        </span>
    )
}

// ============ KPI SUMMARY CARDS ============

function HypothesesSummary() {
    const { hypotheses } = useSurveyBuilder()

    const active = hypotheses.filter(h => !h.dismissed).length
    const dismissed = hypotheses.filter(h => h.dismissed).length

    const stats = [
        { label: 'High Impact', value: '4', icon: Zap, color: 'text-red-600' },
        { label: 'Medium Impact', value: '3', icon: TrendingUp, color: 'text-amber-600' },
        { label: 'Insights', value: '3', icon: Lightbulb, color: 'text-blue-600' },
        { label: 'Potential Value', value: '₹2.4Cr', icon: DollarSign, color: 'text-emerald-600' }
    ]

    return (
        <div className="mb-8 animate-fade-in">
            {/* Header Stats */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        <strong className="text-emerald-500">{active}</strong> active insights
                    </span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        <strong className="text-slate-400">{dismissed}</strong> dismissed
                    </span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-none shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate More
                </button>
            </div>

            {/* Gradient KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* High Impact - Red/Rose Gradient */}
                <div className="relative overflow-hidden p-5 bg-gradient-to-br from-rose-500 to-red-700 rounded-none shadow-xl border border-white/10 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-rose-100 uppercase tracking-widest mb-1">High Impact</p>
                            <h3 className="text-3xl font-black text-white">4</h3>
                            <p className="text-[10px] text-rose-100 mt-1 flex items-center gap-1 opacity-80">
                                <Zap className="w-3 h-3" /> Critical Actions
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-none backdrop-blur-sm">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Medium Impact - Amber/Orange Gradient */}
                <div className="relative overflow-hidden p-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-none shadow-xl border border-white/10 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-amber-100 uppercase tracking-widest mb-1">Medium Impact</p>
                            <h3 className="text-3xl font-black text-white">3</h3>
                            <p className="text-[10px] text-amber-100 mt-1 flex items-center gap-1 opacity-80">
                                <TrendingUp className="w-3 h-3" /> Optimization opps
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-none backdrop-blur-sm">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Insights - Blue/Indigo Gradient */}
                <div className="relative overflow-hidden p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-none shadow-xl border border-white/10 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">Total Insights</p>
                            <h3 className="text-3xl font-black text-white">3</h3>
                            <p className="text-[10px] text-blue-100 mt-1 flex items-center gap-1 opacity-80">
                                <Lightbulb className="w-3 h-3" /> Discovery items
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-none backdrop-blur-sm">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Potential Value - Emerald/Teal Gradient */}
                <div className="relative overflow-hidden p-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-none shadow-xl border border-white/10 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Potential Value</p>
                            <h3 className="text-3xl font-black text-white">₹2.4Cr</h3>
                            <p className="text-[10px] text-emerald-100 mt-1 flex items-center gap-1 opacity-80">
                                <DollarSign className="w-3 h-3" /> Revenue impact
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-none backdrop-blur-sm">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============ HYPOTHESIS CARD ============

interface HypothesisCardProps {
    hypothesis: Hypothesis
    impactLevel: ImpactLevel
    onDismiss: () => void
    onExplore: () => void
}

function HypothesisCard({ hypothesis, impactLevel, onDismiss, onExplore }: HypothesisCardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-none shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                    <ImpactBadge level={impactLevel} />
                    <span className="px-2 py-0.5 text-[9px] font-medium bg-purple-500 text-white rounded-none flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI Generated
                    </span>
                </div>
                <button
                    onClick={onDismiss}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-none transition-colors"
                    title="Dismiss"
                >
                    <X className="w-4 h-4 text-slate-400 hover:text-red-500 dark:hover:text-red-400" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Insight */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-none bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">{hypothesis.insight}</p>
                </div>

                {/* Supporting Data */}
                <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-950 rounded-none border-l-4 border-blue-500">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Supporting Data</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{hypothesis.supportingMetrics}</p>
                </div>

                {/* Recommendation */}
                <div className="flex items-start gap-2 mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-none border border-emerald-200 dark:border-emerald-800">
                    <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">{hypothesis.recommendation}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onExplore}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-none transition-colors shadow-md"
                    >
                        Explore
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700 transition-colors" title="Regenerate">
                        <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
            </div>
        </div>
    )
}





// ============ MAIN TAB ============

export function HypothesesTab() {
    const { hypotheses, dismissHypothesis } = useSurveyBuilder()
    const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis | null>(null)
    const [chatOpen, setChatOpen] = useState(false)
    const [chatHypothesis, setChatHypothesis] = useState<Hypothesis | null>(null)

    const activeHypotheses = hypotheses.filter(h => !h.dismissed)

    // Assign impact levels (in real app, this would come from the data)
    const getImpactLevel = (index: number): ImpactLevel => {
        if (index < 4) return 'high'
        if (index < 7) return 'medium'
        return 'insight'
    }

    const handleTakeAction = (hypothesis: Hypothesis) => {
        setChatHypothesis(hypothesis)
        setChatOpen(true)
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}


            {/* Summary */}
            <HypothesesSummary />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeHypotheses.map((hypothesis, index) => (
                    <HypothesisCard
                        key={hypothesis.id}
                        hypothesis={hypothesis}
                        impactLevel={getImpactLevel(index)}
                        onDismiss={() => dismissHypothesis(hypothesis.id)}
                        onExplore={() => setSelectedHypothesis(hypothesis)}
                    />
                ))}
            </div>

            {/* Hypothesis Deep Dive Modal - NEW ENHANCED VERSION */}
            {selectedHypothesis && (
                <HypothesisDeepDiveModal
                    hypothesis={selectedHypothesis}
                    onClose={() => setSelectedHypothesis(null)}
                    onAIAction={(h) => {
                        setSelectedHypothesis(null)
                        handleTakeAction(h)
                    }}
                />
            )}

            {/* AI Assistant Sidebar - NEW MODERN DESIGN */}
            <AIAssistantSidebar
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                hypothesis={chatHypothesis}
            />
        </div>
    )
}
