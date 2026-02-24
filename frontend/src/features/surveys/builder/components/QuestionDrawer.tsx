import { SurveyContext, QuestionType } from '../contexts/SurveyPageContext'
import { cn } from '@/utils'
import {
    Edit2, List, X, Trash2, Save, Palette, BarChart2, Database, Layout,
    GitBranch, ShieldCheck, Image as ImageIcon, Code, Hash, AlertCircle, EyeOff
} from 'lucide-react'
import { useState, useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'

const TOKENS = {
    label: "text-[10px] font-bold uppercase tracking-widest text-slate-400 select-none",
    input: "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium",
    section: "bg-white p-5 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4 rounded-none group hover:border-slate-300 transition-colors",
    tab: "flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 border-b-2 transition-all hover:bg-slate-50 relative"
}

interface QuestionDrawerProps {
    isOpen: boolean
    onClose: () => void
    editingId: string | null
    // Optional props to allow usage without SurveyProvider
    questions?: any[]
    updateQuestion?: (id: string, updates: any) => void
    deleteQuestion?: (id: string) => void
    mode?: 'edit' | 'create'
}

export function QuestionDrawer({ isOpen, onClose, editingId, questions: propQuestions, updateQuestion: propUpdate, deleteQuestion: propDelete, mode = 'edit' }: QuestionDrawerProps) {
    // Try context first, fall back to props
    const ctx = useContext(SurveyContext)
    // Prefer props (from specific builder context) over global context to avoid conflicts
    const questions = propQuestions ?? ctx?.questions ?? []
    const updateQuestion = propUpdate ?? ctx?.updateQuestion ?? (() => { })
    const deleteQuestion = propDelete ?? ctx?.deleteQuestion ?? (() => { })
    const [activeTab, setActiveTab] = useState<'content' | 'design' | 'logic' | 'data' | 'validation' | 'media' | 'advanced'>('content')
    const [localQuestionText, setLocalQuestionText] = useState('')

    // Helper to find question recursively
    const findQuestion = (nodes: any[], id: string): any => {
        for (const node of nodes) {
            if (node.id === id) return node
            if (node.children && node.children.length > 0) {
                const found = findQuestion(node.children, id)
                if (found) return found
            }
        }
        return null
    }

    // Find question from CONTEXT to ensure sync
    const question = findQuestion(questions, editingId)

    // Sync local state when question changes (switched to another question)
    useEffect(() => {
        if (question) {
            setLocalQuestionText(question.text || '')
        }
    }, [question?.id])

    if (!question || !isOpen) return null

    const TABS = [
        { id: 'content', label: 'Content', icon: Layout },
        { id: 'design', label: 'Design', icon: Palette },
        { id: 'logic', label: 'Logic', icon: GitBranch },
        { id: 'data', label: 'Data', icon: BarChart2 },
        { id: 'validation', label: 'Valid', icon: ShieldCheck },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'advanced', label: 'Adv.', icon: Code },
    ] as const

    return createPortal(
        <>
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[9998] transition-opacity animate-fade-in" onClick={onClose} />
            <div className={cn("fixed inset-y-0 right-0 w-[550px] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 flex flex-col animate-slide-in-right border-l border-slate-100", isOpen ? "translate-x-0" : "translate-x-full")}>
                {/* Modern Dark Header */}
                <div className="px-6 py-5 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between shadow-lg relative z-20">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h3 className="font-black text-lg text-white tracking-tight uppercase">
                                {mode === 'create' ? "Create Question - new followup" : "Edit Question"}
                            </h3>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">ID: {question.id} • TYPE: {question.type}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scroller for Tabs */}
                <div className="bg-white border-b border-slate-200 overflow-x-auto scrollbar-hide shrink-0 shadow-sm z-10 w-full">
                    <div className="flex w-max min-w-full">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    TOKENS.tab,
                                    "px-4 md:px-5 min-w-[90px]",
                                    activeTab === tab.id
                                        ? "border-emerald-500 text-emerald-600 bg-emerald-50/30"
                                        : "border-transparent text-slate-400 hover:text-slate-700"
                                )}
                            >
                                <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-emerald-500" : "text-slate-400")} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-8 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:16px_16px]" />

                    <div className="relative z-10 space-y-6 animate-fade-in">
                        {activeTab === 'content' && (
                            <>
                                <div className={TOKENS.section}>

                                    <label className={cn(TOKENS.label, "flex items-center gap-2")}> <Edit2 className="w-3 h-3" /> Question Text</label>
                                    <textarea
                                        value={localQuestionText}
                                        onChange={(e) => {
                                            setLocalQuestionText(e.target.value)
                                        }}
                                        onBlur={() => {
                                            updateQuestion(question.id, { text: localQuestionText })
                                        }}
                                        rows={3}
                                        className={TOKENS.input}
                                        placeholder="Enter your question here..."
                                    />
                                    <p className="text-[10px] text-slate-400 text-right">{localQuestionText.length} characters</p>
                                </div>

                                <div className={TOKENS.section}>
                                    <label className={cn(TOKENS.label, "flex items-center gap-2")}> <List className="w-3 h-3" /> Question Type</label>
                                    <div className="relative">
                                        <select
                                            value={question.type}
                                            onChange={(e) => updateQuestion(question.id, { type: e.target.value as QuestionType })}
                                            className={cn(TOKENS.input, "appearance-none bg-white")}
                                        >
                                            <option value="mcq">Multiple Choice</option>
                                            <option value="rating">Rating</option>
                                            <option value="text">Free Text</option>
                                            <option value="yes_no">Yes/No</option>
                                            <option value="dropdown">Dropdown</option>
                                            <option value="scale">Scale</option>
                                            <option value="date">Date picker</option>
                                            <option value="file_upload">File Upload</option>
                                            <option value="nps">NPS Score</option>
                                            <option value="matrix">Matrix</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className={TOKENS.section}>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className={cn(TOKENS.label, "flex items-center gap-2")}> <List className="w-3 h-3" /> Options Config</label>
                                        <button
                                            onClick={() => {
                                                const newOption = { id: `opt-${Date.now()}`, text: `Option ${question.options.length + 1}` }
                                                updateQuestion(question.id, { options: [...question.options, newOption] })
                                            }}
                                            className="text-[10px] font-bold text-emerald-600 uppercase hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-100"
                                        >
                                            <Plus className="w-3 h-3" /> Add Option
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                        {question.options.map((opt, i) => (
                                            <div key={opt.id} className="flex items-center gap-2 group/opt animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                                                <span className="text-[10px] font-bold text-slate-400 w-5 h-5 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-sm">{String.fromCharCode(65 + i)}</span>
                                                <input
                                                    value={opt.text}
                                                    onChange={(e) => {
                                                        const newOptions = [...question.options]
                                                        newOptions[i].text = e.target.value
                                                        updateQuestion(question.id, { options: newOptions })
                                                    }}
                                                    className="flex-1 px-3 py-2 text-sm border border-slate-200 bg-white focus:border-emerald-500 outline-none transition-all shadow-sm focus:shadow-md"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newOptions = question.options.filter(o => o.id !== opt.id)
                                                        updateQuestion(question.id, { options: newOptions })
                                                    }}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        {question.options.length === 0 && <p className="text-xs text-slate-400 italic p-8 text-center border-2 border-dashed border-slate-200 bg-slate-50/50">No options defined for this type.</p>}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'design' && (
                            <>
                                <div className={TOKENS.section}>
                                    <label className={cn(TOKENS.label, "flex items-center gap-2")}> <Palette className="w-3 h-3" /> Accent Color</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#64748b'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => updateQuestion(question.id, { color })}
                                                className={cn(
                                                    "w-full aspect-square rounded-full border-2 transition-all hover:scale-110 shadow-sm",
                                                    question.color === color ? "border-slate-800 scale-110 ring-2 ring-slate-200" : "border-white ring-1 ring-slate-100"
                                                )}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className={TOKENS.section}>
                                    <label className={cn(TOKENS.label, "flex items-center gap-2")}> <Layout className="w-3 h-3" /> Layout Style</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Standard Card', 'Full Dropdown', 'Minimal Text', 'Compact'].map(style => (
                                            <div key={style} className="p-3 border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-500 cursor-pointer transition-all flex items-center gap-2 group">
                                                <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-emerald-500 group-hover:bg-emerald-50" />
                                                <span className="text-xs font-medium text-slate-600 group-hover:text-emerald-700">{style}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'logic' && (
                            <div className={TOKENS.section}>
                                <label className={cn(TOKENS.label, "flex items-center gap-2")}> <GitBranch className="w-3 h-3" /> Logic Flow</label>
                                <div className="p-4 bg-slate-50 border border-slate-200 text-center">
                                    <p className="text-sm text-slate-500 mb-4">Edit logic in the Flowchart view for visual connecting.</p>
                                    <div className="text-xs font-mono bg-white p-2 border border-slate-200 text-left space-y-1">
                                        <p className="text-slate-400 uppercase font-bold text-[10px]">Current Rules:</p>
                                        {(question.logic && question.logic.length > 0) ? (
                                            question.logic.map(l => (
                                                <div key={l.id} className="flex items-center gap-2">
                                                    <span className="text-blue-500">IF select {l.triggerOptionId}</span>
                                                    <span>→</span>
                                                    <span className="text-emerald-500">GOTO {l.targetQuestionId}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 italic">No branching rules.</p>
                                        )}
                                        {question.nextQuestionId && (
                                            <div className="flex items-center gap-2 border-t border-slate-100 pt-1 mt-1">
                                                <span className="text-purple-500">DEFAULT</span>
                                                <span>→</span>
                                                <span className="text-emerald-500">GOTO {question.nextQuestionId}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <>
                                <div className={TOKENS.section}>
                                    <label className={cn(TOKENS.label, "flex items-center gap-2")}> <BarChart2 className="w-3 h-3" /> Visualization Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['bar', 'pie', 'line', 'metric', 'table', 'funnel'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => updateQuestion(question.id, { visualization: type as any })}
                                                className={cn(
                                                    "p-3 border rounded-none flex flex-col items-center gap-2 transition-all hover:shadow-md",
                                                    question.visualization === type
                                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-500"
                                                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                                )}
                                            >
                                                <span className="capitalize text-xs tracking-wide">{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={TOKENS.section}>
                                    <label className={cn(TOKENS.label, "flex items-center gap-2")}> <Database className="w-3 h-3" /> Data Source Config</label>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Data Source</label>
                                            <select
                                                value={question.dataConfig?.source || 'responses'}
                                                onChange={(e) => updateQuestion(question.id, { dataConfig: { ...question.dataConfig, source: e.target.value } })}
                                                className={TOKENS.input}
                                            >
                                                <option value="responses">Survey Responses (Direct)</option>
                                                <option value="crm">CRM Data (Enriched)</option>
                                                <option value="external">External API</option>
                                                <option value="computed">Computed Field</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Metric to Track</label>
                                            <input
                                                value={question.dataConfig?.metric || ''}
                                                onChange={(e) => updateQuestion(question.id, { dataConfig: { ...question.dataConfig, metric: e.target.value } })}
                                                className={TOKENS.input}
                                                placeholder="e.g. avg_score, count, sentiment"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'validation' && (
                            <div className={TOKENS.section}>
                                <label className={cn(TOKENS.label, "flex items-center gap-2")}> <ShieldCheck className="w-3 h-3" /> Validation Rules</label>

                                <div className="flex items-center justify-between p-3 border border-slate-200 bg-slate-50">
                                    <span className="text-xs font-bold text-slate-700">Required Field</span>
                                    <button
                                        onClick={() => updateQuestion(question.id, { required: !question.required })}
                                        className={cn("w-10 h-5 rounded-full relative transition-colors", question.required ? "bg-emerald-500" : "bg-slate-300")}
                                    >
                                        <div className={cn("w-4 h-4 bg-white rounded-full shadow-sm absolute top-0.5 transition-all", question.required ? "left-5.5" : "left-0.5")} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Min Value / Length</label>
                                        <input
                                            type="number"
                                            value={question.validation?.min || ''}
                                            onChange={(e) => updateQuestion(question.id, { validation: { ...question.validation, min: parseInt(e.target.value) } })}
                                            className={TOKENS.input}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Max Value / Length</label>
                                        <input
                                            type="number"
                                            value={question.validation?.max || ''}
                                            onChange={(e) => updateQuestion(question.id, { validation: { ...question.validation, max: parseInt(e.target.value) } })}
                                            className={TOKENS.input}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Regex Pattern</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            value={question.validation?.pattern || ''}
                                            onChange={(e) => updateQuestion(question.id, { validation: { ...question.validation, pattern: e.target.value } })}
                                            className={cn(TOKENS.input, "pl-9 font-mono text-xs")}
                                            placeholder="e.g. ^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Error Message</label>
                                    <div className="relative">
                                        <AlertCircle className="absolute left-3 top-2.5 w-4 h-4 text-red-400" />
                                        <input
                                            value={question.validation?.errorMessage || ''}
                                            onChange={(e) => updateQuestion(question.id, { validation: { ...question.validation, errorMessage: e.target.value } })}
                                            className={cn(TOKENS.input, "pl-9 text-red-600")}
                                            placeholder="Custom error message..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'media' && (
                            <div className={TOKENS.section}>
                                <label className={cn(TOKENS.label, "flex items-center gap-2")}> <ImageIcon className="w-3 h-3" /> Media Attachments</label>

                                <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-8 flex flex-col items-center justify-center text-center hover:border-emerald-400 hover:bg-emerald-50/10 transition-colors group cursor-pointer">
                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-600">Click to upload image</p>
                                    <p className="text-[10px] text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Image URL</label>
                                    <input
                                        value={question.media?.imageUrl || ''}
                                        onChange={(e) => updateQuestion(question.id, { media: { ...question.media, imageUrl: e.target.value } })}
                                        className={TOKENS.input}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Video URL</label>
                                    <input
                                        value={question.media?.videoUrl || ''}
                                        onChange={(e) => updateQuestion(question.id, { media: { ...question.media, videoUrl: e.target.value } })}
                                        className={TOKENS.input}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'advanced' && (
                            <div className={TOKENS.section}>
                                <label className={cn(TOKENS.label, "flex items-center gap-2")}> <Code className="w-3 h-3" /> Advanced Configuration</label>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Unique Identifier (API Key)</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            value={question.advancedConfig?.identifier || question.id}
                                            onChange={(e) => updateQuestion(question.id, { advancedConfig: { ...question.advancedConfig, identifier: e.target.value } })}
                                            className={cn(TOKENS.input, "pl-9 font-mono text-xs")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Reporting Category</label>
                                    <input
                                        value={question.advancedConfig?.analyticsCategory || ''}
                                        onChange={(e) => updateQuestion(question.id, { advancedConfig: { ...question.advancedConfig, analyticsCategory: e.target.value } })}
                                        className={TOKENS.input}
                                        placeholder="e.g. Demographics, Sales Funnel"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 border border-slate-200 bg-slate-50 mt-4">
                                    <div className="flex items-center gap-2">
                                        <EyeOff className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700">Hidden Question</span>
                                    </div>
                                    <button
                                        onClick={() => updateQuestion(question.id, { advancedConfig: { ...question.advancedConfig, hidden: !question.advancedConfig?.hidden } })}
                                        className={cn("w-10 h-5 rounded-full relative transition-colors", question.advancedConfig?.hidden ? "bg-emerald-500" : "bg-slate-300")}
                                    >
                                        <div className={cn("w-4 h-4 bg-white rounded-full shadow-sm absolute top-0.5 transition-all", question.advancedConfig?.hidden ? "left-5.5" : "left-0.5")} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 relative">
                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this question?")) {
                                deleteQuestion(question.id)
                                onClose()
                            }
                        }}
                        className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-sm transition-colors flex items-center gap-2 uppercase tracking-wide opacity-70 hover:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-sm transition-colors uppercase tracking-wide">
                            Discard
                        </button>
                        <button
                            onClick={() => {
                                // Explicitly save the text one last time to ensure persistence
                                console.log('[Drawer] Save Clicked:', localQuestionText)
                                if (question) {
                                    updateQuestion(question.id, { text: localQuestionText })
                                }
                                onClose()
                            }}
                            className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 rounded-sm transition-all flex items-center gap-2 uppercase tracking-wide transform hover:-translate-y-0.5"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    )
}

// Helper icons
function ChevronDown({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}

function Plus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
