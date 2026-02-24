/**
 * Leads Page for House FinMan
 * 
 * Purpose: Main leads inbox with Kanban and List views
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { LeadImportWizard } from './components/LeadImportWizard'

import {
    LayoutGrid,
    List,
    Plus,
    Filter,
    Phone,
    MessageCircle,
    Building2,
    MoreVertical,
    X,
    Edit,
    Trash2,
    User,
    Mail,
    Upload, // Added Upload
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn, formatCurrency, formatRelativeTime } from '@/utils'
import { dummyLeads } from './data/dummyLeads'
import { Lead, leadStatusConfig, sourceConfig, LeadStatus } from '@/types'

import { EditLeadModal } from './components/EditLeadModal'
import { AddLeadModal } from './components/AddLeadModal'

// Filter Drawer
function FilterDrawer({ isOpen, onClose, selectedStatuses, onApply }: { isOpen: boolean; onClose: () => void; selectedStatuses: LeadStatus[]; onApply: (statuses: LeadStatus[]) => void }) {
    const [localStatuses, setLocalStatuses] = useState<LeadStatus[]>(selectedStatuses)

    if (!isOpen) return null

    const toggleStatus = (status: LeadStatus) => {
        if (localStatuses.includes(status)) {
            setLocalStatuses(localStatuses.filter(s => s !== status))
        } else {
            setLocalStatuses([...localStatuses, status])
        }
    }

    const handleApply = () => {
        onApply(localStatuses)
        onClose()
    }

    const handleReset = () => {
        setLocalStatuses([])
        onApply([])
        onClose()
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-[350px] bg-white dark:bg-slate-900 shadow-xl z-50 animate-slide-in border-l border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Lead Status</h3>
                        <div className="space-y-2">
                            {(Object.keys(leadStatusConfig) as LeadStatus[]).map((status) => (
                                <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1 rounded">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                        checked={localStatuses.includes(status)}
                                        onChange={() => toggleStatus(status)}
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-300">{leadStatusConfig[status].label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 flex gap-2">
                    <Button variant="secondary" className="flex-1" onClick={handleReset}>Reset</Button>
                    <Button variant="primary" className="flex-1" onClick={handleApply}>Apply Filters</Button>
                </div>
            </div>
        </>
    )
}

type ViewMode = 'kanban' | 'list'

// Sortable Lead Card - Extreme Redesign
function SortableLeadCard({ lead, onClick, onEdit, onDelete }: { lead: Lead; onClick: () => void; onEdit: (e: React.MouseEvent) => void; onDelete: (e: React.MouseEvent) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })
    const [showMenu, setShowMenu] = useState(false)

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={cn(
                'relative flex flex-col group',
                'bg-white dark:bg-slate-900', // White in light mode
                // Glassmorphic dark black stroke (border) + thin inner shadow
                'border border-black/10 dark:border-white/10',
                'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_1px_2px_0_rgba(0,0,0,0.05)] dark:shadow-none',
                'hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_12px_0_rgba(0,0,0,0.08)]',
                'hover:border-black/20 dark:hover:border-white/20',
                'transition-all duration-300 hover:-translate-y-0.5',
                'cursor-grab active:cursor-grabbing',
                // Sharp corners
                'rounded-none',
                isDragging && 'opacity-50 ring-2 ring-primary-500 shadow-2xl z-50 scale-105'
            )}
        >


            {/* Header Section */}
            <div className="p-3 pb-2 flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
                        {lead.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        {lead.phone}
                    </p>
                </div>
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowMenu(!showMenu)
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {/* Menu (kept simple but sharp) */}
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false) }} />
                            <div className="absolute right-0 top-4 w-28 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-white/10 z-20 py-1 rounded-none">
                                <button
                                    onClick={(e) => { onEdit(e); setShowMenu(false) }}
                                    className="w-full text-left px-3 py-1.5 text-[10px] uppercase font-bold tracking-wide hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                                >
                                    <Edit className="w-3 h-3" /> Edit
                                </button>
                                <button
                                    onClick={(e) => { onDelete(e); setShowMenu(false) }}
                                    className="w-full text-left px-3 py-1.5 text-[10px] uppercase font-bold tracking-wide hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Inner "Solid Dark Glassmorphic" Card - Now matching the outer requested aesthetic */}
            <div className={cn(
                "mx-3 mb-3 p-3 relative overflow-hidden group/inner",
                "bg-slate-50 dark:bg-slate-900/40",
                // Glassmorphic dark black stroke (border) + thin inner shadow
                "border border-black/5 dark:border-white/5",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_1px_2px_0_rgba(0,0,0,0.05)]"
            )}>
                {/* Decorative sheen - only in dark mode or subtle in light */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none" />

                <div className="relative z-10 grid grid-cols-2 gap-4">
                    {/* Loan Amount */}
                    <div>
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-0.5">Value</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                            {formatCurrency(lead.estimatedLoan, true)}
                        </p>
                    </div>

                    {/* Score */}
                    <div className="text-right flex flex-col items-end">
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold leading-none mb-0.5">Score</p>
                        <div
                            className={cn(
                                'flex items-center justify-center w-9 h-9 text-xs font-black', // Box shape 4x4-ish (36px), bolder font
                                'text-white rounded-none', // Sharp corners
                                'border border-white/20', // Glassmorphic border
                                'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5)]', // Shadow
                                'backdrop-blur-md'
                            )}
                            style={{
                                // Solid colors based on score tiers
                                backgroundColor: lead.score >= 80 ? '#10b981' : // Green
                                    lead.score >= 60 ? '#eab308' : // Yellow
                                        lead.score >= 40 ? '#f97316' : // Orange
                                            '#ef4444' // Red
                            }}
                        >
                            {lead.score}
                        </div>
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Building2 className="w-3 h-3 opacity-70" />
                        <span className="text-[10px] font-medium truncate">{lead.city || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 justify-end">
                        <span className={cn(
                            'text-[9px] uppercase tracking-wider font-bold px-1',
                            sourceConfig[lead.source].color
                        )}>
                            {sourceConfig[lead.source].label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="mt-auto px-3 pb-3 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 font-medium">
                    {formatRelativeTime(lead.lastActivity)}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                        title="Call"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                        title="Message"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Property Details (Main Focus) */}
            {lead.propertyDetails && (
                <div className="px-3 pb-3">
                    <div className="flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-sm border border-slate-200 dark:border-white/5">
                        <Building2 className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                            {lead.propertyDetails}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

// Kanban Column
function KanbanColumn({ status, leads, totalPipelineValue, onLeadClick, onEdit, onDelete }: { status: LeadStatus; leads: Lead[]; totalPipelineValue: number; onLeadClick: (lead: Lead) => void; onEdit: (lead: Lead) => void; onDelete: (lead: Lead) => void }) {
    const config = leadStatusConfig[status]
    const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedLoan, 0)
    const percentage = totalPipelineValue > 0 ? (totalValue / totalPipelineValue) * 100 : 0

    return (
        <div className="flex flex-col w-80 flex-shrink-0">
            {/* Column Header */}
            <div className={cn(
                'p-4 rounded-t-sm flex flex-col gap-3',
                'bg-[#0B1121] border border-b-0 border-white/10' // Matching the screenshot's dark aesthetic
            )}>
                {/* Title + Count */}
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">
                        {config.label}
                    </span>
                    <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-white text-slate-900 text-[10px] font-bold rounded-none">
                        {leads.length}
                    </span>
                </div>

                {/* Progress Bar + Value */}
                <div className="space-y-1.5">
                    <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-slate-400 to-white/80 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.max(percentage, 5)}%` }} // Minimum 5% visible
                        />
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                            {formatCurrency(totalValue)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Column Body */}
            <div className={cn(
                'flex-1 p-2 space-y-2 overflow-y-auto rounded-b-sm',
                'bg-slate-50 dark:bg-slate-900/30',
                'border border-t-0 border-slate-200 dark:border-white/10',
                'min-h-[400px] max-h-[calc(100vh-300px)]'
            )}>
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {leads.map((lead) => (
                        <SortableLeadCard
                            key={lead.id}
                            lead={lead}
                            onClick={() => onLeadClick(lead)}
                            onEdit={(e) => {
                                e.stopPropagation()
                                onEdit(lead)
                            }}
                            onDelete={(e) => {
                                e.stopPropagation()
                                onDelete(lead)
                            }}
                        />
                    ))}
                    {leads.length === 0 && (
                        <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-8">
                            Drop leads here
                        </p>
                    )}
                </SortableContext>
            </div>
        </div>
    )
}

export default function LeadsPage() {
    const navigate = useNavigate()
    const [viewMode, setViewMode] = useState<ViewMode>('kanban')
    const [leads, setLeads] = useState<Lead[]>(dummyLeads)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [editLead, setEditLead] = useState<Lead | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isImportWizardOpen, setIsImportWizardOpen] = useState(false)
    const [statusFilters, setStatusFilters] = useState<LeadStatus[]>([])
    const [selectedLeads, setSelectedLeads] = useState<string[]>([])

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

        // Find which Status column the active and over items belong to
        const activeLead = leads.find(l => l.id === activeId)
        const overLeadItem = leads.find(l => l.id === overId)

        if (!activeLead) return

        // Scenario 1: Dragging over another Task
        if (overLeadItem && activeLead.status !== overLeadItem.status) {
            setLeads((items) => {
                const activeIndex = items.findIndex((i) => i.id === activeId)
                const overIndex = items.findIndex((i) => i.id === overId)

                // Clone items
                const newItems = [...items]

                // Update active item status to match over item status
                newItems[activeIndex] = { ...newItems[activeIndex], status: overLeadItem.status }

                // Reorder if needed (arrayMove) - but simple status update is enough for DragOver to visualize snap
                return arrayMove(newItems, activeIndex, overIndex)
            })
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeLead = leads.find(l => l.id === activeId)
        const overLeadItem = leads.find(l => l.id === overId)

        // Handling drop on a Column (container) or Task
        // If dropped on column header or empty area, overId might be status string if we set it as ID (we didn't yet)
        // Check SortableLeadCard vs KanbanColumn

        // Simple reorder within same status
        if (activeId !== overId && activeLead && overLeadItem && activeLead.status === overLeadItem.status) {
            setLeads((items) => {
                const oldIndex = items.findIndex((i) => i.id === activeId)
                const newIndex = items.findIndex((i) => i.id === overId)
                return arrayMove(items, oldIndex, newIndex)
            })
        }

        // If dropped over a different status item, DragOver handled the move. 
        // We just need to persist (which setLeads in DragOver does). 
        // API call would go here.
        console.log('Drag end', activeId, overId)
    }

    const handleAddLead = (newLeadData: Partial<Lead>) => {
        const newLead: Lead = {
            id: `lead_${Date.now()}`,
            name: newLeadData.name || 'New Lead',
            phone: newLeadData.phone || '',
            email: newLeadData.email || '',
            city: newLeadData.city || '',
            state: 'Unknown',
            status: 'new',
            incomeType: 'salaried',
            source: 'web',
            estimatedLoan: newLeadData.estimatedLoan || 0,
            score: 50,
            assignedAgent: 'Unassigned',
            assignedAgentId: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            tags: ['New'],
            documents: 0,
            hasConsent: false,
        }
        setLeads([newLead, ...leads])
    }

    // Import Handler
    const handleImportLeads = (importedLeads: Lead[]) => { // Changed type to Lead[] for consistency
        // Merge imported leads
        setLeads(prev => [...importedLeads, ...prev])
    }

    const handleSaveEdit = (updatedLead: Lead) => {
        setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l))
        setEditLead(null)
    }

    const handleDelete = (lead: Lead) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            setLeads(leads.filter(l => l.id !== lead.id))
        }
    }

    const filteredLeads = useMemo(() => {
        if (statusFilters.length === 0) return leads
        return leads.filter(l => statusFilters.includes(l.status as LeadStatus))
    }, [leads, statusFilters])

    // Group leads by status for Kanban Board
    const leadsByStatus = useMemo(() => {
        // Initialize with ALL statuses to satisfy type requirement
        const grouped: Record<LeadStatus, Lead[]> = {
            new: [],
            contacted: [],
            kyc_pending: [],
            kyc_done: [],
            credit_assessment: [],
            sanctioned: [],
            disbursed: [],
            rejected: []
        }
        filteredLeads.forEach(lead => {
            if (grouped[lead.status]) {
                grouped[lead.status].push(lead)
            }
        })
        return grouped
    }, [filteredLeads])

    const totalPipelineValue = useMemo(() => {
        return leads.reduce((sum, lead) => sum + lead.estimatedLoan, 0)
    }, [leads])

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lead Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage and track your leads through the lifecycle
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
                        Add Lead
                    </Button>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-sm">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn(
                                'p-2 rounded-sm transition-all',
                                viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2 rounded-sm transition-all',
                                viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <Button
                        variant={statusFilters.length > 0 ? "primary" : "secondary"}
                        leftIcon={<Filter className="w-4 h-4" />}
                        onClick={() => setIsFilterOpen(true)}
                    >
                        Filter {statusFilters.length > 0 && `(${statusFilters.length})`}
                    </Button>
                    <Button variant="secondary" leftIcon={<Upload className="w-4 h-4" />} onClick={() => setIsImportWizardOpen(true)}>
                        Import CSV
                    </Button>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedLeads.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                    <div className="bg-slate-900 text-white rounded-full shadow-2xl px-4 py-3 flex items-center gap-4 border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-3 border-r border-white/20 pr-6">
                            <span className="bg-white text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                {selectedLeads.length}
                            </span>
                            <span className="text-sm font-medium">Selected</span>
                            <button
                                onClick={() => setSelectedLeads([])}
                                className="text-slate-400 hover:text-white transition-colors ml-2"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-sm font-medium" title="Assign Agent">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">Assign</span>
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-sm font-medium" title="Send Email">
                                <Mail className="w-4 h-4" />
                                <span className="hidden sm:inline">Email</span>
                            </button>
                            <button className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-full transition-colors flex items-center gap-2 text-sm font-medium" title="Delete">
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Area */}
            {viewMode === 'kanban' ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                    <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                        <div className="flex gap-4 h-full min-w-max px-4">
                            {(Object.keys(leadStatusConfig) as LeadStatus[]).map(status => (
                                <KanbanColumn
                                    key={status}
                                    status={status}
                                    leads={leadsByStatus[status]}
                                    totalPipelineValue={totalPipelineValue}
                                    onLeadClick={(lead) => navigate(`/leads/${lead.id}`)}
                                    onEdit={setEditLead}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                    <DragOverlay>
                        {/* Null or simplified placeholder */}
                    </DragOverlay>
                </DndContext>
            ) : (
                <div className="flex-1 overflow-hidden border border-slate-200 dark:border-white/10 rounded-sm bg-white dark:bg-slate-900 shadow-sm mx-4 mb-6">
                    <div className="h-full overflow-y-auto">
                        <table className="w-full relative">
                            <thead className="bg-slate-900 dark:bg-slate-950 text-white backdrop-blur-md sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="w-12 px-4 py-4 border-b border-white/10 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-500 bg-slate-800 focus:ring-primary-500 focus:ring-offset-slate-900"
                                            checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedLeads(filteredLeads.map(l => l.id))
                                                } else {
                                                    setSelectedLeads([])
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10 text-slate-300">Lead Name</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10 text-slate-300">Contact</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10 text-slate-300">Location</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10 text-slate-300">Loan Amount</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10 text-slate-300">Score</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10 text-slate-300">Source</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10 text-slate-300">Status</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 text-slate-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {filteredLeads.map(lead => {
                                    const status = leadStatusConfig[lead.status]
                                    const source = sourceConfig[lead.source]
                                    const isSelected = selectedLeads.includes(lead.id)
                                    return (
                                        <tr
                                            key={lead.id}
                                            className={cn(
                                                "group relative cursor-pointer transition-all duration-200",
                                                isSelected ? "bg-primary-50 dark:bg-primary-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            )}
                                            onClick={() => navigate(`/leads/${lead.id}`)}
                                        >
                                            <td className="w-12 px-4 py-4 text-center border-r border-slate-100 dark:border-white/5" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedLeads([...selectedLeads, lead.id])
                                                        } else {
                                                            setSelectedLeads(selectedLeads.filter(id => id !== lead.id))
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-100 dark:border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{lead.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium font-mono">ID: {lead.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-100 dark:border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{lead.phone}</span>
                                                    <span className="text-xs text-slate-500">{lead.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center text-sm text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-white/5">{lead.city}</td>
                                            <td className="px-4 py-4 text-center text-sm font-bold text-slate-900 dark:text-white font-mono border-r border-slate-100 dark:border-white/5">{formatCurrency(lead.estimatedLoan)}</td>
                                            <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                                                <div className="flex items-center justify-center gap-1">
                                                    <div className={cn(
                                                        'px-2 py-0.5 text-xs font-bold rounded-sm border border-transparent',
                                                        lead.score >= 80 ? 'text-emerald-700 bg-emerald-100 border-emerald-200' :
                                                            lead.score >= 50 ? 'text-amber-700 bg-amber-100 border-amber-200' :
                                                                'text-red-700 bg-red-100 border-red-200'
                                                    )}>
                                                        {lead.score}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                                                <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm inline-block', source.color, 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10')}>
                                                    {source.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                                                <span className={cn('px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm inline-block', status.bgColor, status.color)}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm text-slate-400 hover:text-primary-600 transition-colors"
                                                        onClick={() => setEditLead(lead)}
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-sm text-slate-400 hover:text-red-600 transition-colors"
                                                        onClick={() => handleDelete(lead)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AddLeadModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddLead}
            />

            <EditLeadModal
                lead={editLead}
                isOpen={!!editLead}
                onClose={() => setEditLead(null)}
                onSave={handleSaveEdit}
            />

            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                selectedStatuses={statusFilters}
                onApply={setStatusFilters}
            />

            <LeadImportWizard
                isOpen={isImportWizardOpen}
                onClose={() => setIsImportWizardOpen(false)}
                onImport={handleImportLeads}
            />
        </div>
    )
}
