import { useState } from 'react'
import { useSurveyBuilder, ViewMode } from './contexts/SurveyBuilderContext'
import { AIChatPanel } from './components/AIChatPanel'
import { cn } from '@/utils'
import { UniversalSimulator } from './components/UniversalSimulator'
import {
    Settings, BarChart3, Lightbulb, GitBranch, Sliders,
    ChevronLeft, Sparkles, Eye, Copy, Trash2, MoreVertical,
    Calendar, Clock, Menu, X, Check, Play, Pause, Save, Globe
} from 'lucide-react'

// ============ TAB CONFIG ============

const TABS: { id: ViewMode; label: string; icon: React.ElementType }[] = [
    { id: 'config', label: 'Configure', icon: Settings },
    { id: 'followups', label: 'Follow-ups', icon: GitBranch },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'hypotheses', label: 'AI Insights', icon: Lightbulb },
    { id: 'settings', label: 'Settings', icon: Sliders }
]

// ============ SURVEY HEADER ============

function SurveyHeader() {
    const { settings, updateSettings, openSimulator } = useSurveyBuilder()
    const [isEditing, setIsEditing] = useState(false)
    const [tempName, setTempName] = useState(settings.name)
    const [isSaving, setIsSaving] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    const handleNameSave = () => {
        updateSettings({ name: tempName })
        setIsEditing(false)
    }

    const handleSave = () => {
        setIsSaving(true)
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false)
            // Ideally trigger a toast here
        }, 1000)
    }

    const handlePublish = () => {
        setIsPublishing(true)
        // Simulate API call
        setTimeout(() => {
            setIsPublishing(false)
            updateSettings({ status: 'active' })
        }, 1500)
    }

    const statusConfig = {
        draft: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: null },
        active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: Play },
        ended: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', icon: Check },
        pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Pause }
    }

    const status = statusConfig[settings.status]
    const StatusIcon = status.icon

    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3">
            <div className="flex items-center justify-between">
                {/* Left: Back + Title + Status */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-none transition-colors flex-shrink-0 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                        <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>

                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={handleNameSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                className="text-lg font-bold text-slate-900 dark:text-white bg-transparent border-b-2 border-blue-500 outline-none px-1 w-full max-w-xs rounded-none"
                                autoFocus
                            />
                        ) : (
                            <h1
                                className="text-lg font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                                onClick={() => { setTempName(settings.name); setIsEditing(true) }}
                            >
                                {settings.name}
                            </h1>
                        )}

                        <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none border flex items-center gap-1 flex-shrink-0",
                            status.bg, status.text, status.border
                        )}>
                            {StatusIcon && <StatusIcon className="w-3 h-3" />}
                            {settings.status}
                        </span>
                    </div>
                </div>

                {/* center: Meta Info (hidden on mobile) */}
                <div className="hidden lg:flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Created {new Date(settings.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Updated {new Date(settings.updatedAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 md:gap-3 flex-shrink-0 ml-4">
                    <button onClick={openSimulator} className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-none transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 uppercase tracking-wide">
                        <Eye className="w-4 h-4" />
                        <span className="hidden md:inline">Preview</span>
                    </button>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

                    <button
                        onClick={handleSave}
                        className={cn(
                            "hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-200 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-none transition-all shadow-sm hover:shadow-md uppercase tracking-wide",
                            isSaving && "opacity-80 cursor-wait"
                        )}
                    >
                        {isSaving ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Save</span>
                    </button>

                    <button
                        onClick={handlePublish}
                        className={cn(
                            "hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-none transition-all shadow-sm hover:shadow-md uppercase tracking-wide hover:-translate-y-0.5",
                            isPublishing && "opacity-80 cursor-wait translate-y-0"
                        )}
                    >
                        {isPublishing ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Globe className="w-3.5 h-3.5" />
                        )}
                        <span>Publish</span>
                    </button>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

                    <button className="p-2 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-none transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-none transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============ TAB NAVIGATION ============

function SurveyTabNav() {
    const { viewMode, setViewMode } = useSurveyBuilder()

    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6">
            <nav className="flex items-center gap-0.5 -mb-px overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => {
                    const isActive = viewMode === tab.id
                    const Icon = tab.icon

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setViewMode(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap uppercase tracking-widest",
                                isActive
                                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isActive ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                            {tab.label}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}

// ============ AI TOGGLE BUTTON ============

function AIToggleButton() {
    const { aiPanelOpen, setAiPanelOpen } = useSurveyBuilder()

    return (
        <button
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className={cn(
                "fixed right-6 bottom-6 z-40 flex items-center gap-2 px-5 py-4 rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all border border-white/20",
                aiPanelOpen
                    ? "bg-slate-800 text-white lg:hidden border-slate-700"
                    : "bg-[#0F172A] text-white hover:shadow-2xl hover:-translate-y-1 hover:bg-slate-900"
            )}
        >
            {aiPanelOpen ? (
                <>
                    <X className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider text-xs">Close</span>
                </>
            ) : (
                <>
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                    <span className="font-bold uppercase tracking-wider text-xs">AI Assistant</span>
                </>
            )}
        </button>
    )
}

// ============ MAIN LAYOUT ============

interface CreateSurveyLayoutProps {
    children: React.ReactNode
}

export function CreateSurveyLayout({ children }: CreateSurveyLayoutProps) {
    const { aiPanelOpen, isSimulatorOpen, closeSimulator, questions, simulatorMode, replayResponse } = useSurveyBuilder()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="flex h-full w-full bg-slate-50 overflow-hidden font-sans">
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white border border-slate-200 rounded-none shadow-sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                <Menu className="w-5 h-5 text-slate-600" />
            </button>

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col h-full min-w-0 transition-all duration-300",
                aiPanelOpen ? "lg:mr-[420px]" : ""
            )}>
                {/* Header */}
                <SurveyHeader />

                {/* Tab Navigation */}
                <SurveyTabNav />

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-950 relative">
                    <div className="h-full w-full max-w-full relative">
                        {children}
                    </div>
                </main>
            </div>

            {/* AI Chat Panel */}
            <AIChatPanel />

            {/* AI Toggle Button */}
            <AIToggleButton />

            {/* Simulator */}
            <UniversalSimulator
                isOpen={isSimulatorOpen}
                onClose={closeSimulator}
                questions={questions}
                mode={simulatorMode}
                replayResponse={replayResponse}
            />
        </div>
    )
}
