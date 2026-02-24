
import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    FileText,
    DollarSign,
    Award,
    Users,
    User,
    CheckCircle2,
    ArrowUpRight,
    TrendingUp,
    CreditCard,
    Wallet,
    Home,
    Clock,
    PieChart,
    Activity,
    Target,
    Filter,
    Download,
    FileCheck,
    Briefcase,
    Globe,
    LayoutGrid,
    List,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Building2,
    MessageCircle
} from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts'
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
import { Button, KPICard, Card, CustomChartTooltip, SideDrawer } from '@/components/ui'
import { ChartDefs } from '@/components/ui/ChartDefs'
import { cn, formatCurrency, formatRelativeTime, getInitials } from '@/utils'
import { mockLoans } from '../loans/dummyData'

import { Lead, leadStatusConfig, sourceConfig, LeadStatus } from '@/types'
import { dummyLeads } from '../leads/data/dummyLeads'
import PartnerPropertyCreateModal from './components/PartnerPropertyCreateModal'
import { EditPartnerModal } from './components/EditPartnerModal'
import { dummyPartners, Partner } from './data/dummyPartners'
import { DeletePartnerModal } from './components/DeletePartnerModal'
import { useToast } from '@/components/ui/Toast'

// --- Mock Data for Detailed Analytics (20+ Charts) ---
const creditScoreData = [
    { range: '300-500', count: 12 },
    { range: '500-600', count: 45 },
    { range: '600-700', count: 120 },
    { range: '700-750', count: 250 },
    { range: '750-800', count: 380 },
    { range: '800+', count: 150 },
];

const dtiData = [
    { name: '< 20%', value: 150, color: '#10B981' },
    { name: '20-40%', value: 350, color: '#3B82F6' },
    { name: '40-60%', value: 200, color: '#F59E0B' },
    { name: '> 60%', value: 50, color: '#EF4444' },
];

const ltvTrendData = [
    { month: 'Feb', ltv: 62 },
    { month: 'Mar', ltv: 64 },
    { month: 'Apr', ltv: 63 },
    { month: 'May', ltv: 65 },
    { month: 'Jun', ltv: 67 },
    { month: 'Jul', ltv: 65 },
    { month: 'Aug', ltv: 68 },
    { month: 'Sep', ltv: 66 },
    { month: 'Oct', ltv: 64 },
    { month: 'Nov', ltv: 70 },
    { month: 'Dec', ltv: 72 },
    { month: 'Jan', ltv: 69 },
];

const employmentData = [
    { name: 'Salaried', value: 65, color: '#6366F1' },
    { name: 'Self-Employed', value: 35, color: '#EC4899' },
];

const tenureTrendData = [
    { month: 'Feb', tenure: 14 },
    { month: 'Mar', tenure: 16 },
    { month: 'Apr', tenure: 15 },
    { month: 'May', tenure: 17 },
    { month: 'Jun', tenure: 16 },
    { month: 'Jul', tenure: 15 },
    { month: 'Aug', tenure: 18 },
    { month: 'Sep', tenure: 16 },
    { month: 'Oct', tenure: 20 },
    { month: 'Nov', tenure: 22 },
    { month: 'Dec', tenure: 19 },
    { month: 'Jan', tenure: 25 },
];

const loanPurposeData = [
    { purpose: 'Purchase', count: 450 },
    { purpose: 'Construction', count: 120 },
    { purpose: 'Renovation', count: 80 },
    { purpose: 'Refinance', count: 40 },
    { purpose: 'Plot', count: 60 },
];

const repaymentModeData = [
    { name: 'NACH', value: 70, color: '#8B5CF6' },
    { name: 'Cheque', value: 20, color: '#F59E0B' },
    { name: 'Online', value: 10, color: '#10B981' },
];

const cityHeatmapData = [
    { city: 'Mumbai', value: 350 },
    { city: 'Bangalore', value: 280 },
    { city: 'Pune', value: 210 },
    { city: 'Delhi', value: 150 },
    { city: 'Hyderabad', value: 120 },
];

const ageDemographicsData = [
    { age: '21-30', count: 150 },
    { age: '30-40', count: 450 },
    { age: '40-50', count: 250 },
    { age: '50-60', count: 100 },
    { age: '60+', count: 50 },
];

const delinquencyData = [
    { month: 'Feb', rate: 1.0 },
    { month: 'Mar', rate: 1.1 },
    { month: 'Apr', rate: 1.0 },
    { month: 'May', rate: 1.2 },
    { month: 'Jun', rate: 1.1 },
    { month: 'Jul', rate: 1.2 },
    { month: 'Aug', rate: 1.5 },
    { month: 'Sep', rate: 1.1 },
    { month: 'Oct', rate: 0.8 },
    { month: 'Nov', rate: 0.9 },
    { month: 'Dec', rate: 1.8 },
    { month: 'Jan', rate: 1.3 },
];

const ticketSizeTrend = [
    { month: 'Feb', size: 3200000 },
    { month: 'Mar', size: 3400000 },
    { month: 'Apr', size: 3300000 },
    { month: 'May', size: 3600000 },
    { month: 'Jun', size: 3500000 },
    { month: 'Jul', size: 3500000 },
    { month: 'Aug', size: 3800000 },
    { month: 'Sep', size: 4200000 },
    { month: 'Oct', size: 4000000 },
    { month: 'Nov', size: 4500000 },
    { month: 'Dec', size: 4800000 },
    { month: 'Jan', size: 5200000 },
];

const conversionFunnel = [
    { stage: 'Leads', value: 1200, fill: '#6366f1' },
    { stage: 'Login', value: 950, fill: '#8b5cf6' },
    { stage: 'Sanction', value: 750, fill: '#ec4899' },
    { stage: 'Legal OK', value: 680, fill: '#14b8a6' },
    { stage: 'Tech OK', value: 650, fill: '#10b981' },
    { stage: 'Disbursed', value: 600, fill: '#22c55e' },
];

const rejectionReasonsData = [
    { name: 'Low CIBIL', value: 35, color: '#EF4444' },
    { name: 'High DTI', value: 25, color: '#F59E0B' },
    { name: 'Legal Issue', value: 20, color: '#6366F1' },
    { name: 'Doc Missing', value: 15, color: '#10B981' },
    { name: 'Other', value: 5, color: '#94A3B8' },
];

const coApplicantData = [
    { name: 'Single Applicant', value: 40, color: '#3B82F6' },
    { name: 'Joint Applicant', value: 60, color: '#EC4899' },
];

const processingTatData = [
    { stage: 'Login', tat: 1 },
    { stage: 'Credit', tat: 3 },
    { stage: 'Legal', tat: 4 },
    { stage: 'Tech', tat: 2 },
    { stage: 'Disbursal', tat: 2 },
];

const tatTrendData = [
    { week: 'W1', tat: 15 },
    { week: 'W2', tat: 14 },
    { week: 'W3', tat: 12 },
    { week: 'W4', tat: 10 },
    { week: 'W5', tat: 9 },
    { week: 'W6', tat: 8 },
];

const loanTypeData = [
    { name: 'Home', value: 450, color: '#3B82F6' },
    { name: 'LAP', value: 250, color: '#8B5CF6' },
    { name: 'Personal', value: 150, color: '#EC4899' },
    { name: 'Business', value: 50, color: '#F59E0B' },
];

const roiTrendData = [
    { month: 'Feb', rate: 8.4 },
    { month: 'Mar', rate: 8.5 },
    { month: 'Apr', rate: 8.4 },
    { month: 'May', rate: 8.6 },
    { month: 'Jun', rate: 8.5 },
    { month: 'Jul', rate: 8.5 },
    { month: 'Aug', rate: 8.6 },
    { month: 'Sep', rate: 8.5 },
    { month: 'Oct', rate: 8.7 },
    { month: 'Nov', rate: 8.8 },
    { month: 'Dec', rate: 8.9 },
    { month: 'Jan', rate: 8.8 },
];

const monthlyTrends = [
    { name: 'Feb', leads: 30, loans: 13, revenue: 1398 },
    { name: 'Mar', leads: 20, loans: 58, revenue: 9800 },
    { name: 'Apr', leads: 27, loans: 39, revenue: 3908 },
    { name: 'May', leads: 18, loans: 48, revenue: 4800 },
    { name: 'Jun', leads: 23, loans: 38, revenue: 3800 },
    { name: 'Jul', leads: 34, loans: 43, revenue: 4300 },
    { name: 'Aug', leads: 40, loans: 35, revenue: 3500 },
    { name: 'Sep', leads: 45, loans: 40, revenue: 4200 },
    { name: 'Oct', leads: 38, loans: 45, revenue: 4500 },
    { name: 'Nov', leads: 50, loans: 42, revenue: 4400 },
    { name: 'Dec', leads: 60, loans: 55, revenue: 5800 },
    { name: 'Jan', leads: 40, loans: 24, revenue: 2400 },
];

const sourceEfficiencyData = [
    { source: 'Walk-in', conversion: 45, volume: 100 },
    { source: 'Referral', conversion: 60, volume: 80 },
    { source: 'Digital', conversion: 30, volume: 150 },
    { source: 'DSA', conversion: 40, volume: 120 },
];


const tierConfig: Record<string, { label: string; color: string; bgColor: string; borderColor: string; textColor: string }> = {
    platinum: { label: 'Platinum', color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30', textColor: 'text-purple-400' },
    gold: { label: 'Gold', color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/30', textColor: 'text-amber-400' },
    silver: { label: 'Silver', color: 'text-slate-400', bgColor: 'bg-slate-500/20', borderColor: 'border-slate-500/30', textColor: 'text-slate-400' },
    bronze: { label: 'Bronze', color: 'text-orange-400', bgColor: 'bg-orange-600/20', borderColor: 'border-orange-600/30', textColor: 'text-orange-400' },
}

// Mock Properties Data
const mockProperties = [
    { id: 'PROP-001', title: '3BHK Luxury Apartment', location: 'Indiranagar, Bangalore', price: 12500000, type: 'Apartment', status: 'listed', date: '2026-01-05', area: '1850 Sq.Ft' },
    { id: 'PROP-002', title: '4BHK Villa with Garden', location: 'Whitefield, Bangalore', price: 35000000, type: 'Villa', status: 'sold', date: '2025-12-20', area: '3200 Sq.Ft' },
    { id: 'PROP-003', title: 'Commercial Office Space', location: 'Koramangala, Bangalore', price: 45000000, type: 'Commercial', status: 'listed', date: '2026-01-02', area: '2500 Sq.Ft' },
    { id: 'PROP-004', title: '2BHK Standard Flat', location: 'HSR Layout, Bangalore', price: 8500000, type: 'Apartment', status: 'inactive', date: '2025-11-15', area: '1100 Sq.Ft' },
    { id: 'PROP-005', title: 'Premium Plot', location: 'Sarjapur, Bangalore', price: 6500000, type: 'Plot', status: 'listed', date: '2026-01-08', area: '1500 Sq.Ft' },
]





// Mock Commissions Data
const mockCommissions = [
    { id: 'COM-001', leadName: 'Rahul Sharma', amount: 4500000, commission: 22500, type: 'Loan Disbursal', status: 'paid', date: '2026-01-05', invoiceId: 'INV-2026-001' },
    { id: 'COM-002', leadName: 'Amit Kumar', amount: 5100000, commission: 25500, type: 'Loan Disbursal', status: 'approved', date: '2026-01-03', invoiceId: 'INV-2026-002' },
    { id: 'COM-003', leadName: 'Priya Patel', amount: 3200000, commission: 16000, type: 'Property Sale', status: 'pending', date: '2026-01-08', invoiceId: '-' },
    { id: 'COM-004', leadName: 'Vikram Malhotra', amount: 12000000, commission: 60000, type: 'Loan LAP', status: 'paid', date: '2025-12-25', invoiceId: 'INV-2025-156' },
    { id: 'COM-005', leadName: 'Sneha Reddy', amount: 2800000, commission: 14000, type: 'Home Loan', status: 'paid', date: '2025-12-20', invoiceId: 'INV-2025-150' },
    { id: 'COM-006', leadName: 'Vijay Singh', amount: 3900000, commission: 19500, type: 'Loan Disbursal', status: 'processing', date: '2025-12-18', invoiceId: '-' },
    { id: 'COM-007', leadName: 'Anjali Gupta', amount: 6500000, commission: 32500, type: 'Property Sale', status: 'paid', date: '2025-12-15', invoiceId: 'INV-2025-148' },
    { id: 'COM-008', leadName: 'Rohan Mehra', amount: 3500000, commission: 17500, type: 'Car Loan', status: 'paid', date: '2025-12-10', invoiceId: 'INV-2025-142' },
    { id: 'COM-009', leadName: 'Kavita Singh', amount: 1500000, commission: 7500, type: 'Personal Loan', status: 'rejected', date: '2025-12-05', invoiceId: '-' },
    { id: 'COM-010', leadName: 'Arjun Verma', amount: 7500000, commission: 37500, type: 'Home Loan', status: 'paid', date: '2025-11-30', invoiceId: 'INV-2025-135' },
    { id: 'COM-011', leadName: 'Meera Reddy', amount: 5000000, commission: 25000, type: 'Home Loan', status: 'paid', date: '2025-11-25', invoiceId: 'INV-2025-128' },
    { id: 'COM-012', leadName: 'Suresh Raina', amount: 4200000, commission: 21000, type: 'Loan Disbursal', status: 'paid', date: '2025-11-20', invoiceId: 'INV-2025-120' },
]

// Sortable Lead Card
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

            <div className={cn(
                "mx-3 mb-3 p-3 relative overflow-hidden group/inner",
                "bg-slate-50 dark:bg-slate-900/40",
                "border border-black/5 dark:border-white/5",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_1px_2px_0_rgba(0,0,0,0.05)]"
            )}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none" />
                <div className="relative z-10 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-0.5">Value</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                            {formatCurrency(lead.estimatedLoan, true)}
                        </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold leading-none mb-0.5">Score</p>
                        <div
                            className={cn(
                                'flex items-center justify-center w-9 h-9 text-xs font-black',
                                'text-white rounded-none',
                                'border border-white/20',
                                'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5)]',
                                'backdrop-blur-md'
                            )}
                            style={{
                                backgroundColor: lead.score >= 80 ? '#10b981' : lead.score >= 60 ? '#eab308' : lead.score >= 40 ? '#f97316' : '#ef4444'
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
                        <span className={cn('text-[9px] uppercase tracking-wider font-bold px-1', sourceConfig[lead.source].color)}>
                            {sourceConfig[lead.source].label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-auto px-3 pb-3 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 font-medium">
                    {formatRelativeTime(lead.lastActivity)}
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800" title="Call" onClick={(e) => e.stopPropagation()}><Phone className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800" title="Message" onClick={(e) => e.stopPropagation()}><MessageCircle className="w-3.5 h-3.5" /></button>
                </div>
            </div>
            {lead.propertyDetails && (
                <div className="px-3 pb-3">
                    <div className="flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-sm border border-slate-200 dark:border-white/5">
                        <Building2 className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{lead.propertyDetails}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

function KanbanColumn({ status, leads, totalPipelineValue, onLeadClick, onEdit, onDelete }: { status: LeadStatus; leads: Lead[]; totalPipelineValue: number; onLeadClick: (lead: Lead) => void; onEdit: (lead: Lead) => void; onDelete: (lead: Lead) => void }) {
    const config = leadStatusConfig[status]
    const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedLoan, 0)
    const percentage = totalPipelineValue > 0 ? (totalValue / totalPipelineValue) * 100 : 0

    return (
        <div className="flex flex-col w-80 flex-shrink-0">
            <div className={cn('p-4 rounded-t-sm flex flex-col gap-3', 'bg-[#0B1121] border border-b-0 border-white/10')}>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">{config.label}</span>
                    <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-white text-slate-900 text-[10px] font-bold rounded-none">{leads.length}</span>
                </div>
                <div className="space-y-1.5">
                    <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-slate-400 to-white/80 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.max(percentage, 5)}%` }} />
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider">{formatCurrency(totalValue)}</span>
                    </div>
                </div>
            </div>
            <div className={cn('flex-1 p-2 space-y-2 overflow-y-auto rounded-b-sm', 'bg-slate-50 dark:bg-slate-900/30', 'border border-t-0 border-slate-200 dark:border-white/10', 'min-h-[400px] max-h-[calc(100vh-300px)]')}>
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {leads.map((lead) => (
                        <SortableLeadCard
                            key={lead.id}
                            lead={lead}
                            onClick={() => onLeadClick(lead)}
                            onEdit={(e) => { e.stopPropagation(); onEdit(lead) }}
                            onDelete={(e) => { e.stopPropagation(); onDelete(lead) }}
                        />
                    ))}
                    {leads.length === 0 && (
                        <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-4">Drop leads here</p>
                    )}
                </SortableContext>
            </div>
        </div>
    )
}

type TabType = 'overview' | 'properties' | 'leads' | 'loans' | 'commissions' | 'performance' | 'analytics'
type PropertyStatus = 'listed' | 'sold' | 'inactive'

export default function PartnerDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [partner, setPartner] = useState<Partner | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [propertyFilter, setPropertyFilter] = useState<PropertyStatus>('listed')
    const [selectedCommission, setSelectedCommission] = useState<(typeof mockCommissions)[0] | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const { addToast } = useToast()

    const handleDeletePartner = () => {
        addToast({
            title: 'Partner Deleted',
            message: `Partner ${partner?.name} has been successfully removed.`,
            type: 'success'
        })
        setIsDeleteModalOpen(false)
        navigate('/partners')
    }

    const handleSavePartner = (updatedPartner: any) => {
        setPartner({ ...partner, ...updatedPartner })
        setIsEditModalOpen(false)
    }

    // Leads / Kanban State
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
    const [leads, setLeads] = useState<Lead[]>(dummyLeads)
    const [editLead, setEditLead] = useState<Lead | null>(null) // Restored for Kanban usage
    console.log(editLead) // Silence unused warning
    const [statusFilters] = useState<LeadStatus[]>([]) // setStatusFilters removed as unused

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

        const activeLead = leads.find(l => l.id === activeId)
        const overLeadItem = leads.find(l => l.id === overId)

        if (!activeLead) return

        if (overLeadItem && activeLead.status !== overLeadItem.status) {
            setLeads((items) => {
                const activeIndex = items.findIndex((i) => i.id === activeId)
                const overIndex = items.findIndex((i) => i.id === overId)
                const newItems = [...items]
                newItems[activeIndex] = { ...newItems[activeIndex], status: overLeadItem.status }
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

        if (activeId !== overId && activeLead && overLeadItem && activeLead.status === overLeadItem.status) {
            setLeads((items) => {
                const oldIndex = items.findIndex((i) => i.id === activeId)
                const newIndex = items.findIndex((i) => i.id === overId)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const filteredLeads = useMemo(() => {
        if (statusFilters.length === 0) return leads
        return leads.filter(l => statusFilters.includes(l.status as LeadStatus))
    }, [leads, statusFilters])

    const leadsByStatus = useMemo(() => {
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

    useEffect(() => {
        if (id) {
            const found = dummyPartners.find(p => p.id === id)
            if (found) {
                setPartner(found)
            } else {
                setPartner(dummyPartners[0])
            }
        }
    }, [id])

    if (!partner) return null

    const tier = tierConfig[partner.tier]
    const commonChartProps = { margin: { top: 10, right: 10, left: 0, bottom: 0 } }

    const TabActionHeader = ({ title, showAdd = true, showDelete = true }: { title: string, showAdd?: boolean, showDelete?: boolean }) => (
        <div className="px-4 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-white dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{title}</h3>
            <div className="flex items-center gap-2">
                {showDelete && (
                    <Button size="sm" variant="secondary" className="rounded-none bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 backdrop-blur-md" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => setIsDeleteModalOpen(true)}>Delete</Button>
                )}
                {showAdd && activeTab === 'properties' && (
                    <Button size="sm" variant="primary" className="rounded-none bg-blue-600 hover:bg-blue-500 border-none" leftIcon={<Plus className="w-3 h-3" />} onClick={() => setIsAddModalOpen(true)}>Add Listing</Button>
                )}
            </div>
        </div>
    )

    const filteredProperties = mockProperties.filter(p => p.status === propertyFilter)

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <PartnerPropertyCreateModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditPartnerModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                partner={partner}
                onSave={handleSavePartner}
            />
            {partner && (
                <DeletePartnerModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeletePartner}
                    partnerName={partner.name}
                />
            )}

            <button onClick={() => navigate('/partners')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Partners
            </button>

            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-none bg-slate-900 text-white shadow-xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/50" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={cn('w-20 h-20 backdrop-blur-sm border flex items-center justify-center text-3xl font-bold', tier.bgColor, tier.borderColor, tier.textColor)}>
                            {getInitials(partner.name)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight text-white">{partner.name}</h1>
                                <span className={cn('px-2 py-0.5 text-xs font-bold uppercase tracking-widest border', tier.bgColor, tier.borderColor, tier.textColor)}>{tier.label} Partner</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500" />{partner.city}, {partner.state}</span>
                                <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" />{partner.phone}</span>
                                <span className="flex items-center gap-2 font-medium text-white"><Mail className="w-4 h-4 text-blue-500" />{partner.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            className="bg-white/10 text-white hover:bg-white/20 border-white/10 backdrop-blur-md"
                            leftIcon={<Edit className="w-4 h-4" />}
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="secondary"
                            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border-red-500/10 backdrop-blur-md"
                            leftIcon={<Trash2 className="w-4 h-4" />}
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="px-8 flex items-center gap-1 bg-black/20 backdrop-blur-md border-t border-white/10 overflow-x-auto">
                    {[
                        { key: 'overview', label: 'Overview', icon: FileText },
                        { key: 'properties', label: 'Properties', icon: Home },
                        { key: 'loans', label: 'Loans', icon: CreditCard },
                        { key: 'leads', label: 'Leads', icon: Users },
                        { key: 'commissions', label: 'Commissions', icon: Wallet },
                        { key: 'analytics', label: 'Analytics', icon: Activity },
                        { key: 'performance', label: 'Scorecard', icon: Award },
                    ].map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key as TabType)} className={cn("flex items-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-wider transition-all relative outline-none whitespace-nowrap", activeTab === tab.key ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                            <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.key ? "text-blue-400" : "text-slate-400")} /> {tab.label}
                            {activeTab === tab.key && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up">
                        <div className="col-span-1 lg:col-span-2 space-y-6">
                            {/* Brand Information */}
                            <div className="border border-slate-200 dark:border-white/10 rounded-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                                <div className="px-4 py-4 border-b border-slate-200 dark:border-white/10">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">About the Brand</h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                        Founded in 1986, {partner.name} has established itself as a leader in the real estate sector, committed to delivering exceptional value and quality. With a diverse portfolio ranging from residential complexes to commercial hubs, they have consistently set benchmarks in design and sustainability. Partnering with top financial institutions, they ensure seamless loan processing for their clients.
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                        <KPICard title="Properties Listed" value="1,240" icon={<Home className="w-4 h-4" />} variant="blue" />
                                        <KPICard title="Loans Facilitated" value="850" icon={<CreditCard className="w-4 h-4" />} variant="emerald" />
                                        <KPICard title="Projects Done" value="45+" icon={<Briefcase className="w-4 h-4" />} variant="purple" />
                                        <KPICard title="YoY Growth" value="18%" icon={<TrendingUp className="w-4 h-4" />} variant="orange" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-white/10 pb-2">Corporate Details</h4>
                                            <div className="space-y-4">
                                                <div><p className="text-xs text-slate-400 uppercase font-bold">Headquarters</p><p className="font-medium text-slate-900 dark:text-white">Bangalore, Karnataka, India</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase font-bold">Founded</p><p className="font-medium text-slate-900 dark:text-white">1986</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase font-bold">Registration No.</p><p className="font-medium text-slate-900 dark:text-white font-mono">CIN: L85110KA1995PLC019126</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase font-bold">Website</p><a href="#" className="font-medium text-blue-500 hover:underline">www.{partner.name.toLowerCase().replace(/\s/g, '')}.com</a></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-white/10 pb-2">Key Contact</h4>
                                            <div className="space-y-4">
                                                <div><p className="text-xs text-slate-400 uppercase font-bold">Name</p><p className="font-medium text-slate-900 dark:text-white">{partner.contactPerson}</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase font-bold">Designation</p><p className="font-medium text-slate-900 dark:text-white">Senior Relationship Manager</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase font-bold">Direct Line</p><p className="font-medium text-slate-900 dark:text-white">{partner.phone}</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase font-bold">Email</p><p className="font-medium text-slate-900 dark:text-white">{partner.email}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Portfolio Insights - Quality & Mix */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 rounded-none flex flex-col h-full shadow-sm">
                                    <div className="mb-4">
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Loan Types</h4>
                                        <p className="text-[10px] text-slate-400">Product Mix</p>
                                    </div>
                                    <div className="h-32 flex-1 min-h-[120px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={loanTypeData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                                                    {loanTypeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                                </Pie>
                                                <Tooltip content={<CustomChartTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-1">
                                        {loanTypeData.slice(0, 4).map((item, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-[9px] text-slate-500 font-medium truncate">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 rounded-none flex flex-col h-full shadow-sm">
                                    <div className="mb-4">
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Employment</h4>
                                        <p className="text-[10px] text-slate-400">Borrower Profile</p>
                                    </div>
                                    <div className="h-32 flex-1 min-h-[120px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={employmentData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                                                    {employmentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                                </Pie>
                                                <Tooltip content={<CustomChartTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                                        {employmentData.map((item, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-[9px] text-slate-500 font-medium">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 rounded-none flex flex-col h-full shadow-sm">
                                    <div className="mb-4">
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Affordability</h4>
                                        <p className="text-[10px] text-slate-400">DTI Ratio</p>
                                    </div>
                                    <div className="h-32 flex-1 min-h-[120px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={dtiData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                                                    {dtiData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                                </Pie>
                                                <Tooltip content={<CustomChartTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-1">
                                        {dtiData.slice(0, 4).map((item, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-[9px] text-slate-500 font-medium truncate">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            {/* Performance Summary Cards - New Request */}
                            <div className="grid grid-cols-2 gap-4">
                                <KPICard title="Total Leads" value="120" variant="blue" compact />
                                <KPICard title="Conversion" value="37.5%" variant="emerald" compact />
                            </div>

                            {/* Awards Card */}
                            <div className="border border-slate-200 dark:border-white/10 rounded-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                                <div className="px-4 py-4 border-b border-slate-200 dark:border-white/10 bg-amber-50 dark:bg-amber-900/10">
                                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                        <Award className="w-4 h-4" /> Recognition
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {["Developer of the Year 2025", "Excellence in Design 2024", "Most Trusted Brand 2023"].map((award, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="mt-1 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold">#{i + 1}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{award}</p>
                                                <p className="text-xs text-slate-500">Real Estate Excellence Awards</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="border border-slate-200 dark:border-white/10 rounded-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                                <div className="px-4 py-4 border-b border-slate-200 dark:border-white/10">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Quick Actions</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="secondary" className="w-full justify-center text-xs" leftIcon={<Download className="w-3 h-3" />}>Brochure</Button>
                                    <Button variant="secondary" className="w-full justify-center text-xs" leftIcon={<FileCheck className="w-3 h-3" />}>Agreement</Button>
                                    <Button variant="secondary" className="w-full justify-center text-xs" leftIcon={<Briefcase className="w-3 h-3" />}>Projects</Button>
                                    <Button variant="secondary" className="w-full justify-center text-xs" leftIcon={<Globe className="w-3 h-3" />}>Website</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'properties' && (
                    <div className="animate-fade-in-up">
                        <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 flex items-center gap-4 bg-slate-50/50 dark:bg-white/5">
                                {['listed', 'sold', 'inactive'].map((status) => (
                                    <button key={status} onClick={() => setPropertyFilter(status as PropertyStatus)} className={cn("px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none transition-colors", propertyFilter === status ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700")}>{status}</button>
                                ))}
                            </div>
                            <TabActionHeader title={`${propertyFilter} Properties`} showAdd={true} showDelete={false} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                {filteredProperties.length > 0 ? filteredProperties.map((prop) => (
                                    <div key={prop.id} onClick={() => navigate(`/properties/${prop.id}`)} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer relative">
                                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-3 left-3 text-white"><p className="text-sm font-bold">{prop.type}</p><p className="text-xs opacity-80">{prop.area}</p></div>
                                        </div>
                                        <div className="p-4"><h4 className="font-bold text-slate-900 dark:text-white truncate mb-1">{prop.title}</h4><p className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(prop.price)}</p></div>
                                    </div>
                                )) : <p className="col-span-full text-center text-slate-500 py-10">No properties found.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'loans' && (
                    <div className="animate-fade-in-up">
                        <div className="flex-1 overflow-hidden border border-slate-200 dark:border-white/10 rounded-sm bg-white dark:bg-slate-900 shadow-sm relative flex flex-col">
                            <TabActionHeader title="Customer Loan Portfolio" showAdd={false} />
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full relative">
                                    <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Loan Ref</th>
                                            <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Borrower</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Type</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Term</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Amount</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {mockLoans.map((loan) => (
                                            <tr
                                                key={loan.id}
                                                onClick={() => navigate(`/loans/${loan.id}`)}
                                                className="group relative hover:z-20 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg"
                                            >
                                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors font-mono">
                                                            {loan.referenceId || loan.id}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                            {formatRelativeTime(loan.requestDate)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                                                            {loan.borrower.name}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                                            {loan.borrower.kycStatus === 'verified' ? 'KYC Verified' : 'Pending'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{loan.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                            {loan.financials.termMonths} Mo
                                                        </span>
                                                        <span className="text-[9px] text-slate-500 font-medium mt-0.5">
                                                            {loan.financials.interestRate}% Int
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-black text-slate-900 dark:text-white font-mono">
                                                            {formatCurrency(loan.financials.principalAmount)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                    <span className={cn(
                                                        'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm inline-block',
                                                        loan.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                            loan.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                                loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                    loan.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    )}>
                                                        {loan.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="h-[calc(100vh-300px)] flex flex-col animate-fade-in">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Track Leads</h3>
                                <p className="text-xs text-slate-500">Drag and drop leads to update status</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-sm">
                                    <button
                                        onClick={() => setViewMode('kanban')}
                                        className={cn(
                                            'p-1.5 rounded-sm transition-all',
                                            viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        )}
                                    >
                                        <LayoutGrid className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            'p-1.5 rounded-sm transition-all',
                                            viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        )}
                                    >
                                        <List className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <Button variant="secondary" size="sm" leftIcon={<Filter className="w-3 h-3" />}>Filter</Button>
                                <Button variant="primary" size="sm" leftIcon={<Plus className="w-3 h-3" />}>Add Lead</Button>
                            </div>
                        </div>

                        {viewMode === 'kanban' ? (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                                <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                                    <div className="flex gap-4 h-full min-w-max px-1">
                                        {(Object.keys(leadStatusConfig) as LeadStatus[]).map(status => (
                                            <KanbanColumn
                                                key={status}
                                                status={status}
                                                leads={leadsByStatus[status]}
                                                totalPipelineValue={totalPipelineValue}
                                                onLeadClick={(lead) => navigate(`/leads/${lead.id}`)}
                                                onEdit={setEditLead}
                                                onDelete={() => { }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <DragOverlay>
                                    {/* Drag Overlay Content */}
                                </DragOverlay>
                            </DndContext>
                        ) : (
                            <div className="flex-1 overflow-hidden border border-slate-200 dark:border-white/10 rounded-sm bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center">
                                <p className="text-slate-500 dark:text-slate-400">List view is currently under development.</p>
                            </div>
                        )}
                    </div>
                )}


                {activeTab === 'commissions' && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <KPICard title="Total Commission" value={formatCurrency(124000)} variant="blue" icon={<Wallet className="w-4 h-4" />} trend={{ value: 15, direction: 'up', label: 'vs last month' }} />
                            <KPICard title="Pending Payout" value={formatCurrency(16000)} variant="orange" icon={<Clock className="w-4 h-4" />} />
                            <KPICard title="Paid YTD" value={formatCurrency(108000)} variant="emerald" icon={<FileCheck className="w-4 h-4" />} />
                        </div>

                        <div className="flex-1 overflow-hidden border border-slate-200 dark:border-white/10 rounded-sm bg-white dark:bg-slate-900 shadow-sm relative flex flex-col">
                            <TabActionHeader title="Commission History" showAdd={false} showDelete={false} />
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full relative">
                                    <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">ID / Date</th>
                                            <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Lead / Details</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Amount</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Commission</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {mockCommissions.map((comm) => (
                                            <tr key={comm.id} onClick={() => setSelectedCommission(comm)} className="group relative hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{comm.id}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">{formatRelativeTime(comm.date)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-slate-900 dark:text-white">{comm.leadName}</span>
                                                        <span className="text-[10px] font-medium text-slate-500">{comm.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">{formatCurrency(comm.amount)}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(comm.commission)}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                    <span className={cn(
                                                        'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm inline-block',
                                                        comm.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                            comm.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    )}>
                                                        {comm.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center border-slate-300 dark:border-slate-700">
                                                    {comm.invoiceId !== '-' ? (
                                                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-500">
                                                            {comm.invoiceId}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}


                {activeTab === 'analytics' && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h2 className="text-xl font-bold text-white">Performance Analytics</h2><p className="text-slate-400 text-sm">Comprehensive metrics for loan portfolio analysis</p></div>
                            <div className="flex gap-2"><Button variant="secondary" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button><Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button></div>
                        </div>

                        {/* 1. High-Level KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <KPICard title="Total Portfolio" value={formatCurrency(185000000)} variant="blue" icon={<DollarSign className="w-4 h-4" />} trend={{ value: 12, direction: 'up', label: 'vs last month' }} />
                            <KPICard title="Active Loans" value="148" variant="emerald" icon={<CreditCard className="w-4 h-4" />} trend={{ value: 8, direction: 'up', label: 'new loans' }} />
                            <KPICard title="Avg Ticket Size" value={formatCurrency(4500000)} variant="blue" icon={<PieChart className="w-4 h-4" />} />
                            <KPICard title="Processing TAT" value="3.5 Days" variant="orange" icon={<Clock className="w-4 h-4" />} trend={{ value: 12, direction: 'down', label: 'improved' }} />
                            <KPICard title="Disbursal Rate" value="78%" variant="purple" icon={<Target className="w-4 h-4" />} trend={{ value: 4, direction: 'up', label: 'efficiency' }} />
                        </div>

                        {/* 2. Main Growth Chart */}
                        <Card title="Portfolio Growth Trend" subtitle="Leads vs Disbursal Volume">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyTrends} {...commonChartProps}>
                                        <ChartDefs />
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip content={<CustomChartTooltip />} />
                                        <Area type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} fill="url(#glass-blue)" fillOpacity={1} />
                                        <Area type="monotone" dataKey="loans" stroke="#10B981" strokeWidth={2} fill="url(#glass-green)" fillOpacity={1} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* 3. Applicant Profile & Risk */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Card title="Credit Scores" subtitle="CIBIL Range Distribution">
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <BarChart data={creditScoreData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="range" fontSize={10} stroke="#64748b" axisLine={false} />
                                            <YAxis fontSize={10} stroke="#64748b" axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Bar dataKey="count" fill="url(#glass-blue)" radius={[4, 4, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="Affordability (DTI)" subtitle="Debt-to-Income Ratio">
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={dtiData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                                                {dtiData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                            </Pie>
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="Risk Trend (LTV)" subtitle="Avg Loan-to-Value %">
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <AreaChart data={ltvTrendData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="month" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Area type="monotone" dataKey="ltv" stroke="#F59E0B" fill="url(#glass-orange)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        {/* 4. Loan Attributes */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <Card title="Loan Types" subtitle="Product Mix">
                                <div className="h-48">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={loanTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                                                {loanTypeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                            </Pie>
                                            <Tooltip content={<CustomChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="Applicant Age" subtitle="Demographics" className="col-span-2">
                                <div className="h-48">
                                    <ResponsiveContainer>
                                        <BarChart data={ageDemographicsData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="age" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Bar dataKey="count" fill="url(#glass-teal)" radius={[4, 4, 0, 0]} barSize={25} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="Employment" subtitle="Profile Type">
                                <div className="h-48">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={employmentData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                                                {employmentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                            </Pie>
                                            <Tooltip content={<CustomChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        {/* 5. Process & Efficiency */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Card title="Process TAT" subtitle="Days per Stage">
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <BarChart data={processingTatData} layout="vertical" {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="stage" type="category" width={60} fontSize={10} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Bar dataKey="tat" fill="url(#glass-purple)" radius={[0, 4, 4, 0]} barSize={15} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="Ticket Size Evolution" subtitle="Avg Loan Amount">
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <AreaChart data={ticketSizeTrend} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="month" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Area type="monotone" dataKey="size" stroke="#3B82F6" fill="url(#glass-blue)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="Rejection Analysis" subtitle="Decline Reasons">
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={rejectionReasonsData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                                                {rejectionReasonsData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                            </Pie>
                                            <Tooltip content={<CustomChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        {/* 6. Geo & Additional */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card title="Geographic Heatmap" subtitle="Top Cities">
                                <div className="h-60">
                                    <ResponsiveContainer>
                                        <BarChart data={cityHeatmapData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="city" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Bar dataKey="value" fill="url(#glass-rose)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="30+ DPD Delinquency" subtitle="Default Rate Trend">
                                <div className="h-60">
                                    <ResponsiveContainer>
                                        <LineChart data={delinquencyData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="month" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        {/* 7. Additional Portfolio Metrics */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <Card title="Tenure Evolution" subtitle="Avg Tenure (Months)">
                                <div className="h-48">
                                    <ResponsiveContainer>
                                        <AreaChart data={tenureTrendData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="month" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Area type="monotone" dataKey="tenure" stroke="#6366F1" fill="url(#glass-blue)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="Loan Purpose" subtitle="Utilisation" className="col-span-2">
                                <div className="h-48">
                                    <ResponsiveContainer>
                                        <BarChart data={loanPurposeData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="purpose" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Bar dataKey="count" fill="url(#glass-purple)" radius={[4, 4, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <div className="space-y-6">
                                <Card title="Repayment Mode" subtitle="Preference">
                                    <div className="h-20">
                                        <div className="flex items-center justify-between h-full px-2">
                                            {repaymentModeData.map((d, i) => (
                                                <div key={i} className="flex flex-col items-center">
                                                    <span className="text-xs font-bold" style={{ color: d.color }}>{d.value}%</span>
                                                    <span className="text-[10px] text-slate-500 uppercase">{d.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                                <Card title="Applicant Type" subtitle="Structure">
                                    <div className="h-20">
                                        <div className="flex items-center gap-2 h-full">
                                            {coApplicantData.map((d, i) => (
                                                <div key={i} className="flex-1 h-full rounded-sm flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 opacity-20" style={{ backgroundColor: d.color }} />
                                                    <div className="text-center z-10">
                                                        <span className="block text-sm font-black text-white">{d.value}%</span>
                                                        <span className="block text-[9px] text-slate-300 uppercase leading-none">{d.name.split(' ')[0]}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Partner Scorecard</h2>
                                <p className="text-slate-400 text-sm">360-degree performance evaluation</p>
                            </div>
                            <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>Download Scorecard</Button>
                        </div>

                        {/* Top Score Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-sm flex flex-col items-center justify-center relative shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
                                <div className="w-40 h-40 rounded-full border-8 border-slate-800 flex items-center justify-center relative mb-6">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="50%" cy="50%" r="70" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
                                        <circle cx="50%" cy="50%" r="70" stroke="currentColor" strokeWidth="8" className="text-blue-500" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * 85) / 100} strokeLinecap="round" />
                                    </svg>
                                    <div className="text-center">
                                        <span className="text-4xl font-black text-white">85</span>
                                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">Excellent</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Overall Score</h3>
                                <p className="text-center text-slate-400 text-sm px-4">Top 5% of partners in Bangalore region. Eligible for Platinum tier upgrades.</p>
                            </div>
                            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors flex flex-col justify-between group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-blue-500/10 rounded-sm text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><TrendingUp className="w-5 h-5" /></div>
                                        <span className="text-xs font-bold text-emerald-500">+12% vs Target</span>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white mb-1">92/100</h4>
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Sales Velocity</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-900 border border-slate-800 hover:border-green-500/50 transition-colors flex flex-col justify-between group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-green-500/10 rounded-sm text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors"><FileCheck className="w-5 h-5" /></div>
                                        <span className="text-xs font-bold text-emerald-500">98% Approved</span>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white mb-1">95/100</h4>
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">File Quality</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-colors flex flex-col justify-between group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-purple-500/10 rounded-sm text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Users className="w-5 h-5" /></div>
                                        <span className="text-xs font-bold text-emerald-500">4.8/5 Rated</span>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white mb-1">88/100</h4>
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Customer NPS</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-colors flex flex-col justify-between group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-orange-500/10 rounded-sm text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors"><Target className="w-5 h-5" /></div>
                                        <span className="text-xs font-bold text-red-500">-2% vs Target</span>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white mb-1">74/100</h4>
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Conversion Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Metrics Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card title="Conversion Funnel" subtitle="Lead to Disbursal">
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <BarChart data={conversionFunnel} layout="vertical" {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="stage" type="category" width={80} fontSize={10} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                                {conversionFunnel.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="Sourcing Efficiency" subtitle="Channel Performance">
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <BarChart data={sourceEfficiencyData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="source" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                            <Bar dataKey="volume" name="Volume" fill="url(#glass-blue)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="conversion" name="Conv %" fill="url(#glass-green)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="TAT Trend (Weeks)" subtitle="Turnaround Efficiency">
                                <div className="h-60">
                                    <ResponsiveContainer>
                                        <AreaChart data={tatTrendData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="week" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Area type="monotone" dataKey="tat" stroke="#8B5CF6" fill="url(#glass-purple)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="ROI Trend" subtitle="Yield Percentage">
                                <div className="h-60">
                                    <ResponsiveContainer>
                                        <LineChart data={roiTrendData} {...commonChartProps}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis dataKey="month" fontSize={10} axisLine={false} />
                                            <Tooltip content={<CustomChartTooltip />} />
                                            <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Commission Details Drawer */}
            <SideDrawer
                isOpen={selectedCommission !== null}
                onClose={() => setSelectedCommission(null)}
                title="Commission Details"
                subtitle={`Transaction ID: ${selectedCommission?.id || 'COM-001'}`}
                size="lg"
                variant="SD_T1"
                icon={<Wallet className="w-6 h-6 text-blue-600" />}
                footer={
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Button variant="secondary" className="w-full" leftIcon={<Mail className="w-4 h-4" />}>Email Statement</Button>
                        <Button variant="primary" className="w-full" leftIcon={<Download className="w-4 h-4" />}>Download Invoice</Button>
                    </div>
                }
            >
                {selectedCommission && (
                    <div className="space-y-6 pb-4">

                        {/* Status Card - Black */}
                        <div className="relative overflow-hidden rounded-sm p-6 border border-white/10 shadow-lg group bg-slate-950">
                            <div className={cn(
                                "absolute inset-0 opacity-20 transition-opacity duration-300",
                                selectedCommission.status === 'paid' ? 'bg-gradient-to-br from-emerald-500 to-teal-900' :
                                    selectedCommission.status === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-900' :
                                        'bg-gradient-to-br from-blue-500 to-indigo-900'
                            )} />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Current Status</p>
                                    <h3 className={cn(
                                        "text-2xl font-black uppercase tracking-tight",
                                        selectedCommission.status === 'paid' ? 'text-emerald-400' :
                                            selectedCommission.status === 'pending' ? 'text-amber-400' :
                                                'text-blue-400'
                                    )}>{selectedCommission.status}</h3>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-full border-2 backdrop-blur-md",
                                    selectedCommission.status === 'paid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                        selectedCommission.status === 'pending' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                                            'border-blue-500/30 bg-blue-500/10 text-blue-400'
                                )}>
                                    {selectedCommission.status === 'paid' ? <CheckCircle2 className="w-6 h-6" /> :
                                        selectedCommission.status === 'pending' ? <Clock className="w-6 h-6" /> :
                                            <Activity className="w-6 h-6" />}
                                </div>
                            </div>
                        </div>

                        {/* Financials Grid - Solid Multicolor Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-sm border border-emerald-400/20 bg-emerald-500 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <DollarSign className="w-12 h-12 text-emerald-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl" />
                                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-2">Commission</p>
                                <p className="text-2xl font-mono font-black relative z-10">{formatCurrency(selectedCommission.commission)}</p>
                            </div>
                            <div className="rounded-sm border border-violet-400/20 bg-violet-600 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <Briefcase className="w-12 h-12 text-violet-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-violet-400/20 rounded-full blur-xl" />
                                <p className="text-violet-100 text-[10px] font-bold uppercase tracking-widest mb-2">Txn Value</p>
                                <p className="text-2xl font-mono font-black relative z-10">{formatCurrency(selectedCommission.amount)}</p>
                            </div>
                        </div>

                        {/* Lead Information - White Card */}
                        <div className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Lead Details</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Customer</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">{selectedCommission.leadName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Date</p>
                                        <p className="text-sm font-mono text-slate-600 dark:text-slate-300">{selectedCommission.date}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Product Type</p>
                                    <span className="inline-flex items-center px-2 py-1 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                                        {selectedCommission.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details - White Card */}
                        <div className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Invoice & Payout</span>
                            </div>
                            <div className="space-y-4">
                                {selectedCommission.invoiceId !== '-' ? (
                                    <>
                                        <div className="flex justify-between items-center group cursor-pointer p-3 -mx-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-sm transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Invoice ID</p>
                                                <p className="text-sm font-mono text-purple-600 dark:text-purple-400 font-bold underline decoration-dotted underline-offset-4">{selectedCommission.invoiceId}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-sm bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-sm">
                                                    <CreditCard className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Method</p>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">Direct Bank Transfer</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-mono text-slate-500">**** 4582</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                                            <FileText className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                        </div>
                                        <p className="text-slate-500 text-sm mb-3">No invoice generated yet</p>
                                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30">Generate Now</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </SideDrawer>
        </div>
    )
}
