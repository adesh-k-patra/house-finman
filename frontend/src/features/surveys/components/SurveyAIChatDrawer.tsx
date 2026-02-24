import { useState, useRef, useEffect } from 'react'
import { SideDrawer } from '@/components/ui'
import { Sparkles, Send, User } from 'lucide-react'
import { cn } from '@/utils'

interface SurveyAIChatDrawerProps {
    isOpen: boolean
    onClose: () => void
}

interface Message {
    id: string
    role: 'user' | 'assistant' | 'ai'
    content: string
    timestamp: Date
}

export function SurveyAIChatDrawer({ isOpen, onClose }: SurveyAIChatDrawerProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your AI Survey Assistant. I can help you analyze survey data, find specific feedback, or summarize trends. What would you like to know?",
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSend = async (message: string) => {
        if (!message?.trim()) return

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, newUserMessage])
        setInputValue('')
        setIsTyping(true)

        // Simulate AI processing
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: generateMockResponse(newUserMessage.content),
                timestamp: new Date()
            }
            setMessages(prev => [...prev.map(m => ({ ...m, role: m.role as 'user' | 'assistant' })), aiResponse])
            setIsTyping(false)
        }, 1500)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend(inputValue)
        }
    }

    const generateMockResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase()
        if (lowerQuery.includes('churn') || lowerQuery.includes('risk')) {
            return "Based on recent feedback, the 'Churn Feedback' survey indicates a 15% increase in pricing-related complaints. 3 users specifically mentioned 'competitor offers' as a reason for leaving."
        }
        if (lowerQuery.includes('positive') || lowerQuery.includes('good')) {
            return "The 'Loan Experience' survey is performing well with a CSAT of 4.8/5. Customers particularly appreciate the 'fast disbursement' process."
        }
        if (lowerQuery.includes('summary') || lowerQuery.includes('trend')) {
            return "Overall, response rates are up by 12% this month. The key trend is a shift towards mobile-first engagement, with WhatsApp responses overtaking email by a 2:1 margin."
        }
        return "I found 12 responses matching your query across active surveys. Would you like me to generate a detailed report or filter the view?"
    }

    const footerContent = (
        <div className="w-full flex flex-col gap-4">
            {/* Suggestions */}
            {messages.length < 3 && (
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {[
                        "Summarize positive feedback",
                        "Identify churn risks",
                        "What are the top complaints?",
                        "Draft a response for..."
                    ].map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSend(suggestion)}
                            className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-xs text-slate-600 hover:text-purple-700 transition-colors rounded-none font-medium"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            <div className="relative flex items-end gap-2">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask anything about your survey data..."
                    rows={1}
                    className="flex-1 min-h-[44px] max-h-[120px] py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-none resize-none text-sm placeholder:text-slate-400 focus:outline-none transition-all"
                    style={{ height: 'auto' }}
                />
                <button
                    onClick={() => handleSend(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className={cn(
                        "h-[44px] px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center",
                        "active:bg-purple-800"
                    )}
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
            <div className="text-center">
                <span className="text-[10px] text-slate-400">AI can make mistakes. Verify important info.</span>
            </div>
        </div>
    )

    return (
        <SideDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-none">AI Insights</h2>
                        <p className="text-xs text-slate-400 mt-1 font-normal">Powered by OrionIQ</p>
                    </div>
                </div>
            }
            // Custom dark header styling
            headerClassName="bg-[#0f172a] border-b border-white/10 py-5"
            closeButtonClassName="text-slate-400 hover:text-white hover:bg-white/10 rounded-none"
            footer={footerContent}
            noContentPadding
        >
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-4 animate-fade-in-up",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-none flex items-center justify-center flex-shrink-0 shadow-sm",
                                msg.role === 'ai' ? "bg-purple-600 text-white" : "bg-white border border-slate-200 text-slate-600"
                            )}>
                                {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className={cn(
                                "max-w-[85%] p-4 text-sm shadow-sm border",
                                msg.role === 'user'
                                    ? "bg-white text-slate-800 border-slate-200 rounded-none rounded-bl-xl"
                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 rounded-none rounded-br-xl"
                            )}>
                                <p className="leading-relaxed">{msg.content}</p>
                                <span className="text-[10px] text-slate-400 mt-2 block opacity-70">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-4 items-center animate-pulse">
                            <div className="w-8 h-8 bg-purple-600/20 text-purple-600 rounded-none flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="text-xs font-medium text-slate-500">
                                AI is analyzing responses...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </SideDrawer>
    )
}
