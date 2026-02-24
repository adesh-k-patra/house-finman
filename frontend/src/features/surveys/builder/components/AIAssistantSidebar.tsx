import { useState, useEffect, useRef } from 'react'
import { cn } from '@/utils'
import {
    X, Bot, Send, Copy, ThumbsUp, ThumbsDown, Sparkles,
    Zap, FileText, BarChart3, ArrowRight,
    CheckCircle, Maximize2, Minimize2,
    Layout, Monitor, Smartphone, Columns,
    Move
} from 'lucide-react'
import { Hypothesis } from '../contexts/SurveyBuilderContext'
import { motion, AnimatePresence } from 'framer-motion'

// ============ TYPES ============

interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    actions?: { label: string; onClick: () => void }[]
}

export interface AIAssistantSidebarProps {
    isOpen: boolean
    onClose: () => void
    hypothesis: Hypothesis | null
}

type ViewMode = 'compact' | 'standard' | 'canvas' | 'immersive'

// ============ REUSABLE COMPONENTS ============

function SuggestionChip({ label, onClick, icon: Icon }: { label: string, onClick: () => void, icon?: any }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 hover:border-blue-500/50 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-all shadow-sm rounded-lg group"
        >
            {Icon && <Icon className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-400 transition-colors" />}
            {label}
        </motion.button>
    )
}

function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === 'user'
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn("flex gap-4 group", isUser ? "flex-row-reverse" : "flex-row")}
        >
            {/* Avatar */}
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border backdrop-blur-xl z-10",
                isUser
                    ? "bg-blue-600/90 border-blue-400/50 text-white"
                    : "bg-white/80 dark:bg-slate-900/80 border-white/40 dark:border-white/10"
            )}>
                {isUser ? <div className="w-2 h-2 bg-white rounded-full" /> : <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />}
            </div>

            {/* Content */}
            <div className={cn(
                "max-w-[85%] relative",
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "p-4 text-sm shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl border relative overflow-hidden",
                    isUser
                        ? "bg-blue-600/90 text-white rounded-2xl rounded-tr-sm border-blue-500/50"
                        : "bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-sm border-white/20 dark:border-white/10"
                )}>
                    {/* Glass Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                    </div>

                    {message.actions && (
                        <div className="flex flex-wrap gap-2 mt-3 relative z-10">
                            {message.actions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={action.onClick}
                                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                                >
                                    <Zap className="w-3 h-3" />
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Meta */}
                {!isUser && (
                    <div className="flex items-center gap-2 mt-1.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={handleCopy} className="p-1 text-slate-400 hover:text-blue-500 transition-colors" title="Copy">
                            {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button className="p-1 text-slate-400 hover:text-emerald-500 transition-colors" title="Helpful">
                            <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-500 transition-colors" title="Not Helpful">
                            <ThumbsDown className="w-3 h-3" />
                        </button>
                        <span className="text-[10px] text-slate-300 ml-auto">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ============ MAIN COMPONENT ============

export function AIAssistantSidebar({ isOpen, onClose, hypothesis }: AIAssistantSidebarProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [viewMode, setViewMode] = useState<ViewMode>('compact')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    role: 'assistant',
                    content: "Hello! I'm your AI Survey Architect. \n\nI can help you draft questions, analyze logic, or optimize your flow. \n\nTry asking: \n\"Add a logic rule for budget\" or \"Suggest pro-tips for this section\".",
                    timestamp: new Date(),
                    actions: [
                        { label: 'Draft Questions', onClick: () => setInput("Draft some questions about user preference") },
                        { label: 'Analyze Logic', onClick: () => setInput("Analyze the current logic flow") }
                    ]
                }
            ])
        }
    }, [isOpen])

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping, viewMode])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I can certainly help with "${userMsg.content}". \n\nHere is a suggested approach based on best practices...`,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    const getViewStyles = (mode: ViewMode) => {
        switch (mode) {
            case 'compact': return "w-[360px] right-6 bottom-6 h-[600px] rounded-3xl"
            case 'standard': return "w-[480px] right-0 top-0 h-full rounded-l-3xl rounded-r-none" // Sidebar style
            case 'canvas': return "w-[800px] left-1/2 -translate-x-1/2 top-10 bottom-10 rounded-3xl" // Floating centered
            case 'immersive': return "inset-0 w-full h-full rounded-none backdrop-blur-2xl bg-slate-900/90" // Fullscreen
            default: return "w-[360px] right-6 bottom-6 h-[600px] rounded-3xl"
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {/* Backdrop for focused modes */}
            {(viewMode === 'canvas' || viewMode === 'immersive') && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
                    onClick={onClose}
                />
            )}

            <motion.div
                ref={containerRef}
                layout
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{
                    opacity: 1,
                    x: viewMode === 'canvas' ? '-50%' : 0,
                    scale: 1,
                    top: viewMode === 'canvas' ? 40 : (viewMode === 'standard' || viewMode === 'immersive') ? 0 : 'auto',
                    bottom: (viewMode === 'standard' || viewMode === 'immersive') ? 0 : 24,
                    right: (viewMode === 'canvas') ? 'auto' : (viewMode === 'standard' || viewMode === 'immersive') ? 0 : 24,
                }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={cn(
                    "fixed z-[100] flex flex-col shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden",
                    "bg-slate-900/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-900/60",
                    getViewStyles(viewMode)
                )}
                style={viewMode === 'canvas' ? { left: '50%' } : {}}
            >
                {/* 1. Header (Glassmorphic) */}
                <div className="flex-shrink-0 px-5 py-4 flex items-center justify-between border-b border-white/10 bg-white/5 relative z-20 cursor-move"
                // Drag handle logic could go here if using dnd-kit
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-wide">AI Architect</h3>
                            <p className="text-[10px] text-slate-400 font-medium">{isTyping ? "Thinking..." : "Online & Ready"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                        <button
                            onClick={() => setViewMode('compact')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'compact' ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300")}
                            title="Compact View"
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode('standard')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'standard' ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300")}
                            title="Sidebar View"
                        >
                            <Columns className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode('canvas')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'canvas' ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300")}
                            title="Canvas View"
                        >
                            <Layout className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode('immersive')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'immersive' ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300")}
                            title="Immersive View"
                        >
                            <Monitor className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        <button onClick={onClose} className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 2. Messages Area */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {/* Welcome / Empty State */}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                            <Sparkles className="w-12 h-12 text-slate-500" />
                            <p className="text-slate-400 text-sm">Start a conversation...</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                                <Bot className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* 3. Input Area */}
                <div className="flex-shrink-0 p-5 bg-white/5 border-t border-white/10 backdrop-blur-md relative z-20">
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                        <SuggestionChip label="Review logic" onClick={() => setInput("Review the logic in section 2")} icon={FileText} />
                        <SuggestionChip label="Add budget question" onClick={() => setInput("Add a question about budget")} icon={Zap} />
                        <SuggestionChip label="Analyze drop-off" onClick={() => setInput("Where are users dropping off?")} icon={BarChart3} />
                    </div>

                    <div className="relative group">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                            placeholder="Ask me anything..."
                            className="w-full bg-black/20 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all resize-none shadow-inner h-[52px] max-h-[120px]"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="absolute right-2 top-2 p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg text-white shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:shadow-none hover:shadow-blue-500/30 hover:scale-105 transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1">
                        <span>Press Enter to send</span>
                        <div className="flex gap-2">
                            <span>Powered by Gemini</span>
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
