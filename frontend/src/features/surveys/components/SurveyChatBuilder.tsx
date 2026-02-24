import { useState, useRef, useEffect } from 'react'
import { Send, X, Bot, User, Sparkles, Play } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

interface Message {
    id: string
    role: 'ai' | 'user'
    content: string
    timestamp: Date
}

interface Question {
    id: string
    text: string
    type: 'rating' | 'text' | 'choice' | 'nps'
    options?: string[]
}

export function SurveyChatBuilder({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: "Hi! I'm your AI survey assistant. What kind of feedback are you looking to collect today?", timestamp: new Date() }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [generatedSurvey, setGeneratedSurvey] = useState<Question[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Mock AI Response Logic
        setTimeout(() => {
            let aiContent = "I can help with that."
            let newQuestions: Question[] = []

            if (input.toLowerCase().includes('satisfaction') || input.toLowerCase().includes('customer')) {
                aiContent = "Great! A Customer Satisfaction (CSAT) survey is perfect for valid insights. I've drafted a few questions focusing on service quality and responsiveness. How does this look?"
                newQuestions = [
                    { id: 'q1', text: 'How satisfied are you with our service?', type: 'rating' },
                    { id: 'q2', text: 'What did you like most about your experience?', type: 'text' },
                    { id: 'q3', text: 'How likely are you to recommend us?', type: 'nps' }
                ]
            } else if (input.toLowerCase().includes('product') || input.toLowerCase().includes('feature')) {
                aiContent = "Understood. For product feedback, it's good to ask about specific features and ease of use. I've generated a template for you."
                newQuestions = [
                    { id: 'q1', text: 'Which feature do you use the most?', type: 'choice', options: ['Dashboard', 'Reports', 'Settings'] },
                    { id: 'q2', text: 'How easy was it to get started?', type: 'rating' },
                    { id: 'q3', text: 'Any suggestions for improvement?', type: 'text' }
                ]
            } else {
                aiContent = "I've created a general feedback form based on your request. You can refine it by asking me to 'add a question about pricing' or 'remove the last question'."
                newQuestions = [
                    { id: 'q1', text: 'How would you rate your overall experience?', type: 'rating' },
                    { id: 'q2', text: 'Do you have any additional comments?', type: 'text' }
                ]
            }

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: aiContent, timestamp: new Date() }
            setMessages(prev => [...prev, aiMsg])
            setGeneratedSurvey(newQuestions)
            setIsTyping(false)
        }, 1500)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[85vh] flex rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* Left: Chat Interface */}
                <div className="w-1/3 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg shadow-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">AI Builder</h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex gap-3 max-w-[90%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                    msg.role === 'ai' ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" : "bg-blue-600 text-white"
                                )}>
                                    {msg.role === 'ai' ? <Sparkles className="w-4 h-4 text-purple-500" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm shadow-sm",
                                    msg.role === 'ai' ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-200 dark:border-slate-700" : "bg-blue-600 text-white rounded-tr-none"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Describe your survey..."
                                className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Live Preview */}
                <div className="w-2/3 flex flex-col bg-slate-100 dark:bg-slate-950 relative">
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full bg-white/50 backdrop-blur hover:bg-white dark:bg-black/20 dark:hover:bg-black/40">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 flex items-center justify-center">
                        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[500px] flex flex-col">
                            {/* Survey Header (Mock) */}
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                                <h1 className="text-3xl font-display font-bold">Feedback Survey</h1>
                                <p className="opacity-90 mt-2">We value your opinion.</p>
                            </div>

                            <div className="p-8 space-y-8 flex-1">
                                {generatedSurvey.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-20">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Sparkles className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p>Chat with AI to generate your survey...</p>
                                    </div>
                                ) : (
                                    generatedSurvey.map((q, i) => (
                                        <div key={q.id} className="space-y-3 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                            <label className="block text-sm font-bold text-slate-900 dark:text-white">
                                                <span className="mr-2 text-slate-400">{i + 1}.</span>
                                                {q.text} <span className="text-red-500">*</span>
                                            </label>

                                            {q.type === 'text' && (
                                                <input disabled className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-not-allowed" placeholder="Type your answer..." />
                                            )}

                                            {q.type === 'rating' && (
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map(n => (
                                                        <div key={n} className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-500 hover:border-purple-500 cursor-pointer transition-colors">
                                                            {n}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === 'nps' && (
                                                <div className="flex gap-1 overflow-x-auto pb-2">
                                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                        <div key={n} className="min-w-[36px] h-9 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer">
                                                            {n}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === 'choice' && (
                                                <div className="space-y-2">
                                                    {q.options?.map(opt => (
                                                        <div key={opt} className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                                                            <div className="w-4 h-4 rounded-full border border-slate-300" />
                                                            <span className="text-sm">{opt}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Survey Footer */}
                            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-1/3" />
                                </div>
                                <Button disabled className="opacity-50 cursor-not-allowed">Submit</Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                            Preview Mode • {generatedSurvey.length} Questions
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost">Save Draft</Button>
                            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 border-none">
                                <Play className="w-4 h-4" /> Publish Survey
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
