
import { useState, useMemo } from 'react'
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    DragOverEvent,
    pointerWithin,
    useDroppable,
} from '@dnd-kit/core'
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
    Plus,
    Filter,
    MoreVertical,
    Clock,
    MessageSquare,
    User,
    ArrowRight,
    Edit,
    Trash2,
    Calendar,
    Phone,
    Mail
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'
import { ActionDetailModal } from '../../components/ActionDetailModal'

// --- Types ---
export type ActionStatus = 'Inbox' | 'High Priority' | 'Medium Priority' | 'Low Priority' | 'Fixed' | 'Deleted'

export interface ActionItem {
    id: string
    title: string
    description: string
    status: ActionStatus
    priority: 'High' | 'Medium' | 'Low'
    assignee: string
    createdAt: string
    dueDate?: string
    comments: number
}

// --- Dummy Data ---
const dummyActions: ActionItem[] = [
    {
        id: 'act-1',
        title: 'Investigate iOS Login Timeout',
        description: 'Users reporting session expiry immediately after login on iOS 17.',
        status: 'High Priority',
        priority: 'High',
        assignee: 'Sarah Connor',
        createdAt: '2024-02-10T10:00:00Z',
        comments: 3
    },
    {
        id: 'act-2',
        title: 'Update Privacy Policy Link',
        description: 'Footer link is broken on mobile view.',
        status: 'Inbox',
        priority: 'Low',
        assignee: 'John Doe',
        createdAt: '2024-02-12T14:30:00Z',
        comments: 2
    },
    {
        id: 'act-3',
        title: 'Optimize Dashboard Load Time',
        description: 'Dashboard takes >5s to load for users with >10k records.',
        status: 'Medium Priority',
        priority: 'Medium',
        assignee: 'Alex Murphy',
        createdAt: '2024-02-11T09:15:00Z',
        comments: 5
    },
    {
        id: 'act-4',
        title: 'Fix Typo in Welcome Email',
        description: 'Says "Welocme" instead of "Welcome".',
        status: 'Fixed',
        priority: 'Low',
        assignee: 'Jane Smith',
        createdAt: '2024-02-09T16:00:00Z',
        comments: 1
    },
    {
        id: 'act-5',
        title: 'Review GDPR Compliance',
        description: 'Legal team requested a review of data retention policies.',
        status: 'Inbox',
        priority: 'High',
        assignee: 'Unassigned',
        createdAt: '2024-02-13T11:00:00Z',
        comments: 2
    },
    {
        id: 'act-6',
        title: 'Update API Documentation',
        description: 'Add new endpoints for survey analytics.',
        status: 'Low Priority',
        priority: 'Low',
        assignee: 'Dev Team',
        createdAt: '2024-02-14T09:00:00Z',
        comments: 1
    },
    {
        id: 'act-7',
        title: 'Remove Legacy Code',
        description: 'Cleanup old survey components.',
        status: 'Deleted',
        priority: 'Low',
        assignee: 'System',
        createdAt: '2024-01-01T00:00:00Z',
        comments: 0
    }
]

const statusConfig: Record<ActionStatus, { label: string, color: string, bgColor: string }> = {
    'Inbox': { label: 'Inbox', color: 'text-slate-500', bgColor: 'bg-slate-500' },
    'High Priority': { label: 'High Priority', color: 'text-red-500', bgColor: 'bg-red-500' },
    'Medium Priority': { label: 'Medium Priority', color: 'text-amber-500', bgColor: 'bg-amber-500' },
    'Low Priority': { label: 'Low Priority', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    'Fixed': { label: 'Fixed', color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
    'Deleted': { label: 'Deleted', color: 'text-slate-400', bgColor: 'bg-slate-400' }
}

// --- Components ---

function SortableActionCard({ action, onClick }: { action: ActionItem; onClick: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: action.id })
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
                'relative flex flex-col group p-3', // Reduce padding slightly to match compact screenshot
                'bg-white dark:bg-slate-900', // White in light mode
                // Glassmorphic dark black stroke (border) + thin inner shadow
                'border border-slate-200 dark:border-white/10',
                'shadow-sm hover:shadow-md transition-all duration-300',
                'hover:border-blue-400 dark:hover:border-blue-500',
                'cursor-grab active:cursor-grabbing',
                'rounded-none', // Sharp corners
                isDragging && 'opacity-50 ring-2 ring-primary-500 shadow-2xl z-50 scale-105'
            )}
        >
            {/* Header: Title & Description */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                        {action.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {action.description}
                    </p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(!showMenu)
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            {/* Grid: Assignee & Priority (Matching Value & Score) */}
            <div className="grid grid-cols-2 gap-4 mb-3">
                {/* Assignee */}
                <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Assignee</p>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {action.assignee.charAt(0)}
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {action.assignee.split(' ')[0]}
                        </p>
                    </div>
                </div>

                {/* Priority */}
                <div className="text-right flex flex-col items-end">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Priority</p>
                    <div
                        className={cn(
                            'flex items-center justify-center w-8 h-8 text-[10px] font-black',
                            'text-white rounded-none shadow-sm',
                            action.priority === 'High' ? 'bg-[#ef4444]' :
                                action.priority === 'Medium' ? 'bg-[#f59e0b]' :
                                    'bg-[#10b981]' // Low is Green
                        )}
                    >
                        {action.priority === 'High' ? '85' : action.priority === 'Medium' ? '65' : '92'}
                    </div>
                </div>
            </div>

            {/* Footer: Date & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                <span className="text-[10px] font-medium text-slate-400">
                    2 days ago
                </span>
                <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-blue-500 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button className="text-slate-400 hover:text-blue-500 transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Bottom Colored Box (Blue Tag) */}
            <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-none flex items-center gap-2 border border-blue-100 dark:border-blue-800/30">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 truncate">
                    Survey Response #{action.id.split('-')[1]}
                </span>
            </div>
        </div>
    )
}

function KanbanColumn({ status, actions, onActionClick }: { status: ActionStatus; actions: ActionItem[]; onActionClick: (action: ActionItem) => void }) {
    const config = statusConfig[status]
    const totalActions = Math.max(actions.length, 5) // Mock total base
    const percentage = (actions.length / totalActions) * 100
    // Make the column itself droppable
    const { setNodeRef } = useDroppable({
        id: status,
    })

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col w-[340px] flex-shrink-0 h-full"
        >
            {/* Column Header */}
            <div className={cn(
                'p-4 flex flex-col gap-3',
                'bg-[#0B1121] border border-b-0 border-white/10 rounded-none' // Dark aesthetic
            )}>
                {/* Title + Count */}
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">
                        {config.label}
                    </span>
                    <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-white text-slate-900 text-[10px] font-bold rounded-none">
                        {actions.length}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                    <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-500 ease-out", "bg-white")} // White progress bar in dark header
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                    </div>
                </div>
                {/* Total Value Stub */}
                <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                        {actions.length} TASKS
                    </span>
                </div>
            </div>

            {/* Column Body */}
            <div className={cn(
                'flex-1 p-3 space-y-3 overflow-y-auto rounded-none custom-scrollbar min-h-0',
                'bg-slate-50 dark:bg-slate-900/30',
                'border border-t-0 border-slate-200 dark:border-white/10',
            )}>
                <SortableContext items={actions.map(a => a.id)} strategy={verticalListSortingStrategy}>
                    <div className="min-h-[100px] flex flex-col gap-3">
                        {actions.map(action => (
                            <SortableActionCard
                                key={action.id}
                                action={action}
                                onClick={() => onActionClick(action)}
                            />
                        ))}
                    </div>
                    {actions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 opacity-50">
                            <ArrowRight className="w-5 h-5 mb-2 opacity-50" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">No Actions</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    )
}

export function ActionsTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const [outcome, setOutcome] = useState<ActionItem[]>(dummyActions)
    const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Reduced distance for faster pickup
            },
        })
    )

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        if (activeId === overId) return

        const activeItem = outcome.find(i => i.id === activeId)
        const overItem = outcome.find(i => i.id === overId)

        if (!activeItem) return

        // If dragging over another item in a different column
        if (overItem && activeItem.status !== overItem.status) {
            setOutcome((items) => {
                const activeIndex = items.findIndex((i) => i.id === activeId)
                const overIndex = items.findIndex((i) => i.id === overId)
                const newItems = [...items]

                // Update status
                newItems[activeIndex] = { ...newItems[activeIndex], status: overItem.status }

                return arrayMove(newItems, activeIndex, overIndex)
            })
        }
        // Handle dragging over an empty column
        else {
            const isOverColumn = columns.includes(overId as ActionStatus)

            if (isOverColumn && activeItem.status !== overId) {
                setOutcome((items) => {
                    const activeIndex = items.findIndex((i) => i.id === activeId)
                    const newItems = [...items]

                    // Update status to the new column
                    newItems[activeIndex] = { ...newItems[activeIndex], status: overId as ActionStatus }

                    return arrayMove(newItems, activeIndex, activeIndex) // Keep relative position or move to end? arrayMove with same index effectively just updates the item in place but triggers re-render
                })
            }
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeItem = outcome.find(i => i.id === activeId)
        const overItem = outcome.find(i => i.id === overId)

        // If dropped on a column (empty or not, if the sensor picked the column background)
        if (columns.includes(overId as any) && activeItem && activeItem.status !== overId) {
            setOutcome((items) => {
                const activeIndex = items.findIndex((i) => i.id === activeId)
                const newItems = [...items]
                newItems[activeIndex] = { ...newItems[activeIndex], status: overId as ActionStatus }
                return arrayMove(newItems, activeIndex, 0) // Move to top or keep? Logic might be tricky. Let's just update status.
            })
            return
        }

        if (activeId !== overId && activeItem && overItem && activeItem.status === overItem.status) {
            setOutcome((items) => {
                const oldIndex = items.findIndex((i) => i.id === activeId)
                const newIndex = items.findIndex((i) => i.id === overId)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    // Group actions by status
    const groupedActions = useMemo(() => {
        const groups: Record<ActionStatus, ActionItem[]> = {
            'Inbox': [],
            'High Priority': [],
            'Medium Priority': [],
            'Low Priority': [],
            'Fixed': [],
            'Deleted': []
        }
        outcome.forEach(action => {
            if (groups[action.status]) {
                groups[action.status].push(action)
            }
        })
        return groups
    }, [outcome])

    const columns: ActionStatus[] = ['Inbox', 'High Priority', 'Medium Priority', 'Low Priority', 'Fixed', 'Deleted']

    return (
        <div className="h-full w-full max-w-full min-w-0 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Header / Toolbar - Transparent & Compact */}
            <div className="flex items-center justify-end px-6 py-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Button variant="primary" className="rounded-none font-bold text-xs shadow-md" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                        ADD ACTION
                    </Button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-2">
                <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin} // Use pointerWithin for better UX
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex h-full gap-5 min-w-max pt-4">
                        {columns.map(status => (
                            <KanbanColumn
                                key={status}
                                status={status}
                                actions={groupedActions[status]}
                                onActionClick={(action) => {
                                    setSelectedAction(action)
                                    setIsDetailOpen(true)
                                }}
                            />
                        ))}
                    </div>
                </DndContext>
            </div>

            <ActionDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                actionItem={selectedAction}
                onViewResponses={() => onNavigate('responses')}
            />
        </div>
    )
}
