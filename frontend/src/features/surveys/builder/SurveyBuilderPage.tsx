/**
 * CFM Survey Builder - 10/10 Rebuild
 * 
 * Exact Visual Match with Leads/Loans Pages:
 * - Sharp edges (rounded-none)
 * - Specific shadows and borders
 * - Fixed global Sidebar
 * - Horizontal Flowchart with "Tree" expansion logic
 * - Persistent Right AI Drawer
 * - Advanced Wizard & Analytics
 * - Logic Engine & Mobile Simulator
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedLogo } from '@/components/logo/AnimatedLogo'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../../components/layout/Sidebar' // Global Sidebar
import {
    ChevronRight,
    Plus,
    Settings,
    X,
    Check,
    ArrowRight,
    MessageSquare,
    LayoutGrid,
    List,
    GitBranch,
    ZoomIn,
    ZoomOut,
    Play,
    Share2,
    Save,
    Trash2,
    Smartphone,
    Globe,
    Mail,
    MessageCircle,
    Tablet,
    Calendar,
    Target,
    Activity,
    Filter,
    ChevronDown,
    Download,
    GripVertical,
    Split,
    Merge,
    TrendingUp,
    Sparkles,
    Maximize2,
    Minimize2,
    Bot,
    Zap,
    BarChart3,
    FileText,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Mic,
    Paperclip,
    CheckCircle,
    AlertTriangle,
    Users,
    Clock,
    AlertCircle,
    Info,
    Pin,
    MoreHorizontal,
    MoreVertical,
    Edit2,
    PlusCircle,
    XCircle,
    Palette,
    Database,
    Type,
    Wand2,
    User,
    BookOpen,
    ArrowUpRight,
    Send,
} from 'lucide-react'
import { cn } from '@/utils'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FollowUpTab } from './views/FollowUpTab'
import { HypothesesTab } from './views/HypothesesTab'
import { AnalyticsTab } from './views/AnalyticsTab'
import { SettingsTab } from './views/SettingsTab'
import { SurveyBuilderProvider } from './contexts/SurveyBuilderContext'
import { ApplicantsTab } from '../components/ApplicantsTab'
import { WizardStep } from '@/components/ui'
import { QuestionDrawer } from './components/QuestionDrawer'


// ============================================================================
// UTILS & TOKENS
// ============================================================================

const TOKENS = {
    card: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),_0_1px_2px_-1px_rgba(0,0,0,0.06)] rounded-none",
    cardHover: "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_12px_0_rgba(0,0,0,0.08)] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300",
    label: "text-[10px] font-bold text-slate-400 uppercase tracking-widest",
    input: "w-full px-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400",
    btn: "px-4 py-2 font-medium rounded-none transition-colors",
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-medium transition-colors shadow-sm",
    btnSecondary: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-none font-medium transition-colors",
    iconBtn: "p-2 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-none",
    tab: "text-sm font-medium px-4 py-3 border-b-2 transition-colors",
    tabActive: "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10",
    tabInactive: "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-white/5",
    modalOverlay: "fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fade-in",
    modalContent: "bg-white dark:bg-slate-900 w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-white/10 rounded-none animate-scale-in"
}

// ============================================================================
// TYPES
// ============================================================================

import {
    useSurvey,
    SurveyProvider,
    MainTab,
    BuilderView,
    Question,
    QuestionOption
} from './contexts/SurveyPageContext'

// ============================================================================
// PAGE LAYOUT
// ============================================================================

export function SurveyBuilderContent() {
    const { selectedQuestionId, selectQuestion, activeTab } = useSurvey()

    // Tabs that should use window-level scrolling (Dashboard style)
    const isScrollableTab = ['overview', 'analytics', 'settings', 'responses', 'applicants'].includes(activeTab)

    return (
        <div className={cn(
            "flex w-full bg-slate-50 dark:bg-[#0B1121] font-sans",
            isScrollableTab ? "min-h-screen" : "h-screen overflow-hidden"
        )}>
            {/* Global Sidebar - Sticky in scroll mode, relative in fixed mode */}
            <div className={cn(
                "flex-shrink-0 z-40",
                isScrollableTab ? "sticky top-0 h-screen" : "relative h-full w-[70px]"
            )}>
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1121] relative">
                <SurveyHeader />
                <SurveyTabNav />

                {/* Workspace Container */}
                <div className={cn(
                    "flex-1 relative",
                    !isScrollableTab && "overflow-hidden"
                )}>
                    <div className={cn(
                        !isScrollableTab && "absolute inset-0"
                    )}>
                        <MainWorkspace />
                    </div>
                </div>
            </div>

            <AICopilot />
            <QuestionDrawer
                isOpen={!!selectedQuestionId}
                onClose={() => selectQuestion(null)}
                editingId={selectedQuestionId}
            />
            {/* <NewSurveyWizard /> Removed as per user request */}
            <MobileSimulator />
        </div>
    )
}

function SurveyHeader() {
    // ...
    const { surveyName, openSimulator } = useSurvey()
    const navigate = useNavigate()
    const [isPublishOpen, setIsPublishOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1000)
    }

    return (
        <>
            <PublishSurveyModal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} />
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 z-30 h-16 px-4 flex items-center justify-between shadow-sm">

                {/* Left: Title & Breadcrumbs */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/surveys')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                            <span>Surveys</span>
                            <ChevronRight className="w-3 h-3" />
                            <span>Edit Builder</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">{surveyName}</h1>
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase rounded-sm">Draft</span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center text-xs text-slate-400 mr-2 gap-1.5 hidden md:flex">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Saved just now</span>
                    </div>

                    {/* Creation Mode removed */}
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />

                    <button
                        onClick={openSimulator}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-sm transition-all uppercase tracking-wide"
                    >
                        <Play className="w-3.5 h-3.5" />
                        Run Prototype
                    </button>

                    <button
                        onClick={handleSave}
                        className={cn(
                            "hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-sm transition-all uppercase tracking-wide shadow-sm",
                            isSaving && "opacity-80"
                        )}
                    >
                        {isSaving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Save
                    </button>

                    <button
                        onClick={() => setIsPublishOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-sm transition-all uppercase tracking-wide shadow-sm hover:shadow-md hover:-translate-y-0.5 transform"
                    >
                        <Globe className="w-3.5 h-3.5" />
                        Publish
                    </button>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block" />

                    <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </header>
        </>
    )
}

function SurveyTabNav() {
    const { activeTab, setActiveTab, builderView, setBuilderView } = useSurvey()

    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0 h-12 z-20">
            {/* Main Tabs */}
            <nav className="flex items-center gap-4 h-full">
                {['overview', 'analytics', 'hypotheses', 'followups', 'settings'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as MainTab)}
                        className={cn(
                            "h-full flex items-center gap-2 text-xs font-bold uppercase tracking-wide border-b-2 transition-all px-1",
                            activeTab === tab
                                ? "border-emerald-500 text-emerald-600"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    )
}


function MainWorkspace() {
    const { activeTab } = useSurvey()
    return (
        <div className="h-full w-full overflow-hidden relative bg-slate-50 dark:bg-[#0B1121]">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {/* Keeping placeholders simple for non-core tabs to save space, but core tabs are full. */}
            {activeTab === 'hypotheses' && <HypothesesTab />}
            {activeTab === 'followups' && <FollowUpTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'applicants' && <ApplicantsTab />}
            {activeTab === 'responses' && <ResponsesTab />}
        </div>
    )
}

// --- Builder Components Removed (Legacy) ---


// --- MULTI-DEVICE PROTOTYPE SIMULATOR ---

type DeviceType = 'iphone' | 'ipad' | 'desktop'

const DEVICES: Record<DeviceType, { label: string; width: number; height: number; scale: number }> = {
    iphone: { label: 'iPhone', width: 375, height: 812, scale: 0.9 },
    ipad: { label: 'iPad', width: 768, height: 1024, scale: 0.85 },
    desktop: { label: 'Desktop', width: 1280, height: 800, scale: 0.85 }
}

function MobileSimulator() {
    const { isSimulatorOpen, closeSimulator, questions, simulatorMode, replayResponse } = useSurvey()
    const [currentQIndex, setCurrentQIndex] = useState(0)
    const [deviceType, setDeviceType] = useState<DeviceType>('iphone')
    const [selectedOption, setSelectedOption] = useState<string | null>(null)

    const [isRotating, setIsRotating] = useState(false)



    const currentQ = questions[currentQIndex] || questions[0]
    const device = DEVICES[deviceType]

    // Replay Engine
    useEffect(() => {
        if (simulatorMode !== 'replay' || !replayResponse || !isSimulatorOpen) return

        const currentQ = questions[currentQIndex] || questions[0]
        const answer = replayResponse.answers[currentQ.id]

        const timer = setTimeout(() => {
            if (answer) {
                // Try to find matching option for logic
                const matchingOpt = currentQ.options.find(o => o.text === answer)
                if (matchingOpt) {
                    handleOptionSelect(matchingOpt)
                } else {
                    // For text/rating/etc where answer is direct value
                    // Just move next after delay
                    handleNext()
                }
            } else {
                // No answer found (maybe skipped), move next
                handleNext()
            }
        }, 1500) // 1.5s delay for reading

        return () => clearTimeout(timer)
    }, [currentQIndex, simulatorMode, replayResponse, isSimulatorOpen])

    const handleNext = () => {
        const currentQ = questions[currentQIndex] || questions[0]
        // Simple linear next for basic types or missing logic
        // In reality, should check logicType but for prototype linear/skip is okay for non-options
        if (currentQ.logicType === 'independent' && currentQ.children?.length === 0) {
            setCurrentQIndex(prev => (prev + 1) % questions.length)
        } else {
            // Try to follow first independent child or next sibling
            setCurrentQIndex(prev => (prev + 1) % questions.length)
        }
    }

    const handleOptionSelect = (opt: QuestionOption) => {
        setSelectedOption(opt.id)
        // Simulate animation then navigate
        setTimeout(() => {
            setSelectedOption(null)
            // Check for branching
            if (opt.nextQuestionId) {
                const branchIdx = questions.findIndex(q => q.id === opt.nextQuestionId)
                if (branchIdx >= 0) {
                    setCurrentQIndex(branchIdx)
                    return
                }
            }
            setCurrentQIndex(prev => (prev + 1) % questions.length)
        }, 300)
    }

    const switchDevice = (type: DeviceType) => {
        if (type === deviceType) return
        setIsRotating(true)
        setTimeout(() => {
            setDeviceType(type)
            setIsRotating(false)
        }, 250) // Switch halfway through rotation
    }

    const renderInput = () => {
        const type = currentQ.type
        const answer = simulatorMode === 'replay' ? replayResponse?.answers[currentQ.id] : null

        if (['text', 'date', 'file', 'number'].includes(type)) {
            return (
                <div className="space-y-4">
                    <input
                        type={type === 'date' ? 'date' : 'text'}
                        className={cn(TOKENS.input, "p-4 text-base rounded-lg border-slate-200 focus:border-emerald-500 shadow-sm transition-all")}
                        placeholder="Type your answer..."
                        value={answer || ''}
                        readOnly={simulatorMode === 'replay'}
                    />
                    {simulatorMode !== 'replay' && <button onClick={handleNext} className={cn(TOKENS.btnPrimary, "w-full rounded-lg py-3")}>Next</button>}
                </div>
            )
        }

        if (['rating', 'nps'].includes(type)) {
            const max = type === 'nps' ? 10 : 5
            return (
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {Array.from({ length: max + 1 }).map((_, i) => {
                            const val = type === 'nps' ? i : i + 1
                            if (type === 'rating' && i === max) return null // 1-5
                            const isSelected = answer === val.toString()
                            return (
                                <button
                                    key={i}
                                    className={cn(
                                        "w-10 h-10 rounded-full font-bold text-sm transition-all shadow-sm border",
                                        isSelected
                                            ? "bg-emerald-500 text-white border-emerald-600 scale-110"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400"
                                    )}
                                    onClick={simulatorMode !== 'replay' ? handleNext : undefined}
                                >
                                    {val}
                                </button>
                            )
                        })}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 px-2">
                        <span>Not Likely</span>
                        <span>Very Likely</span>
                    </div>
                </div>
            )
        }

        // Default MCQ / Options
        // Sharp 3D Glassmorphic Stats for Options
        return (
            <div className={cn(
                "space-y-3",
                deviceType === 'desktop' && 'grid grid-cols-2 gap-4 space-y-0'
            )}>
                {currentQ.options.slice(0, 6).map((opt, i) => (
                    <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt)}
                        className={cn(
                            "w-full text-left font-bold transition-all group relative overflow-hidden border",
                            selectedOption === opt.id || (simulatorMode === 'replay' && answer === opt.text)
                                ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_4px_0_0_#065f46] translate-y-[-2px] z-10"
                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-[0_2px_0_0_rgba(0,0,0,0.1)] hover:translate-y-[-1px]",
                            deviceType !== 'iphone' && 'p-4'
                        )}
                        style={{
                            borderRadius: 0,
                            animationDelay: `${i * 80}ms`
                        }}
                    >
                        {/* 3D Highlight for Active */}
                        {(selectedOption === opt.id || (simulatorMode === 'replay' && answer === opt.text)) && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/30" />
                        )}

                        <div className={cn("flex items-center gap-3", deviceType === 'iphone' ? 'p-3' : '')}>
                            <span className={cn(
                                "inline-flex items-center justify-center font-black transition-colors border",
                                deviceType === 'iphone' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs',
                                selectedOption === opt.id || (simulatorMode === 'replay' && answer === opt.text)
                                    ? "bg-emerald-800 border-emerald-700 text-emerald-100"
                                    : "bg-slate-100 border-slate-200 text-slate-500 group-hover:bg-slate-200"
                            )} style={{ borderRadius: 0 }}>{String.fromCharCode(65 + i)}</span>

                            <span className={cn(deviceType !== 'iphone' ? 'text-base' : 'text-sm')}>{opt.text}</span>
                        </div>
                    </button>
                ))}
                {currentQ.options.length > 6 && (
                    <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 py-2">+{currentQ.options.length - 6} more options</div>
                )}
            </div>
        )
    }

    const renderSurveyContent = () => (
        <div className={cn(
            "h-full flex flex-col",
            deviceType === 'iphone' ? 'p-6 pt-8' : deviceType === 'ipad' ? 'p-10 pt-12' : 'p-12 pt-8'
        )}>
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-bold text-slate-400">{currentQIndex + 1}/{questions.length}</span>
            </div>

            {/* Question */}
            <div className="flex-1 overflow-y-auto">
                <h2 className={cn(
                    "font-bold text-slate-900 mb-2",
                    deviceType === 'iphone' ? 'text-xl' : 'text-2xl'
                )}>{currentQ.text}</h2>
                <p className={cn(
                    "text-slate-500 mb-6",
                    deviceType === 'iphone' ? 'text-sm' : 'text-base'
                )}>
                    {currentQ.description || (['text', 'date'].includes(currentQ.type) ? "Please type your answer." : "Please select an option below.")}
                </p>

                {/* Dynamic Input Render */}
                {renderInput()}
            </div>

            {/* Footer */}
            <div className="pt-4 mt-auto border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                        className="text-sm text-slate-400 hover:text-slate-600"
                        disabled={currentQIndex === 0}
                    >← Previous</button>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-300">Powered by CFM</div>
                    <button
                        onClick={() => setCurrentQIndex(prev => (prev + 1) % questions.length)}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >Skip →</button>
                </div>
            </div>
        </div>
    )


    if (!isSimulatorOpen) return null

    return (
        <div className={TOKENS.modalOverlay + " perspective-[1500px]"}>
            <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
                {/* Fixed Sticky Header */}
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/10 animate-fade-in">
                    {(Object.keys(DEVICES) as DeviceType[]).map(device => (
                        <button
                            key={device}
                            onClick={() => switchDevice(device)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2",
                                deviceType === device
                                    ? "bg-white text-slate-900 shadow-lg scale-105"
                                    : "text-slate-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {device === 'iphone' && <Smartphone className="w-4 h-4" />}
                            {device === 'ipad' && <Tablet className="w-4 h-4" />}
                            {device === 'desktop' && <Globe className="w-4 h-4" />}
                            {DEVICES[device].label}
                        </button>
                    ))}
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button onClick={closeSimulator} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Device Frame with 3D Rotation */}
                <div
                    className="relative transition-all duration-500 ease-in-out"
                    style={{
                        transform: `scale(${device.scale}) ${isRotating ? 'rotateY(90deg) scale(0.8)' : 'rotateY(0deg)'}`,
                        opacity: isRotating ? 0.5 : 1
                    }}
                >

                    {/* iPhone Frame */}
                    {deviceType === 'iphone' && (
                        <div className="w-[375px] h-[812px] bg-black rounded-[50px] border-[14px] border-slate-900 shadow-2xl overflow-hidden relative">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-black rounded-b-2xl z-10" />
                            {/* Status Bar */}
                            <div className="h-12 w-full bg-white flex justify-between items-center px-8 pt-2 text-xs font-bold">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center">
                                    <div className="w-4 h-2 bg-black rounded-sm" />
                                </div>
                            </div>
                            {/* Content */}
                            <div className="h-[calc(100%-48px)] bg-slate-50">
                                {renderSurveyContent()}
                            </div>
                            {/* Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full" />
                        </div>
                    )}

                    {/* iPad Frame */}
                    {deviceType === 'ipad' && (
                        <div className="w-[768px] h-[1024px] bg-slate-800 rounded-[40px] border-[16px] border-slate-800 shadow-2xl overflow-hidden relative">
                            {/* Camera */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-600 rounded-full z-10" />
                            {/* Status Bar */}
                            <div className="h-10 w-full bg-white flex justify-between items-center px-4 text-xs font-bold">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center">
                                    <div className="w-4 h-2 bg-black rounded-sm" />
                                    <span className="text-[10px]">100%</span>
                                </div>
                            </div>
                            {/* Content */}
                            <div className="h-[calc(100%-40px)] bg-slate-50">
                                {renderSurveyContent()}
                            </div>
                        </div>
                    )}

                    {/* Desktop Frame */}
                    {deviceType === 'desktop' && (
                        <div className="flex flex-col">
                            {/* Browser Chrome */}
                            <div className="w-[1280px] h-10 bg-slate-100 rounded-t-xl flex items-center px-4 gap-2 border border-slate-200">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 mx-20">
                                    <div className="h-6 bg-white rounded-md border border-slate-200 flex items-center px-3">
                                        <span className="text-[10px] text-slate-500">🔒 survey.cfm.io/preview</span>
                                    </div>
                                </div>
                            </div>
                            {/* Content */}
                            <div className="w-[1280px] h-[800px] bg-slate-50 border-x border-b border-slate-200 rounded-b-xl overflow-hidden">
                                <div className="max-w-2xl mx-auto py-4">
                                    {renderSurveyContent()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Question Navigator */}
                <div className="flex items-center gap-2 text-white/70 text-sm">
                    <button onClick={() => setCurrentQIndex(0)} className="hover:text-white">⟨⟨ First</button>
                    <span className="px-3">Question {currentQIndex + 1} of {questions.length}</span>
                    <button onClick={() => setCurrentQIndex(questions.length - 1)} className="hover:text-white">Last ⟩⟩</button>
                </div>
            </div>
        </div>
    )
}

// ============ PUBLISH SURVEY MODAL (QUICK CREATE STYLE) ============

const PUBLISH_STEPS: WizardStep[] = [
    { id: 1, label: 'Configure', description: 'Schedule & Targets' },
    { id: 2, label: 'Confirmation', description: 'Review & Launch' }
]

function PublishSurveyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { surveyName } = useSurvey()
    const [step, setStep] = useState(1)
    const [scheduleType, setScheduleType] = useState<'instant' | 'scheduled' | null>(null)
    const [status, setStatus] = useState<'idle' | 'publishing' | 'success'>('idle')

    // Scheduled State
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [totalDays, setTotalDays] = useState(0)

    // Reset on Close
    useEffect(() => {
        if (!isOpen) {
            setStep(1)
            setScheduleType(null)
            setStatus('idle')
        }
    }, [isOpen])

    // Calculate Days
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate)
            const end = new Date(endDate)
            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
            setTotalDays(diff > 0 ? diff : 0)
        }
    }, [startDate, endDate])

    const handlePublish = () => {
        setStatus('publishing')
        // Mock publish action
        setTimeout(() => {
            setStatus('success')
        }, 1500)
    }

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={cn(
                "relative flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-scale-in",
                "!rounded-none" // Sharp Edges enforced
            )}>
                {/* Left Sidebar */}
                <div className={cn(
                    "hidden md:flex flex-col relative",
                    "bg-[#0F172A] text-white p-4",
                    "w-[350px] shrink-0 border-r border-slate-800"
                )}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

                    <div className="relative z-10 mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <AnimatedLogo className="w-8 h-8 text-emerald-500" />
                            <span className="font-bold text-lg tracking-tight">Survey<span className="text-emerald-500">Launch</span></span>
                        </div>
                        <p className="text-slate-400 text-sm">Deploy your survey to thousands of potential customers in seconds.</p>
                    </div>

                    <div className="relative z-10 space-y-6 flex-1">
                        {PUBLISH_STEPS.map((s, idx) => {
                            const isActive = Number(step) === Number(s.id);
                            const isCompleted = Number(step) > Number(s.id);
                            return (
                                <div key={s.id} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            "w-8 h-8 flex items-center justify-center font-bold text-sm transition-all duration-300 rounded-none border",
                                            isActive ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
                                                isCompleted ? "bg-emerald-900/30 border-emerald-500/50 text-emerald-500" :
                                                    "bg-transparent border-slate-700 text-slate-500"
                                        )}>
                                            {isCompleted ? <Check className="w-4 h-4" /> : s.id}
                                        </div>
                                        {idx < PUBLISH_STEPS.length - 1 && (
                                            <div className={cn(
                                                "w-px h-12 my-2 transition-colors",
                                                isCompleted ? "bg-emerald-900" : "bg-slate-800"
                                            )} />
                                        )}
                                    </div>
                                    <div className="pt-1">
                                        <p className={cn(
                                            "font-bold text-sm transition-colors",
                                            isActive ? "text-white" : isCompleted ? "text-emerald-400" : "text-slate-500"
                                        )}>{s.label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Footer AI Badge */}
                    <div className="relative z-10 mt-auto pt-8 border-t border-slate-800/50">
                        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded border border-slate-700">
                            <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">AI Optimization</p>
                                <p className="text-[10px] text-slate-400">Targeting settings are auto-optimized</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col h-[600px] max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {status === 'success' ? 'Congratulations!' : step === 1 ? 'Configure Launch' : 'Review & Confirm'}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {status === 'success' ? 'Your survey is now live.' : `Step ${step} of 2`}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Body - Scrollable */}
                    <div className="flex-1 overflow-y-auto relative">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
                                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-2">
                                    <Check className="w-10 h-10 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Survey Published!</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">Your survey "{surveyName}" is now active and collecting responses.</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-sm">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500">Status</span>
                                        <span className="font-bold text-emerald-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Link</span>
                                        <span className="font-bold text-blue-500 hover:underline cursor-pointer">cfm.io/s/x9d2k</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={onClose} className={cn(TOKENS.btnSecondary, "px-4")}>Close</button>
                                    <button className={cn(TOKENS.btnPrimary, "px-4")}>View Analytics</button>
                                </div>
                            </div>
                        ) : step === 1 ? (
                            <div className="space-y-8 animate-fade-in">
                                {/* Launch Type Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setScheduleType('instant')}
                                        className={cn(
                                            "p-6 border rounded-none text-left transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative overflow-hidden group",
                                            scheduleType === 'instant' ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors",
                                            scheduleType === 'instant' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                                        )}>
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <h3 className={cn("font-bold mb-1", scheduleType === 'instant' ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white")}>Instant Publish</h3>
                                        <p className="text-xs text-slate-500">Go live immediately. Best for urgent data collection.</p>
                                        {scheduleType === 'instant' && <div className="absolute top-3 right-3 text-emerald-500"><CheckCircle className="w-5 h-5" /></div>}
                                    </button>

                                    <button
                                        onClick={() => setScheduleType('scheduled')}
                                        className={cn(
                                            "p-6 border rounded-none text-left transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative overflow-hidden group",
                                            scheduleType === 'scheduled' ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors",
                                            scheduleType === 'scheduled' ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                                        )}>
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <h3 className={cn("font-bold mb-1", scheduleType === 'scheduled' ? "text-blue-700 dark:text-blue-400" : "text-slate-900 dark:text-white")}>Schedule Launch</h3>
                                        <p className="text-xs text-slate-500">Set start/end dates. Best for controlled campaigns.</p>
                                        {scheduleType === 'scheduled' && <div className="absolute top-3 right-3 text-blue-500"><CheckCircle className="w-5 h-5" /></div>}
                                    </button>
                                </div>

                                {/* Schedule Details (Conditional) */}
                                {scheduleType === 'scheduled' && (
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 animate-slide-up">
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-500" /> Campaign Duration
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className={cn(TOKENS.input, "bg-white dark:bg-slate-900")}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500">End Date</label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className={cn(TOKENS.input, "bg-white dark:bg-slate-900")}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded border border-blue-100 dark:border-blue-800 text-xs">
                                            <Info className="w-4 h-4" />
                                            <span>Campaign will run for <strong>{totalDays} days</strong> automatically.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Confirmation Step
                            <div className="space-y-6 animate-fade-in">
                                <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Summary</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 text-sm">Survey Name</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">{surveyName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 text-sm">Launch Type</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">{scheduleType}</span>
                                        </div>
                                        {scheduleType === 'scheduled' && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-500 text-sm">Duration</span>
                                                <span className="font-bold text-slate-900 dark:text-white text-sm">{startDate} - {endDate} ({totalDays} days)</span>
                                            </div>
                                        )}
                                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 text-sm">Target Audience</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">All Applicants</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-sm text-slate-500 bg-yellow-50 dark:bg-yellow-900/10 rounded border border-yellow-100 dark:border-yellow-900/20">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                                    <p>Once published, removing questions will break analytics for existing responses. Adding questions is safe.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {status !== 'success' && (
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center z-10">
                            {step > 1 ? (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wide px-8 py-3 rounded-none transition-colors border-none"
                                >
                                    Back
                                </button>
                            ) : <div></div>}

                            <div className="flex gap-3">
                                <button onClick={onClose} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs uppercase tracking-wide px-8 py-3 rounded-none transition-colors shadow-sm hover:shadow">Cancel</button>
                                {step < 2 ? (
                                    <button
                                        disabled={!scheduleType}
                                        onClick={() => setStep(step + 1)}
                                        className={cn("bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide px-8 py-3 rounded-none transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5", !scheduleType && "opacity-50 cursor-not-allowed transform-none")}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePublish}
                                        disabled={status === 'publishing'}
                                        className={cn("bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide px-8 py-3 rounded-none transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2")}
                                    >
                                        {status === 'publishing' ? <><span className="animate-spin">⟳</span> Publishing...</> : 'Launch Survey'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}



function NewSurveyWizard() {
    const { isWizardOpen, closeWizard, updateSurveySettings, setSurveyName } = useSurvey()
    const [step, setStep] = useState(1)
    const [selectedMediums, setSelectedMediums] = useState<string[]>([])
    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const [goal, setGoal] = useState(100)
    const [loadingAI, setLoadingAI] = useState(false)

    if (!isWizardOpen) return null

    const MEDIUMS = [
        { id: 'mobile', label: 'Mobile App', icon: Smartphone },
        { id: 'web', label: 'Website', icon: Globe },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'sms', label: 'SMS', icon: MessageCircle },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
        { id: 'kiosk', label: 'Kiosk', icon: Tablet },
        { id: 'qr', label: 'QR Code', icon: Target },
        { id: 'social', label: 'Social', icon: Share2 }
    ]

    const handleCreateAI = () => {
        setLoadingAI(true)
        setTimeout(() => {
            setLoadingAI(false)
            updateSurveySettings(selectedMediums, date ? new Date(date) : null, goal)
            if (name) setSurveyName(name)
            closeWizard()
        }, 2000)
    }

    return (
        <div className={TOKENS.modalOverlay}>
            <div className={cn(TOKENS.modalContent, "flex flex-col h-[600px]")}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-6 h-6 bg-emerald-600 text-white text-xs font-bold flex items-center justify-center rounded-none shadow-sm">{step}</span>
                            <span className={TOKENS.label}>Step {step} of 3</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {step === 1 ? 'Select Survey Mediums' : step === 2 ? 'Survey Details' : 'Creation Mode'}
                        </h2>
                    </div>
                    <button onClick={closeWizard}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                </div>
                {/* Simplified content for brevity here, but assuming full implementation logic from previous step is preserved or re-copy pasted if needed. 
                    I will restore the FULL content below to be safe. */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                    {step === 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {MEDIUMS.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedMediums(prev => prev.includes(m.id) ? prev.filter(i => i !== m.id) : [...prev, m.id])}
                                    className={cn(
                                        TOKENS.card,
                                        "p-6 flex flex-col items-center justify-center gap-3 transition-all",
                                        selectedMediums.includes(m.id) ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500" : TOKENS.cardHover
                                    )}
                                >
                                    <m.icon className={cn("w-8 h-8", selectedMediums.includes(m.id) ? "text-emerald-600" : "text-slate-400")} />
                                    <span className={cn("text-xs font-bold uppercase", selectedMediums.includes(m.id) ? "text-emerald-700" : "text-slate-500")}>
                                        {m.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 max-w-lg mx-auto">
                            <div className="space-y-2">
                                <label className={TOKENS.label}>Survey Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} className={TOKENS.input} placeholder="e.g., Q1 Customer Feedback" />
                            </div>
                            <div className="space-y-2">
                                <label className={TOKENS.label}>Schedule Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className={cn(TOKENS.input, "pl-10")} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={TOKENS.label}>Response Goal</label>
                                <div className="relative">
                                    <Target className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input type="number" value={goal} onChange={e => setGoal(parseInt(e.target.value))} className={cn(TOKENS.input, "pl-10")} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div
                                onClick={handleCreateAI}
                                className={cn(TOKENS.card, TOKENS.cardHover, "p-4 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group")}
                            >
                                {loadingAI && (
                                    <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                                        <span className={TOKENS.label}>Generating Structure...</span>
                                    </div>
                                )}
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Assisted</h3>
                                <p className="text-sm text-slate-500 mb-6">Build via chat. Select a template and let AI generate the structure instantly.</p>
                            </div>

                            <button
                                onClick={() => { updateSurveySettings(selectedMediums, date ? new Date(date) : null, goal); if (name) setSurveyName(name); closeWizard() }}
                                className={cn(TOKENS.card, TOKENS.cardHover, "p-4 flex flex-col items-center justify-center text-center group")}
                            >
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Manual Build</h3>
                                <p className="text-sm text-slate-500">Start from scratch.</p>
                            </button>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                    {step > 1 && <button onClick={() => setStep(s => s - 1)} className={TOKENS.btnSecondary + " px-4 py-2"}>Back</button>}
                    {step < 3 && <button onClick={() => setStep(s => s + 1)} className={TOKENS.btnPrimary + " px-4 py-2"}>Next Step</button>}
                </div>
            </div>
        </div>
    )
}

// ============ CHART TYPES FOR ANALYTICS ============

// CHART_TYPES and KPI_OPTIONS removed

// ============ SVG CHART COMPONENTS ============

// Charts removed

// Remaining Charts removed

// MiniHorizontalBars removed

// MiniDonut removed (unused)

// ============ ANALYTICS EDIT POPUP ============

// AnalyticsEditPopup & AIQuickCreatePopup removed (unused)





function OverviewTab() {
    const {
        surveyName, setSurveyName,
        mediums, setMediums,
        scheduledDate, setScheduledDate,
        endDate, setEndDate,
        responseGoal, setResponseGoal,
        region, setRegion,
        demography, setDemography,
        segment, setSegment
    } = useSurvey()

    // Calculate Total Days
    const totalDays = useMemo(() => {
        if (!scheduledDate || !endDate) return 0
        const diff = endDate.getTime() - scheduledDate.getTime()
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }, [scheduledDate, endDate])

    // Mock options
    const REGIONS = ['All Regions', 'North America', 'Europe', 'Asia Pacific', 'Latin America']
    const DEMOGRAPHICS = ['All Demographics', '18-24', '25-34', '35-44', '45+']
    const SEGMENTS = [
        'Buyer Intent', 'Loan Pre-Qual', 'Property Match', 'Site Visit',
        'Loan Experience', 'Post Possession', 'Generic Inquiry', 'Support Request',
        'Feedback', 'Churn Risk', 'Referral', 'Other'
    ]
    const MEDIUM_OPTIONS = [
        { id: 'mobile', label: 'Mobile App', icon: Smartphone },
        { id: 'web', label: 'Website', icon: Globe },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'sms', label: 'SMS', icon: MessageCircle },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
        { id: 'kiosk', label: 'Kiosk', icon: Tablet },
        { id: 'qr', label: 'QR Code', icon: Target },
        { id: 'social', label: 'Social', icon: Share2 }
    ]


    return (
        <div className="w-full mx-auto p-6 pb-20 overflow-y-auto h-full animate-fade-in text-slate-900 dark:text-white">


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* LEFT COLUMN - MAIN SETTINGS */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Section */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-500" />
                            General Information
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={TOKENS.label}>Survey Name</label>
                                <input
                                    type="text"
                                    value={surveyName}
                                    onChange={(e) => setSurveyName(e.target.value)}
                                    className={TOKENS.input + " font-bold text-lg"}
                                    placeholder="Enter survey name..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={TOKENS.label}>Response Goal</label>
                                    <div className="relative">
                                        <Target className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="number"
                                            value={responseGoal}
                                            onChange={(e) => setResponseGoal(parseInt(e.target.value))}
                                            className={TOKENS.input + " pl-10"}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={TOKENS.label}>Total Days (Calc)</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={totalDays > 0 ? `${totalDays} Days` : '-'}
                                            readOnly
                                            className={TOKENS.input + " pl-10 bg-slate-100 dark:bg-slate-800 text-slate-500"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Targeting Section */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Target Audience
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className={TOKENS.label}>Region</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <select
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className={TOKENS.input + " pl-10 appearance-none bg-none"}
                                    >
                                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={TOKENS.label}>Demography</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <select
                                        value={demography}
                                        onChange={(e) => setDemography(e.target.value)}
                                        className={TOKENS.input + " pl-10 appearance-none bg-none"}
                                    >
                                        {DEMOGRAPHICS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className={TOKENS.label}>Customer Segment</label>
                                <div className="relative">
                                    <Target className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <select
                                        value={segment}
                                        onChange={(e) => setSegment(e.target.value)}
                                        className={TOKENS.input + " pl-10 appearance-none bg-none"}
                                    >
                                        {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - MEDIUMS & SCHEDULE */}
                <div className="space-y-8">
                    {/* Launch Schedule */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-500" />
                            Schedule
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={TOKENS.label}>Start Date</label>
                                <input
                                    type="date"
                                    value={scheduledDate ? scheduledDate.toISOString().slice(0, 10) : ''}
                                    onChange={(e) => setScheduledDate(e.target.value ? new Date(e.target.value) : null)}
                                    className={TOKENS.input}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={TOKENS.label}>End Date</label>
                                <input
                                    type="date"
                                    value={endDate ? endDate.toISOString().slice(0, 10) : ''}
                                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                                    className={TOKENS.input}
                                />
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Duration:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{totalDays} Days</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                    <div className="h-full bg-purple-500 w-full" style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mediums */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-orange-500" />
                            Distribution Channels
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {MEDIUM_OPTIONS.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setMediums(mediums.includes(m.id) ? mediums.filter(i => i !== m.id) : [...mediums, m.id])}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 gap-2 transition-all border",
                                        mediums.includes(m.id)
                                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                                            : "bg-slate-50 dark:bg-slate-800 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                                    )}
                                >
                                    <m.icon className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




import { ResponseListView, ListViewResponse } from '../components/ResponseListView'

function ResponsesTab() {
    const { responses } = useSurvey()

    // Transform context responses to ListViewResponse format
    const transformedResponses: ListViewResponse[] = responses.map(r => ({
        id: r.id,
        respondent: r.user,
        phone: '+91 98765 43210', // Mock
        location: 'Mumbai, MH', // Mock
        agent: 'System', // Mock
        date: r.submittedAt,
        time: '10:00 AM', // Mock
        nps: Math.floor(Math.random() * 10) + 1, // Mock
        status: 'complete',
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
        channel: 'Mobile App', // Mock
        duration: r.completionTime,
        flagged: false, // Mock
        device: 'iPhone 14', // Mock
        os: 'iOS 17', // Mock
        source: 'Organic' // Mock
    }))

    return (
        <div className="h-full bg-slate-50 dark:bg-slate-950">
            <ResponseListView data={transformedResponses} />
        </div>
    )
}

// SettingsTab moved to ./views/SettingsTab.tsx

// ============ AI COPILOT COMPONENT (FIXED BOTTOM) ============

// ============ AI COPILOT COMPONENT (FIXED BOTTOM) ============

function AICopilot() {
    const {
        aiDrawerOpen, toggleAIDrawer, chatMessages, sendMessage, sendAIMessage,
        setActiveTab, setBuilderView, addQuestion, updateQuestion, deleteQuestion,
        selectQuestion, selectedQuestionId, setSurveyName, setResponseGoal
    } = useSurvey()
    const [input, setInput] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeView, setActiveView] = useState<'chat' | 'suggestions' | 'insights' | 'history'>('chat')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-scroll
    useEffect(() => {
        if (isExpanded && activeView === 'chat') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chatMessages, isExpanded, activeView])

    // AI Command Processor
    const processSurveyCommand = async (command: string) => {
        const lowerCmd = command.toLowerCase()
        let response = "I'm not sure how to do that yet. Try 'Go to analytics' or 'Add a question'."

        // 1. NAVIGATION
        if (lowerCmd.match(/go to|open|show|view/)) {
            if (lowerCmd.includes('analytics') || lowerCmd.includes('stats') || lowerCmd.includes('charts')) {
                setActiveTab('analytics')
                return "Navigating to Analytics tab."
            }
            if (lowerCmd.includes('flowchart') || lowerCmd.includes('graph')) {
                setActiveTab('builder')
                setBuilderView('flowchart')
                return "Switching to Flowchart view."
            }
            if (lowerCmd.includes('settings') || lowerCmd.includes('config')) {
                setActiveTab('settings')
                return "Opening Survey Settings."
            }
            if (lowerCmd.includes('hypotheses') || lowerCmd.includes('insights')) {
                setActiveTab('hypotheses')
                return "Showing Hypotheses."
            }
        }

        // 2. EDITING - ADD QUESTION
        if (lowerCmd.match(/add|create|new/) && lowerCmd.includes('question')) {
            const newId = addQuestion(selectedQuestionId) // Add as child if something selected, else root

            // Try to infer type
            if (lowerCmd.includes('dating') || lowerCmd.includes('date')) updateQuestion(newId, { type: 'date', text: 'Select a date' })
            else if (lowerCmd.includes('rating') || lowerCmd.includes('star')) updateQuestion(newId, { type: 'rating', text: 'Rate your experience' })
            else if (lowerCmd.includes('text') || lowerCmd.includes('input')) updateQuestion(newId, { type: 'text', text: 'Your answer' })
            else if (lowerCmd.includes('choice') || lowerCmd.includes('mcq')) updateQuestion(newId, { type: 'mcq', text: 'Select an option' })

            // Try to infer text: "add question about budget"
            const aboutMatch = lowerCmd.match(/about (.+)/)
            if (aboutMatch && aboutMatch[1]) {
                updateQuestion(newId, { text: aboutMatch[1].charAt(0).toUpperCase() + aboutMatch[1].slice(1) + '?' })
            }

            selectQuestion(newId)
            return "Added a new question. You can edit it now."
        }

        // 3. EDITING - DELETE
        if ((lowerCmd.includes('delete') || lowerCmd.includes('remove')) && (lowerCmd.includes('this') || lowerCmd.includes('current') || lowerCmd.includes('question'))) {
            if (selectedQuestionId) {
                deleteQuestion(selectedQuestionId)
                selectQuestion(null)
                return "Question deleted."
            } else {
                return "Please select a question to delete first."
            }
        }

        // 4. SETTINGS - RENAME
        if (lowerCmd.includes('rename') || (lowerCmd.includes('change') && lowerCmd.includes('name'))) {
            const nameMatch = command.match(/to\s+(.+)/i)
            if (nameMatch && nameMatch[1]) {
                setSurveyName(nameMatch[1].trim())
                return `Renamed survey to "${nameMatch[1].trim()}".`
            }
        }

        // 5. SETTINGS - GOAL
        if (lowerCmd.includes('target') || lowerCmd.includes('goal')) {
            const numMatch = lowerCmd.match(/\d+/)
            if (numMatch) {
                const goal = parseInt(numMatch[0])
                setResponseGoal(goal)
                return `Set response goal to ${goal}.`
            }
        }

        return response
    }

    const handleSend = async () => {
        if (!input.trim()) return

        // 1. User Message (Skip auto reply)
        sendMessage(input, true)
        const currentInput = input
        setInput('')
        if (!isExpanded) setIsExpanded(true)
        setActiveView('chat')

        // 2. Process Command
        const aiResponse = await processSurveyCommand(currentInput)

        // 3. AI Response
        setTimeout(() => {
            sendAIMessage(aiResponse)
        }, 600)
    }

    if (!aiDrawerOpen) return (
        <button
            onClick={toggleAIDrawer}
            className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 dark:bg-black text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center hover:scale-110 transition-all duration-300 rounded-full z-50 group border border-white/10"
            title="Open AI Assistant"
        >
            <div className="relative">
                <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />
            </div>
        </button>
    )

    return (
        <>
            {/* Backdrop for Expanded Mode */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[90] transition-all duration-500"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {/* Main Floating Container - Centered */}
            <div className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-4 flex flex-col items-center pointer-events-none transition-all duration-500 ease-out",
                isExpanded ? "translate-y-0" : "translate-y-0" // Always keep input visible
            )}>

                {/* 1. Main Panel (Slides Up) */}
                <div className={cn(
                    "w-full bg-white dark:bg-slate-900 shadow-2xl rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-auto mb-2 origin-bottom",
                    isExpanded ? "h-[650px] opacity-100 scale-100" : "h-0 opacity-0 scale-95"
                )}>
                    {/* Dark Header */}
                    <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/10 rounded-sm backdrop-blur-sm border border-white/10">
                                <Bot className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base tracking-wide flex items-center gap-2">
                                    AI Survey Assistant
                                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-sm border border-emerald-500/30 uppercase font-bold tracking-wider">Beta</span>
                                </h2>
                                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Active
                                    </span>
                                    <span>•</span>
                                    <span>v2.4.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-2 hover:bg-white/10 rounded-sm transition-colors text-slate-400 hover:text-white"
                                title="Minimize"
                            >
                                <Minimize2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={toggleAIDrawer}
                                className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-sm transition-colors text-slate-400"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="h-[calc(100%-80px)] bg-slate-50 dark:bg-black/20 overflow-hidden relative">
                        {/* CHAT VIEW */}
                        <div className="h-full overflow-y-auto p-6 space-y-6 scroll-smooth">
                            {chatMessages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up">
                                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-sm flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                                        <Sparkles className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Hello, Survey Master!</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                                        I'm here to help you craft the perfect survey. Try asking: <br />
                                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium select-all cursor-pointer hover:underline" onClick={() => setInput("Add a logic rule for budget")}>"Add a logic rule for budget"</span>
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
                                        {["Analyze drop-off risk", "Suggest 3 follow-ups", "Rephrase for clarity", "Translate to Hindi"].map(action => (
                                            <button
                                                key={action}
                                                onClick={() => { setInput(action); handleSend() }}
                                                className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm hover:border-emerald-500 hover:text-emerald-600 hover:shadow-lg hover:-translate-y-1 transition-all text-left flex items-center justify-between group"
                                            >
                                                {action}
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {chatMessages.map((msg, idx) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={cn("flex gap-4 group", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 shadow-md border border-white/20",
                                                msg.role === 'user'
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-emerald-500 text-white"
                                            )}>
                                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                            </div>
                                            <div className={cn(
                                                "max-w-[75%] p-5 text-sm shadow-sm border",
                                                msg.role === 'user'
                                                    ? "bg-blue-600 text-white border-blue-500 rounded-sm rounded-tr-none"
                                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 rounded-sm rounded-tl-none"
                                            )}>
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                                    {msg.content}
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] opacity-60 block mt-2 text-right font-medium",
                                                    msg.role === 'user' ? "text-blue-100" : "text-slate-400"
                                                )}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>


                {/* 2. Floating Input Bar (Always Visible Control) */}
                <div className="w-full pointer-events-auto group">
                    <div className={cn(
                        "relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-black/5 dark:border-white/10 p-2 flex items-center gap-3 transform transition-all duration-300",
                        isExpanded ? "scale-100" : "scale-[0.98] hover:scale-100"
                    )}>
                        <div
                            className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center cursor-pointer hover:rotate-3 transition-transform active:scale-95 shadow-md"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <Sparkles className="w-6 h-6 text-emerald-400 dark:text-slate-900" />
                        </div>

                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            onFocus={() => setIsExpanded(true)}
                            placeholder="Ask AI to add a question, change logic, or style..."
                            className="flex-1 bg-transparent border-none outline-none focus:ring-0 ring-0 text-base font-medium text-slate-800 dark:text-white px-2 placeholder:text-slate-400"
                        />

                        {input.length > 0 ? (
                            <motion.button
                                onClick={handleSend}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center"
                            >
                                <Send className="w-5 h-5" />
                            </motion.button>
                        ) : (
                            <div className="flex items-center gap-1 pr-2">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors" title="Voice Input">
                                    <Mic className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors" title="Attach Context">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export function SurveyBuilderPage() {
    return (
        <SurveyProvider>
            <SurveyBuilderProvider>
                <SurveyBuilderContent />
            </SurveyBuilderProvider>
        </SurveyProvider>
    )
}

export default SurveyBuilderPage
