import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    Zap, TrendingUp, AlertTriangle, Lightbulb,
    Target, Clock, X, Bell, ArrowUpRight,
    Bot, Play, MoreHorizontal, ChevronLeft
} from 'lucide-react'
import { Button, SideDrawer } from '@/components/ui'
import { cn } from '@/utils'
import { apiClient } from '@/services/apiClient'
import { HypothesisDeepDiveModal } from '../builder/components/HypothesisDeepDiveModal'
import { AIAssistantSidebar } from '../builder/components/AIAssistantSidebar'
import { Hypothesis } from '../builder/contexts/SurveyBuilderContext'

// ============ MOCK DATA ============

const insights = [
    {
        id: 1,
        type: 'trend',
        severity: 'info',
        title: 'Response rate increasing in evening hours',
        description: 'We\'ve detected a 35% increase in survey completions between 6 PM - 9 PM IST compared to morning hours. Consider scheduling more surveys during this window.',
        impact: 'High',
        confidence: 94,
        actionable: true,
        suggestedAction: 'Adjust distribution schedule to favor evening hours',
        created: '2 hours ago',
        category: 'Timing',
    },
    {
        id: 2,
        type: 'anomaly',
        severity: 'warning',
        title: 'Drop-off spike at Q4 (Documentation)',
        description: 'Question 4 about documentation is causing 23% of respondents to abandon the survey. The average time spent on this question is 45 seconds, suggesting confusion.',
        impact: 'Critical',
        confidence: 87,
        actionable: true,
        suggestedAction: 'Simplify question wording or break into multiple parts',
        created: '4 hours ago',
        category: 'Survey Design',
    },
    {
        id: 3,
        type: 'pattern',
        severity: 'success',
        title: 'Maharashtra outperforming other regions',
        description: 'Maharashtra leads with 92% awareness score, 18% higher than the average. The top-performing districts are Mumbai Suburban, Pune, and Thane.',
        impact: 'Medium',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Replicate Maharashtra campaign strategies in other regions',
        created: '6 hours ago',
        category: 'Regional',
    },
    {
        id: 4,
        type: 'alert',
        severity: 'error',
        title: 'Negative sentiment surge from Gujarat',
        description: '42% of responses from Gujarat in the last 2 hours have been negative (NPS 0-6). Common themes: "documentation delay", "agent not reachable".',
        impact: 'Critical',
        confidence: 96,
        actionable: true,
        suggestedAction: 'Escalate to Gujarat regional manager immediately',
        created: '30 minutes ago',
        category: 'Sentiment',
    },
    {
        id: 5,
        type: 'opportunity',
        severity: 'info',
        title: 'High conversion intent among 25-35 age group',
        description: 'Respondents aged 25-35 show 67% higher conversion intent compared to other age groups. This segment represents 38% of total responses.',
        impact: 'High',
        confidence: 89,
        actionable: true,
        suggestedAction: 'Create targeted campaigns for this demographic',
        created: '1 day ago',
        category: 'Segmentation',
    },
    {
        id: 6,
        type: 'trend',
        severity: 'warning',
        title: 'Agent response time exceeding SLA',
        description: '35% of CX threads are breaching the 2-hour SLA. The average response time has increased to 2h 45m, up from 1h 30m last week.',
        impact: 'High',
        confidence: 98,
        actionable: true,
        suggestedAction: 'Add more agents to the CX queue or adjust SLA',
        created: '5 hours ago',
        category: 'Operations',
    },
]

const hypothesisValidation = [
    { hypothesis: 'Field agents improve awareness scores', result: true, pValue: 0.003, effect: '+24% awareness' },
    { hypothesis: 'Longer surveys reduce completion', result: true, pValue: 0.001, effect: '-3.2% completion' },
    { hypothesis: 'Evening distribution improves response rate', result: true, pValue: 0.012, effect: '+35% responses' },
    { hypothesis: 'Women respondents show higher satisfaction', result: false, pValue: 0.234, effect: 'No significant diff' },
    { hypothesis: 'SMS reminders increase click-through', result: true, pValue: 0.041, effect: '+12% CTR' },
    { hypothesis: 'Video content improves trust score', result: false, pValue: 0.156, effect: 'Inconclusive' },
]

// ============ COMPONENTS ============

function InsightCard({ insight, onDismiss, onAction }: { insight: typeof insights[0], onDismiss: () => void, onAction: (insight: typeof insights[0]) => void }) {
    const severityStyles = {
        info: 'border-l-blue-500',
        success: 'border-l-emerald-500',
        warning: 'border-l-orange-500',
        error: 'border-l-red-500',
    }

    const typeIcons = {
        trend: TrendingUp,
        anomaly: AlertTriangle,
        pattern: Target,
        alert: Bell,
        opportunity: Lightbulb,
    }

    const Icon = typeIcons[insight.type as keyof typeof typeIcons] || Lightbulb

    return (
        <div className={cn(
            "p-5 rounded-none border-l-4 border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md bg-white dark:bg-slate-900 group",
            severityStyles[insight.severity as keyof typeof severityStyles]
        )}>
            <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div className={cn(
                    "p-2.5 rounded-none shrink-0",
                    insight.severity === 'error' ? "bg-red-50 dark:bg-red-900/20" :
                        insight.severity === 'warning' ? "bg-orange-50 dark:bg-orange-900/20" :
                            insight.severity === 'success' ? "bg-emerald-50 dark:bg-emerald-900/20" :
                                "bg-blue-50 dark:bg-blue-900/20"
                )}>
                    <Icon className={cn(
                        "w-5 h-5",
                        insight.severity === 'error' ? "text-red-500" :
                            insight.severity === 'warning' ? "text-orange-500" :
                                insight.severity === 'success' ? "text-emerald-500" :
                                    "text-blue-500"
                    )} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{insight.title}</h4>
                            <span className={cn(
                                "px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wide",
                                insight.impact === 'Critical' ? "bg-red-100 text-red-700" :
                                    insight.impact === 'High' ? "bg-orange-100 text-orange-700" :
                                        insight.impact === 'Medium' ? "bg-blue-100 text-blue-700" :
                                            "bg-slate-100 text-slate-600"
                            )}>
                                {insight.impact}
                            </span>
                        </div>
                        <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">{insight.description}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {insight.created}</span>
                        <span className="w-1 h-1 rounded-none bg-slate-300"></span>
                        <span>{insight.category}</span>
                        <span className="w-1 h-1 rounded-none bg-slate-300"></span>
                        <span className="flex items-center gap-1.5">
                            <span className={cn(
                                "w-2 h-2 rounded-none",
                                insight.confidence >= 90 ? "bg-emerald-500" : insight.confidence >= 80 ? "bg-orange-500" : "bg-red-500"
                            )} />
                            <span className={cn("font-medium", insight.confidence >= 90 ? "text-emerald-700 dark:text-emerald-400" : "")}>{insight.confidence}% confidence</span>
                        </span>
                    </div>

                    {insight.actionable && insight.suggestedAction && (
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-none border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <Zap className="w-4 h-4 text-purple-600 shrink-0" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{insight.suggestedAction}</span>
                            </div>
                            <Button size="sm" onClick={() => onAction(insight)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-none h-8 px-4 text-xs font-semibold shadow-sm transition-all hover:shadow">
                                Take Action <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ============ MAIN COMPONENT ============

export function InsightEngine() {
    const { id } = useParams()
    const [realInsights, setRealInsights] = useState<any[]>([])
    const [_isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'actionable' | 'alerts'>('all')
    const [dismissedIds, setDismissedIds] = useState<string[]>([])
    const [selectedInsight, setSelectedInsight] = useState<any | null>(null)
    const [selectedHypothesis, setSelectedHypothesis] = useState<typeof hypothesisValidation[0] | null>(null)

    // AI Sidebar state
    const [aiSidebarOpen, setAiSidebarOpen] = useState(false)
    const [aiSidebarHypothesis, setAiSidebarHypothesis] = useState<Hypothesis | null>(null)

    const fetchInsights = async () => {
        if (!id) return
        setIsLoading(true)
        try {
            const response = await apiClient.get<any[]>(`/surveys/${id}/insights`)
            if (response.success && response.data) {
                // Map backend format to UI format
                const mapped = response.data.map((ins: any) => ({
                    id: ins.id,
                    title: ins.title,
                    description: ins.description,
                    impact: ins.impact,
                    confidence: ins.confidence,
                    actionable: !!ins.actionLabel,
                    suggestedAction: ins.actionLabel,
                    type: ins.type === 'critical' ? 'alert' : ins.type === 'opportunity' ? 'opportunity' : ins.type === 'positive' ? 'pattern' : 'trend',
                    severity: ins.type === 'critical' ? 'error' : ins.type === 'warning' ? 'warning' : ins.type === 'positive' ? 'success' : 'info',
                    created: 'Just now',
                    category: 'AI Detection'
                }))
                setRealInsights(mapped)
            }
        } catch (error) {
            console.error('Failed to fetch insights:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchInsights()
    }, [id])

    const displayInsights = realInsights.length > 0 ? realInsights : insights

    const filteredInsights = displayInsights.filter(i => {
        if (dismissedIds.includes(String(i.id))) return false
        if (filter === 'actionable') return i.actionable
        if (filter === 'alerts') return i.severity === 'error' || i.severity === 'warning'
        return true
    })

    return (
        <div className="space-y-8 animate-fade-in p-2">

            {/* AI Insights Section */}
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex items-center gap-2">
                    {[
                        { id: 'all', label: 'All Insights', count: displayInsights.length },
                        { id: 'actionable', label: 'Actionable', count: displayInsights.filter(i => i.actionable).length },
                        { id: 'alerts', label: 'Alerts', count: displayInsights.filter(i => i.severity === 'error' || i.severity === 'warning').length },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as any)}
                            className={cn(
                                "px-4 py-2 text-sm font-bold transition-all rounded-none flex items-center gap-2",
                                filter === tab.id
                                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm ring-1 ring-slate-900/5"
                                    : "bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700"
                            )}
                        >
                            {tab.label}
                            <span className={cn(
                                "px-1.5 py-0.5 text-[10px] rounded-none font-bold",
                                filter === tab.id ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                            )}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                <div className="grid gap-4">
                    {filteredInsights.map(insight => (
                        <InsightCard
                            key={insight.id}
                            insight={insight}
                            onDismiss={() => setDismissedIds(prev => [...prev, insight.id])}
                            onAction={(ins) => setSelectedInsight(ins)}
                        />
                    ))}
                </div>
            </div>

            {/* Hypothesis Generator Section */}
            <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                            <Bot className="w-5 h-5 text-purple-600" />
                            AI Hypotheses
                        </h3>
                        <p className="text-sm text-slate-500">Automated A/B testing & validation reports</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 rounded-none bg-white dark:bg-slate-800">
                        <Target className="w-4 h-4" /> Create Experiment
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hypothesisValidation.map((h, i) => (
                        <div key={i} className="group flex flex-col justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-lg rounded-none relative overflow-hidden">
                            {/* Decorative gradient blob */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />

                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <div className={cn(
                                        "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none border",
                                        h.result
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900"
                                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900"
                                    )}>
                                        {h.result ? "Validated" : "Inconclusive"}
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-none">
                                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                    </Button>
                                </div>

                                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight min-h-[3rem]">
                                    {h.hypothesis}
                                </h4>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">P-Value</span>
                                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{h.pValue}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Impact</span>
                                        <span className={cn("font-bold", h.result ? "text-emerald-600" : "text-amber-600")}>
                                            {h.effect}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full rounded-none gap-2 bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-purple-600 dark:hover:border-purple-600 transition-all font-bold"
                                onClick={() => setSelectedHypothesis(h)}
                            >
                                <Play className="w-3 h-3" /> Run Analysis Report
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insight Action Drawer (Keeping existing one) */}
            <SideDrawer
                isOpen={!!selectedInsight}
                onClose={() => setSelectedInsight(null)}
                title={selectedInsight?.title || 'Insight Details'}
                subtitle={selectedInsight?.category}
                variant={selectedInsight?.severity === 'error' ? 'red' : selectedInsight?.severity === 'warning' ? 'orange' : 'blue'}
                icon={<Lightbulb className="w-5 h-5" />}
                footer={
                    <div className="flex w-full gap-3">
                        <Button variant="outline" className="flex-1 rounded-none" onClick={() => setSelectedInsight(null)}>Dismiss</Button>
                        <Button className="flex-1 rounded-none gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                            Apply Recommendation <ArrowUpRight className="w-4 h-4" />
                        </Button>
                    </div>
                }
            >
                {selectedInsight && (
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Recommendation</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{selectedInsight.suggestedAction}</p>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1 font-bold text-emerald-600">
                                    <TrendingUp className="w-3 h-3" /> High Impact
                                </span>
                                <span className="flex items-center gap-1 text-slate-500">
                                    <Clock className="w-3 h-3" /> Est. Time: 5 mins
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </SideDrawer>

            {/* NEW: Hypothesis Deep Dive Modal - Enhanced 20-Section Report */}
            {selectedHypothesis && (
                <HypothesisDeepDiveModal
                    hypothesis={{
                        id: `H-${String(hypothesisValidation.indexOf(selectedHypothesis) + 1).padStart(3, '0')}`,
                        insight: selectedHypothesis.hypothesis,
                        supportingMetrics: `p-value: ${selectedHypothesis.pValue} | Effect: ${selectedHypothesis.effect}`,
                        recommendation: selectedHypothesis.result
                            ? 'Implement this strategy to capture the validated impact'
                            : 'Gather more data before making decisions',
                        dismissed: false
                    }}
                    onClose={() => setSelectedHypothesis(null)}
                    onAIAction={(h) => {
                        setSelectedHypothesis(null)
                        setAiSidebarOpen(true)
                        setAiSidebarHypothesis(h)
                    }}
                />
            )}

            {/* Persistent AI Trigger Button */}
            <button
                onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
                className={cn(
                    "fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#0F172A] text-white p-3 rounded-l-lg shadow-xl hover:bg-slate-800 transition-all duration-300 flex flex-col items-center gap-2 border-l border-t border-b border-white/10",
                    aiSidebarOpen ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
                )}
            >
                <Bot className="w-6 h-6 animate-pulse" />
                <div className="writing-vertical-rl text-[10px] font-bold tracking-widest uppercase rotate-180">
                    AI Assistant
                </div>
                <ChevronLeft className="w-4 h-4 mt-2" />
            </button>

            {/* AI Assistant Sidebar */}
            <AIAssistantSidebar
                isOpen={aiSidebarOpen}
                onClose={() => setAiSidebarOpen(false)}
                hypothesis={aiSidebarHypothesis}
            />
        </div>
    )
}
