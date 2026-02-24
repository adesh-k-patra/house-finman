/**
 * Opportunities Page for House FinMan
 * 
 * Features:
 * - Kanban view with drag-and-drop functionality using @dnd-kit
 * - Stage summary cards with pipeline values
 * - Opportunity cards with probability and expected close
 */

import { useState } from 'react'
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    useDroppable,
} from '@dnd-kit/core'
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, Calendar, User, MoreVertical, Phone, MessageCircle } from 'lucide-react'
import { Button, KPICard } from '@/components/ui'
import { cn, formatCurrency } from '@/utils'
import { CreateOpportunityModal } from './components/CreateOpportunityModal'

type OpportunityStage = 'qualification' | 'proposal' | 'negotiation' | 'review' | 'won' | 'lost'

interface Opportunity {
    id: string
    name: string
    customerName: string
    propertyName: string
    loanAmount: number
    stage: OpportunityStage
    probability: number
    expectedClose: string
    assignedTo: string
    lastActivity: string
}

const stageConfig: Record<OpportunityStage, { label: string; color: string; bgColor: string }> = {
    qualification: { label: 'Qualification', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    proposal: { label: 'Proposal', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    negotiation: { label: 'Negotiation', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    review: { label: 'Review', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
    won: { label: 'Won', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    lost: { label: 'Lost', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
}

const initialOpportunities: Opportunity[] = [
    { id: 'opp_1', name: 'Green Valley - Rahul Sharma', customerName: 'Rahul Sharma', propertyName: 'Green Valley Apartments', loanAmount: 4500000, stage: 'negotiation', probability: 80, expectedClose: '2026-01-15', assignedTo: 'Priya Patel', lastActivity: '2026-01-05T10:00:00' },
    { id: 'opp_2', name: 'Sunrise Villas - Amit Kumar', customerName: 'Amit Kumar', propertyName: 'Sunrise Villas', loanAmount: 8500000, stage: 'proposal', probability: 60, expectedClose: '2026-01-20', assignedTo: 'Vikram Singh', lastActivity: '2026-01-04T14:00:00' },
    { id: 'opp_3', name: 'Metro Heights - Sneha Reddy', customerName: 'Sneha Reddy', propertyName: 'Metro Heights', loanAmount: 12000000, stage: 'qualification', probability: 40, expectedClose: '2026-02-01', assignedTo: 'Anjali Gupta', lastActivity: '2026-01-03T11:00:00' },
    { id: 'opp_4', name: 'Affordable Homes - Deepika Iyer', customerName: 'Deepika Iyer', propertyName: 'Affordable Homes Phase 2', loanAmount: 2800000, stage: 'won', probability: 100, expectedClose: '2026-01-05', assignedTo: 'Priya Patel', lastActivity: '2026-01-05T09:00:00' },
    { id: 'opp_5', name: 'Royal Gardens - Vikram Singh', customerName: 'Vikram Singh', propertyName: 'Royal Gardens', loanAmount: 15000000, stage: 'proposal', probability: 55, expectedClose: '2026-01-25', assignedTo: 'Rajesh Nair', lastActivity: '2026-01-04T16:00:00' },
    { id: 'opp_6', name: 'Budget Homes - Kavitha Pillai', customerName: 'Kavitha Pillai', propertyName: 'Budget Homes Scheme', loanAmount: 3200000, stage: 'qualification', probability: 35, expectedClose: '2026-02-10', assignedTo: 'Sneha Reddy', lastActivity: '2025-12-28T10:00:00' },
    { id: 'opp_7', name: 'Sky Tower - Ramesh Patel', customerName: 'Ramesh Patel', propertyName: 'Sky Tower Residency', loanAmount: 6500000, stage: 'negotiation', probability: 75, expectedClose: '2026-01-18', assignedTo: 'Priya Patel', lastActivity: '2026-01-05T08:00:00' },
    { id: 'opp_8', name: 'Hillside Villas - Meera Iyer', customerName: 'Meera Iyer', propertyName: 'Hillside Villas', loanAmount: 9200000, stage: 'qualification', probability: 45, expectedClose: '2026-02-15', assignedTo: 'Vikram Singh', lastActivity: '2026-01-04T10:00:00' },
    { id: 'opp_9', name: 'City Center - Rajesh Gupta', customerName: 'Rajesh Gupta', propertyName: 'City Center Complex', loanAmount: 18000000, stage: 'review', probability: 90, expectedClose: '2026-01-12', assignedTo: 'Anjali Gupta', lastActivity: '2026-01-06T09:30:00' },
    { id: 'opp_10', name: 'Lakeside View - Suresh Nair', customerName: 'Suresh Nair', propertyName: 'Lakeside View', loanAmount: 5500000, stage: 'negotiation', probability: 70, expectedClose: '2026-01-22', assignedTo: 'Priya Patel', lastActivity: '2026-01-06T11:00:00' },
    { id: 'opp_11', name: 'Urban Living - Anita Desai', customerName: 'Anita Desai', propertyName: 'Urban Living Phases', loanAmount: 7200000, stage: 'review', probability: 85, expectedClose: '2026-01-14', assignedTo: 'Vikram Singh', lastActivity: '2026-01-05T15:45:00' },
    { id: 'opp_12', name: 'Tech Park - Sanjay Gupta', customerName: 'Sanjay Gupta', propertyName: 'Tech Park Office', loanAmount: 25000000, stage: 'negotiation', probability: 70, expectedClose: '2026-02-28', assignedTo: 'Amit Kumar', lastActivity: '2026-01-07T10:00:00' },
    { id: 'opp_13', name: 'Sea Breeze - Rina Roy', customerName: 'Rina Roy', propertyName: 'Sea Breeze Apts', loanAmount: 8800000, stage: 'qualification', probability: 40, expectedClose: '2026-03-15', assignedTo: 'Priya Singh', lastActivity: '2026-01-07T11:30:00' },
    { id: 'opp_14', name: 'Greenfields - Manoj Tiwary', customerName: 'Manoj Tiwary', propertyName: 'Greenfields Plot', loanAmount: 4200000, stage: 'proposal', probability: 55, expectedClose: '2026-02-10', assignedTo: 'Rahul Verma', lastActivity: '2026-01-06T14:20:00' },
    { id: 'opp_15', name: 'Skyline - Neha Kakkar', customerName: 'Neha Kakkar', propertyName: 'Skyline Penthouse', loanAmount: 55000000, stage: 'review', probability: 85, expectedClose: '2026-01-30', assignedTo: 'Anjali Gupta', lastActivity: '2026-01-07T09:15:00' },
    { id: 'opp_16', name: 'City Mall - Retail Corp', customerName: 'Retail Corp', propertyName: 'City Mall Shop', loanAmount: 12500000, stage: 'won', probability: 100, expectedClose: '2026-01-05', assignedTo: 'Vikram Singh', lastActivity: '2026-01-05T16:45:00' },
    { id: 'opp_17', name: 'Lake View - Suresh Raina', customerName: 'Suresh Raina', propertyName: 'Lake View Villa', loanAmount: 18500000, stage: 'negotiation', probability: 75, expectedClose: '2026-02-05', assignedTo: 'Amit Kumar', lastActivity: '2026-01-07T12:00:00' },
    { id: 'opp_18', name: 'Metro Plaza - Office', customerName: 'StartUp Inc', propertyName: 'Metro Plaza Unit', loanAmount: 9500000, stage: 'lost', probability: 0, expectedClose: '2026-01-01', assignedTo: 'Rahul Verma', lastActivity: '2025-12-28T10:00:00' },
    { id: 'opp_19', name: 'Palm Grove - Resort', customerName: 'Hospitality Group', propertyName: 'Palm Grove Land', loanAmount: 85000000, stage: 'proposal', probability: 60, expectedClose: '2026-04-01', assignedTo: 'Priya Singh', lastActivity: '2026-01-06T15:30:00' },
    { id: 'opp_20', name: 'Urban Heights - Flat', customerName: 'Deepak Chopra', propertyName: 'Urban Heights 3BHK', loanAmount: 11000000, stage: 'qualification', probability: 30, expectedClose: '2026-03-20', assignedTo: 'Anjali Gupta', lastActivity: '2026-01-07T13:45:00' }
]

// Sortable Opportunity Card - Extreme Redesign
function SortableOpportunityCard({ opportunity }: { opportunity: Opportunity }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: opportunity.id })
    const stage = stageConfig[opportunity.stage]
    const navigate = useNavigate()

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                navigate(`/opportunities/${opportunity.id}`)
            }}
            className={cn(
                'relative flex flex-col group',
                'bg-white dark:bg-slate-900',
                'border border-slate-200 dark:border-white/10',
                'shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-white/20',
                'transition-all duration-300 hover:-translate-y-1',
                // Sharp corners
                'rounded-none',
                isDragging && 'opacity-50 ring-2 ring-primary-500 shadow-2xl z-50 scale-105'
            )}
        >
            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-4 h-1 border-t-2 border-current" />
            </button>

            {/* Header */}
            <div className="p-3 pb-2 flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
                        {opportunity.name.split('-')[0].trim()}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        <User className="w-3 h-3" />
                        <span className="truncate">{opportunity.customerName}</span>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <MoreVertical className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Inner "Solid Dark" Block */}
            <div className="mx-3 mb-3 p-3 bg-slate-900/95 dark:bg-black/80 backdrop-blur-md border border-slate-800/50 dark:border-white/10 relative overflow-hidden group/inner shadow-inner">
                {/* Decorative sheen */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -translate-y-10 -translate-x-10 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Potential</p>
                            <p className="text-sm font-bold text-white tracking-tight">
                                {formatCurrency(opportunity.loanAmount)}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={cn('inline-flex text-[9px] uppercase font-bold px-1.5 py-0.5 border', stage.color.replace('text-', 'border-').replace('600', '500').replace('500', '400') + '/50', stage.color)}>
                                {stage.label}
                            </div>
                        </div>
                    </div>

                    {/* Probability Bar */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Probability</span>
                            <span>{opportunity.probability}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 overflow-hidden">
                            <div className={cn("h-full transition-all duration-500",
                                opportunity.probability > 75 ? 'bg-emerald-500' :
                                    opportunity.probability > 40 ? 'bg-blue-500' : 'bg-slate-500'
                            )} style={{ width: `${opportunity.probability}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto px-3 pb-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-2">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(opportunity.expectedClose).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex gap-1">
                    <button className="p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

// Kanban Column with Droppable area
function KanbanColumn({ stage, opportunities }: { stage: OpportunityStage; opportunities: Opportunity[] }) {
    const config = stageConfig[stage]
    const { isOver, setNodeRef } = useDroppable({
        id: stage,
    })

    return (
        <div className="flex flex-col w-80 flex-shrink-0">
            <div className={cn('flex items-center justify-between p-3 rounded-t-sm', 'bg-slate-100 dark:bg-slate-800/50', 'border border-b-0 border-slate-200 dark:border-white/10')}>
                <div className="flex items-center gap-2">
                    <span className={cn('w-2 h-2 rounded-full', config.bgColor)} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{config.label}</span>
                    <span className="text-xs text-slate-400">({opportunities.length})</span>
                </div>
            </div>
            <div
                ref={setNodeRef}
                className={cn(
                    'flex-1 p-2 space-y-2 overflow-y-auto rounded-b-sm transition-all duration-200',
                    'bg-slate-50 dark:bg-slate-900/30',
                    'border border-t-0 border-slate-200 dark:border-white/10',
                    'min-h-[400px] max-h-[calc(100vh-400px)]',
                    isOver && 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-inset ring-primary-500/50'
                )}
            >
                <SortableContext items={opportunities.map(o => o.id)} strategy={verticalListSortingStrategy}>
                    {opportunities.map(opp => (
                        <SortableOpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                    {opportunities.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-sm m-2">
                            <p className="text-xs font-medium">Drop items here</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    )
}

export default function OpportunitiesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [isCreateOpportunityOpen, setIsCreateOpportunityOpen] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    )

    const stages: OpportunityStage[] = ['qualification', 'proposal', 'negotiation', 'review', 'won']

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null)
        const { active, over } = event

        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        const activeOpp = opportunities.find(o => o.id === activeId)
        if (!activeOpp) return

        // 1. Dropped over another Opportunity (reorder or move/replace)
        const overOpp = opportunities.find(o => o.id === overId)
        if (overOpp) {
            if (activeOpp.stage !== overOpp.stage) {
                setOpportunities(prev =>
                    prev.map(o => o.id === activeId ? { ...o, stage: overOpp.stage } : o)
                )
            }
            return
        }

        // 2. Dropped over a Column (empty or end of list)
        if (stages.includes(overId as OpportunityStage)) {
            const newStage = overId as OpportunityStage
            if (activeOpp.stage !== newStage) {
                setOpportunities(prev =>
                    prev.map(o => o.id === activeId ? { ...o, stage: newStage } : o)
                )
            }
        }
    }

    const handleCreateOpportunity = (newOpportunity: Opportunity) => {
        setOpportunities([newOpportunity, ...opportunities])
        setIsCreateOpportunityOpen(false)
    }

    const activeOpportunity = activeId ? opportunities.find(o => o.id === activeId) : null

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Opportunities Pipeline</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {opportunities.length} opportunities • {formatCurrency(opportunities.filter(o => o.stage !== 'lost').reduce((s, o) => s + o.loanAmount, 0), true)} pipeline value
                        <span className="text-primary-600 ml-2">• Drag cards between stages</span>
                    </p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpportunityOpen(true)}>Create Opportunity</Button>
            </div>

            {/* Stage Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stages.map(stage => {
                    const config = stageConfig[stage]
                    const opps = opportunities.filter(o => o.stage === stage)
                    const value = opps.reduce((s, o) => s + o.loanAmount, 0)

                    // Map stage to KPICard variant
                    const variantMap: Record<OpportunityStage, 'blue' | 'purple' | 'orange' | 'cyan' | 'green' | 'red'> = {
                        qualification: 'blue',
                        proposal: 'purple',
                        negotiation: 'orange',
                        review: 'cyan',
                        won: 'green',
                        lost: 'red'
                    }

                    return (
                        <div key={stage} className="min-w-[140px]">
                            <KPICard
                                title={config.label}
                                value={formatCurrency(value, true)}
                                subtitle={`${opps.length} Deals`}
                                variant={variantMap[stage]}
                                className="h-full"
                            />
                        </div>
                    )
                })}
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search opportunities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
                </div>
                <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
            </div>

            {/* Kanban with DnD */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {stages.map(stage => (
                        <KanbanColumn key={stage} stage={stage} opportunities={opportunities.filter(o => o.stage === stage)} />
                    ))}
                </div>

                <DragOverlay>
                    {activeOpportunity && (
                        <div className="rounded-sm bg-white dark:bg-slate-800 border border-primary-500 shadow-xl opacity-90 w-80">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{activeOpportunity.name}</h3>
                            <p className="text-sm font-bold text-primary-600 mt-2">{formatCurrency(activeOpportunity.loanAmount)}</p>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            <CreateOpportunityModal
                isOpen={isCreateOpportunityOpen}
                onClose={() => setIsCreateOpportunityOpen(false)}
                onSave={handleCreateOpportunity}
            />
        </div>
    )
}
