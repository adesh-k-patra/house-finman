import { useState, createContext, useContext, ReactNode } from 'react'
import { cn } from '@/utils'

// ============ TYPES ============

export type BuilderMode = 'builder' | 'logic' | 'ai'
export type SurveyStatus = 'draft' | 'published' | 'active' | 'ended'
export type QuestionType = 'mcq' | 'text' | 'rating' | 'scale' | 'yes_no' | 'nps' | 'date' | 'file' | 'dropdown'

export interface QuestionOption {
    id: string
    text: string
    nextQuestionId?: string
    score?: number
}

export interface Question {
    id: string
    type: QuestionType
    text: string
    required: boolean
    options: QuestionOption[]
    parentId?: string
    parentOptionId?: string
    level: number
}

export interface ActivityEntry {
    id: string
    action: string
    actor: string
    timestamp: Date
    type: 'create' | 'update' | 'delete' | 'ai'
}

export interface HealthItem {
    id: string
    type: 'warning' | 'success' | 'error'
    message: string
    action?: string
}

export interface SurveyBuilderState {
    // Core
    surveyName: string
    surveyStatus: SurveyStatus
    builderMode: BuilderMode

    // Questions
    questions: Question[]
    selectedQuestionId: string | null

    // Metrics
    completionRate: number
    estimatedTime: string
    qualityScore: number

    // Activity & Health
    activityLog: ActivityEntry[]
    healthChecks: HealthItem[]

    // UI State
    intelligencePanelOpen: boolean
    isDirty: boolean

    // Actions
    setBuilderMode: (mode: BuilderMode) => void
    setSurveyName: (name: string) => void
    addQuestion: (question: Omit<Question, 'id' | 'level'>, parentId?: string, parentOptionId?: string) => void
    updateQuestion: (id: string, updates: Partial<Question>) => void
    deleteQuestion: (id: string) => void
    selectQuestion: (id: string | null) => void
    addOption: (questionId: string, option: Omit<QuestionOption, 'id'>) => void
    toggleIntelligencePanel: () => void
    addActivityEntry: (action: string, actor: string, type: ActivityEntry['type']) => void
}

// ============ CONTEXT ============

const SurveyBuilderContext = createContext<SurveyBuilderState | null>(null)

export function useSurveyBuilder() {
    const context = useContext(SurveyBuilderContext)
    if (!context) throw new Error('useSurveyBuilder must be used within SurveyBuilderProvider')
    return context
}

// ============ DUMMY DATA ============

const dummyQuestions: Question[] = [
    {
        id: 'q1',
        type: 'mcq',
        text: 'How satisfied are you?',
        required: true,
        level: 0,
        options: [
            { id: 'q1-o1', text: 'Very Satisfied', nextQuestionId: 'q2' },
            { id: 'q1-o2', text: 'Satisfied' },
            { id: 'q1-o3', text: 'Neutral' }
        ]
    },
    {
        id: 'q2',
        type: 'mcq',
        text: 'Follow-up to Very Satisfied',
        required: false,
        level: 1,
        parentId: 'q1',
        parentOptionId: 'q1-o1',
        options: [
            { id: 'q2-o1', text: 'Option A', nextQuestionId: 'q3' },
            { id: 'q2-o2', text: 'Option B' }
        ]
    },
    {
        id: 'q3',
        type: 'mcq',
        text: 'Follow-up to Option A',
        required: false,
        level: 2,
        parentId: 'q2',
        parentOptionId: 'q2-o1',
        options: [
            { id: 'q3-o1', text: 'Option A' },
            { id: 'q3-o2', text: 'Option B' }
        ]
    },
    {
        id: 'q4',
        type: 'text',
        text: 'Any feedback?',
        required: false,
        level: 0,
        options: []
    },
    {
        id: 'q5',
        type: 'mcq',
        text: 'Enter question text...',
        required: false,
        level: 0,
        options: [
            { id: 'q5-o1', text: 'Option 1' },
            { id: 'q5-o2', text: 'Option 2' }
        ]
    }
]

const dummyActivity: ActivityEntry[] = [
    { id: 'a1', action: 'Added Q4 (Draft)', actor: 'You', timestamp: new Date(), type: 'create' },
    { id: 'a2', action: 'Updated Logic Flow', actor: 'AI Assistant', timestamp: new Date(Date.now() - 600000), type: 'ai' },
    { id: 'a3', action: 'Created Survey', actor: 'System', timestamp: new Date(Date.now() - 3600000), type: 'create' }
]

const dummyHealth: HealthItem[] = [
    { id: 'h1', type: 'warning', message: 'Survey has no dedicated Exit Screen. Participants may loop.', action: 'Edit Screen' }
]

// ============ PROVIDER ============

export function SurveyBuilderProvider({ children }: { children: ReactNode }) {
    const [surveyName, setSurveyName] = useState('New Survey')
    const [surveyStatus, setSurveyStatus] = useState<SurveyStatus>('draft')
    const [builderMode, setBuilderMode] = useState<BuilderMode>('logic')
    const [questions, setQuestions] = useState<Question[]>(dummyQuestions)
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
    const [intelligencePanelOpen, setIntelligencePanelOpen] = useState(true)
    const [activityLog, setActivityLog] = useState<ActivityEntry[]>(dummyActivity)
    const [healthChecks] = useState<HealthItem[]>(dummyHealth)
    const [isDirty, setIsDirty] = useState(false)

    const addQuestion = (question: Omit<Question, 'id' | 'level'>, parentId?: string, parentOptionId?: string) => {
        const id = `q${Date.now()}`
        const level = parentId ? (questions.find(q => q.id === parentId)?.level ?? 0) + 1 : 0
        setQuestions(prev => [...prev, { ...question, id, level, parentId, parentOptionId }])
        setIsDirty(true)
    }

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q))
        setIsDirty(true)
    }

    const deleteQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id && q.parentId !== id))
        setIsDirty(true)
    }

    const addOption = (questionId: string, option: Omit<QuestionOption, 'id'>) => {
        const id = `opt${Date.now()}`
        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? { ...q, options: [...q.options, { ...option, id }] }
                : q
        ))
        setIsDirty(true)
    }

    const addActivityEntry = (action: string, actor: string, type: ActivityEntry['type']) => {
        setActivityLog(prev => [{ id: `a${Date.now()}`, action, actor, timestamp: new Date(), type }, ...prev])
    }

    const value: SurveyBuilderState = {
        surveyName,
        surveyStatus,
        builderMode,
        questions,
        selectedQuestionId,
        completionRate: 85,
        estimatedTime: '2m 00s',
        qualityScore: 9.8,
        activityLog,
        healthChecks,
        intelligencePanelOpen,
        isDirty,
        setBuilderMode,
        setSurveyName,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        selectQuestion: setSelectedQuestionId,
        addOption,
        toggleIntelligencePanel: () => setIntelligencePanelOpen(prev => !prev),
        addActivityEntry
    }

    return (
        <SurveyBuilderContext.Provider value={value}>
            {children}
        </SurveyBuilderContext.Provider>
    )
}

import { MobileSimulator } from './components/MobileSimulator'

// ============ MAIN PAGE ============

export function SurveyBuilderPageNew() {
    return (
        <SurveyBuilderProvider>
            <SurveyBuilderLayout />
            <MobileSimulator />
        </SurveyBuilderProvider>
    )
}

function SurveyBuilderLayout() {
    const { intelligencePanelOpen } = useSurveyBuilder()

    return (
        <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
            {/* Header */}
            <SurveyBuilderHeader />

            {/* Content Area */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Main Canvas */}
                <div className={cn(
                    "flex-1 min-w-0 transition-all duration-300",
                    intelligencePanelOpen ? "mr-0" : ""
                )}>
                    <SurveyCanvas />
                </div>

                {/* Intelligence Panel */}
                <IntelligencePanel />
            </div>
        </div>
    )
}

// ============ HEADER ============

function SurveyBuilderHeader() {
    const { surveyName, setSurveyName, builderMode, setBuilderMode, openSimulator } = useSurveyBuilder()
    const [isEditing, setIsEditing] = useState(false)

    return (
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
            {/* Left: Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <button className="p-1.5 hover:bg-slate-100 rounded transition-colors">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="text-slate-400">SURVEYS</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-400">CREATE</span>
                <span className="text-slate-300">/</span>
                {isEditing ? (
                    <input
                        autoFocus
                        value={surveyName}
                        onChange={(e) => setSurveyName(e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                        className="font-semibold text-slate-900 bg-transparent border-b-2 border-blue-500 outline-none px-1"
                    />
                ) : (
                    <span
                        className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                        onClick={() => setIsEditing(true)}
                    >
                        {surveyName}
                    </span>
                )}
            </div>

            {/* Center: Mode Tabs */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                {(['builder', 'logic', 'ai'] as BuilderMode[]).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setBuilderMode(mode)}
                        className={cn(
                            "px-4 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-md transition-all",
                            builderMode === mode
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {mode === 'ai' && <span className="mr-1">✨</span>}
                        {mode.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Undo/Redo */}
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                </button>

                <div className="w-px h-6 bg-slate-200 mx-1" />

                {/* Draft Button */}
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Draft
                </button>

                {/* Preview Button */}
                <button
                    onClick={openSimulator}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Run Prototype
                </button>

                {/* Publish Button */}
                <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    PUBLISH
                </button>
            </div>
        </header>
    )
}

// ============ CANVAS ============

function SurveyCanvas() {
    const { builderMode, questions } = useSurveyBuilder()

    if (builderMode === 'builder') {
        return <BuilderModeCanvas />
    }

    if (builderMode === 'ai') {
        return <AIModeCanvas />
    }

    // Default: Logic Mode (Flowchart)
    return <LogicModeCanvas />
}

function LogicModeCanvas() {
    const { questions } = useSurveyBuilder()
    const [zoom, setZoom] = useState(1)

    // Group questions by level
    const level0 = questions.filter(q => q.level === 0)
    const level1 = questions.filter(q => q.level === 1)
    const level2 = questions.filter(q => q.level === 2)

    return (
        <div
            className="h-full overflow-auto"
            style={{
                backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}
        >
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
                <button
                    onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                    className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                >
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <span className="text-xs text-slate-500 px-2">{Math.round(zoom * 100)}%</span>
                <button
                    onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                    className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                >
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Flowchart Content */}
            <div
                className="p-8 min-h-full"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            >
                <div className="flex gap-8 items-start">
                    {/* Level 0 */}
                    <div className="flex flex-col gap-4">
                        {level0.map(q => (
                            <QuestionNode key={q.id} question={q} />
                        ))}
                    </div>

                    {/* Level 1 */}
                    {level1.length > 0 && (
                        <div className="flex flex-col gap-4 mt-12">
                            {level1.map(q => (
                                <QuestionNode key={q.id} question={q} isChild />
                            ))}
                        </div>
                    )}

                    {/* Level 2 */}
                    {level2.length > 0 && (
                        <div className="flex flex-col gap-4 mt-24">
                            {level2.map(q => (
                                <QuestionNode key={q.id} question={q} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ============ QUESTION NODE ============

interface QuestionNodeProps {
    question: Question
    isChild?: boolean
}

function QuestionNode({ question, isChild }: QuestionNodeProps) {
    const { selectQuestion, selectedQuestionId } = useSurveyBuilder()
    const isSelected = selectedQuestionId === question.id
    const hasChildren = question.options.some(o => o.nextQuestionId)

    return (
        <div
            className={cn(
                "bg-white rounded-lg border shadow-sm transition-all cursor-pointer group",
                isChild
                    ? "border-blue-500 shadow-blue-100"
                    : "border-slate-200 hover:border-slate-300",
                isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            onClick={() => selectQuestion(question.id)}
            style={{ width: isChild ? 220 : 200 }}
        >
            {/* Header */}
            <div className={cn(
                "px-3 py-2 flex items-center justify-between border-b",
                isChild ? "bg-blue-500 text-white border-blue-400" : "bg-white text-slate-600 border-slate-100"
            )}>
                <div className="flex items-center gap-2">
                    <span className="cursor-grab">⋮⋮</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {question.type.toUpperCase()}
                    </span>
                </div>
                <button className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    isChild ? "text-white/70 hover:text-white" : "text-slate-400 hover:text-slate-600"
                )}>
                    ×
                </button>
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">{question.text}</h3>

                {/* Options */}
                {question.options.length > 0 && (
                    <div className="space-y-2">
                        {question.options.map((opt) => (
                            <div
                                key={opt.id}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 bg-slate-50 rounded text-sm text-slate-600",
                                    opt.nextQuestionId && "border-r-2 border-blue-500"
                                )}
                            >
                                <span>{opt.text}</span>
                                {opt.nextQuestionId && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ============ BUILDER MODE ============

function BuilderModeCanvas() {
    const { questions } = useSurveyBuilder()
    const rootQuestions = questions.filter(q => q.level === 0)

    return (
        <div className="h-full overflow-auto p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">STRUCTURE</h1>
                    <p className="text-slate-500">Manage question flow and logic</p>
                    <span className="text-sm text-slate-400 float-right -mt-6">{questions.length} QUESTIONS</span>
                </div>

                {/* Question Blocks */}
                <div className="space-y-4">
                    {rootQuestions.map((q, i) => (
                        <BuilderQuestionBlock key={q.id} question={q} index={i} />
                    ))}
                </div>

                {/* Add Button */}
                <button className="w-full mt-6 py-4 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                    <span className="text-lg">+</span>
                    ADD QUESTION BLOCK
                </button>
            </div>
        </div>
    )
}

interface BuilderQuestionBlockProps {
    question: Question
    index: number
}

function BuilderQuestionBlock({ question, index }: BuilderQuestionBlockProps) {
    const [isExpanded, setIsExpanded] = useState(index === 0)

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            {/* Collapsed Header */}
            <div
                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <span className="cursor-grab text-slate-400">⋮⋮</span>
                    <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">{question.type}</span>
                        {question.required && <span className="text-[10px] font-bold text-red-500 ml-2">* REQUIRED</span>}
                        <h3 className="text-sm font-medium text-slate-800">{question.text}</h3>
                    </div>
                </div>
                <svg
                    className={cn("w-5 h-5 text-slate-400 transition-transform", isExpanded && "rotate-180")}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                    {/* Question Text */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Question Text</label>
                        <input
                            type="text"
                            value={question.text}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Configuration */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Configuration</label>
                            <div className="space-y-2">
                                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                                    <option>Multiple Choice</option>
                                    <option>Text</option>
                                    <option>Rating</option>
                                    <option>Scale</option>
                                </select>
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input type="checkbox" checked={question.required} className="rounded" />
                                    Required Response
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input type="checkbox" className="rounded" />
                                    Randomize Options
                                </label>
                            </div>
                        </div>

                        {/* Answer Options */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-slate-500 uppercase">Answer Options</label>
                                <button className="text-xs text-blue-600 font-medium">BULK ADD</button>
                            </div>
                            <div className="space-y-2">
                                {question.options.map(opt => (
                                    <label key={opt.id} className="flex items-center gap-2 text-sm text-slate-600">
                                        <input type="radio" name={`q${question.id}`} className="text-blue-600" />
                                        {opt.text}
                                    </label>
                                ))}
                                <button className="text-sm text-blue-600 font-medium">+ Add Option</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ============ AI MODE ============

function AIModeCanvas() {
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✨</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">AI Survey Builder</h2>
                <p className="text-slate-500 mb-6">Describe your survey and let AI create it for you</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {['Buyer Intent', 'Loan Prequal', 'Flat Discovery', 'Site Visit Feedback'].map(template => (
                        <button
                            key={template}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                        >
                            {template}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ============ INTELLIGENCE PANEL ============

function IntelligencePanel() {
    const { intelligencePanelOpen, toggleIntelligencePanel, completionRate, estimatedTime, qualityScore, activityLog, healthChecks } = useSurveyBuilder()

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={toggleIntelligencePanel}
                className={cn(
                    "absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-white border border-slate-200 shadow-sm transition-all",
                    intelligencePanelOpen ? "rounded-l-lg border-r-0" : "rounded-l-lg"
                )}
                style={{ right: intelligencePanelOpen ? 280 : 0 }}
            >
                <svg
                    className={cn("w-4 h-4 text-slate-500 transition-transform", !intelligencePanelOpen && "rotate-180")}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Panel */}
            <div className={cn(
                "w-[280px] bg-white border-l border-slate-200 flex-shrink-0 overflow-y-auto transition-all duration-300",
                intelligencePanelOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Intelligence</h2>
                </div>

                {/* Projected Metrics */}
                <div className="p-4 border-b border-slate-100">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Projected Metrics</h3>

                    {/* Completion Rate */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
                        <div className="text-xs text-emerald-600 font-medium uppercase">Completion Rate</div>
                        <div className="text-2xl font-bold text-emerald-700">{completionRate}%</div>
                        <div className="text-xs text-emerald-600">High engagement</div>
                    </div>

                    {/* Est Time */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <div className="text-xs text-blue-600 font-medium uppercase">Est. Time</div>
                        <div className="text-2xl font-bold text-blue-700">{estimatedTime}</div>
                        <div className="text-xs text-blue-600">Optimal for mobile</div>
                    </div>

                    {/* Quality Score */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <div className="text-xs text-emerald-600 font-medium uppercase">Quality Score</div>
                        <div className="text-2xl font-bold text-emerald-700">{qualityScore}/10</div>
                        <div className="text-xs text-emerald-600">Excellent structure</div>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="p-4 border-b border-slate-100">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Activity Log</h3>
                    <div className="space-y-3">
                        {activityLog.slice(0, 4).map((entry, i) => (
                            <div key={entry.id} className="flex items-start gap-3">
                                <div className={cn(
                                    "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                                    i === 0 ? "bg-blue-500" : "bg-slate-300"
                                )} />
                                <div>
                                    <div className="text-sm font-medium text-slate-700">{entry.action}</div>
                                    <div className="text-xs text-slate-400">
                                        {i === 0 ? 'Just now' : i === 1 ? '10m ago' : '1h ago'} • {entry.actor}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Health Check */}
                <div className="p-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Health Check</h3>
                    {healthChecks.map(check => (
                        <div
                            key={check.id}
                            className={cn(
                                "p-3 rounded-lg border",
                                check.type === 'warning' && "bg-orange-50 border-orange-200",
                                check.type === 'error' && "bg-red-50 border-red-200",
                                check.type === 'success' && "bg-emerald-50 border-emerald-200"
                            )}
                        >
                            <div className="flex items-start gap-2">
                                <span className={cn(
                                    "text-xs font-bold uppercase",
                                    check.type === 'warning' && "text-orange-600",
                                    check.type === 'error' && "text-red-600",
                                    check.type === 'success' && "text-emerald-600"
                                )}>
                                    ⚠ {check.type.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{check.message}</p>
                            {check.action && (
                                <button className="text-xs text-blue-600 font-medium mt-2 underline">
                                    {check.action}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SurveyBuilderPageNew
