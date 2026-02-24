import { useState, useRef, useEffect } from 'react'
import {
    Send, Sparkles, ChevronRight, Copy, Download, X, RefreshCw,
    MessageSquare, Wand2, Lightbulb, CheckCircle,
    Target, Users, Palette, ArrowUp, ArrowDown, AlertCircle,
    Bot, MoreHorizontal, Edit3, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

// ============ TYPES ============

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    questions?: GeneratedQuestion[]
    suggestions?: string[]
}

interface GeneratedQuestion {
    id: string
    type: 'nps' | 'rating' | 'multiple_choice' | 'open_text' | 'yes_no'
    text: string
    options?: string[]
    required: boolean
    skipLogic?: string
}

// ============ MOCK DATA ============

const quickPrompts = [
    { icon: Target, label: 'Post-Disbursement Feedback', prompt: 'Create a survey to collect feedback 7 days after loan disbursement' },
    { icon: Users, label: 'Agent Evaluation', prompt: 'Generate questions to evaluate field agent performance' },
    { icon: Sparkles, label: 'NPS + CSAT Combo', prompt: 'Create an NPS survey with CSAT follow-up questions' },
    { icon: Lightbulb, label: 'Product Awareness', prompt: 'Survey to measure awareness of new housing loan products' },
]

const sampleConversation: Message[] = [
    {
        id: '1',
        role: 'user',
        content: 'Create a survey to collect feedback 7 days after loan disbursement'
    },
    {
        id: '2',
        role: 'assistant',
        content: 'I\'ll create a post-disbursement feedback survey for you. This survey will help you measure customer satisfaction and identify any issues early. Here are the generated questions:',
        questions: [
            { id: 'q1', type: 'nps', text: 'How likely are you to recommend HouseFin to a friend or colleague?', required: true },
            { id: 'q2', type: 'rating', text: 'How satisfied are you with the overall loan disbursement process?', required: true },
            { id: 'q3', type: 'multiple_choice', text: 'Which part of the process was most satisfactory?', options: ['Application submission', 'Document verification', 'Agent communication', 'Fund disbursement'], required: true },
            { id: 'q4', type: 'rating', text: 'How would you rate the responsiveness of our team?', required: true },
            { id: 'q5', type: 'open_text', text: 'What could we have done better during your loan journey?', required: false, skipLogic: 'Show if NPS < 7' },
        ],
        suggestions: ['Add a question about documentation clarity', 'Include follow-up for detractors', 'Add consent for follow-up call']
    },
]

// ============ COMPONENTS ============

interface QuestionCardProps {
    question: GeneratedQuestion
    index: number
    totalQuestions: number
    onRemove: () => void
    onEdit: () => void
    onDuplicate: () => void
    onMoveUp: () => void
    onMoveDown: () => void
    onRegenerate: () => void
}

function QuestionCard({ question, index, totalQuestions, onRemove, onEdit, onDuplicate, onMoveUp, onMoveDown, onRegenerate }: QuestionCardProps) {
    const [isRegenerating, setIsRegenerating] = useState(false)

    const handleRegenerate = () => {
        setIsRegenerating(true)
        // Simulate API call
        setTimeout(() => {
            setIsRegenerating(false)
            onRegenerate()
        }, 1500)
    }

    const typeLabels: Record<string, { label: string, color: string }> = {
        nps: { label: 'NPS', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' },
        rating: { label: 'Rating', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' },
        multiple_choice: { label: 'Multiple Choice', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
        open_text: { label: 'Open Text', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
        yes_no: { label: 'Yes/No', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' },
    }

    const { label, color } = typeLabels[question.type] || { label: question.type, color: 'bg-slate-50 text-slate-600 border-slate-200' }

    return (
        <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            {/* Numbering Badge */}
            <div className="absolute -left-3 top-4 w-6 h-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center text-xs font-bold shadow-sm z-10">
                {index + 1}
            </div>

            <div className="p-4 pl-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border", color)}>{label}</span>
                        {question.required && (
                            <span className="text-rose-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Required
                            </span>
                        )}
                        {question.skipLogic && (
                            <span className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 border border-slate-200 dark:border-slate-700">
                                <ChevronRight className="w-3 h-3" /> {question.skipLogic}
                            </span>
                        )}
                    </div>

                    {/* Action Buttons - Visible on Hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleRegenerate} disabled={isRegenerating} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-sm">
                            <RefreshCw className={cn("w-3.5 h-3.5", isRegenerating && "animate-spin")} />
                        </button>
                        <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-sm">
                            <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={onDuplicate} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-sm">
                            <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={onRemove} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-sm">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <p className={cn(
                    "text-sm font-semibold text-slate-900 dark:text-white leading-relaxed mb-3 transition-opacity",
                    isRegenerating ? "opacity-50" : "opacity-100"
                )}>
                    {question.text}
                </p>

                {question.options && (
                    <div className="flex flex-wrap gap-2">
                        {question.options.map((opt, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                                {opt}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Reorder Handles - Absolute right */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onMoveUp} disabled={index === 0} className="p-1 text-slate-300 hover:text-blue-600 disabled:opacity-30">
                    <ArrowUp className="w-3 h-3" />
                </button>
                <button onClick={onMoveDown} disabled={index === totalQuestions - 1} className="p-1 text-slate-300 hover:text-blue-600 disabled:opacity-30">
                    <ArrowDown className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}

// ============ MAIN COMPONENT ============

export function AISurveyBuilder() {
    const [messages, setMessages] = useState<Message[]>(sampleConversation)
    const [input, setInput] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsGenerating(true)

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I've analyzed your request: "${input}". Here are some tailored questions based on best practices:`,
                questions: [
                    { id: `q${Date.now()}`, type: 'rating', text: 'Based on your request, how would you rate your experience?', required: true },
                    { id: `q${Date.now() + 1}`, type: 'open_text', text: 'Please share any specific feedback related to your inquiry.', required: false },
                ],
                suggestions: ['Add more specific questions', 'Consider adding demographic questions']
            }
            setMessages(prev => [...prev, aiResponse])
            setIsGenerating(false)
        }, 1500)
    }

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt)
    }

    const allQuestions = messages.flatMap(m => m.questions || [])

    return (
        <div className="flex h-[750px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in group/main">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white tracking-tight text-lg">Survey Architect AI</h3>
                            <p className="text-xs text-slate-500 font-medium">Powered by HouseFin Intelligence</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-100 dark:border-blue-800 rounded-full flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">AI Online</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {messages.length === 0 && (
                        <div className="mt-10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Start with a template</p>
                            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {quickPrompts.map((qp, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleQuickPrompt(qp.prompt)}
                                        className="flex flex-col gap-3 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group text-left relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 w-fit rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <qp.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{qp.label}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{qp.prompt}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map(msg => (
                        <div key={msg.id} className={cn("flex gap-4 animate-fade-in-up", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                            {/* Avatar */}
                            <div className={cn(
                                "w-8 h-8 rounded-none flex items-center justify-center shrink-0 border mt-1",
                                msg.role === 'user'
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-white text-blue-600 border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                            )}>
                                {msg.role === 'user' ? <Users className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                            </div>

                            <div className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "px-5 py-4 border shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-slate-900 text-white border-slate-900 rounded-bl-sm rounded-tl-sm rounded-br-sm"
                                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 rounded-tr-sm rounded-br-sm rounded-bl-sm"
                                )}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                    {/* Generated Questions within Chat */}
                                    {msg.questions && msg.questions.length > 0 && (
                                        <div className="mt-6 space-y-3 w-full min-w-[500px]">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Generated Output</span>
                                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                                            </div>
                                            {msg.questions.map((q, qIdx) => (
                                                <QuestionCard
                                                    key={q.id}
                                                    index={qIdx}
                                                    totalQuestions={msg.questions!.length}
                                                    question={q}
                                                    onRemove={() => {
                                                        setMessages(prev => prev.map(m => {
                                                            if (m.id !== msg.id) return m
                                                            return { ...m, questions: m.questions?.filter(qi => qi.id !== q.id) }
                                                        }))
                                                    }}
                                                    onEdit={() => {
                                                        const newText = prompt('Edit Question Text:', q.text)
                                                        if (newText) {
                                                            setMessages(prev => prev.map(m => {
                                                                if (m.id !== msg.id) return m
                                                                return {
                                                                    ...m,
                                                                    questions: m.questions?.map(qi => qi.id === q.id ? { ...qi, text: newText } : qi)
                                                                }
                                                            }))
                                                        }
                                                    }}
                                                    onDuplicate={() => {
                                                        setMessages(prev => prev.map(m => {
                                                            if (m.id !== msg.id) return m
                                                            const questions = [...(m.questions || [])]
                                                            questions.splice(qIdx + 1, 0, { ...q, id: `q-${Date.now()}`, text: `${q.text} (Copy)` })
                                                            return { ...m, questions }
                                                        }))
                                                    }}
                                                    onMoveUp={() => {
                                                        if (qIdx === 0) return
                                                        setMessages(prev => prev.map(m => {
                                                            if (m.id !== msg.id) return m
                                                            const questions = [...(m.questions || [])]
                                                            const temp = questions[qIdx - 1]
                                                            questions[qIdx - 1] = questions[qIdx]
                                                            questions[qIdx] = temp
                                                            return { ...m, questions }
                                                        }))
                                                    }}
                                                    onMoveDown={() => {
                                                        if (!msg.questions || qIdx === msg.questions.length - 1) return
                                                        setMessages(prev => prev.map(m => {
                                                            if (m.id !== msg.id) return m
                                                            const questions = [...(m.questions || [])]
                                                            const temp = questions[qIdx + 1]
                                                            questions[qIdx + 1] = questions[qIdx]
                                                            questions[qIdx] = temp
                                                            return { ...m, questions }
                                                        }))
                                                    }}
                                                    onRegenerate={() => {
                                                        setMessages(prev => prev.map(m => {
                                                            if (m.id !== msg.id) return m
                                                            return {
                                                                ...m,
                                                                questions: m.questions?.map(qi =>
                                                                    qi.id === q.id ? { ...qi, text: qi.text + " (AI Optimized)" } : qi
                                                                )
                                                            }
                                                        }))
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Suggestions */}
                                    {msg.suggestions && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <Lightbulb className="w-3 h-3 text-amber-500" /> Suggested Refinements
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.suggestions.map((s, i) => (
                                                    <button key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors text-xs font-medium text-slate-600 dark:text-slate-400">
                                                        + {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                    {msg.role === 'assistant' ? 'AI Assistant' : 'You'} • Just now
                                </span>
                            </div>
                        </div>
                    ))}

                    {isGenerating && (
                        <div className="flex gap-4 animate-pulse">
                            <div className="w-8 h-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-4 rounded-tr-sm rounded-br-sm rounded-bl-sm shadow-sm flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-sm text-slate-500 font-medium">Analyzing requirements...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl z-20">
                    <div className="flex gap-0 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Describe the survey you want to generate..."
                            className="flex-1 px-4 py-3 bg-transparent border-none text-sm focus:outline-none"
                        />
                        <div className="p-1">
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isGenerating}
                                className="h-full px-4 rounded-none bg-slate-900 hover:bg-slate-800 text-white shadow-md gap-2"
                            >
                                <Sparkles className="w-4 h-4" /> Generate
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Context:</span>
                        <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors"><Palette className="w-3.5 h-3.5" /> Brand Tone</button>
                        <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors"><Users className="w-3.5 h-3.5" /> Target Persona</button>
                        <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors"><Target className="w-3.5 h-3.5" /> Objectives</button>
                    </div>
                </div>
            </div>

            {/* Preview Panel - Fixed Sidebar */}
            <div className="w-96 flex flex-col bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Live Preview</h3>
                        <p className="text-xs text-slate-500">{allQuestions.length} questions ready</p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none hover:bg-slate-100">
                            <Copy className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none hover:bg-slate-100">
                            <Download className="w-4 h-4 text-slate-500" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
                    {allQuestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-sm font-medium">No questions generated yet</p>
                            <p className="text-xs mt-1 text-slate-500 text-center px-8">Start chatting with the AI to build your survey</p>
                        </div>
                    ) : (
                        allQuestions.map((q, i) => (
                            <div key={q.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm group hover:border-blue-400 transition-colors cursor-grab active:cursor-grabbing">
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-none flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-1 leading-snug">{q.text}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-50 px-1 border border-slate-100">{q.type.replace('_', ' ')}</span>
                                            {q.required && <span className="text-[10px] text-rose-500 font-bold">* Req</span>}
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <Button className="w-full gap-2 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" disabled={allQuestions.length === 0}>
                        <CheckCircle className="w-4 h-4" /> Finalize Survey ({allQuestions.length})
                    </Button>
                </div>
            </div>
        </div>
    )
}
