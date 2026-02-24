import { useState } from 'react'
import { useSurveyBuilder, Question } from '../contexts/SurveyBuilderContext'
import { cn } from '@/utils'
import {
    Activity, ChevronDown, ChevronRight, GitBranch,
    PlayCircle, Search, Settings2, Trash2, Edit2, Link, Zap,
    TrendingUp, Eye, ArrowRight, CornerDownRight, Check, X
} from 'lucide-react'

// ============ TYPES ============

interface BranchStats {
    totalBranches: number
    activeBranches: number
    avgDepth: number
    hitRate: number // Simulated or real
}

// ============ MOCK DATA GEN ============

const getMockStats = (q: Question): BranchStats => {
    const depth = q.level || 0
    // Deterministic pseudo-random based on ID char codes
    const seed = q.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return {
        totalBranches: (q.options?.length || 0) + (q.nextQuestionId ? 1 : 0),
        activeBranches: (q.logic?.length || 0) + (q.nextQuestionId ? 1 : 0),
        avgDepth: depth + Math.floor((seed % 5) + 1),
        hitRate: Math.floor(40 + (seed % 60))
    }
}

// ============ COMPONENT ============

// ============ COMPONENT ============

export function BranchOverview({
    onEdit,
    onDelete
}: {
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}) {
    const { questions, updateQuestion } = useSurveyBuilder()
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')
    const [filterImpact, setFilterImpact] = useState<'all' | 'high' | 'low'>('all')

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setExpandedIds(newSet)
    }

    const handleAddOption = (q: Question) => {
        const newOption = {
            id: crypto.randomUUID(),
            text: `Option ${q.options.length + 1}`
        }
        updateQuestion(q.id, { options: [...q.options, newOption] })
    }

    const rootQuestions = questions.filter(q => !q.parentId).sort((a, b) => (a.order || 0) - (b.order || 0))

    const filteredQuestions = rootQuestions.filter(q =>
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.options?.some(o => o.text.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    // Helper to render branch card
    const renderQuestionCard = (question: Question, depth = 0) => {
        const isExpanded = expandedIds.has(question.id)
        const stats = getMockStats(question)
        const hasChildren = questions.some(q => q.parentId === question.id)
        const childQuestions = questions.filter(q => q.parentId === question.id)

        // Determine if global or per-answer follow-up
        const followUpType = childQuestions.length > 0
            ? (childQuestions.some(cq => cq.logic?.some(l => l.triggerOptionId)) ? 'Mixed' : 'Global')
            : 'None'

        return (
            <div key={question.id} className="relative group">
                {/* Connector Line for Depth */}
                {depth > 0 && (
                    <div className="absolute -left-6 top-6 w-6 h-[2px] bg-slate-200 border-t border-slate-200"
                        style={{ borderTopStyle: 'solid', borderTopWidth: 2 }} />
                )}
                {depth > 0 && (
                    <div className="absolute -left-[26px] -top-4 bottom-6 w-[2px] bg-slate-200" />
                )}

                <div className={cn(
                    "bg-white border transition-all rounded-lg overflow-hidden relative",
                    isExpanded ? "border-blue-300 shadow-md" : "border-slate-200 hover:border-blue-200 hover:shadow-sm"
                )}>
                    {/* Header Row */}
                    <div
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                        onClick={() => toggleExpand(question.id)}
                    >
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 font-bold text-xs rounded border border-slate-200 uppercase flex-shrink-0">
                            {question.type === 'mcq' ? 'MCQ' : 'TXT'}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm truncate">{question.text}</span>
                                {followUpType !== 'None' && (
                                    <span className={cn(
                                        "px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border",
                                        followUpType === 'Global' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                            followUpType === 'Mixed' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                "bg-slate-50 text-slate-500 border-slate-200"
                                    )}>
                                        {followUpType} Flow
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <Activity className="w-3 h-3" />
                                    {stats.hitRate}% traffic
                                </span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <GitBranch className="w-3 h-3" />
                                    {stats.activeBranches}/{stats.totalBranches} paths
                                </span>
                            </div>
                        </div>

                        {/* Quick Actions (Hover) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); alert("Simulation started for this branch!"); }}
                                className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors"
                                title="Simulate"
                            >
                                <PlayCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(question.id); }}
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(question.id); }}
                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                            <div className="grid grid-cols-12 gap-4">
                                {/* Left: Answer Options */}
                                <div className="col-span-4 border-r border-slate-200 pr-4 space-y-2">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Answers ({question.options?.length || 0})</h5>
                                    {question.options?.map((opt, i) => (
                                        <div
                                            key={opt.id}
                                            className="flex items-center justify-between text-xs p-2 bg-white border border-slate-200 rounded hover:border-blue-300 transition-colors cursor-pointer group/opt"
                                            onClick={() => onEdit(question.id)} // For now, clicking option edits the question
                                        >
                                            <span className="truncate flex-1 font-medium text-slate-700">{opt.text}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 group-hover/opt:hidden">{Math.floor(Math.random() * 40) + 10}%</span>
                                                <button
                                                    className="hidden group-hover/opt:flex p-1 bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded transition-colors"
                                                    title="Edit Option"
                                                    onClick={(e) => { e.stopPropagation(); onEdit(question.id); }}
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleAddOption(question)}
                                        className="w-full py-1.5 text-[10px] font-bold text-slate-400 border border-dashed border-slate-300 rounded hover:text-blue-600 hover:border-blue-300 hover:bg-white transition-colors"
                                    >
                                        + Add Answer
                                    </button>
                                </div>

                                {/* Middle: Linked Nodes / Visual Flow */}
                                <div className="col-span-5 px-2 space-y-2">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Connections</h5>
                                    {(question.logic?.length || 0) > 0 ? (
                                        question.logic?.map((logic, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs p-2 bg-white border border-slate-200 rounded">
                                                <CornerDownRight className="w-3 h-3 text-slate-400" />
                                                <span className="font-medium text-slate-600">If answer is <span className="text-blue-600 font-bold">"{question.options.find(o => o.id === logic.triggerOptionId)?.text}"</span></span>
                                                <ArrowRight className="w-3 h-3 text-slate-300" />
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 border border-slate-200">
                                                    Goes to Q{questions.findIndex(q => q.id === logic.targetQuestionId) + 1}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-slate-400 italic py-2 flex items-center gap-2">
                                            <CornerDownRight className="w-3 h-3" />
                                            Default flow to next question
                                        </div>
                                    )}
                                </div>

                                {/* Right: Conditions & Metrics */}
                                <div className="col-span-3 border-l border-slate-200 pl-4 space-y-3">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Impact</h5>
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-slate-500">Drop-off Rate</span>
                                            <span className="font-bold text-red-500">{Math.floor(Math.random() * 15) + 2}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-400 rounded-full" style={{ width: '12%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-slate-500">Avg Time</span>
                                            <span className="font-bold text-blue-600">8.2s</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100">
                                        <button
                                            onClick={() => onEdit(question.id)}
                                            className="w-full py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <Settings2 className="w-3 h-3" />
                                            Configure Rules
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recursive Children */}
                {(isExpanded || hasChildren) && depth < 3 && (
                    <div className="ml-8 mt-3 space-y-3 border-l-2 border-slate-100 pl-4">
                        {childQuestions.map(child => renderQuestionCard(child, depth + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-slate-50/30">
            {/* Toolbar */}
            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center gap-4 shadow-sm z-10 sticky top-0">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search branches, questions, logic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                    />
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => alert("Simulation started!")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Run Simulation
                    </button>
                    <button
                        onClick={() => alert("Logic validation complete! No errors found.")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Validate Logic
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map(q => renderQuestionCard(q))
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <GitBranch className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-slate-900 font-bold mb-1">No branches found</h3>
                            <p className="text-slate-500 text-sm">Try adding questions or adjusting your search filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
