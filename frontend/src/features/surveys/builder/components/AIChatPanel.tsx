import { useState, useRef, useEffect } from 'react'
import { useSurveyBuilder } from '../contexts/SurveyBuilderContext'
import { cn } from '@/utils'
import {
    Send, X, Sparkles, RefreshCw, ThumbsUp, ThumbsDown,
    ChevronRight, Loader2, Home, FileText, MapPin, Building,
    CreditCard, Star, Clipboard, Users
} from 'lucide-react'

// ============ TEMPLATE CHIPS ============

const TEMPLATE_CHIPS = [
    { id: 'buyer-intent', label: 'Buyer Intent', icon: Home, color: 'blue' },
    { id: 'loan-prequal', label: 'Loan Prequal', icon: CreditCard, color: 'green' },
    { id: 'flat-discovery', label: 'Flat Discovery', icon: Building, color: 'purple' },
    { id: 'site-visit', label: 'Site Visit Feedback', icon: MapPin, color: 'orange' },
    { id: 'loan-experience', label: 'Loan Experience', icon: FileText, color: 'teal' },
    { id: 'post-purchase', label: 'Post-Purchase', icon: Star, color: 'pink' },
    { id: 'villa-interest', label: 'Villa Interest', icon: Home, color: 'amber' },
    { id: 'bhk-preference', label: 'BHK Preference', icon: Building, color: 'cyan' }
]

const CHIP_COLORS = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    teal: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
    pink: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
}

// ============ MESSAGE BUBBLE ============

interface MessageBubbleProps {
    role: 'user' | 'ai'
    content: string
    timestamp: string
    liked?: boolean
    disliked?: boolean
    onRegenerate?: () => void
    onLike?: () => void
    onDislike?: () => void
}

function MessageBubble({ role, content, timestamp, liked, disliked, onRegenerate, onLike, onDislike }: MessageBubbleProps) {
    const isAI = role === 'ai'

    return (
        <div className={cn("flex gap-3", isAI ? "" : "flex-row-reverse")}>
            {/* Avatar */}
            <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                isAI ? "bg-gradient-to-br from-blue-600 to-purple-600" : "bg-slate-200"
            )}>
                {isAI ? (
                    <Sparkles className="w-4 h-4 text-white" />
                ) : (
                    <Users className="w-4 h-4 text-slate-600" />
                )}
            </div>

            {/* Content */}
            <div className={cn("flex-1 max-w-[85%]", isAI ? "" : "flex flex-col items-end")}>
                <div className={cn(
                    "px-4 py-3 rounded-xl text-sm",
                    isAI
                        ? "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                        : "bg-blue-600 text-white rounded-tr-none"
                )}>
                    {content}
                </div>

                {/* Meta & Actions */}
                <div className={cn(
                    "flex items-center gap-2 mt-1.5",
                    isAI ? "" : "flex-row-reverse"
                )}>
                    <span className="text-[10px] text-slate-400">
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {isAI && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onRegenerate}
                                className="p-1 hover:bg-slate-100 rounded transition-colors"
                                title="Regenerate"
                            >
                                <RefreshCw className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                            </button>
                            <button
                                onClick={onLike}
                                className={cn(
                                    "p-1 rounded transition-colors",
                                    liked ? "bg-green-100" : "hover:bg-slate-100"
                                )}
                                title="Like"
                            >
                                <ThumbsUp className={cn("w-3 h-3", liked ? "text-green-600" : "text-slate-400 hover:text-slate-600")} />
                            </button>
                            <button
                                onClick={onDislike}
                                className={cn(
                                    "p-1 rounded transition-colors",
                                    disliked ? "bg-red-100" : "hover:bg-slate-100"
                                )}
                                title="Dislike"
                            >
                                <ThumbsDown className={cn("w-3 h-3", disliked ? "text-red-600" : "text-slate-400 hover:text-slate-600")} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ============ TYPING INDICATOR ============

function TypingIndicator() {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-xl rounded-tl-none">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    )
}

// ============ MAIN COMPONENT ============

export function AIChatPanel() {
    const { aiPanelOpen, setAiPanelOpen, chatMessages, addChatMessage } = useSurveyBuilder()
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages, isTyping])

    const handleSend = () => {
        if (!input.trim()) return

        // Add user message
        addChatMessage({ role: 'user', content: input.trim() })
        setInput('')
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            setIsTyping(false)
            addChatMessage({
                role: 'ai',
                content: generateAIResponse(input.trim())
            })
        }, 1500)
    }

    const handleTemplateClick = (templateId: string) => {
        const template = TEMPLATE_CHIPS.find(t => t.id === templateId)
        if (!template) return

        addChatMessage({
            role: 'user',
            content: `Create a ${template.label} survey for housing finance leads`
        })
        setIsTyping(true)

        setTimeout(() => {
            setIsTyping(false)
            addChatMessage({
                role: 'ai',
                content: `I've created a ${template.label} survey template with the following structure:\n\n` +
                    `✅ 5 pre-qualified questions\n` +
                    `✅ Branching logic for loan intent\n` +
                    `✅ Score weighting for lead quality\n` +
                    `✅ Mobile-optimized layout\n\n` +
                    `The survey is now loaded in the Follow-ups tab. Would you like me to customize any questions?`
            })
        }, 2000)
    }

    return (
        <>
            {/* Backdrop for mobile */}
            {aiPanelOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setAiPanelOpen(false)}
                />
            )}

            {/* Panel */}
            <div className={cn(
                "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-out",
                aiPanelOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">AI Survey Builder</h3>
                            <p className="text-xs text-slate-500">Build surveys with natural language</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setAiPanelOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Template Chips */}
                {chatMessages.length === 0 && (
                    <div className="px-5 py-4 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Quick Templates</p>
                        <div className="flex flex-wrap gap-2">
                            {TEMPLATE_CHIPS.map((chip) => {
                                const Icon = chip.icon
                                return (
                                    <button
                                        key={chip.id}
                                        onClick={() => handleTemplateClick(chip.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
                                            CHIP_COLORS[chip.color as keyof typeof CHIP_COLORS]
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {chip.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-auto p-5 space-y-4">
                    {chatMessages.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                <Clipboard className="w-8 h-8 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-slate-800 mb-2">Create Your Survey</h4>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                Click a template above or describe what you need. I'll build the perfect survey for your housing finance leads.
                            </p>
                        </div>
                    )}

                    {chatMessages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            role={msg.role}
                            content={msg.content}
                            timestamp={msg.timestamp}
                            liked={msg.liked}
                            disliked={msg.disliked}
                        />
                    ))}

                    {isTyping && <TypingIndicator />}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-5 py-4 border-t border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Describe your survey or ask a question..."
                            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className={cn(
                                "p-3 rounded-xl transition-all flex items-center justify-center",
                                input.trim() && !isTyping
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            {isTyping ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-center">
                        AI-powered survey creation for Housing Finance & Real Estate
                    </p>
                </div>
            </div>
        </>
    )
}

// ============ HELPERS ============

function generateAIResponse(input: string): string {
    const lower = input.toLowerCase()

    if (lower.includes('loan') || lower.includes('prequal')) {
        return `I'll create a Loan Prequalification survey with these questions:\n\n` +
            `1. Are you currently employed? (Yes/No)\n` +
            `2. What is your monthly income range?\n` +
            `3. Do you have existing EMIs? (Yes/No)\n` +
            `4. What is your expected loan amount?\n` +
            `5. Have you checked your credit score recently?\n\n` +
            `This flow will automatically score leads and route high-intent buyers to your loan partners.`
    }

    if (lower.includes('bhk') || lower.includes('bedroom')) {
        return `Great! I'll add BHK preference questions:\n\n` +
            `• 1 BHK (Score: 5)\n` +
            `• 2 BHK (Score: 10)\n` +
            `• 3 BHK (Score: 15)\n` +
            `• 4+ BHK (Score: 20)\n\n` +
            `Each selection will branch into budget ranges specific to that configuration.`
    }

    if (lower.includes('budget') || lower.includes('price')) {
        return `I've added budget range questions with these tiers:\n\n` +
            `• Under ₹30 Lakhs\n` +
            `• ₹30L - ₹50L\n` +
            `• ₹50L - ₹1 Cr\n` +
            `• ₹1 Cr - ₹2 Cr\n` +
            `• Above ₹2 Cr\n\n` +
            `Higher budgets automatically increase lead scores.`
    }

    return `I understand you want to customize the survey. Here's what I can help with:\n\n` +
        `📝 Add/modify questions\n` +
        `🔀 Set up branching logic\n` +
        `📊 Configure scoring weights\n` +
        `🎯 Optimize for lead qualification\n\n` +
        `Just tell me what you'd like to change!`
}
