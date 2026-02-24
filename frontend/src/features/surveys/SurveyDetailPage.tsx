/**
 * SurveyDetailPage - Real Estate CFM Survey Detail
 * 
 * Enhanced with:
 * - Sharp edges matching leads/loans design
 * - Border-l-4 KPI cards
 * - Dark table headers
 * - Tab navigation without rounded corners
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ChevronLeft, Share2, Download, ExternalLink,
    LayoutDashboard, List, MessageSquare, Sliders, Edit,
    Users, Clock, CheckCircle, Smartphone, Zap, // Sparkles removed
    Target, CreditCard, Building2, MapPin,
    Play, Pause, Square, Copy, BrainCircuit, GitBranch // GitBranch added
} from 'lucide-react'
import { Button, KPICard } from '@/components/ui'
import { cn } from '@/utils'
import { SurveyProvider } from './builder/contexts/SurveyPageContext'
import { FollowUpTab } from './builder/views/FollowUpTab'

// Sub-components
import { SurveyRealtimeDashboard } from './components/SurveyRealtimeDashboard'
import { ResponseListView } from './components/ResponseListView'
import { ApplicantsTab } from './components/ApplicantsTab'

import { SurveyBuilderProvider } from './builder/contexts/SurveyBuilderContext'
import { ActionsTab } from './builder/views/ActionsTab'
import { HypothesesTab } from './builder/views/HypothesesTab'
import { AnalyticsTab } from './builder/views/AnalyticsTab'
import { SurveySettings } from './components/SurveySettings'
import { DuplicateSurveyModal } from './components/DuplicateSurveyModal'
import { ExportModal } from './components/ExportModal'
import { ConfirmationModal } from './components/ConfirmationModal'


// Survey type configuration
const surveyTypeConfig = {
    buyer_intent: { label: 'Buyer Intent', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', borderColor: 'border-l-blue-500' },
    loan_prequal: { label: 'Loan Pre-Qual', icon: CreditCard, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', borderColor: 'border-l-emerald-500' },
    property_match: { label: 'Property Match', icon: Building2, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', borderColor: 'border-l-purple-500' },
    site_visit: { label: 'Site Visit', icon: MapPin, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', borderColor: 'border-l-orange-500' },
}

// Mock survey data
const surveyData = {
    id: '1',
    title: 'Post-Disbursement Feedback Survey',
    type: 'loan_prequal' as keyof typeof surveyTypeConfig,
    status: 'active',
    createdAt: '2024-01-15',
    responses: 1245,
    completionRate: 84.2,
    avgTime: '1m 45s',
    questions: 8,
    channels: ['web', 'email', 'whatsapp'],
    campaign: 'Q1 Loan Campaign',
    intentScore: 72,
    highIntentLeads: 312,
    prequalLeads: 189,
    siteVisitBookings: 45,
}

export function SurveyDetailPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'dashboard' | 'responses' | 'cx' | 'actions' | 'ai-builder' | 'insights' | 'ai-insights' | 'settings'>('dashboard')
    const [status, setStatus] = useState(surveyData.status)
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false)
    const [isExportModalOpen, setIsExportModalOpen] = useState(false)
    const [confirmation, setConfirmation] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void, variant: 'danger' | 'warning' | 'info' | 'success' }>({
        isOpen: false, title: '', message: '', onConfirm: () => { }, variant: 'warning'
    })

    const TypeIcon = surveyTypeConfig[surveyData.type]?.icon || Target
    const typeConfig = surveyTypeConfig[surveyData.type] || surveyTypeConfig.buyer_intent



    return (
        <SurveyProvider>
            <SurveyBuilderProvider>
                <div className="h-full w-full flex flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
                    {/* Header Section - Premium Card Style */}
                    <div className="shrink-0 pt-6 px-4 pb-0 space-y-6 w-full">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            {/* Top decorative bar */}
                            <div className={cn("h-1 w-full", typeConfig.bgColor.replace('/30', ''))} />

                            <div className="p-6">
                                {/* Top Row: Back link & Meta badges */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                                    <button
                                        onClick={() => navigate('/surveys')}
                                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-wider group/back"
                                    >
                                        <ChevronLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                                        Back to Surveys
                                    </button>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={cn(
                                            "px-3 py-1.5 text-xs font-bold uppercase tracking-wider border ring-1 ring-inset ring-transparent",
                                            surveyData.status === 'active'
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : surveyData.status === 'pending'
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : "bg-slate-50 text-slate-600 border-slate-200"
                                        )}>
                                            <span className={cn("w-2 h-2 rounded-none inline-block mr-2",
                                                status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                                            )} />
                                            {status}
                                        </span>

                                        <span className={cn(
                                            "px-3 py-1.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-2",
                                            typeConfig.bgColor, typeConfig.color, typeConfig.borderColor.replace('border-l-', 'border-')
                                        )}>
                                            <TypeIcon className="w-4 h-4" />
                                            {typeConfig.label}
                                        </span>

                                        <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 bg-slate-50 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Started 2 days ago
                                        </span>
                                    </div>
                                </div>

                                {/* Main Content Row: Title & Actions */}
                                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                                    {/* Title & Description */}
                                    <div className="flex-1 min-w-0 space-y-3">
                                        <div className="flex items-baseline gap-4">
                                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                                {surveyData.title}
                                            </h1>
                                        </div>
                                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium flex items-center gap-4">
                                            <span className="flex items-center gap-2">
                                                <List className="w-5 h-5 text-slate-400" /> {surveyData.questions} Questions
                                            </span>
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-none" />
                                            <span className="flex items-center gap-2">
                                                <Target className="w-5 h-5 text-slate-400" /> Campaign: <span className="text-slate-700 dark:text-slate-200 font-bold">{surveyData.campaign}</span>
                                            </span>
                                        </p>
                                    </div>

                                    {/* Action Toolbar */}
                                    <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 self-start xl:self-end shadow-sm">
                                        {/* Primary Control Group */}
                                        {status === 'active' ? (
                                            <Button
                                                variant="outline" size="sm"
                                                className="h-10 px-4 gap-2 rounded-none border-slate-300 bg-white hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-all font-bold shadow-sm text-xs uppercase tracking-wider"
                                                onClick={() => setStatus('paused')}
                                            >
                                                <Pause className="w-4 h-4 fill-current" /> Pause
                                            </Button>
                                        ) : status === 'paused' ? (
                                            <Button
                                                variant="outline" size="sm"
                                                className="h-10 px-4 gap-2 rounded-none border-slate-300 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all font-bold shadow-sm text-xs uppercase tracking-wider"
                                                onClick={() => setStatus('active')}
                                            >
                                                <Play className="w-4 h-4 fill-current" /> Resume
                                            </Button>
                                        ) : null}

                                        {(status === 'active' || status === 'paused') && (
                                            <Button
                                                variant="outline" size="sm"
                                                className="h-10 px-4 gap-2 rounded-none border-slate-300 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all font-bold shadow-sm text-xs uppercase tracking-wider"
                                                onClick={() => setConfirmation({
                                                    isOpen: true,
                                                    title: 'End Survey?',
                                                    message: 'This will stop response collection immediately. You can re-open it later.',
                                                    variant: 'danger',
                                                    onConfirm: () => setStatus('ended')
                                                })}
                                            >
                                                <Square className="w-4 h-4 fill-current" /> End
                                            </Button>
                                        )}

                                        {status === 'ended' && (
                                            <Button
                                                variant="outline" size="sm"
                                                className="h-10 px-4 gap-2 rounded-none border-slate-300 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all font-bold shadow-sm text-xs uppercase tracking-wider"
                                                onClick={() => setConfirmation({
                                                    isOpen: true,
                                                    title: 'Re-open Survey?',
                                                    message: 'This will resume response collection. Ensure your active dates are valid.',
                                                    variant: 'success',
                                                    onConfirm: () => setStatus('active')
                                                })}
                                            >
                                                <Play className="w-4 h-4 fill-current" /> Re-open
                                            </Button>
                                        )}

                                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2" />

                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost" size="sm"
                                                className="h-10 px-3 gap-2 rounded-none text-slate-600 hover:text-blue-600 hover:bg-white text-xs uppercase tracking-wider font-bold"
                                                onClick={() => navigate(`/surveys/${surveyData.id}/edit`)}
                                            >
                                                <Edit className="w-4 h-4" /> Edit
                                            </Button>
                                            <Button
                                                variant="ghost" size="sm"
                                                className="h-10 px-3 gap-2 rounded-none text-slate-600 hover:text-purple-600 hover:bg-white text-xs uppercase tracking-wider font-bold"
                                                onClick={() => setIsDuplicateModalOpen(true)}
                                            >
                                                <Copy className="w-4 h-4" /> Duplicate
                                            </Button>
                                        </div>

                                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2" />

                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost" size="sm"
                                                className="h-10 px-3 gap-2 rounded-none text-slate-600 hover:text-teal-600 hover:bg-white text-xs uppercase tracking-wider font-bold"
                                                onClick={() => alert('Share Survey')}
                                            >
                                                <Share2 className="w-4 h-4" /> Share
                                            </Button>
                                            <Button
                                                variant="ghost" size="sm"
                                                className="h-10 px-3 gap-2 rounded-none text-slate-600 hover:text-indigo-600 hover:bg-white text-xs uppercase tracking-wider font-bold"
                                                onClick={() => setIsExportModalOpen(true)}
                                            >
                                                <Download className="w-4 h-4" /> Export
                                            </Button>
                                            <Button
                                                variant="ghost" size="sm"
                                                className="h-10 px-3 gap-2 rounded-none text-slate-600 hover:text-orange-600 hover:bg-white text-xs uppercase tracking-wider font-bold"
                                                onClick={() => window.open('/survey/preview/1', '_blank')}
                                            >
                                                <ExternalLink className="w-4 h-4" /> Preview
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KPI Cards - Premium Style */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                            <KPICard
                                title="Total Responses"
                                value={surveyData.responses.toLocaleString()}
                                icon={<Users className="w-6 h-6" />}
                                trend={{ value: "12%", direction: "up" }}
                                variant="blue"
                                compact={false}
                                className="h-32 rounded-none border-l-4"
                            />

                            <KPICard
                                title="Completion Rate"
                                value={`${surveyData.completionRate}%`}
                                icon={<CheckCircle className="w-6 h-6" />}
                                trend={{ value: "3%", direction: "up" }}
                                variant="emerald"
                                compact={false}
                                className="h-32 rounded-none border-l-4"
                            />

                            <KPICard
                                title="Avg Time"
                                value={surveyData.avgTime}
                                icon={<Smartphone className="w-6 h-6" />}
                                variant="purple"
                                compact={false}
                                className="h-32 rounded-none border-l-4"
                            />

                            <KPICard
                                title="Intent Score"
                                value={surveyData.intentScore}
                                icon={<Target className="w-6 h-6" />}
                                trend={{ value: "8%", direction: "up" }}
                                variant="orange"
                                compact={false}
                                className="h-32 rounded-none border-l-4"
                            />
                        </div>

                        {/* Tab Navigation - Sharp edges */}
                        <div className="border-b-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-1 overflow-x-auto px-2">
                                {[
                                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                                    { id: 'responses', label: 'Responses', icon: List, count: surveyData.responses },
                                    { id: 'cx', label: 'CX Thread', icon: MessageSquare, count: 12 },
                                    { id: 'actions', label: 'Actions', icon: Zap, count: 5 },
                                    { id: 'insights', label: 'AI Hypotheses', icon: Zap },
                                    { id: 'ai-insights', label: 'AI Insights', icon: BrainCircuit, badge: 'HOT' },
                                    { id: 'ai-builder', label: 'Flowchart', icon: GitBranch, badge: 'NEW' },
                                    { id: 'settings', label: 'Settings', icon: Sliders },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-4 text-base font-bold transition-all border-b-2 -mb-[2px] whitespace-nowrap",
                                            activeTab === tab.id
                                                ? "border-b-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800"
                                                : "border-b-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.label}
                                        {tab.count !== undefined && (
                                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-xs font-black rounded-none">
                                                {tab.count.toLocaleString()}
                                            </span>
                                        )}
                                        {tab.badge && (
                                            <span className={cn(
                                                "px-2 py-0.5 text-white text-[10px] font-black uppercase rounded-none tracking-wider",
                                                tab.badge === 'HOT' ? "bg-orange-500" : "bg-purple-500"
                                            )}>
                                                {tab.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area - Flex Grow & Overflow Hidden */}
                    <div className="flex-1 overflow-hidden min-w-0">
                        <div className="h-full w-full px-4 py-4">
                            {activeTab === 'dashboard' && <SurveyRealtimeDashboard />}
                            {activeTab === 'responses' && <ResponseListView />}
                            {activeTab === 'cx' && <ApplicantsTab />}
                            {activeTab === 'actions' && <ActionsTab onNavigate={(tab) => setActiveTab(tab as any)} />}
                            {activeTab === 'ai-builder' && <FollowUpTab hideToolbar defaultView="flowchart" />}
                            {activeTab === 'insights' && <HypothesesTab />}

                            {activeTab === 'ai-insights' && <AnalyticsTab />}
                            {activeTab === 'settings' && (
                                <div className="h-full overflow-y-auto">
                                    <SurveySettings status={status} onStatusChange={(s) => setStatus(s)} />
                                </div>
                            )}
                        </div>
                    </div>

                    <DuplicateSurveyModal
                        isOpen={isDuplicateModalOpen}
                        onClose={() => setIsDuplicateModalOpen(false)}
                        originalTitle={surveyData.title}
                    />

                    <ExportModal
                        isOpen={isExportModalOpen}
                        onClose={() => setIsExportModalOpen(false)}
                        surveyTitle={surveyData.title}
                    />

                    <ConfirmationModal
                        isOpen={confirmation.isOpen}
                        onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                        onConfirm={confirmation.onConfirm}
                        title={confirmation.title}
                        message={confirmation.message}
                        variant={confirmation.variant}
                    />
                </div>
            </SurveyBuilderProvider>
        </SurveyProvider >
    )
}
