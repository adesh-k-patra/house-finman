
/**
 * Support Tickets Page for House FinMan
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, User, Calendar, MoreVertical, MessageCircle, AlertCircle, CheckCircle2, Clock, Send, Paperclip, Tag, LayoutGrid, List, Columns, Mail } from 'lucide-react'
import { Button, WizardModal, KPICard } from '@/components/ui'
import { cn, formatRelativeTime } from '@/utils'
import { CreateTicketModal } from './components/CreateTicketModal'

import { dummyTickets, Ticket, TicketCategory, TicketPriority, TicketStatus } from './data/dummyTickets'
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    DragOverEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const dummyAssignees = ['Sarah Jenkins', 'Mike Ross', 'Harvey Specter', 'Donna Paulsen', 'Rachel Zane']

const priorityConfig: Record<TicketPriority, { label: string; color: string; bgColor: string }> = {
    critical: { label: 'Critical', color: 'text-white', bgColor: 'bg-red-600' },
    high: { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    medium: { label: 'Medium', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    low: { label: 'Low', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-700/30' },
}

const statusConfig: Record<TicketStatus, { label: string; color: string; bgColor: string; icon: any }> = {
    open: { label: 'Open', color: 'text-blue-600', bgColor: 'bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-500/60 dark:hover:bg-blue-500/80', icon: AlertCircle },
    in_progress: { label: 'In Progress', color: 'text-purple-600', bgColor: 'bg-purple-500/80 hover:bg-purple-600/90 dark:bg-purple-500/60 dark:hover:bg-purple-500/80', icon: Clock },
    pending_customer: { label: 'Pending Customer', color: 'text-amber-600', bgColor: 'bg-amber-500/80 hover:bg-amber-600/90 dark:bg-amber-500/60 dark:hover:bg-amber-500/80', icon: Clock },
    resolved: { label: 'Resolved', color: 'text-emerald-600', bgColor: 'bg-emerald-500/80 hover:bg-emerald-600/90 dark:bg-emerald-500/60 dark:hover:bg-emerald-500/80', icon: CheckCircle2 },
    closed: { label: 'Closed', color: 'text-slate-600', bgColor: 'bg-slate-500/80 hover:bg-slate-600/90 dark:bg-slate-500/60 dark:hover:bg-slate-500/80', icon: CheckCircle2 },
}

const categoryConfig: Record<TicketCategory, { label: string }> = {
    loan_query: { label: 'Loan Query' },
    document_issue: { label: 'Document Issue' },
    payment_issue: { label: 'Payment Issue' },
    partner_complaint: { label: 'Partner Complaint' },
    technical: { label: 'Technical' },
    other: { label: 'Other' },
}

// Sortable Ticket Card - Cloned & Adapted from Leads
function SortableTicketCard({ ticket, onClick }: { ticket: Ticket; onClick: (t: Ticket) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: ticket.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const priority = priorityConfig[ticket.priority]
    const status = statusConfig[ticket.status]

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(ticket)}
            className={cn(
                'relative flex flex-col group',
                'bg-white dark:bg-slate-900',
                'border border-black/10 dark:border-white/10',
                'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_1px_2px_0_rgba(0,0,0,0.05)] dark:shadow-none',
                'hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_12px_0_rgba(0,0,0,0.08)]',
                'hover:border-black/20 dark:hover:border-white/20',
                'transition-all duration-300 hover:-translate-y-0.5',
                'cursor-grab active:cursor-grabbing',
                'rounded-none',
                isDragging && 'opacity-50 ring-2 ring-primary-500 shadow-2xl z-50 scale-105'
            )}
        >
            {/* Header Section */}
            <div className="p-3 pb-2 flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] text-slate-400 font-medium tracking-wide">
                            #{ticket.ticketNumber}
                        </span>
                        <span className={cn(
                            'px-1.5 py-0.5 text-[8px] uppercase font-bold tracking-wider border',
                            priority.color.replace('text-', 'border-') + '/50 text-slate-500 dark:text-slate-400'
                        )}>
                            {priority.label}
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
                        {ticket.subject}
                    </h3>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <MoreVertical className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Inner "Solid Dark Glassmorphic" Card */}
            <div className={cn(
                "mx-3 mb-3 p-3 relative overflow-hidden group/inner",
                "bg-slate-50 dark:bg-slate-900/40",
                "border border-black/5 dark:border-white/5",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_1px_2px_0_rgba(0,0,0,0.05)]"
            )}>
                {/* Decorative sheen */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] rounded-none shadow-sm">
                            {ticket.customerName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-0.5">Customer</p>
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{ticket.customerName}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Tag className="w-3 h-3 opacity-70" />
                        <span className="text-[10px] font-medium truncate">{categoryConfig[ticket.category].label}</span>
                    </div>
                    <span className={cn(
                        'flex items-center gap-1 px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wide border rounded-sm',
                        status.color.replace('text-', 'border-') + '/30',
                        status.color
                    )}>
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto px-3 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(ticket.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-[9px] font-bold rounded-sm">
                        {ticket.assignedTo.charAt(0)}
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {ticket.assignedTo.split(' ')[0]}
                    </span>
                </div>
            </div>
        </div>
    )
}

// Static Ticket Card for Grid View (re-using styles from SortableTicketCard but without DnD)
function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: (t: Ticket) => void }) {
    const priority = priorityConfig[ticket.priority]
    const status = statusConfig[ticket.status]

    return (
        <div
            onClick={() => onClick(ticket)}
            className={cn(
                'relative flex flex-col group',
                'bg-white dark:bg-slate-900',
                'border border-black/10 dark:border-white/10',
                'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_1px_2px_0_rgba(0,0,0,0.05)] dark:shadow-none',
                'hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_12px_0_rgba(0,0,0,0.08)]',
                'hover:border-black/20 dark:hover:border-white/20',
                'transition-all duration-300 hover:-translate-y-0.5',
                'cursor-pointer',
                'rounded-none'
            )}
        >
            {/* Header Section */}
            <div className="p-3 pb-2 flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] text-slate-400 font-medium tracking-wide">
                            #{ticket.ticketNumber}
                        </span>
                        <span className={cn(
                            'px-1.5 py-0.5 text-[8px] uppercase font-bold tracking-wider border',
                            priority.color.replace('text-', 'border-') + '/50 text-slate-500 dark:text-slate-400'
                        )}>
                            {priority.label}
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
                        {ticket.subject}
                    </h3>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <MoreVertical className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Inner "Solid Dark Glassmorphic" Card */}
            <div className={cn(
                "mx-3 mb-3 p-3 relative overflow-hidden group/inner",
                "bg-slate-50 dark:bg-slate-900/40",
                "border border-black/5 dark:border-white/5",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_1px_2px_0_rgba(0,0,0,0.05)]"
            )}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] rounded-none shadow-sm">
                            {ticket.customerName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-0.5">Customer</p>
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{ticket.customerName}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Tag className="w-3 h-3 opacity-70" />
                        <span className="text-[10px] font-medium truncate">{categoryConfig[ticket.category].label}</span>
                    </div>
                    <span className={cn(
                        'flex items-center gap-1 px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wide border rounded-sm',
                        status.color.replace('text-', 'border-') + '/30',
                        status.color
                    )}>
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto px-3 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(ticket.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-[9px] font-bold rounded-sm">
                        {ticket.assignedTo.charAt(0)}
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {ticket.assignedTo.split(' ')[0]}
                    </span>
                </div>
            </div>
        </div>
    )
}

// Kanban Column - Cloned & Adapted
function KanbanColumn({ status, tickets, onTicketClick }: { status: TicketStatus; tickets: Ticket[]; onTicketClick: (t: Ticket) => void }) {
    const config = statusConfig[status]

    return (
        <div className="flex flex-col w-80 flex-shrink-0">
            {/* Column Header */}
            <div className={cn(
                'p-4 rounded-t-sm flex flex-col gap-3',
                'bg-[#0B1121] border border-b-0 border-white/10'
            )}>
                {/* Title + Count */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {(() => { const I = config.icon; return <I className="w-3.5 h-3.5 text-slate-400" /> })()}
                        <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">
                            {config.label}
                        </span>
                    </div>
                    <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-white text-slate-900 text-[10px] font-bold rounded-none">
                        {tickets.length}
                    </span>
                </div>

                {/* Progress Bar (Mock for now, could use SLA stats) */}
                <div className="h-0.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full opacity-50", config.bgColor.replace('bg-', 'bg-'))}
                        style={{ width: '40%' }} // Static for now as Tickets don't have Value like Leads
                    />
                </div>
            </div>

            {/* Column Body */}
            <div className={cn(
                'flex-1 p-2 space-y-2 overflow-y-auto rounded-b-sm',
                'bg-slate-50 dark:bg-slate-900/30',
                'border border-t-0 border-slate-200 dark:border-white/10',
                'min-h-[400px] max-h-[calc(100vh-300px)]'
            )}>
                <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tickets.map((ticket) => (
                        <SortableTicketCard key={ticket.id} ticket={ticket} onClick={onTicketClick} />
                    ))}
                    {tickets.length === 0 && (
                        <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-4">
                            No tickets
                        </p>
                    )}
                </SortableContext>
            </div>
        </div>
    )
}

export default function SupportTicketsPage() {
    const navigate = useNavigate()
    const [tickets, setTickets] = useState<Ticket[]>(dummyTickets)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')
    const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('kanban')

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const openCount = tickets.filter(t => t.status === 'open').length
    const inProgressCount = tickets.filter(t => t.status === 'in_progress').length
    const breachedCount = tickets.filter(t => t.slaBreached).length

    const handleCreateTicket = (newTicket: Ticket) => {
        setTickets([newTicket, ...tickets])
        setIsCreateTicketOpen(false)
    }

    const handleResolveTicket = () => {
        if (!selectedTicket) return
        setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'resolved' as TicketStatus } : t))
        setSelectedTicket(null)
    }

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        if (activeId === overId) return

        const activeTicket = tickets.find(t => t.id === activeId)
        const overTicket = tickets.find(t => t.id === overId)

        if (!activeTicket) return

        // Scenario 1: Dragging over another Task
        if (overTicket && activeTicket.status !== overTicket.status) {
            setTickets((items) => {
                const activeIndex = items.findIndex((i) => i.id === activeId)
                const overIndex = items.findIndex((i) => i.id === overId)
                const newItems = [...items]
                // Update active item status to match over item status
                newItems[activeIndex] = { ...newItems[activeIndex], status: overTicket.status }
                return arrayMove(newItems, activeIndex, overIndex)
            })
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeTicket = tickets.find(t => t.id === activeId)
        const overTicket = tickets.find(t => t.id === overId)

        if (activeId !== overId && activeTicket && overTicket && activeTicket.status === overTicket.status) {
            setTickets((items) => {
                const oldIndex = items.findIndex((i) => i.id === activeId)
                const newIndex = items.findIndex((i) => i.id === overId)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ticket Queue</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tickets.length} tickets • {openCount} open • {breachedCount} SLA breached</p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateTicketOpen(true)}>Create Ticket</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <KPICard
                    title="Open Tickets"
                    value={openCount}
                    icon={<AlertCircle className="w-4 h-4" />}
                    trend={{ value: "+2 today", direction: "up" }}
                    variant="blue"
                />
                <KPICard
                    title="In Progress"
                    value={inProgressCount}
                    icon={<Clock className="w-4 h-4" />}
                    trend={{ value: "Active", direction: "neutral" }}
                    variant="purple"
                />
                <KPICard
                    title="Pending Customer"
                    value={tickets.filter(t => t.status === 'pending_customer').length}
                    icon={<Clock className="w-4 h-4" />}
                    trend={{ value: "Waiting", direction: "neutral" }}
                    variant="orange"
                />
                <KPICard
                    title="SLA Breached"
                    value={breachedCount}
                    icon={<AlertCircle className="w-4 h-4" />}
                    trend={{ value: "Critical", direction: "down" }}
                    variant="red"
                />
                <KPICard
                    title="Resolved Today"
                    value={tickets.filter(t => t.status === 'resolved').length}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    trend={{ value: "+5 this week", direction: "up" }}
                    variant="emerald"
                />
            </div>

            <div className="flex items-center gap-4">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-sm">
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={cn('p-1.5 rounded-sm transition-all', viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600')}
                        title="Kanban View"
                    >
                        <Columns className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn('p-1.5 rounded-sm transition-all', viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600')}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn('p-1.5 rounded-sm transition-all', viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600')}
                        title="List View"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10 rounded-sm" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')} className="input w-auto h-[42px] min-w-[140px] rounded-sm">
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending_customer">Pending Customer</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            {viewMode === 'kanban' ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                    <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                        <div className="flex gap-4 h-full min-w-max px-1">
                            {['open', 'in_progress', 'pending_customer', 'resolved', 'closed'].map((statusKey) => {
                                const status = statusKey as TicketStatus
                                const columnTickets = tickets.filter(t => t.status === status)
                                return (
                                    <KanbanColumn
                                        key={status}
                                        status={status}
                                        tickets={columnTickets}
                                        onTicketClick={setSelectedTicket}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <DragOverlay>
                        {/* Null or simplified placeholder */}
                    </DragOverlay>
                </DndContext>
            ) : viewMode === 'list' ? (
                <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                    <table className="w-full">
                        <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Ticket</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Subject</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Customer</th>
                                <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                                <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Priority</th>
                                <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Assignee</th>
                                <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Created</th>
                                <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredTickets.map(ticket => {
                                const priority = priorityConfig[ticket.priority]
                                const status = statusConfig[ticket.status]
                                const category = categoryConfig[ticket.category]
                                const StatusIcon = status.icon

                                return (
                                    <tr
                                        key={ticket.id}
                                        className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                        <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-mono text-slate-500">{ticket.ticketNumber}</span>
                                                {ticket.slaBreached && (
                                                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1 mt-1">
                                                        <AlertCircle className="w-3 h-3" /> SLA
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">{ticket.subject}</span>
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> {category.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
                                                    {ticket.customerName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{ticket.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                            <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm inline-flex items-center gap-1.5', status.bgColor, status.color)}>
                                                <StatusIcon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                            <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm border border-transparent', priority.bgColor, priority.color)}>
                                                {priority.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                                    {ticket.assignedTo.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">{ticket.assignedTo.split(' ')[0]}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center text-xs text-slate-500 border-r border-slate-300 dark:border-slate-700">
                                            {formatRelativeTime(ticket.createdAt)}
                                        </td>
                                        <td className="px-4 py-4 text-center border-slate-300 dark:border-slate-700">
                                            <button
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm text-slate-400 hover:text-primary-600 transition-colors"
                                                onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}
                                            >
                                                <MoreVertical className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} onClick={setSelectedTicket} />
                    ))}
                </div>
            )}

            <CreateTicketModal
                isOpen={isCreateTicketOpen}
                onClose={() => setIsCreateTicketOpen(false)}
                onSave={handleCreateTicket}
            />

            {/* Ticket Detail Modal (Wizard Style) */}
            <WizardModal
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                title="Ticket Details"
                subtitle={selectedTicket?.ticketNumber}
                sidebarWidth=""
                currentStep={currentStep}
                onStepClick={(id) => setCurrentStep(Number(id))}
                steps={[
                    { id: 1, label: 'Overview', description: 'Properties & Info' },
                    { id: 2, label: 'Messages', description: 'Chat & History' },
                    { id: 3, label: 'Send', description: 'External Channels' },
                    { id: 4, label: 'Customer', description: 'Profile Details' }
                ]}
                contentTitle={
                    currentStep === 1 ? 'Overview' :
                        currentStep === 2 ? 'Communication' :
                            currentStep === 3 ? 'Send via Apps' :
                                'Customer Profile'
                }
                footer={
                    <div className="flex justify-end items-center w-full gap-3 pt-2">
                        <Button
                            className="bg-slate-200/50 dark:bg-slate-700/50 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:bg-slate-300/60 dark:hover:bg-slate-600/60 border-none font-bold shadow-sm"
                            leftIcon={<MessageCircle className="w-4 h-4" />}
                            onClick={() => navigate(`/support/conversations?id=1`)}
                        >
                            Chat
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white border-none font-bold shadow-md shadow-emerald-500/20"
                            leftIcon={<CheckCircle2 className="w-4 h-4" />}
                            onClick={handleResolveTicket}
                        >
                            Resolve Ticket
                        </Button>
                    </div>
                }
            >
                {selectedTicket && (
                    <div className="space-y-6 animate-fade-in pb-4">
                        {/* Header Stats - Always Visible on Top? Or just Step 1? Keeping on Step 1 for now or all if useful. User said "white area layout to be better". Let's put it in Step 1 for cleanliness. */}

                        {currentStep === 1 && (
                            <div className="space-y-8">
                                {/* Ticket Controls */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 rounded-sm">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                        <div className="relative">
                                            <select
                                                className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                                defaultValue={selectedTicket.status}
                                            >
                                                {Object.entries(statusConfig).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <MoreVertical className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                                        <div className="relative">
                                            <select
                                                className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                                defaultValue={selectedTicket.priority}
                                            >
                                                {Object.entries(priorityConfig).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <MoreVertical className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</label>
                                        <div className="relative">
                                            <select
                                                className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                                defaultValue={selectedTicket.assignedTo}
                                            >
                                                {dummyAssignees.map(name => (
                                                    <option key={name} value={name}>{name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Current State
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedTicket.slaBreached && (
                                            <div className="px-3 py-1.5 rounded-sm text-sm font-bold bg-red-600 text-white flex items-center gap-2 uppercase tracking-wider shadow-sm">
                                                <Clock className="w-4 h-4" /> SLA Breached
                                            </div>
                                        )}
                                        <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-sm text-sm font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Created {formatRelativeTime(selectedTicket.createdAt)}
                                        </div>
                                        <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-sm text-sm font-medium flex items-center gap-2">
                                            <Tag className="w-4 h-4" /> {categoryConfig[selectedTicket.category].label}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Description</h4>
                                    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-sm text-sm text-slate-700 dark:text-slate-300 leading-7 shadow-sm">
                                        {selectedTicket.description || 'No detailed description provided.'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="flex flex-col h-[500px] border border-slate-200 dark:border-white/10 rounded-sm overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Mock Messages */}
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm">SP</div>
                                        <div className="flex-1 max-w-[80%]">
                                            <div className="flex items-baseline justify-between mb-1">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">Support Agent</span>
                                                <span className="text-xs text-slate-400">2h ago</span>
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 rounded-sm rounded-tl-none border border-slate-200 dark:border-white/5 text-sm shadow-sm leading-relaxed">
                                                Hi {selectedTicket.customerName}, thanks for reaching out. We are investigating the issue with your document upload and will get back to you shortly.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 flex-row-reverse">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm">CS</div>
                                        <div className="flex-1 max-w-[80%]">
                                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                                <span className="text-xs text-slate-400">5h ago</span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">Customer</span>
                                            </div>
                                            <div className="bg-blue-600 text-white rounded-sm rounded-tr-none text-sm shadow-md leading-relaxed">
                                                I am unable to upload the Form 16. It says "File type not supported" even though it is a PDF.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10">
                                    <div className="relative">
                                        <textarea
                                            placeholder="Type a reply..."
                                            className="w-full min-h-[100px] pr-12 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                                        />
                                        <div className="absolute bottom-3 right-3 flex gap-2">
                                            <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm transition-colors" title="Attach File">
                                                <Paperclip className="w-4 h-4" />
                                            </button>
                                            <Button size="sm" isIconOnly className="w-9 h-9 rounded-sm shadow-sm"><Send className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 border border-slate-200 dark:border-white/10 rounded-sm bg-white dark:bg-slate-800/30 hover:border-primary-500 transition-colors cursor-pointer group shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">Email</h4>
                                            <p className="text-xs text-slate-500">Send official reply via email</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border border-slate-200 dark:border-white/10 rounded-sm bg-white dark:bg-slate-800/30 hover:border-primary-500 transition-colors cursor-pointer group shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                            <span className="font-black text-sm">JIRA</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">Jira</h4>
                                            <p className="text-xs text-slate-500">Create linked issue in Jira</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border border-slate-200 dark:border-white/10 rounded-sm bg-white dark:bg-slate-800/30 hover:border-green-500 transition-colors cursor-pointer group shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                            <MessageCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-green-600 transition-colors">WhatsApp</h4>
                                            <p className="text-xs text-slate-500">Message via Business API</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border border-slate-200 dark:border-white/10 rounded-sm bg-white dark:bg-slate-800/30 hover:border-sky-500 transition-colors cursor-pointer group shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-600">
                                            <Send className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">Telegram</h4>
                                            <p className="text-xs text-slate-500">Send via Support Bot</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-6">
                                    <div className="p-6 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 rounded-sm shadow-sm">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                                            <User className="w-4 h-4" /> Customer Profile
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-500">
                                                    {selectedTicket.customerName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedTicket.customerName}</h3>
                                                    <p className="text-sm text-slate-500">ID: CUST-{selectedTicket.id.split('-')[1]}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Phone</p>
                                                    <p className="font-medium text-slate-700 dark:text-slate-300 text-sm mt-1">{selectedTicket.customerPhone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Email</p>
                                                    <p className="font-medium text-slate-700 dark:text-slate-300 text-sm mt-1">user@example.com</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Location</p>
                                                    <p className="font-medium text-slate-700 dark:text-slate-300 text-sm mt-1">Mumbai, India</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Language</p>
                                                    <p className="font-medium text-slate-700 dark:text-slate-300 text-sm mt-1">English, Hindi</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 rounded-sm shadow-sm">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                                            <Clock className="w-4 h-4" /> History & Metadata
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">Member Since</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">Jan 2023</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">Total Tickets</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">12</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">Last Active</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">2 days ago</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">CSAT Score</span>
                                                <span className="text-sm font-bold text-emerald-600">4.8/5.0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </WizardModal>
        </div>
    )
}
