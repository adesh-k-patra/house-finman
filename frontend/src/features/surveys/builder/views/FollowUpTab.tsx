
import { useSurveyBuilder, Question, QuestionType } from '../contexts/SurveyBuilderContext'
import { QuestionDrawer } from '../components/QuestionDrawer'
import { cn } from '@/utils'
import {
    MoreVertical, GitBranch, List, Plus, Edit2, Trash2, Copy, AlertTriangle, ChevronRight, ChevronDown,
    X, ArrowRight, LayoutGrid, ZoomIn, ZoomOut, Play, CheckCircle, Info, Split, Merge,
    RotateCcw, Settings, Layout, Link2, GripVertical, CornerDownRight, Check, Search
} from 'lucide-react'
import { BranchOverview } from './BranchOverview'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ============ TYPES ============

// Define ViewType locally to ensure it matches usage
export type ViewType = 'qa_list' | 'flowchart' | 'logic_map'

// ============ TOKENS ============

const TOKENS = {
    card: "bg-white border rounded-none shadow-sm transition-all relative group",
    cardHeader: "px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-900 text-white",
    cardBody: "p-4 bg-white",
    cardFooter: "px-4 py-3 bg-slate-50 border-t border-slate-100",
    btn: "px-4 py-2 text-sm font-medium rounded-none transition-colors",
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20",
    btnSecondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    btnDanger: "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100",
    label: "text-[10px] font-bold uppercase tracking-widest text-slate-400",
    input: "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all",
    popover: "absolute z-50 bg-white border border-slate-200 shadow-xl rounded-none min-w-[200px]"
}

// ============ BRANCH ACTION MENU ============

export interface BranchMenuState {
    isOpen: boolean
    questionId: string | null
    optionId: string | null  // If null, it's a default branch
    position: { x: number; y: number }
}

function BranchActionMenu({
    state,
    onClose,
    onConnect,
    onCreate,
    onModify,
    onDelete,
    hasExistingBranch
}: {
    state: BranchMenuState
    onClose: () => void
    onConnect: () => void
    onCreate: () => void
    onModify: () => void
    onDelete: () => void
    hasExistingBranch: boolean
}) {
    if (!state.isOpen) return null

    return createPortal(
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[9998]" onClick={onClose} />

            {/* Menu */}
            <div
                className="absolute z-[9999] bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-none ring-1 ring-slate-900/5 min-w-[280px] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                style={{
                    position: 'fixed',
                    left: state.position.x,
                    top: state.position.y,
                }}
            >
                {/* Header */}
                <div className="px-5 py-3 bg-slate-900 border-b border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 block">Branch Actions</span>
                    {state.optionId ? (
                        <p className="text-xs text-slate-400 mt-0.5">For Option Logic</p>
                    ) : (
                        <p className="text-xs text-slate-400 mt-0.5">For Default Flow</p>
                    )}
                </div>

                <div className="p-3 flex flex-col gap-2">
                    {!hasExistingBranch ? (
                        <>
                            <button
                                onClick={onConnect}
                                className="group w-full px-3 py-3 rounded-none border border-slate-200 bg-white hover:border-blue-500/30 hover:bg-blue-50/50 hover:shadow-md hover:shadow-blue-500/10 flex items-center gap-3 transition-all duration-200 text-left"
                            >
                                <div className="w-8 h-8 rounded-none bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                                    <Link2 className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 block">Connect Existing</span>
                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Link to Question</span>
                                </div>
                            </button>
                            <button
                                onClick={onCreate}
                                className="group w-full px-3 py-3 rounded-none border border-slate-200 bg-white hover:border-emerald-500/30 hover:bg-emerald-50/50 hover:shadow-md hover:shadow-emerald-500/10 flex items-center gap-3 transition-all duration-200 text-left"
                            >
                                <div className="w-8 h-8 rounded-none bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                                    <Plus className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 block">Create New</span>
                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Add Follow-up</span>
                                </div>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onModify}
                                className="group w-full px-3 py-3 rounded-none border border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 hover:shadow-md flex items-center gap-3 transition-all duration-200 text-left"
                            >
                                <div className="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:bg-white group-hover:scale-110 transition-transform">
                                    <Settings className="w-4 h-4 text-slate-600" />
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 block">Modify Branch</span>
                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Edit Logic</span>
                                </div>
                            </button>
                            <button
                                onClick={onDelete}
                                className="group w-full px-3 py-3 rounded-none border border-slate-200 bg-white hover:border-red-200 hover:bg-red-50 hover:shadow-md hover:shadow-red-500/10 flex items-center gap-3 transition-all duration-200 text-left"
                            >
                                <div className="w-8 h-8 rounded-none bg-red-50 flex items-center justify-center border border-red-100 group-hover:bg-white group-hover:scale-110 transition-transform">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-red-700 block">Delete Branch</span>
                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Remove Connection</span>
                                </div>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>,
        document.body
    )
}

// ============ CONNECT EXISTING MODAL ============

function ConnectExistingModal({
    isOpen,
    onClose,
    onSelect,
    questions,
    sourceQuestionId
}: {
    isOpen: boolean
    onClose: () => void
    onSelect: (targetId: string) => void
    questions: Question[]
    sourceQuestionId: string | null
}) {
    const [searchTerm, setSearchTerm] = useState('')

    if (!isOpen) return null

    // Filter questions: exclude source question and its children (to prevent cycles - simple check)
    // For now, just exclude source question itself.
    const filteredQuestions = questions.filter(q =>
        q.id !== sourceQuestionId &&
        (q.text.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return createPortal(
        <>
            <div className="fixed inset-0 z-[10000] bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] w-full max-w-md bg-white shadow-2xl border border-slate-200 rounded-none p-0 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-none bg-blue-50 flex items-center justify-center border border-blue-100">
                            <Link2 className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">Connect to Question</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Link this branch to an existing question</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={TOKENS.input + " pl-9"}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map(q => (
                            <button
                                key={q.id}
                                onClick={() => onSelect(q.id)}
                                className="w-full text-left p-3 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group flex items-start gap-3"
                            >
                                <div className="mt-0.5 w-6 h-6 rounded-none bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100">
                                    {q.order + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 line-clamp-2">{q.text}</p>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wide mt-1 inline-block">{q.type.replace('_', ' ')}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all self-center" />
                            </button>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            <p className="text-sm">No matching questions found.</p>
                        </div>
                    )}
                </div>
            </div>
        </>,
        document.body
    )
}

// ============ SORTABLE QUESTION CARD ============

function SortableQuestionCard({ question, onEdit, onDelete, onOptionBranch, onQuestionBranch }: {
    question: Question
    onEdit: () => void
    onDelete: () => void
    onOptionBranch: (e: React.MouseEvent, optionId: string) => void
    onQuestionBranch: (e: React.MouseEvent) => void
}) {
    const { questions } = useSurveyBuilder()
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }

    // Derive children from flat list
    const children = questions.filter(q => q.parentId === question.id)
    const hasChildren = children.length > 0
    const [expanded, setExpanded] = useState(true)

    // Helper: Logic check
    const hasBranchForOption = (optId: string) => {
        return (question.logic || []).some(l => l.triggerOptionId === optId)
    }

    // Find parent context for follow-up badge
    const parentQuestion = question.parentId ? questions.find(q => q.id === question.parentId) : null
    const triggeringAnswer = parentQuestion
        ? (() => {
            const rule = parentQuestion.logic?.find(l => l.targetQuestionId === question.id)
            if (rule) {
                const opt = parentQuestion.options.find(o => o.id === rule.triggerOptionId)
                return opt?.text || null
            }
            return parentQuestion.nextQuestionId === question.id ? 'Default Flow' : null
        })()
        : null


    const isFollowUp = question.level > 0 || !!question.parentId
    const typeLabel = question.type.replace('_', ' ')
    const hasDefaultBranch = !!question.nextQuestionId
    const hasBranches = (question.logic && question.logic.length > 0) || hasDefaultBranch

    // Level-based accent colors
    const accentColors = [
        '', // level 0 - no accent
        'border-l-4 border-l-emerald-500',
        'border-l-4 border-l-violet-500',
        'border-l-4 border-l-amber-500',
        'border-l-4 border-l-cyan-500',
    ]
    const accentClass = accentColors[Math.min(question.level, accentColors.length - 1)] || accentColors[1]

    return (
        <div ref={setNodeRef} style={style} className={cn("group mb-3 relative", isFollowUp ? 'ml-10' : 'ml-8')}>
            {/* Connector Line for Tree */}
            {isFollowUp && (
                <>
                    <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-300 to-emerald-100"></div>
                    <div className="absolute -left-8 top-7 w-8 h-px bg-emerald-300"></div>
                    <div className="absolute -left-[33px] top-[24px] w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm z-10"></div>
                </>
            )}

            <div className={cn(
                "bg-white border shadow-sm hover:shadow-md transition-all rounded-none overflow-hidden",
                isFollowUp ? cn('border-slate-200', accentClass) : 'border-slate-200'
            )}>
                {/* Follow-up Scope Badge */}
                {isFollowUp && parentQuestion && (
                    <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                triggeringAnswer
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                            )}>
                                {triggeringAnswer ? "Per-Answer Follow-up" : "Global Follow-up"}
                            </span>
                            <span className="text-slate-300">|</span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 min-w-0">
                                <span className="truncate font-medium text-slate-500 max-w-[150px]" title={parentQuestion.text}>
                                    {parentQuestion.text}
                                </span>
                                {triggeringAnswer && (
                                    <>
                                        <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[10px] font-bold border border-amber-200 truncate flex-shrink-0 max-w-[120px]" title={triggeringAnswer}>
                                            "{triggeringAnswer}"
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => onEdit()}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                        >
                            <Settings className="w-3 h-3" />
                            Edit Scope
                        </button>
                    </div>
                )}

                {/* Dark Header */}
                <div className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-white",
                    isFollowUp ? 'bg-slate-800' : 'bg-slate-900'
                )}>
                    <div className="flex items-center gap-3">
                        {/* Drag Handle */}
                        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-white transition-colors">
                            <GripVertical className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-none border border-white/10">
                            {typeLabel}
                        </span>
                        {isFollowUp && (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-none border border-emerald-400/30">
                                LVL {question.level}
                            </span>
                        )}
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none border",
                            hasBranches ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" : "bg-white/10 text-slate-400 border-white/10"
                        )}>
                            {hasBranches ? 'Active' : 'Draft'}
                        </span>
                        {question.required && <span className="text-rose-400 text-[10px] font-bold">REQUIRED</span>}
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={onEdit} className="p-1.5 hover:bg-white/10 rounded-none transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={onDelete} className="p-1.5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-none transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        {hasChildren && (
                            <button onClick={() => setExpanded(!expanded)} className="p-1.5 hover:bg-white/10 rounded-none transition-colors ml-2 border-l border-white/10">
                                {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-4">
                    <p className="text-sm font-bold text-slate-800 mb-4">{question.text}</p>

                    {/* Visual Options List */}
                    <div className="space-y-2">
                        {question.options.map((opt, idx) => {
                            const hasBranch = hasBranchForOption(opt.id)
                            // Find which child question this option leads to
                            const branchTarget = hasBranch
                                ? (() => {
                                    const rule = question.logic?.find(l => l.triggerOptionId === opt.id)
                                    if (rule) {
                                        const target = questions.find(q => q.id === rule.targetQuestionId)
                                        return target?.text || null
                                    }
                                    return null
                                })()
                                : null
                            return (
                                <div key={opt.id} className={cn(
                                    "flex items-center justify-between p-2 border transition-colors group/opt",
                                    hasBranch
                                        ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-400"
                                        : "bg-slate-50 border-slate-100 hover:border-slate-300"
                                )}>
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className={cn(
                                            "w-6 h-6 flex items-center justify-center text-[10px] font-bold border rounded-none flex-shrink-0",
                                            hasBranch ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-white text-slate-500 border-slate-200"
                                        )}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-medium text-slate-700">{opt.text}</span>
                                            {hasBranch && branchTarget && (
                                                <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                                                    <GitBranch className="w-2.5 h-2.5 flex-shrink-0" />
                                                    <span className="truncate">→ {branchTarget}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Add Branch Button Logic */}
                                    {!hasBranchForOption(opt.id) && (
                                        <button
                                            onClick={(e) => onOptionBranch(e, opt.id)}
                                            className="opacity-0 group-hover/opt:opacity-100 p-1 hover:bg-emerald-50 text-emerald-600 transition-all flex items-center gap-1 px-2 text-[10px] font-bold uppercase tracking-wide bg-emerald-50 rounded-none flex-shrink-0"
                                            title="Add Branch"
                                        >
                                            <GitBranch className="w-3 h-3" /> Branch
                                        </button>
                                    )}
                                    {hasBranch && (
                                        <button
                                            onClick={(e) => onOptionBranch(e, opt.id)}
                                            className="p-1 hover:bg-emerald-50 text-emerald-600 transition-all flex items-center gap-1 px-2 text-[10px] font-bold uppercase tracking-wide bg-emerald-50 rounded-none flex-shrink-0"
                                            title="Modify Branch"
                                        >
                                            <GitBranch className="w-3 h-3" /> Edit
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Footer Actions - Default Flow */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onQuestionBranch}
                        className={cn(
                            "flex items-center gap-2 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-none transition-colors border",
                            hasDefaultBranch
                                ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                                : "bg-white text-slate-500 border-slate-200 hover:border-emerald-500 hover:text-emerald-600"
                        )}
                    >
                        <GitBranch className="w-3.5 h-3.5" />
                        {hasDefaultBranch ? "Default Flow Active" : "Add Default Flow"}
                    </button>
                </div>
            </div>

            {/* Recursion for Children */}
            {expanded && hasChildren && (
                <div className="ml-2 pt-3 space-y-3 relative">
                    <SortableContext items={children.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        {children.map(child => (
                            <SortableQuestionCard
                                key={child.id}
                                question={child}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onOptionBranch={onOptionBranch}
                                onQuestionBranch={onQuestionBranch}
                            />
                        ))}
                    </SortableContext>
                </div>
            )}
        </div>
    )
}

// ============ Q&A LIST VIEW ============

function QAListView({
    onEditDrawer,
    onOptionClick,
    onQuestionClick,
    onDelete
}: {
    onEditDrawer: (id: string | null) => void
    onOptionClick: (e: React.MouseEvent, qId: string, optId: string) => void
    onQuestionClick: (e: React.MouseEvent, qId: string) => void
    onDelete: (id: string) => void
}) {
    const { questions, addQuestion } = useSurveyBuilder()
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

    // Only show root questions here, children are nested
    const rootQuestions = questions.filter(q => !q.parentId).sort((a, b) => (a.order || 0) - (b.order || 0))

    const handleDragEnd = () => {
        // Placeholder for reordering logic
    }

    return (
        <div className="h-full overflow-y-auto p-6 bg-slate-50/50">
            <div className="max-w-3xl mx-auto space-y-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={rootQuestions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                        {rootQuestions.map(question => (
                            <SortableQuestionCard
                                key={question.id}
                                question={question}
                                onEdit={() => onEditDrawer(question.id)}
                                onDelete={() => onDelete(question.id)}
                                onOptionBranch={(e, optId) => onOptionClick(e, question.id, optId)}
                                onQuestionBranch={(e) => onQuestionClick(e, question.id)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                <button
                    onClick={() => {
                        const newId = addQuestion({
                            text: 'New Question',
                            type: 'mcq',
                            options: [],
                            logic: [],
                            required: false,
                            parentId: null,
                            level: 0,
                            scoreWeight: 0
                        })
                        onEditDrawer(newId)
                    }}
                    className="w-full py-6 border-2 border-dashed border-slate-300 bg-slate-50 rounded-none text-sm font-bold uppercase tracking-wide text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/20 transition-all flex items-center justify-center gap-2 group"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Plus className="w-5 h-5" />
                    </div>
                    Add New Question
                </button>
            </div>
        </div>
    )
}

// ============ ENHANCED FLOWCHART VIEW ============

interface NodePosition {
    id: string
    x: number
    y: number
    width: number
    height: number
}

function FlowchartView({
    onEditDrawer,
    onOptionClick,
    onQuestionClick,
    onDelete,
    onBranchAction
}: {
    onEditDrawer: (id: string | null) => void // Fixed type to match usage
    onOptionClick: (e: React.MouseEvent, qId: string, optId: string) => void
    onQuestionClick: (e: React.MouseEvent, qId: string) => void
    onDelete: (id: string) => void
    onBranchAction: (state: BranchMenuState) => void
}) {
    const { questions, addBranch, updateQuestion } = useSurveyBuilder()
    const [zoom, setZoom] = useState(1)
    const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map())
    const svgRef = useRef<SVGSVGElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [canvasSize, setCanvasSize] = useState({ width: 2000, height: 1500 })


    // Flowchart Constants
    const NODE_WIDTH = 320
    const H_GAP = 120
    const V_GAP = 40

    // Helper to build tree from flat list


    // Refined Build Tree
    const getQuestionTree = useCallback(() => {
        const questionMap = new Map<string, TreeQuestion>()

        // 1. Create nodes
        questions.forEach(q => {
            questionMap.set(q.id, { ...q, children: [] })
        })

        const roots: TreeQuestion[] = []

        // 2. Link children
        questions.forEach(q => {
            const node = questionMap.get(q.id)!

            if (q.parentId) {
                const parentNode = questionMap.get(q.parentId)
                if (parentNode) {
                    // Identify connection type
                    const parentQ = questions.find(pq => pq.id === q.parentId)
                    // Check Option Logic
                    const logic = parentQ?.logic.find(l => l.targetQuestionId === q.id)
                    if (logic) {
                        node.parentOptionId = logic.triggerOptionId
                    }
                    parentNode.children.push(node)
                } else {
                    roots.push(node)
                }
            } else {
                roots.push(node)
            }
        })

        return roots
    }, [questions])

    // Update positions when questions change
    useEffect(() => {
        const treeRoots = getQuestionTree()
        const newPositions = new Map<string, NodePosition>()

        const getNodeHeight = (q: TreeQuestion) => {
            const optionsCount = Math.min(q.options.length, 6) // Cap at 6 for visual sizing
            const baseHeight = 120 // Header + padding + bottom action
            const optionHeight = optionsCount > 0 ? (optionsCount * 48) + 16 : 48
            return baseHeight + optionHeight
        }

        // Recursive function to calculate subtree size
        // Returns total height of the subtree
        const calculateSubtreeHeight = (q: TreeQuestion): number => {
            const h = getNodeHeight(q)
            const children = q.children || []

            if (children.length === 0) return h + V_GAP

            let childrenTotalHeight = 0
            children.forEach(child => {
                childrenTotalHeight += calculateSubtreeHeight(child)
            })

            return Math.max(h + V_GAP, childrenTotalHeight)
        }

        // Recursive function to position nodes
        // centers the node vertically within its allocated subtree space
        const positionNode = (q: TreeQuestion, x: number, y: number, allocatedHeight: number) => {
            const h = getNodeHeight(q)
            const children = q.children || []

            // Center node in its allocated vertical space
            const myY = y + (allocatedHeight / 2) - (h / 2)

            newPositions.set(q.id, {
                id: q.id,
                x,
                y: myY,
                width: NODE_WIDTH,
                height: h
            })

            if (children.length > 0) {
                let currentChildY = y
                children.forEach(child => {
                    const childSubtreeHeight = calculateSubtreeHeight(child)
                    positionNode(child, x + NODE_WIDTH + H_GAP, currentChildY, childSubtreeHeight)
                    currentChildY += childSubtreeHeight
                })
            }
        }

        // Main Layout Loop
        let globalY = 100 // Start offset
        let maxX = 0

        // Use treeRoots instead of flat questions
        treeRoots.forEach(root => {
            const subtreeH = calculateSubtreeHeight(root)
            positionNode(root, 180, globalY, subtreeH)
            globalY += subtreeH
        })

        // Calculate Canvas Size
        newPositions.forEach(pos => {
            if (pos.x + pos.width > maxX) maxX = pos.x + pos.width
        })

        // Ensure canvas is at least container size or content size + padding
        const containerW = containerRef.current?.clientWidth || (window.innerWidth - 70)
        const containerH = containerRef.current?.clientHeight || window.innerHeight

        setCanvasSize({
            width: Math.max(containerW, maxX + 600),
            height: Math.max(containerH, globalY + 600)
        })

        setPositions(newPositions)
    }, [questions, getQuestionTree])

    // Generate SVG paths for connections
    const generatePaths = () => {
        const paths: React.ReactElement[] = []
        const treeRoots = getQuestionTree()

        // 1. Start Node -> Level 0 Questions
        const roots = questions.filter(q => !q.parentId && positions.has(q.id))

        if (roots.length > 0) {
            const startX = 70
            const startY = 60

            roots.forEach(root => {
                const pos = positions.get(root.id)!
                const endX = pos.x
                const endY = pos.y + (pos.height / 2) // Center of node
                const c1x = startX + 50
                const c2x = endX - 50

                paths.push(
                    <path
                        key={`start - ${root.id} `}
                        d={`M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY} `}
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="none"
                        className="opacity-50"
                        strokeDasharray="4 4"
                    />
                )
            })
        }

        // 2. Parent -> Child connections
        // Recursive function to add paths for a node and its children
        const addPathsForNode = (parent: TreeQuestion) => {
            if (!positions.has(parent.id)) return
            const parentPos = positions.get(parent.id)!
            const children = parent.children || []

            children.forEach(child => {
                if (!positions.has(child.id)) return
                const childPos = positions.get(child.id)!

                // Determine start point (Option vs Question bottom)
                let startX = parentPos.x + parentPos.width
                let startY = parentPos.y + (parentPos.height / 2)
                let strokeColor = "#94a3b8" // Default gray

                // Find connection type
                // 1. Check if connected via Option Logic
                const logicRule = parent.logic?.find(l => l.targetQuestionId === child.id) // Fallback for logic-based compatibility
                const linkedOptionId = parent.parentOptionId // In nested structure, child knows its parentOptionId? 
                // Wait, child has parentOptionId.

                // Better: check child's parentOptionId
                if (child.parentOptionId) {
                    const optionIndex = parent.options.findIndex(o => o.id === child.parentOptionId)
                    if (optionIndex !== -1) {
                        // Precise Offset Calculation
                        // Header: 45px
                        // Body Padding Top: 20px
                        // Title Area (approx): 40px (min)
                        // Option Height: 44px
                        // Option Gap: 8px
                        // Option Half Height: 22px
                        const optionIndex = parent.options.findIndex(o => o.id === child.parentOptionId)
                        if (optionIndex !== -1) {
                            const optionY = parentPos.y + 105 + (optionIndex * 52) + 22
                            startY = optionY
                            strokeColor = "#3b82f6" // Blue for logic
                        }
                    }
                } else if (child.parentId === parent.id) { // Default flow
                    strokeColor = "#10b981" // Emerald for default
                }

                const endX = childPos.x
                const endY = childPos.y + (childPos.height / 2)

                const c1x = startX + 80
                const c2x = endX - 80

                paths.push(
                    <g key={`${parent.id} -${child.id} `} className="group/path">
                        <path
                            d={`M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY} `}
                            stroke={strokeColor}
                            strokeWidth={2}
                            fill="none"
                            className="transition-all hover:stroke-emerald-500 hover:stroke-[3px] cursor-pointer"
                            onClick={() => {
                                // Open menu or delete
                                onBranchAction({
                                    isOpen: true,
                                    questionId: parent.id,
                                    optionId: child.parentOptionId || null,
                                    position: { x: (startX + endX) / 2, y: (startY + endY) / 2 }
                                })
                            }}
                        />
                        <circle cx={endX} cy={endY} r="4" fill={strokeColor} />
                        {!child.parentOptionId && <circle cx={startX} cy={startY} r="3" fill={strokeColor} />}
                    </g>
                )

                // Recurse for children's children
                addPathsForNode(child)
            })
        }

        treeRoots.forEach(root => addPathsForNode(root))

        return paths
    }

    const nodeElements = useMemo(() => {
        const nodes: React.ReactElement[] = []
        const renderNodeRecursive = (q: TreeQuestion) => {
            const pos = positions.get(q.id)
            if (!pos) return

            // Check connections for visual feedback
            const hasDefaultBranch = !!q.nextQuestionId || (q.children?.some(c => !c.parentOptionId && c.parentId === q.id))

            nodes.push(
                <foreignObject
                    key={`${q.id}-${q.text}-${q.options.length}`}
                    x={pos.x - 20}
                    y={pos.y - 20}
                    width={pos.width + 40}
                    height={pos.height + 40}
                    className="overflow-visible"
                >
                    <div className="p-[20px] h-full w-full"> {/* Wrapper for shadow/hover space */}
                        <div
                            className="bg-white group/card relative flex flex-col h-full shadow-sm hover:shadow-2xl transition-all duration-300 rounded-none border border-slate-200 overflow-hidden"
                            onClick={() => onEditDrawer(q.id)}
                        >
                            {/* SHARP HEADER */}
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white cursor-pointer hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-none border border-white/10">
                                        {q.type.replace('_', ' ')}
                                    </span>
                                    {q.required && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEditDrawer(q.id) }}
                                        className="p-1.5 hover:bg-white/10 rounded-sm transition-colors text-slate-400 hover:text-white"
                                        title="Settings"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(q.id) }}
                                        className="p-1.5 hover:bg-red-500/20 rounded-sm transition-colors text-slate-400 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-4 bg-white flex-1">
                                <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-4">
                                    {q.text || "Untitled Question"}
                                </h4>

                                {/* Options List */}
                                <div className="space-y-2">
                                    {q.options.map((opt, idx) => {
                                        const hasBranch = q.children?.some(c => c.parentOptionId === opt.id)
                                        const letter = String.fromCharCode(65 + idx) // A, B, C...

                                        return (
                                            <div
                                                key={opt.id}
                                                className={cn(
                                                    "group/option flex items-center justify-between p-2 rounded-none border transition-all cursor-pointer h-11 relative",
                                                    hasBranch ? "border-blue-200 bg-blue-50/30" : "border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                                                )}
                                                onClick={(e) => onOptionClick(e, q.id, opt.id)}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <span className={cn(
                                                        "flex-shrink-0 w-6 h-6 flex items-center justify-center text-[10px] font-bold border rounded-none transition-colors",
                                                        hasBranch ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-slate-500 border-slate-200 group-hover/option:border-slate-300 group-hover/option:text-slate-900"
                                                    )}>
                                                        {letter}
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-700 truncate max-w-[140px]">{opt.text}</span>
                                                </div>

                                                {/* Branch Indicator / Add Button */}
                                                <div className={cn(
                                                    "ml-2 transition-all",
                                                    hasBranch ? "text-blue-500" : "text-slate-300 group-hover/option:text-slate-500"
                                                )}>
                                                    {hasBranch ? <GitBranch className="w-3.5 h-3.5" /> : null}
                                                </div>

                                                {/* Visual Connection Point Logic - Right Side */}
                                                <div className={cn(
                                                    "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 z-20 flex items-center justify-center transition-all",
                                                    hasBranch ? "" : "opacity-0 group-hover/option:opacity-100"
                                                )}>
                                                    {hasBranch ? (
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onBranchAction({
                                                                    isOpen: true,
                                                                    questionId: q.id,
                                                                    optionId: opt.id,
                                                                    position: { x: e.currentTarget.getBoundingClientRect().right + 10, y: e.currentTarget.getBoundingClientRect().top }
                                                                })
                                                            }}
                                                            className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center cursor-pointer hover:border-slate-400 hover:bg-slate-50"
                                                            title="Modify Branch"
                                                        >
                                                            <Settings className="w-3 h-3 text-slate-500" />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={(e) => onOptionClick(e, q.id, opt.id)}
                                                            className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200 hover:scale-110 hover:border-slate-400 transition-all shadow-sm"
                                                            title="Add Branch"
                                                        >
                                                            <Plus className="w-3.5 h-3.5 text-slate-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Question Branch Point (Bottom Center) Logic */}
                            <div
                                className={cn(
                                    "absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 rounded-full flex items-center justify-center shadow-sm z-20 cursor-pointer transition-all hover:scale-110",
                                    hasDefaultBranch ? "border-emerald-500 opacity-100 scale-100" : "border-slate-300 opacity-0 group-hover/card:opacity-100 scale-90 hover:border-emerald-500"
                                )}
                                onClick={(e) => onQuestionClick(e, q.id)}
                                title="Default Flow (Branch by Question)"
                            >
                                <div className={cn("w-2 h-2 rounded-full", hasDefaultBranch ? "bg-emerald-500" : "bg-slate-300 hover:bg-emerald-500")}></div>
                            </div>
                        </div>
                    </div>
                </foreignObject>
            )

            // Recurse
            if (q.children) q.children.forEach(renderNodeRecursive)
        }

        getQuestionTree().forEach(renderNodeRecursive)
        return nodes
    }, [getQuestionTree, positions, onEditDrawer, onDelete, onOptionClick, onQuestionClick])

    return (
        <div className="relative w-full max-w-full min-w-0 h-full bg-slate-50 border-none rounded-none overflow-hidden font-sans">
            {/* View Switcher is assumed to be in parent, but we can render content based on prop if needed, 
                but based on previous file content, FollowUpTab seems to handle internal state or is just the container? 
                Wait, the previous code had separate components. I need to see where they are instantiated. 
                Ah, I need to look at the main component export. It wasn't shown in the previous 800 lines. 
                I will assume there is a main component that renders these views. 
                Let me read the rest of the file first to be sure. 
            */}

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white border border-slate-200 rounded-none p-1 shadow-md">
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-slate-100 rounded-none">
                    <ZoomOut className="w-4 h-4 text-slate-600" />
                </button>
                <span className="text-xs font-bold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 hover:bg-slate-100 rounded-none">
                    <ZoomIn className="w-4 h-4 text-slate-600" />
                </button>
                <div className="w-px h-4 bg-slate-200" />
                <button onClick={() => setZoom(1)} className="p-2 hover:bg-slate-100 rounded-none">
                    <RotateCcw className="w-4 h-4 text-slate-600" />
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-10 bg-white border border-slate-200 p-3 shadow-md flex flex-col gap-2 rounded-none">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-blue-500 rounded-none"></span>
                    <span className="text-[10px] font-bold uppercase text-slate-500">Option Logic</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-emerald-500 rounded-none"></span>
                    <span className="text-[10px] font-bold uppercase text-slate-500">Default Flow</span>
                </div>
            </div>

            {/* Canvas */}
            <div ref={containerRef} className="w-full h-full overflow-auto bg-slate-50 cursor-move active:cursor-grabbing">
                <svg
                    ref={svgRef}
                    width={canvasSize.width * zoom}
                    height={canvasSize.height * zoom}
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                    className="bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px]"
                >
                    {/* Connection Paths using G for stacking order */}
                    {generatePaths()}

                    {/* Start Node */}
                    <foreignObject x={20} y={20} width={100} height={80}>
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer shadow-emerald-500/20 rounded-full border-4 border-white ring-1 ring-slate-200">
                                <Play className="w-6 h-6 fill-current ml-1" />
                            </div>
                            <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">Start</span>
                        </div>
                    </foreignObject>

                    {/* Question Nodes - Recursive */}
                    {nodeElements}
                </svg>
            </div >

            {/* Helper to determine if a branch exists (for menu toggle) */}



        </div >
    )
}

// ============ LOGIC MAP BRANCH DELETED (Replaced by BranchOverview) ============
// ============ LOGIC MAP VIEW DELETED (Replaced by BranchOverview) ============

// ============ DELETE CONFIRMATION MODAL ============



// ============ MODERN QUESTION DRAWER ============

// QuestionDrawer is now imported from ../components/QuestionDrawer

// Extended interface for Tree Structure
interface TreeQuestion extends Question {
    children: TreeQuestion[]
    parentOptionId?: string
}

export function FollowUpTab({ hideToolbar = false, defaultView }: { hideToolbar?: boolean, defaultView?: 'qa_list' | 'flowchart' | 'logic_map' }) {
    const {
        followUpViewType,
        setFollowUpViewType,
        addBranch,
        questions,
        updateQuestion,
        deleteQuestion,
        // Drawer State from Context
        questionDrawerOpen,
        setQuestionDrawerOpen,
        editingQuestionId,
        setEditingQuestionId,
        setDrawerMode,
        drawerMode,
        // Delete Confirmation State from Context
        deleteConfirm,
        setDeleteConfirm,
        // Connect Modal State from Context
        connectModalOpen,
        setConnectModalOpen,
    } = useSurveyBuilder()

    // Set default view if provided
    useEffect(() => {
        if (defaultView) {
            setFollowUpViewType(defaultView)
        }
    }, [defaultView, setFollowUpViewType])

    // Hoisted Branch State
    const [branchMenu, setBranchMenu] = useState<BranchMenuState>({
        isOpen: false,
        questionId: null,
        optionId: null,
        position: { x: 0, y: 0 }
    })

    const handleOptionClick = (e: React.MouseEvent, questionId: string, optionId: string) => {
        e.stopPropagation()
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        setBranchMenu({
            isOpen: true,
            questionId,
            optionId,
            position: { x: rect.right + 10, y: rect.top }
        })
    }

    const handleQuestionClick = (e: React.MouseEvent, questionId: string) => {
        e.stopPropagation()
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        setBranchMenu({
            isOpen: true,
            questionId,
            optionId: null,
            position: { x: rect.right + 10, y: rect.top }
        })
    }

    // Handlers
    const handleEditDrawer = (questionId: string | null) => {
        setEditingQuestionId(questionId)
        setDrawerMode('edit')
        setQuestionDrawerOpen(true)
    }

    const handleCreateBranch = (parentId: string, triggerOptionId: string | null) => {
        addBranch(parentId, triggerOptionId)
        // addBranch now handles opening the drawer in 'create' mode via context
    }

    const handleConnectExisting = (targetId: string) => {
        if (branchMenu.questionId) {
            const q = questions.find(q => q.id === branchMenu.questionId)
            if (q) {
                if (branchMenu.optionId) {
                    // Option Logic
                    // Check if logic exists for this option, replace or add? For now, add.
                    // Ideally check if one already exists for this option and update it.
                    const existingRuleIndex = q.logic?.findIndex(l => l.triggerOptionId === branchMenu.optionId)
                    let newLogic = [...(q.logic || [])]

                    if (existingRuleIndex !== undefined && existingRuleIndex !== -1) {
                        // Update existing rule
                        newLogic[existingRuleIndex] = { ...newLogic[existingRuleIndex], targetQuestionId: targetId }
                    } else {
                        // Add new rule
                        newLogic.push({
                            id: 'logic-' + Date.now(),
                            triggerOptionId: branchMenu.optionId,
                            targetQuestionId: targetId
                        })
                    }
                    updateQuestion(q.id, { logic: newLogic })

                } else {
                    // Default Flow
                    updateQuestion(q.id, { nextQuestionId: targetId })
                }
            }
        }
        setConnectModalOpen(false)
        setBranchMenu(prev => ({ ...prev, isOpen: false }))
    }

    // Trigger Delete Request
    const handleDeleteRequest = (type: 'question' | 'branch', id: string, optionId?: string | null) => {
        setBranchMenu(prev => ({ ...prev, isOpen: false })) // Close menu if open
        setDeleteConfirm({
            isOpen: true,
            type,
            id,
            optionId
        })
    }

    // Execute Delete
    const handleDeleteConfirm = () => {
        const { type, id, optionId } = deleteConfirm
        if (!id) return

        if (type === 'question') {
            deleteQuestion(id)
        } else if (type === 'branch') {
            const q = questions.find(q => q.id === id)
            if (q) {
                if (optionId) {
                    // Remove logic rule for this option
                    const newLogic = q.logic?.filter(l => l.triggerOptionId !== optionId) || []
                    updateQuestion(q.id, { logic: newLogic })
                } else {
                    // Remove default flow
                    updateQuestion(q.id, { nextQuestionId: undefined })
                }
            }
        }
        setDeleteConfirm(prev => ({ ...prev, isOpen: false }))
    }

    // Helper to determine if a branch exists (for menu toggle)
    const hasExistingBranch = (() => {
        if (!branchMenu.questionId) return false
        const q = questions.find(q => q.id === branchMenu.questionId)
        if (!q) return false
        if (branchMenu.optionId) {
            return q.logic?.some(l => l.triggerOptionId === branchMenu.optionId) || false
        }
        return !!q.nextQuestionId
    })()

    return (
        <div className="h-full w-full max-w-full min-w-0 flex flex-col relative overflow-hidden">
            {/* Toolbar */}
            {!hideToolbar && (
                <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-20 relative">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-2">View Mode:</span>
                        <div className="flex bg-slate-100 p-1 rounded-none border border-slate-200">
                            <button
                                onClick={() => setFollowUpViewType('qa_list')}
                                className={cn("p-1.5 rounded-none transition-all", followUpViewType === 'qa_list' ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700")}
                                title="List View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setFollowUpViewType('flowchart')}
                                className={cn("p-1.5 rounded-none transition-all", followUpViewType === 'flowchart' ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700")}
                                title="Flowchart View"
                            >
                                <GitBranch className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setFollowUpViewType('logic_map')}
                                className={cn("p-1.5 rounded-none transition-all", followUpViewType === 'logic_map' ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700")}
                                title="Logic Map View"
                            >
                                <Layout className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-100 uppercase tracking-widest">
                            Auto-Save Active
                        </span>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {followUpViewType === 'qa_list' && (
                    <QAListView
                        onEditDrawer={handleEditDrawer}
                        onOptionClick={handleOptionClick}
                        onQuestionClick={handleQuestionClick}
                        onDelete={(id) => handleDeleteRequest('question', id)}
                    />
                )}
                {followUpViewType === 'flowchart' && (
                    <FlowchartView
                        onEditDrawer={handleEditDrawer}
                        onOptionClick={handleOptionClick}
                        onQuestionClick={handleQuestionClick}
                        onDelete={(id) => handleDeleteRequest('question', id)}
                        onBranchAction={state => setBranchMenu(state)}
                    />
                )}
                {followUpViewType === 'logic_map' && (
                    <BranchOverview
                        onEdit={handleEditDrawer}
                        onDelete={(id: string) => handleDeleteRequest('question', id)}
                    />
                )}
            </div>

            {/* Global Edit Drawer */}
            <QuestionDrawer
                isOpen={questionDrawerOpen}
                onClose={() => setQuestionDrawerOpen(false)}
                editingId={editingQuestionId}
                questions={questions}
                updateQuestion={updateQuestion}
                deleteQuestion={(id) => handleDeleteRequest('question', id)}
                mode={drawerMode}
            />

            {/* Shared Branch Action Menu */}
            <BranchActionMenu
                state={branchMenu}
                onClose={() => setBranchMenu(prev => ({ ...prev, isOpen: false }))}
                onConnect={() => {
                    setConnectModalOpen(true)
                    // Keep menu open? No, close it or keep state for modal use.
                    // We need branchMenu state for the modal to know source/option.
                    // Just close the menu UI but keep the state active? Or better, close menu visually but keep state?
                    // The menu uses `if (!state.isOpen) return null`, so we can set isOpen false but keep IDs.
                    // Actually, if we set isOpen false, we lose context if we rely on it being open? Not really, state persists.
                    setBranchMenu(prev => ({ ...prev, isOpen: false }))
                }}
                onCreate={() => {
                    if (branchMenu.questionId) {
                        handleCreateBranch(branchMenu.questionId, branchMenu.optionId)
                    }
                    setBranchMenu(prev => ({ ...prev, isOpen: false }))
                }}
                onModify={() => {
                    if (branchMenu.questionId) {
                        const q = questions.find(q => q.id === branchMenu.questionId)
                        if (q) {
                            let targetId: string | undefined
                            if (branchMenu.optionId) {
                                targetId = q.logic?.find(l => l.triggerOptionId === branchMenu.optionId)?.targetQuestionId
                            } else {
                                targetId = q.nextQuestionId
                            }

                            if (targetId) {
                                setEditingQuestionId(targetId)
                                setQuestionDrawerOpen(true)
                            } else {
                                setEditingQuestionId(branchMenu.questionId)
                                setQuestionDrawerOpen(true)
                            }
                        }
                    }
                    setBranchMenu(prev => ({ ...prev, isOpen: false }))
                }}
                onDelete={() => {
                    if (branchMenu.questionId) {
                        handleDeleteRequest('branch', branchMenu.questionId, branchMenu.optionId)
                    }
                }}
                hasExistingBranch={hasExistingBranch}
            />
            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleDeleteConfirm}
                title={deleteConfirm.type === 'question' ? "Delete Question?" : "Delete Branch?"}
                message={
                    deleteConfirm.type === 'question'
                        ? "Are you sure you want to delete this question? This will also delete any logic branches originating from it."
                        : "Are you sure you want to delete this logic branch? The connection between questions will be removed."
                }
            />

            {/* Question Drawer - Explicitly passing props to ensure updates work */}
            <QuestionDrawer
                isOpen={questionDrawerOpen}
                onClose={() => setQuestionDrawerOpen(false)}
                editingId={editingQuestionId}
                mode={drawerMode}
                questions={questions}
                updateQuestion={updateQuestion}
                deleteQuestion={(id) => handleDeleteRequest('question', id)}
            />
        </div>
    )
}

function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message
}: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
}) {
    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 rounded-none border border-slate-200">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {message}
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors uppercase tracking-wide rounded-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all uppercase tracking-wide rounded-none flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0" />
            </div>
        </div>,
        document.body
    )
}
