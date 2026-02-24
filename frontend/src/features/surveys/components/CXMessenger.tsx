import { useState } from 'react'
import {
    Search, User, Send, Paperclip, MoreVertical, CheckCircle,
    Phone, Clock, AlertTriangle, MessageSquare, Zap,
    Star, ArrowUpRight, X,
    ShieldCheck, CornerUpLeft
} from 'lucide-react'
import { Button, KPICard } from '@/components/ui'
import { cn } from '@/utils'

// ============ MOCK DATA ============

const threads = [
    { id: 1, name: 'Ramesh Kumar', phone: '+91 98765 43210', lastMessage: 'I have not received the confirmation...', time: '2m ago', status: 'open', priority: 'high', sla: '1h 45m', sentiment: 'negative', nps: 3 },
    { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', lastMessage: 'Thank you for the quick response!', time: '15m ago', status: 'resolved', priority: 'low', sla: null, sentiment: 'positive', nps: 9 },
    { id: 3, name: 'Amit Patel', phone: '+91 76543 21098', lastMessage: 'When will my documents be verified?', time: '1h ago', status: 'open', priority: 'medium', sla: '45m', sentiment: 'neutral', nps: 6 },
    { id: 4, name: 'Sunita Devi', phone: '+91 65432 10987', lastMessage: 'The agent was very helpful during...', time: '2h ago', status: 'pending', priority: 'low', sla: '2h 30m', sentiment: 'positive', nps: 8 },
    { id: 5, name: 'Vikram Singh', phone: '+91 54321 09876', lastMessage: 'Still waiting for callback...', time: '3h ago', status: 'escalated', priority: 'critical', sla: '30m', sentiment: 'negative', nps: 2 },
]

const messages = [
    { id: 1, sender: 'customer', text: 'Hi, I submitted my loan application 3 days ago but haven\'t heard anything back.', time: '10:30 AM', status: 'delivered' },
    { id: 2, sender: 'agent', text: 'Hello! Thank you for reaching out. Let me check the status of your application. Could you please provide your application reference number?', time: '10:32 AM', status: 'read' },
    { id: 3, sender: 'customer', text: 'Sure, it\'s HFL-2024-78432', time: '10:33 AM', status: 'delivered' },
    { id: 4, sender: 'agent', text: 'Thank you! I can see your application is currently under document verification. Our team is reviewing the income proof documents you submitted.', time: '10:35 AM', status: 'read' },
    { id: 5, sender: 'customer', text: 'How long will this take? I need the loan approved by next week.', time: '10:36 AM', status: 'delivered' },
    { id: 6, sender: 'system', text: 'AI Suggestion: Offer expedited processing or provide specific timeline based on current queue.', time: '10:36 AM', isAiSuggestion: true },
]

const templates = [
    { id: 1, name: 'Acknowledgment', text: 'Thank you for contacting HouseFin. We have received your query and will respond within 24 hours.' },
    { id: 2, name: 'Document Request', text: 'To proceed with your application, please submit the following documents: [List documents]' },
    { id: 3, name: 'Status Update', text: 'Your application (Ref: {ref_no}) is currently at {stage} stage. Expected completion: {eta}' },
    { id: 4, name: 'Resolution', text: 'Your query has been resolved. If you have any further questions, please don\'t hesitate to reach out.' },
    { id: 5, name: 'Callback Schedule', text: 'We have scheduled a callback for {date} at {time}. Our representative will contact you on {phone}.' },
    { id: 6, name: 'Escalation Notice', text: 'Your concern has been escalated to our senior team. You will receive a response within {hours} hours.' },
]

// ============ COMPONENTS ============

const ThreadItem = ({ thread, isActive, onClick }: { thread: any, isActive: boolean, onClick: () => void }) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-all group relative",
                isActive
                    ? "bg-slate-50 dark:bg-blue-900/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
        >
            {/* Active Indicator Bar */}
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}

            <div className="flex items-start gap-3">
                <div className="relative">
                    <div className={cn(
                        "w-10 h-10 flex items-center justify-center text-xs font-black shrink-0 rounded-none border shadow-sm",
                        thread.sentiment === 'positive' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                            thread.sentiment === 'negative' ? "bg-rose-100 text-rose-700 border-rose-200" :
                                "bg-slate-100 text-slate-600 border-slate-200"
                    )}>
                        {thread.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    {thread.priority === 'critical' && (
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={cn(
                            "font-bold text-sm truncate transition-colors",
                            isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-900 dark:text-white group-hover:text-blue-600"
                        )}>{thread.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{thread.time}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2.5 leading-relaxed font-medium">{thread.lastMessage}</p>

                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "px-1.5 py-0.5 text-[9px] font-bold uppercase border tracking-wider rounded-sm",
                            thread.status === 'open' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                thread.status === 'resolved' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                    thread.status === 'escalated' ? "bg-rose-50 text-rose-700 border-rose-200" :
                                        "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                            {thread.status}
                        </span>

                        {thread.sla && (
                            <span className={cn(
                                "flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 border rounded-sm",
                                thread.sla.includes('m') && !thread.sla.includes('h')
                                    ? "text-rose-600 border-rose-200 bg-rose-50"
                                    : "text-slate-500 border-slate-200 bg-slate-50"
                            )}>
                                <Clock className="w-2.5 h-2.5" />
                                {thread.sla}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function MessageBubble({ message }: { message: typeof messages[0] }) {
    if (message.isAiSuggestion) {
        return (
            <div className="flex justify-center my-6 animate-fade-in-up">
                <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 border border-violet-200 dark:border-violet-800 p-0 max-w-lg shadow-sm relative overflow-hidden group w-full mx-4 sm:mx-0 sm:w-auto">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-fuchsia-600"></div>
                    <div className="p-3 border-b border-violet-100 dark:border-violet-800/50 flex items-center justify-between bg-white/50 dark:bg-black/20">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-violet-600 text-white rounded-none">
                                <Zap className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-widest">AI Insight Generated</span>
                        </div>
                        <span className="text-[10px] text-violet-400 font-mono">CONFIDENCE: 94%</span>
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{message.text}</p>
                    </div>
                    <div className="p-2 bg-violet-100/50 dark:bg-violet-900/30 flex gap-2 justify-end">
                        <button className="text-xs px-3 py-1.5 bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <CheckCircle className="w-3 h-3" /> Apply
                        </button>
                        <button className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 font-bold hover:bg-violet-50 transition-colors uppercase tracking-wider flex items-center gap-1">
                            <CornerUpLeft className="w-3 h-3" /> Edit
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const isAgent = message.sender === 'agent'
    return (
        <div className={cn("flex mb-6 group", isAgent ? "justify-end" : "justify-start")}>
            <div className={cn("flex flex-col max-w-[75%]", isAgent ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isAgent ? 'Support Agent' : 'Customer'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">• {message.time}</span>
                </div>

                <div className={cn(
                    "px-5 py-3.5 border shadow-sm relative",
                    isAgent
                        ? "bg-slate-900 text-white border-slate-900 rounded-tr-none rounded-bl-sm rounded-tl-sm rounded-br-sm" // Sharp edges typical of premium look
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700 rounded-tl-none rounded-tr-sm rounded-br-sm rounded-bl-sm"
                )}>
                    {/* Tick for chat bubble */}
                    <div className={cn(
                        "absolute top-0 w-3 h-3 border-t bg-inherit border-inherit",
                        isAgent
                            ? "-right-1.5 skew-x-[45deg] border-r" // Right side tick
                            : "-left-1.5 skew-x-[-45deg] border-l" + (isAgent ? "" : " border-l") // Left side tick
                    )} />

                    <p className="text-sm leading-relaxed relative z-10">{message.text}</p>
                </div>

                {isAgent && (
                    <div className="flex items-center gap-1 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-slate-400">Read</span>
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                )}
            </div>
        </div>
    )
}

// ============ MAIN COMPONENT ============

export function CXMessenger() {
    const [threadsList, setThreadsList] = useState(threads)
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(1)
    const [newMessage, setNewMessage] = useState('')
    const [showTemplates, setShowTemplates] = useState(false)
    const [filter, setFilter] = useState<'all' | 'open' | 'escalated' | 'resolved'>('all')

    const filteredThreads = threadsList.filter(t => filter === 'all' || t.status === filter)
    const currentThread = threadsList.find(t => t.id === selectedThreadId)

    const handleStatusChange = (status: string) => {
        if (!currentThread) return
        setThreadsList(prev => prev.map(t => t.id === currentThread.id ? { ...t, status } : t))
    }

    return (
        <div className="flex h-[750px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in">
            {/* Thread List Sidebar */}
            <div className="w-80 md:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-950">
                {/* Search & Filter Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    <div className="flex bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 gap-1">
                        {(['all', 'open', 'escalated', 'resolved'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border",
                                    filter === f
                                        ? f === 'open' ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                            : f === 'escalated' ? "bg-rose-600 text-white border-rose-600 shadow-md"
                                                : f === 'resolved' ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                                                    : "bg-slate-800 text-white border-slate-800 shadow-md"
                                        : "bg-white dark:bg-slate-950 text-slate-500 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dashboard Mini-Stats - KPI Style */}
                <div className="grid grid-cols-3 gap-2 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <KPICard
                        title="Open"
                        value="12"
                        icon={<MessageSquare />}
                        variant="blue"
                        compact
                    />
                    <KPICard
                        title="Critical"
                        value="3"
                        icon={<AlertTriangle />}
                        variant="rose"
                        compact
                    />
                    <KPICard
                        title="Avg SLA"
                        value="4m"
                        icon={<Clock />}
                        variant="purple"
                        compact
                    />
                </div>

                {/* Thread List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {filteredThreads.map(thread => (
                        <ThreadItem
                            key={thread.id}
                            thread={thread}
                            isActive={selectedThreadId === thread.id}
                            onClick={() => setSelectedThreadId(thread.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            {selectedThreadId && currentThread ? (
                <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/20 relative">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm z-10 sticky top-0">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className={cn(
                                    "w-12 h-12 flex items-center justify-center text-lg font-black rounded-none border-2",
                                    currentThread.sentiment === 'positive' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                        currentThread.sentiment === 'negative' ? "bg-rose-50 text-rose-700 border-rose-200" :
                                            "bg-slate-50 text-slate-600 border-slate-200"
                                )}>
                                    {currentThread.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 border border-slate-200 dark:border-slate-800">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{currentThread.name}</h3>
                                    <span className={cn(
                                        "px-2 py-0.5 text-[10px] font-bold uppercase border tracking-wider",
                                        currentThread.status === 'open' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-700 border-slate-200"
                                    )}>
                                        {currentThread.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer transition-colors"><Phone className="w-3 h-3" /> {currentThread.phone}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="flex items-center gap-1.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> NPS: {currentThread.nps}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 gap-2 rounded-none border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-900 dark:text-purple-400 dark:hover:bg-purple-900/20"
                            >
                                <Zap className="w-4 h-4 fill-purple-700/20" /> Autopilot
                            </Button>

                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2" />

                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-none text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                                <Phone className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-none text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                onClick={() => handleStatusChange('escalated')}
                                title="Escalate"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-none text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                onClick={() => handleStatusChange('resolved')}
                                title="Resolve"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-none text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
                        <div className="flex justify-center mb-6">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                                Today, January 28
                            </span>
                        </div>
                        {messages.map(msg => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-lg z-20">
                        {showTemplates && (
                            <div className="mb-4 bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 animate-slide-up shadow-inner">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Quick Response Templates</h4>
                                    <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {templates.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => { setNewMessage(t.text); setShowTemplates(false) }}
                                            className="text-left p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-md transition-all group"
                                        >
                                            <p className="font-bold text-xs text-slate-900 dark:text-white mb-1 group-hover:text-blue-600">{t.name}</p>
                                            <p className="text-[10px] text-slate-500 line-clamp-2">{t.text}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-1 px-1">
                                <button
                                    onClick={() => setShowTemplates(!showTemplates)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-sm transition-colors"
                                >
                                    <MessageSquare className="w-3 h-3" /> Templates
                                </button>
                                <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-sm transition-colors">
                                    <Zap className="w-3 h-3" /> AI Enhancer
                                </button>
                                <div className="flex-1" />
                                <span className="text-[10px] font-mono text-slate-300">Markdown supported</span>
                            </div>

                            <div className="flex items-start gap-0 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
                                <div className="flex flex-col p-2 gap-2 border-r border-slate-100 dark:border-slate-800">
                                    <button className="text-slate-400 hover:text-slate-600 p-1">
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <button className="text-slate-400 hover:text-slate-600 p-1">
                                        <User className="w-4 h-4" />
                                    </button>
                                </div>
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="flex-1 px-4 py-3 bg-transparent border-none text-sm resize-none focus:outline-none min-h-[50px] max-h-[150px]"
                                    rows={2}
                                />
                                <div className="p-2 self-end">
                                    <Button className="h-10 w-10 p-0 rounded-none bg-slate-900 hover:bg-slate-800 text-white shadow-md">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 border-l border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <MessageSquare className="w-10 h-10 opacity-50" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Conversation Selected</h3>
                    <p className="text-sm text-slate-500">Select a thread from the list to start messaging</p>
                </div>
            )}
        </div>
    )
}
