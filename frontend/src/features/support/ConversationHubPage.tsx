import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    Search,
    MoreVertical,
    Paperclip,
    Send,
    Image as ImageIcon,
    ChevronLeft,
    Clock,

    Sparkles,
    ArrowRightLeft,
    MessageSquare,
    Check,
    CheckCheck,
    Smile,
    AlertTriangle,
    ArrowUpCircle,
    ArrowDownCircle
} from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import { cn } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'

// --- Interfaces ---
interface Message {
    id: string
    senderId: string
    text: string
    timestamp: Date
    isMe: boolean
    status: 'sent' | 'delivered' | 'read'
    attachment?: {
        type: 'image' | 'file'
        url: string
        name?: string
    }
}

interface Conversation {
    id: string
    name: string
    type: 'Lead' | 'Partner' | 'Support'
    status: 'active' | 'archived' | 'escalated' | 'resolved'
    unread: number
    lastMessage: string
    lastMessageTime: Date
    avatar: string
    online: boolean
    isTyping?: boolean
    tier: 'L1' | 'L2' | 'L3'
    ticketTitle?: string
    ticketNumber?: string
}

// --- Mock Data ---
const dummyConversations: Conversation[] = [
    {
        id: '1',
        name: 'Rahul Sharma',
        type: 'Lead',
        status: 'active',
        unread: 2,
        lastMessage: 'Is the interest rate negotiable?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
        avatar: 'RS',
        online: true,
        isTyping: true,
        tier: 'L1',
        ticketTitle: 'Home Loan Eligibility Inquiry',
        ticketNumber: 'TKT-2024-001'
    },
    {
        id: '2',
        name: 'HomeLoan Direct',
        type: 'Partner',
        status: 'escalated',
        unread: 0,
        lastMessage: 'Applications submitted for approval.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        avatar: 'HD',
        online: false,
        tier: 'L2',
        ticketTitle: 'Partner Onboarding Process',
        ticketNumber: 'TKT-2024-042'
    },
    {
        id: '3',
        name: 'Priya Patel',
        type: 'Lead',
        status: 'resolved',
        unread: 0,
        lastMessage: 'Thanks for the quick response!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
        avatar: 'PP',
        online: true,
        tier: 'L1',
        ticketTitle: 'Interest Rate Clarification',
        ticketNumber: 'TKT-2024-089'
    },
    {
        id: '4',
        name: 'Technical Support',
        type: 'Support',
        status: 'active',
        unread: 5,
        lastMessage: 'Your ticket #1234 has been resolved.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
        avatar: 'TS',
        online: true,
        tier: 'L3',
        ticketTitle: 'System Login Issue',
        ticketNumber: 'TKT-2024-123'
    },
]

const initialMessages: Message[] = [
    {
        id: 'm1',
        senderId: 'lead',
        text: 'Hi, I saw your loan offer. Can you tell me more about the eligibility criteria?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isMe: false,
        status: 'read'
    },
    {
        id: 'm2',
        senderId: 'me',
        text: 'Hello! I\'d be happy to help. For salaried employees, we require a minimum monthly income of ₹25,000 and a CIBIL score of 700+.',
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        isMe: true,
        status: 'read'
    },
    {
        id: 'm3',
        senderId: 'lead',
        text: 'That sounds good. I have a salary of ₹45,000. Is there a processing fee waiver?',
        timestamp: new Date(Date.now() - 1000 * 60 * 40),
        isMe: false,
        status: 'read'
    },
    {
        id: 'm4',
        senderId: 'me',
        text: 'Currently we have a waiver on processing fees for applications submitted before Jan 15th.',
        timestamp: new Date(Date.now() - 1000 * 60 * 35),
        isMe: true,
        status: 'read'
    },
    {
        id: 'm5',
        senderId: 'lead',
        text: 'Is the interest rate negotiable?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isMe: false,
        status: 'read'
    },
]

export default function ConversationHubPage() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(dummyConversations[0])
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [conversations, setConversations] = useState(dummyConversations)
    const [tierFilter, setTierFilter] = useState<'All' | 'L1' | 'L2' | 'L3'>('All')
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'ESCALATED' | 'RESOLVED'>('ALL')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [searchParams] = useSearchParams()

    // Modals
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
    const [isCloseTicketModalOpen, setIsCloseTicketModalOpen] = useState(false)
    const [transferTarget, setTransferTarget] = useState<'L1' | 'L2' | 'L3'>('L1')
    const [transferNote, setTransferNote] = useState('')
    const [closeNote, setCloseNote] = useState('')

    // AI Assist
    const [isAiOpen, setIsAiOpen] = useState(false)

    // KPI Data (4 Cards)
    const kpiData = {
        all: conversations.length + 25,
        open: conversations.filter(c => c.status === 'active').length + 10,
        escalated: conversations.filter(c => c.status === 'escalated').length + 2,
        resolved: conversations.filter(c => c.status === 'resolved').length + 13
    }

    const aiSuggestions = [
        { label: 'Professional Greeting', text: "Hello! Thank you for contacting dynamic support. How can I assist you today along with our AI tools?" },
        { label: 'Empathetic Apology', text: "I apologize for the inconvenience you've experienced. Let me personally look into this for you right away." },
        { label: 'Clarifying Question', text: "Could you please provide more details or a screenshot so I can better understand the issue?" },
        { label: 'Closing Statement', text: "Is there anything else I can help you with today? Thank you for choosing House FinMan." },
        { label: 'Policy Explanation', text: "As per our current policy, this request requires L3 approval. I will escalate this for you immediately." }
    ]

    const handleTransfer = () => {
        if (!selectedConversation) return

        const updated: Conversation = { ...selectedConversation, tier: transferTarget }
        setConversations(conversations.map(c => c.id === updated.id ? updated : c))
        setSelectedConversation(updated)
        addSystemMessage(`Conversation transferred to ${transferTarget} (Note: ${transferNote || 'No notes'})`)
        setIsTransferModalOpen(false)
        setTransferNote('')
    }

    const handleElevate = () => {
        if (!selectedConversation) return
        const nextTier: Conversation['tier'] = selectedConversation.tier === 'L1' ? 'L2' : selectedConversation.tier === 'L2' ? 'L3' : 'L3'
        if (nextTier === selectedConversation.tier) return

        const updated: Conversation = { ...selectedConversation, tier: nextTier, status: 'escalated' }
        setConversations(conversations.map(c => c.id === updated.id ? updated : c))
        setSelectedConversation(updated)
        addSystemMessage(`Ticket Elevated to ${nextTier}`)
    }

    const handleDeElevate = () => {
        if (!selectedConversation) return
        const prevTier: Conversation['tier'] = selectedConversation.tier === 'L3' ? 'L2' : selectedConversation.tier === 'L2' ? 'L1' : 'L1'
        if (prevTier === selectedConversation.tier) return

        const updated: Conversation = { ...selectedConversation, tier: prevTier }
        setConversations(conversations.map(c => c.id === updated.id ? updated : c))
        setSelectedConversation(updated)
        addSystemMessage(`Ticket De-elevated to ${prevTier}`)
    }

    const handleCloseTicket = () => {
        if (!selectedConversation) return
        const updated: Conversation = { ...selectedConversation, status: 'resolved' }
        setConversations(conversations.map(c => c.id === updated.id ? updated : c))
        setSelectedConversation(updated)
        addSystemMessage(`Ticket Closed. Resolution: ${closeNote}`)
        setIsCloseTicketModalOpen(false)
        setCloseNote('')
    }

    const addSystemMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: `sys_${Date.now()}`,
            senderId: 'system',
            text: `System: ${text}`,
            timestamp: new Date(),
            isMe: false,
            status: 'read'
        }])
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        const id = searchParams.get('id')
        if (id) {
            const found = conversations.find(c => c.id === id)
            if (found) setSelectedConversation(found)
        }
    }, [searchParams])

    useEffect(() => {
        scrollToBottom()
    }, [messages, selectedConversation])

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        const msg: Message = {
            id: `new_${Date.now()}`,
            senderId: 'me',
            text: newMessage,
            timestamp: new Date(),
            isMe: true,
            status: 'sent'
        }

        setMessages(prev => [...prev, msg])
        setNewMessage('')

        setTimeout(() => {
            const reply: Message = {
                id: `reply_${Date.now()}`,
                senderId: selectedConversation?.id || 'other',
                text: "Thanks for the update! I'll check and get back to you.",
                timestamp: new Date(),
                isMe: false,
                status: 'read'
            }
            setMessages(prev => [...prev, reply])
        }, 1500)
    }

    const filteredConversations = conversations.filter(c => {
        const tierMatch = tierFilter === 'All' || c.tier === tierFilter
        const statusMatch = statusFilter === 'ALL' ||
            (statusFilter === 'OPEN' && c.status === 'active') ||
            (statusFilter === 'ESCALATED' && c.status === 'escalated') ||
            (statusFilter === 'RESOLVED' && c.status === 'resolved')
        return tierMatch && statusMatch
    })

    // --- RENDER ---
    return (
        <div className="flex h-[calc(100vh-64px)] -mt-6 -mx-6 bg-gray-50 dark:bg-[#0f1014] text-slate-900 dark:text-slate-200 font-sans overflow-hidden relative">
            {/* Ambient Background Effects */}
            <div className="hidden dark:block absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
            <div className="hidden dark:block absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Sidebar List */}
            <div className={cn(
                "w-full md:w-96 border-r border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#0f1014]/80 backdrop-blur-xl flex flex-col z-30 absolute md:relative h-full transition-transform duration-300",
                selectedConversation ? "-translate-x-full md:translate-x-0" : "translate-x-0"
            )}>
                {/* KPI Cards Header */}
                {/* KPI Cards Header */}
                <div className="p-5 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-[#0B1120]">
                    {/* KPI Grid - Interactive 3D Cards */}
                    <div className="grid grid-cols-4 gap-3 mb-5">
                        {[
                            { id: 'ALL', label: 'All', count: kpiData.all, color: 'blue', icon: MessageSquare },
                            { id: 'OPEN', label: 'Open', count: kpiData.open, color: 'red', icon: AlertTriangle },
                            { id: 'ESCALATED', label: 'Escalated', count: kpiData.escalated, color: 'yellow', icon: ArrowUpCircle },
                            { id: 'RESOLVED', label: 'Resolved', count: kpiData.resolved, color: 'emerald', icon: CheckCheck }
                        ].map((item) => {
                            const isActive = statusFilter === item.id;
                            // Dynamic color classes based on active state
                            const colorClasses = {
                                blue: isActive ? 'bg-blue-600' : 'bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20',
                                red: isActive ? 'bg-red-600' : 'bg-red-600/10 border-red-600/20 hover:bg-red-600/20',
                                yellow: isActive ? 'bg-yellow-500' : 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20',
                                emerald: isActive ? 'bg-emerald-600' : 'bg-emerald-600/10 border-emerald-600/20 hover:bg-emerald-600/20'
                            }[item.color];

                            const textClasses = {
                                blue: isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400',
                                red: isActive ? 'text-white' : 'text-red-600 dark:text-red-400',
                                yellow: isActive ? 'text-black/80' : 'text-yellow-600 dark:text-yellow-400',
                                emerald: isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                            }[item.color];

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setStatusFilter(item.id as any)}
                                    className={cn(
                                        "h-28 flex flex-col justify-between p-3 relative transition-all duration-300 group",
                                        "border border-t-white/10 border-l-white/10 border-b-black/20 border-r-black/20", // Thin glass stroke
                                        isActive ? "shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] scale-105 z-10" : "shadow-sm hover:translate-y-[-2px]",
                                        colorClasses
                                    )}
                                    style={{ borderRadius: 0 }}
                                >
                                    {/* Glass Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                                    {/* Icon Box */}
                                    <div className={cn(
                                        "w-8 h-8 flex items-center justify-center backdrop-blur-sm border shadow-sm transition-colors",
                                        isActive ? "bg-white/20 border-white/30 text-white" : "bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10"
                                    )} style={{ borderRadius: 0 }}>
                                        <item.icon className={cn("w-4 h-4", isActive ? "text-white" : textClasses)} />
                                    </div>

                                    {/* Stats */}
                                    <div className="flex flex-col items-end text-right z-10">
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest mb-0.5",
                                            isActive && item.color !== 'yellow' ? "text-white/70" :
                                                isActive && item.color === 'yellow' ? "text-black/50" : "text-slate-400"
                                        )}>
                                            {item.label}
                                        </span>
                                        <span className={cn(
                                            "text-3xl font-black leading-none tracking-tight filter drop-shadow-sm",
                                            isActive && item.color !== 'yellow' ? "text-white" :
                                                isActive && item.color === 'yellow' ? "text-black/80" : "text-slate-700 dark:text-slate-200"
                                        )}>
                                            {item.count}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Filters & Search - Sharp */}
                    <div className="space-y-4">
                        <div className="flex gap-0 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#1a1b20]">
                            <div className="relative flex-1 group border-r border-gray-200 dark:border-white/5">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-3 py-2 bg-transparent text-xs text-slate-900 dark:text-slate-300 focus:outline-none placeholder:text-slate-400"
                                    style={{ borderRadius: 0 }}
                                />
                            </div>
                            <div className="flex bg-gray-50 dark:bg-[#1a1b20]">
                                {['All', 'L1', 'L2', 'L3'].map((tier) => (
                                    <button
                                        key={tier}
                                        onClick={() => setTierFilter(tier as any)}
                                        className={cn(
                                            "px-3 py-1 text-[10px] font-bold uppercase hover:bg-white/50 dark:hover:bg-white/5 transition-colors border-l border-gray-200 dark:border-white/5",
                                            tierFilter === tier ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm" : "text-slate-500"
                                        )}
                                        style={{ borderRadius: 0 }}
                                    >
                                        {tier}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conversation List - 0 Margins / Sharp */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-0 space-y-0 bg-white dark:bg-[#0f1014]">
                    {filteredConversations.map(conv => {
                        const isActive = selectedConversation?.id === conv.id
                        return (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={cn(
                                    'p-4 border-b border-gray-100 dark:border-white/5 cursor-pointer transition-all group relative',
                                    isActive
                                        ? 'bg-blue-50/50 dark:bg-white/[0.03] border-l-4 border-l-blue-600 dark:border-l-blue-500'
                                        : 'hover:bg-gray-50 dark:hover:bg-white/[0.02] border-l-4 border-l-transparent'
                                )}
                                style={{ borderRadius: 0 }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <div className={cn(
                                            "w-10 h-10 flex items-center justify-center text-xs font-bold shrink-0 border shadow-sm",
                                            "bg-white dark:bg-[#1a1b20] border-gray-100 dark:border-white/10 text-slate-700 dark:text-slate-300"
                                        )} style={{ borderRadius: 0 }}>
                                            {conv.avatar}
                                        </div>
                                        {conv.online && (
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#0f1014]" style={{ borderRadius: 0 }} />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h3 className={cn(
                                                "text-sm font-bold truncate",
                                                isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-800 dark:text-slate-200"
                                            )}>
                                                {conv.name}
                                            </h3>
                                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                                                {conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <p className={cn(
                                            "text-xs truncate mb-2 leading-relaxed font-medium",
                                            isActive ? "text-slate-600 dark:text-slate-400" : "text-slate-500 dark:text-slate-500",
                                            conv.isTyping && "text-blue-500 dark:text-blue-400 italic"
                                        )}>
                                            {conv.isTyping ? 'Typing...' : conv.lastMessage}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            {conv.status === 'escalated' ? (
                                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 flex items-center gap-1" style={{ borderRadius: 0 }}>
                                                    Escalated
                                                </span>
                                            ) : (
                                                <span className={cn(
                                                    "px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                                                    conv.type === 'Lead' ? "border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/5" :
                                                        conv.type === 'Partner' ? "border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/5" :
                                                            "border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/5"
                                                )} style={{ borderRadius: 0 }}>
                                                    {conv.type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-gray-50 dark:bg-[#0f1014] relative w-full md:w-auto h-full absolute inset-0 md:static transition-transform duration-300 z-20",
                selectedConversation ? "translate-x-0" : "translate-x-full md:translate-x-0"
            )}>
                <AnimatePresence mode="wait">
                    {selectedConversation ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full relative"
                        >
                            {/* Dark Header - Sharp */}
                            <div className="h-18 shrink-0 flex items-center justify-between px-6 py-3 bg-[#0B1120] dark:bg-[#050505] shadow-lg z-20 text-white">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="sm" isIconOnly className="md:hidden text-white/70 hover:text-white hover:bg-white/10" onClick={() => setSelectedConversation(null)}>
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>

                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 flex items-center justify-center text-sm font-bold border shrink-0 shadow-inner",
                                            selectedConversation.type === 'Lead' ? "bg-blue-500/20 border-blue-500/40 text-blue-300" :
                                                selectedConversation.type === 'Partner' ? "bg-purple-500/20 border-purple-500/40 text-purple-300" :
                                                    "bg-orange-500/20 border-orange-500/40 text-orange-300"
                                        )} style={{ borderRadius: 0 }}>
                                            {selectedConversation.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-base font-bold text-white tracking-wide">{selectedConversation.name}</h3>
                                                <span className={cn(
                                                    "px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                                                    selectedConversation.tier === 'L1' ? "bg-white/10 text-white/80 border-white/20" :
                                                        selectedConversation.tier === 'L2' ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" :
                                                            "bg-red-500/20 text-red-300 border-red-500/40"
                                                )} style={{ borderRadius: 0 }}>
                                                    {selectedConversation.tier}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-white/50 font-mono mt-0.5 flex items-center gap-2">
                                                <span>{selectedConversation.ticketNumber || 'NO TICKET'}</span>
                                                <span className="opacity-30">|</span>
                                                <span>{selectedConversation.ticketTitle}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center mr-2 border-r border-white/10 pr-2 gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            title="De-elevate"
                                            onClick={handleDeElevate}
                                            disabled={selectedConversation.tier === 'L1'}
                                            className="text-white/60 hover:text-red-400 hover:bg-white/5 disabled:opacity-30 w-8 h-8 p-0"
                                            style={{ borderRadius: 0 }}
                                        >
                                            <ArrowDownCircle className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            title="Elevate"
                                            onClick={handleElevate}
                                            disabled={selectedConversation.tier === 'L3'}
                                            className="text-white/60 hover:text-green-400 hover:bg-white/5 disabled:opacity-30 w-8 h-8 p-0"
                                            style={{ borderRadius: 0 }}
                                        >
                                            <ArrowUpCircle className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsTransferModalOpen(true)}
                                        className="h-8 gap-1.5 border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white hover:border-white/40"
                                        style={{ borderRadius: 0 }}
                                    >
                                        <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer
                                    </Button>

                                    <Button
                                        size="sm"
                                        onClick={() => setIsCloseTicketModalOpen(true)}
                                        className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-none"
                                        style={{ borderRadius: 0 }}
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" /> Close
                                    </Button>

                                    <Button variant="ghost" size="sm" isIconOnly className="ml-1 text-white/50 hover:text-white hover:bg-white/10" style={{ borderRadius: 0 }}>
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar relative bg-white/50 dark:bg-transparent">
                                {/* Subtle Grid BG */}
                                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none dark:invert"
                                    style={{
                                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                                        backgroundSize: '40px 40px'
                                    }}
                                />

                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={cn('flex gap-4 max-w-3xl relative z-10 group', msg.isMe ? 'ml-auto flex-row-reverse' : '')}
                                        >
                                            {!msg.isMe && (
                                                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1b20]" style={{ borderRadius: 0 }}>
                                                    {selectedConversation.avatar}
                                                </div>
                                            )}

                                            <div className="relative max-w-[85%]">
                                                {/* Chat Bubble */}
                                                <div className={cn(
                                                    "p-3.5 text-sm leading-relaxed border shadow-sm",
                                                    msg.isMe
                                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500/50 shadow-blue-500/10"
                                                        : "bg-white dark:bg-[#1a1b20]/90 text-slate-700 dark:text-slate-200 border-gray-200 dark:border-white/10"
                                                )} style={{ borderRadius: 0 }}>
                                                    {msg.text}
                                                </div>

                                                {/* Timestamp & Status */}
                                                <div className={cn(
                                                    "flex items-center gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
                                                    msg.isMe ? "justify-end text-right" : "justify-start"
                                                )}>
                                                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {msg.isMe && (
                                                        <span className={cn("text-slate-400 dark:text-slate-500", msg.status === 'read' ? "text-blue-500 dark:text-blue-400" : "")}>
                                                            {msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-0 bg-white dark:bg-[#0f1014] border-t border-gray-200 dark:border-white/10 z-20">
                                <div className="w-full flex flex-col relative">
                                    {/* AI Hints (Animated) */}
                                    <AnimatePresence>
                                        {isAiOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute bottom-full left-0 right-0 border-b border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#1a1b20]/90 backdrop-blur-md p-3 shadow-xl z-30"
                                            >
                                                <div className="flex justify-between items-center pb-2 mb-1">
                                                    <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                                                        <Sparkles className="w-3 h-3" /> AI Suggestions
                                                    </span>
                                                    <button onClick={() => setIsAiOpen(false)} className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">CLOSE</button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {aiSuggestions.map((item, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => { setNewMessage(item.text); setIsAiOpen(false); }}
                                                            className="text-left text-xs p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all group"
                                                            style={{ borderRadius: 0 }}
                                                        >
                                                            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-300">{item.label}</span>
                                                            <span className="text-slate-500 dark:text-slate-500 line-clamp-1">{item.text}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Toolbar */}
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#15161a] border-b border-gray-200 dark:border-white/5">
                                        <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded" title="Attach">
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded" title="Image">
                                            <ImageIcon className="w-4 h-4" />
                                        </button>
                                        <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded" title="Emoji">
                                            <Smile className="w-4 h-4" />
                                        </button>
                                        <div className="h-4 w-px bg-gray-300 dark:bg-white/10 mx-1" />
                                        <button
                                            onClick={() => setIsAiOpen(!isAiOpen)}
                                            className={cn(
                                                "flex items-center gap-1.5 text-xs font-bold px-2 py-1 transition-all border",
                                                isAiOpen
                                                    ? "bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/50 text-purple-600 dark:text-purple-400"
                                                    : "bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                                            )}
                                            style={{ borderRadius: 0 }}
                                        >
                                            <Sparkles className="w-3 h-3" /> AI Copilot
                                        </button>
                                    </div>

                                    {/* Full Width Text Input */}
                                    <div className="flex items-end gap-0 bg-white dark:bg-[#1a1b20] transition-all">
                                        <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-4 bg-transparent border-none text-sm text-slate-900 dark:text-white resize-none focus:outline-none min-h-[60px] max-h-[200px] placeholder:text-slate-400 dark:placeholder:text-slate-600 custom-scrollbar"
                                            rows={2}
                                        />
                                        <div className="p-3 flex gap-2 items-end pb-4">
                                            <Button
                                                onClick={handleSendMessage}
                                                className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                                                style={{ borderRadius: 0 }}
                                            >
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-[#1a1b20] border border-gray-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-600" style={{ borderRadius: 0 }}>
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-1">Select a Ticket</h3>
                                <p className="text-sm text-slate-500">Choose a conversation from the list to view details</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Transfer Modal */}
            <Modal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                title="Transfer Conversation"
                className="border border-white/10"
            >
                <div className="space-y-5 p-2">
                    <p className="text-sm text-slate-400">Select a target tier to transfer this conversation.</p>

                    {/* Tier Selection - Boxed Sharp */}
                    <div className="grid grid-cols-3 gap-4">
                        {['L1', 'L2', 'L3'].map((tier) => (
                            <button
                                key={tier}
                                onClick={() => setTransferTarget(tier as any)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 py-6 px-4 border-2 transition-all relative overflow-hidden group",
                                    transferTarget === tier
                                        ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-900/20"
                                        : "bg-[#1a1b20] border-white/5 text-slate-400 hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-400"
                                )}
                                style={{ borderRadius: 0 }}
                            >
                                <span className="text-xl font-black tracking-widest">{tier}</span>
                                <span className="text-[9px] uppercase font-bold opacity-60">Support Tier</span>
                            </button>
                        ))}
                    </div>

                    {/* Note Box */}
                    <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Transfer Note</label>
                        <textarea
                            value={transferNote}
                            onChange={(e) => setTransferNote(e.target.value)}
                            placeholder="Add a reason for transfer..."
                            className="w-full text-sm p-4 bg-[#0a0b0f] border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-slate-200 placeholder:text-slate-600 transition-all min-h-[100px]"
                            style={{ borderRadius: 0 }}
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/5 mt-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsTransferModalOpen(false)}
                            className="flex-1 border border-white/10 hover:bg-white/5 text-slate-400"
                            style={{ borderRadius: 0 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleTransfer}
                            className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/40"
                            style={{ borderRadius: 0 }}
                        >
                            CONFIRM TRANSFER
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Close Ticket Modal */}
            <Modal
                isOpen={isCloseTicketModalOpen}
                onClose={() => setIsCloseTicketModalOpen(false)}
                title="Close Ticket"
                className="border border-white/10"
            >
                <div className="space-y-5 p-2">
                    {/* Alert Box - Sharp */}
                    <div className="flex items-start gap-4 p-5 bg-emerald-500/5 border border-emerald-500/20" style={{ borderRadius: 0 }}>
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                            <CheckCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-1">Resolution Verification</h4>
                            <p className="text-sm text-emerald-200/70 font-medium leading-relaxed">
                                Are you sure you want to mark this ticket as resolved? This action will archive the conversation.
                            </p>
                        </div>
                    </div>

                    {/* Resolution Note */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Resolution Summary</label>
                        <textarea
                            value={closeNote}
                            onChange={(e) => setCloseNote(e.target.value)}
                            placeholder="Briefly describe the resolution, e.g. 'Customer confirmed fix'..."
                            className="w-full text-sm p-4 bg-[#0a0b0f] border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-slate-200 placeholder:text-slate-600 transition-all min-h-[120px]"
                            style={{ borderRadius: 0 }}
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/5 mt-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsCloseTicketModalOpen(false)}
                            className="flex-1 border border-white/10 hover:bg-white/5 text-slate-400"
                            style={{ borderRadius: 0 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCloseTicket}
                            className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/40"
                            style={{ borderRadius: 0 }}
                        >
                            RESOLVE TICKET
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
