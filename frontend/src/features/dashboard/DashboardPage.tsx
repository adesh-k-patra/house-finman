/**
 * Dashboard Page for House FinMan
 * 
 * Purpose: Executive dashboard with 40+ KPIs organized by sections
 * Features:
 * - Executive summary with multi-colored solid glassmorphic cards
 * - Sales & Pipeline KPIs with Area Chart
 * - Operational Efficiency KPIs with Bar Chart
 * - Finance Overview with Donut Chart
 * - Property Portfolio KPIs
 * - Partner & Vendor Ecosystem KPIs
 * - Portfolio Quality & Risk KPIs
 * - Campaign Performance KPIs
 * - Mentor Network KPIs
 * - CX & Support KPIs
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Users,
    Building2,
    Wallet,
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    PieChart,
    BarChart3,
    Megaphone,
    Target,
    Zap,
    DollarSign,
    TrendingUp,
    CreditCard,
    Receipt,
    Percent,
    AlertTriangle,
    Eye,
    Download,
    MousePointer2,
    Timer,
    Activity,
    UserCheck,
    XCircle,
    MessageSquare,
    Star,
    GraduationCap,
    Home,
    TrendingDown,
    Ticket,
    Phone,
    Mail,
    AlertCircle,
    ShoppingBag,
    ShieldCheck
} from 'lucide-react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn, formatCurrency, formatPercentage, formatNumber } from '@/utils'
import { ChartDefs } from '@/components/ui/ChartDefs'
import { KPICard, Card, CardVariant } from '@/components/ui'

// ============================================================================
// EXECUTIVE SUMMARY KPIs - Multi-colored Solid Glassmorphic
// ============================================================================
const executiveKPIs = [
    { id: 'revenue', title: 'Total Revenue', value: '$4.2M', trend: { value: 12.5, direction: 'up' as const, label: 'vs last month' }, variant: 'blue' as const, icon: DollarSign },
    { id: 'payouts', title: 'Active Payouts', value: '$1.8M', trend: { value: 8.2, direction: 'up' as const, label: 'vs last month' }, variant: 'indigo' as const, icon: CreditCard },
    { id: 'partners', title: 'Total Partners', value: '342', trend: { value: 24, direction: 'up' as const, label: 'new partners' }, variant: 'violet' as const, icon: Users },
    { id: 'loans', title: 'Active Loans', value: '1,250', trend: { value: 156, direction: 'up' as const, label: 'active files' }, variant: 'purple' as const, icon: Activity },
    { id: 'leads', title: 'Active Leads', value: '2,543', trend: { value: 18.2, direction: 'up' as const, label: 'vs last week' }, variant: 'emerald' as const, icon: Target },
    { id: 'conversion', title: 'Conversion Rate', value: '12.4%', trend: { value: 1.2, direction: 'down' as const, label: 'vs target' }, variant: 'teal' as const, icon: TrendingUp },
    { id: 'approvals', title: 'Pending Approvals', value: '18', trend: { value: 4, direction: 'neutral' as const, label: 'urgent' }, variant: 'amber' as const, icon: AlertCircle },
    { id: 'tickets', title: 'Avg Ticket Time', value: '4h 12m', trend: { value: 15, direction: 'down' as const, label: 'minutes' }, variant: 'orange' as const, icon: Clock },
    { id: 'spend', title: 'Vendor Spend', value: '$1.2M', trend: { value: 5.4, direction: 'up' as const, label: 'vs budget' }, variant: 'rose' as const, icon: ShoppingBag },
    { id: 'listings', title: 'Property Listings', value: '450', trend: { value: 32, direction: 'up' as const, label: 'new units' }, variant: 'cyan' as const, icon: Building2 },
    { id: 'reach', title: 'Campaign Reach', value: '1.8M', trend: { value: 22, direction: 'up' as const, label: 'impressions' }, variant: 'magenta' as const, icon: Megaphone },
    { id: 'health', title: 'System Health', value: '99.9%', trend: { value: 0, direction: 'up' as const, label: 'stable' }, variant: 'slate' as const, icon: ShieldCheck },
]

// ============================================================================
// SALES & PIPELINE KPIs
// ============================================================================
const salesPipelineKPIs = [
    {
        title: 'Total Leads Generated', value: formatNumber(1847), trend: { value: 15.2, direction: 'up' as const },
        icon: Users, variant: 'emerald' as const
    },
    {
        title: 'Login to Sanction Ratio', value: formatPercentage(68.5), trend: { value: 2.3, direction: 'up' as const },
        icon: Percent, variant: 'purple' as const
    },
    {
        title: 'Sanction to Disbursement', value: formatPercentage(85.2), trend: { value: 1.8, direction: 'up' as const },
        icon: CheckCircle2, variant: 'royal' as const
    },
    {
        title: 'Lead Velocity', value: '3.2 days', trend: { value: 8.5, direction: 'down' as const },
        icon: Timer, variant: 'violet' as const
    },
    {
        title: 'Daily Active Users', value: formatNumber(156), trend: { value: 5.0, direction: 'up' as const },
        icon: Activity, variant: 'teal' as const
    },
    {
        title: 'Daily Active Partners', value: formatNumber(89), trend: { value: 12.3, direction: 'up' as const },
        icon: UserCheck, variant: 'indigo' as const
    },
    {
        title: 'Leads by Partner %', value: formatPercentage(62), trend: { value: 3.2, direction: 'up' as const },
        icon: BarChart3, variant: 'blue' as const
    },
    {
        title: 'Lost Leads Rate', value: formatPercentage(8.5), trend: { value: 1.2, direction: 'down' as const },
        icon: XCircle, variant: 'orange' as const
    }
]

// Lead Funnel Chart Data
const leadFunnelData = [
    { month: 'Jul', leads: 1200, qualified: 840, converted: 420 },
    { month: 'Aug', leads: 1350, qualified: 945, converted: 480 },
    { month: 'Sep', leads: 1500, qualified: 1050, converted: 560 },
    { month: 'Oct', leads: 1680, qualified: 1176, converted: 620 },
    { month: 'Nov', leads: 1750, qualified: 1225, converted: 680 },
    { month: 'Dec', leads: 1847, qualified: 1293, converted: 720 },
]

// ============================================================================
// OPERATIONAL EFFICIENCY KPIs
// ============================================================================
const operationalKPIs = [
    {
        title: 'Avg Login-Sanction TAT', value: '4.2 days', trend: { value: 5.5, direction: 'down' as const },
        icon: Clock, variant: 'emerald' as const
    },
    {
        title: 'Avg Sanction-Disbursal TAT', value: '2.8 days', trend: { value: 8.2, direction: 'down' as const },
        icon: Timer, variant: 'purple' as const
    },
    {
        title: 'First Time Right %', value: formatPercentage(78.5), trend: { value: 3.2, direction: 'up' as const },
        icon: CheckCircle2, variant: 'royal' as const
    },
    {
        title: 'Credit Decisioning Time', value: '45 mins', trend: { value: 12.0, direction: 'down' as const },
        icon: Zap, variant: 'violet' as const
    },
    {
        title: 'Legal/Tech Verification TAT', value: '1.5 days', trend: { value: 4.5, direction: 'down' as const },
        icon: FileText, variant: 'teal' as const
    },
    {
        title: 'Vendor SLA Breach Count', value: '3', trend: { value: 40.0, direction: 'down' as const },
        icon: AlertTriangle, variant: 'indigo' as const
    },
    {
        title: 'Query Resolution Time', value: '2.4 hrs', trend: { value: 15.0, direction: 'down' as const },
        icon: MessageSquare, variant: 'blue' as const
    }
]

// TAT Weekly Data
const tatWeeklyData = [
    { week: 'W1', loginSanction: 4.8, sanctionDisbursal: 3.2 },
    { week: 'W2', loginSanction: 4.5, sanctionDisbursal: 3.0 },
    { week: 'W3', loginSanction: 4.3, sanctionDisbursal: 2.9 },
    { week: 'W4', loginSanction: 4.2, sanctionDisbursal: 2.8 },
]

// ============================================================================
// FINANCE OVERVIEW KPIs - NEW
// ============================================================================
const financeKPIs = [
    {
        title: 'Revenue This Month', value: '₹48.00 L', trend: { value: 8.5, direction: 'up' as const },
        icon: DollarSign, variant: 'emerald' as const
    },
    {
        title: 'ARPU', value: '₹2,450', trend: { value: 3.2, direction: 'up' as const },
        icon: Users, variant: 'purple' as const
    },
    {
        title: 'Outstanding Dues', value: '₹8.25 L', trend: { value: 5.0, direction: 'down' as const },
        icon: Receipt, variant: 'royal' as const
    },
    {
        title: 'Collection Rate', value: formatPercentage(94.5), trend: { value: 1.8, direction: 'up' as const },
        icon: CheckCircle2, variant: 'violet' as const
    },
    {
        title: 'Pending Invoices', value: formatNumber(23), trend: { value: 12.0, direction: 'down' as const },
        icon: FileText, variant: 'teal' as const
    },
    {
        title: 'Commission Payouts', value: '₹6.80 L', trend: { value: 4.2, direction: 'up' as const },
        icon: Wallet, variant: 'indigo' as const
    }
]

// Revenue Breakdown Data
const revenueBreakdownData = [
    { name: 'Processing Fees', value: 45, color: '#3B82F6' },
    { name: 'Commissions', value: 30, color: '#10B981' },
    { name: 'Interest Income', value: 15, color: '#8B5CF6' },
    { name: 'Other Income', value: 10, color: '#F59E0B' },
]

// ============================================================================
// PROPERTY PORTFOLIO KPIs - NEW
// ============================================================================
const propertyKPIs = [
    {
        title: 'Total Properties Listed', value: formatNumber(342), trend: { value: 18.5, direction: 'up' as const },
        icon: Building2, variant: 'emerald' as const
    },
    {
        title: 'Active Listings', value: formatNumber(287), trend: { value: 5.2, direction: 'up' as const },
        icon: Home, variant: 'purple' as const
    },
    {
        title: 'Properties Under Review', value: formatNumber(28), trend: { value: 8.0, direction: 'neutral' as const },
        icon: Eye, variant: 'royal' as const
    },
    {
        title: 'Avg Property Value', value: '₹1.85 Cr', trend: { value: 6.5, direction: 'up' as const },
        icon: TrendingUp, variant: 'violet' as const
    },
    {
        title: 'Sold Properties (MTD)', value: formatNumber(42), trend: { value: 12.0, direction: 'up' as const },
        icon: CheckCircle2, variant: 'teal' as const
    },
    {
        title: 'Avg Days on Market', value: '45 days', trend: { value: 5.0, direction: 'down' as const },
        icon: Clock, variant: 'indigo' as const
    }
]

// ============================================================================
// PARTNER & VENDOR ECOSYSTEM KPIs
// ============================================================================
const partnerVendorKPIs = [
    {
        title: 'Total Onboarded Partners', value: formatNumber(234), trend: { value: 18.5, direction: 'up' as const },
        icon: UserCheck, variant: 'emerald' as const
    },
    {
        title: 'Active Partners (30d)', value: formatNumber(189), trend: { value: 5.2, direction: 'up' as const },
        icon: Activity, variant: 'purple' as const
    },
    {
        title: 'Partner Churn Rate', value: formatPercentage(2.3), trend: { value: 0.5, direction: 'down' as const },
        icon: TrendingDown, variant: 'royal' as const
    },
    {
        title: 'Top Partner Volume', value: formatCurrency(8500000, true), trend: { value: 22.0, direction: 'up' as const },
        icon: Star, variant: 'violet' as const
    },
    {
        title: 'Vendor Pending Invoices', value: formatCurrency(450000, true), trend: { value: 8.0, direction: 'neutral' as const },
        icon: FileText, variant: 'teal' as const
    },
    {
        title: 'Mentor Performance Index', value: '4.6/5', trend: { value: 2.2, direction: 'up' as const },
        icon: Star, variant: 'indigo' as const
    }
]

// ============================================================================
// PORTFOLIO QUALITY & RISK KPIs
// ============================================================================
const portfolioRiskKPIs = [
    {
        title: 'NPL %', value: formatPercentage(1.8), trend: { value: 0.2, direction: 'down' as const },
        icon: AlertTriangle, variant: 'emerald' as const
    },
    {
        title: 'Early Payment Default', value: formatPercentage(0.8), trend: { value: 0.1, direction: 'down' as const },
        icon: XCircle, variant: 'purple' as const
    },
    {
        title: 'Cheque Bounce Rate', value: formatPercentage(3.2), trend: { value: 0.5, direction: 'down' as const },
        icon: XCircle, variant: 'royal' as const
    },
    {
        title: 'Geo Concentration Risk', value: 'Medium', trend: { value: 5.0, direction: 'neutral' as const },
        icon: Building2, variant: 'violet' as const
    },
    {
        title: 'Category C Exposure', value: formatPercentage(12.5), trend: { value: 1.2, direction: 'down' as const },
        icon: AlertTriangle, variant: 'teal' as const
    },
    {
        title: 'LTV Outliers', value: '12 cases', trend: { value: 20.0, direction: 'down' as const },
        icon: AlertTriangle, variant: 'indigo' as const
    }
]

// ============================================================================
// CAMPAIGN PERFORMANCE KPIs - NEW
// ============================================================================
// Sortable Wrapper
function SortableExecutiveCard({ id, children }: { id: string; children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: isDragging ? 'relative' as const : 'static' as const,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={isDragging ? 'opacity-50 shadow-2xl scale-105 z-50' : ''}>
            {children}
        </div>
    )
}

const campaignKPIs = [
    {
        title: 'Active Campaigns', value: formatNumber(8), trend: { value: 33.0, direction: 'up' as const },
        icon: Megaphone, variant: 'emerald' as const
    },
    {
        title: 'Campaign Spend MTD', value: '₹2.40 L', trend: { value: 12.0, direction: 'up' as const },
        icon: Wallet, variant: 'purple' as const
    },
    {
        title: 'Leads from Campaigns', value: formatNumber(456), trend: { value: 25.0, direction: 'up' as const },
        icon: Users, variant: 'royal' as const
    },
    {
        title: 'Campaign ROI', value: '3.2x', trend: { value: 8.5, direction: 'up' as const },
        icon: TrendingUp, variant: 'violet' as const
    },
    {
        title: 'Avg CTR', value: '2.4%', trend: { value: 0.8, direction: 'up' as const },
        icon: MousePointer2, variant: 'teal' as const
    }
]

// ============================================================================
// MENTOR NETWORK KPIs - NEW
// ============================================================================
const mentorKPIs = [
    {
        title: 'Total Mentors', value: formatNumber(45), trend: { value: 12.5, direction: 'up' as const },
        icon: GraduationCap, variant: 'emerald' as const
    },
    {
        title: 'Active Sessions', value: formatNumber(128), trend: { value: 18.0, direction: 'up' as const },
        icon: Calendar, variant: 'purple' as const
    },
    {
        title: 'Avg Session Rating', value: '4.7/5', trend: { value: 2.5, direction: 'up' as const },
        icon: Star, variant: 'royal' as const
    },
    {
        title: 'Mentor Hours (MTD)', value: '245 hrs', trend: { value: 15.0, direction: 'up' as const },
        icon: Clock, variant: 'violet' as const
    },
    {
        title: 'New Mentors (MTD)', value: formatNumber(5), trend: { value: 2.0, direction: 'neutral' as const },
        icon: UserCheck, variant: 'teal' as const
    }
]

// ============================================================================
// CX & SUPPORT KPIs
// ============================================================================
const cxSupportKPIs = [
    { title: 'Open Tickets', value: formatNumber(47), trend: { value: 12.0, direction: 'down' as const }, icon: Ticket },
    { title: 'Avg Handling Time', value: '18 mins', trend: { value: 8.5, direction: 'down' as const }, icon: Clock },
    { title: 'CSAT Score', value: '4.5/5', trend: { value: 3.0, direction: 'up' as const }, icon: Star },
    { title: 'Escalation %', value: formatPercentage(5.2), trend: { value: 1.5, direction: 'down' as const }, icon: AlertTriangle },
    { title: 'Unresolved > 48hrs', value: '8', trend: { value: 33.0, direction: 'down' as const }, icon: Clock },
    { title: 'First Contact Resolution', value: formatPercentage(72.5), trend: { value: 4.5, direction: 'up' as const }, icon: CheckCircle2 },
]

// ============================================================================
// TOP PERFORMERS & RECENT ACTIVITY DATA - Top 5 Lists
// ============================================================================
const topPartners = [
    { id: 'P001', name: 'Sharma Associates', value: '₹2.5 Cr', time: '2 hrs ago', path: '/partners/P001' },
    { id: 'P002', name: 'Patel Realty Group', value: '₹1.8 Cr', time: '5 hrs ago', path: '/partners/P002' },
    { id: 'P003', name: 'Mumbai Housing Co.', value: '₹1.5 Cr', time: '1 day ago', path: '/partners/P003' },
    { id: 'P004', name: 'Bangalore Estates', value: '₹1.2 Cr', time: '2 days ago', path: '/partners/P004' },
    { id: 'P005', name: 'Hyderabad Realtors', value: '₹95 L', time: '3 days ago', path: '/partners/P005' },
]

const topVendors = [
    { id: 'V001', name: 'QuickVerify Legal', value: '98% SLA', time: '1 hr ago', path: '/vendors/V001' },
    { id: 'V002', name: 'PropCheck Valuations', value: '96% SLA', time: '3 hrs ago', path: '/vendors/V002' },
    { id: 'V003', name: 'DocuSign Pro', value: '95% SLA', time: '6 hrs ago', path: '/vendors/V003' },
    { id: 'V004', name: 'TitleClear Services', value: '94% SLA', time: '1 day ago', path: '/vendors/V004' },
    { id: 'V005', name: 'FastTrack Appraisals', value: '93% SLA', time: '2 days ago', path: '/vendors/V005' },
]

const topMentors = [
    { id: '1', name: 'Dr. Rajesh Sharma', value: '4.9★ • 456 sessions', time: 'Active now', path: '/mentors/1' },
    { id: '2', name: 'Adv. Priya Nair', value: '4.8★ • 324 sessions', time: '30 mins ago', path: '/mentors/2' },
    { id: '6', name: 'Dr. Meera Kapoor', value: '4.9★ • 512 sessions', time: '1 hr ago', path: '/mentors/6' },
    { id: '3', name: 'CA Vikram Patel', value: '4.7★ • 289 sessions', time: '2 hrs ago', path: '/mentors/3' },
    { id: '4', name: 'Sunita Reddy', value: '4.6★ • 198 sessions', time: '4 hrs ago', path: '/mentors/4' },
]

const recentBillings = [
    { id: 'INV-2024-0156', name: 'Processing Fee - Sneha Kapoor', value: '₹25,000', time: '10 mins ago', path: '/finance/billing' },
    { id: 'INV-2024-0155', name: 'Documentation Fee - Raj Malhotra', value: '₹15,000', time: '2 hrs ago', path: '/finance/billing' },
    { id: 'INV-2024-0154', name: 'Legal Verification Fee', value: '₹8,500', time: '5 hrs ago', path: '/finance/billing' },
    { id: 'INV-2024-0153', name: 'Technical Appraisal - Vikram', value: '₹12,000', time: '8 hrs ago', path: '/finance/billing' },
    { id: 'INV-2024-0152', name: 'Stamp Duty Advisory', value: '₹5,000', time: '1 day ago', path: '/finance/billing' },
]

const recentPayments = [
    { id: 'PAY-2024-0089', name: 'Partner Commission - Sharma Assoc.', value: '₹1,25,000', time: '1 hr ago', path: '/finance/payments' },
    { id: 'PAY-2024-0088', name: 'Vendor Payment - QuickVerify', value: '₹45,000', time: '4 hrs ago', path: '/finance/payments' },
    { id: 'PAY-2024-0087', name: 'Mentor Payout - Dr. Rajesh', value: '₹12,000', time: '1 day ago', path: '/finance/payments' },
    { id: 'PAY-2024-0086', name: 'Legal Services - TitleClear', value: '₹28,000', time: '2 days ago', path: '/finance/payments' },
    { id: 'PAY-2024-0085', name: 'Partner Bonus - Patel Realty', value: '₹50,000', time: '3 days ago', path: '/finance/payments' },
]

const recentCommissions = [
    { id: 'COM-2024-0234', name: 'Patel Realty - Loan Disbursement', value: '₹85,000', time: '30 mins ago', path: '/commissions' },
    { id: 'COM-2024-0233', name: 'Mumbai Housing - New Lead', value: '₹5,000', time: '2 hrs ago', path: '/commissions' },
    { id: 'COM-2024-0232', name: 'Bangalore Estates - Referral', value: '₹15,000', time: '6 hrs ago', path: '/commissions' },
    { id: 'COM-2024-0231', name: 'Hyderabad Realtors - Closure', value: '₹42,000', time: '1 day ago', path: '/commissions' },
    { id: 'COM-2024-0230', name: 'Sharma Associates - Premium', value: '₹1,20,000', time: '2 days ago', path: '/commissions' },
]

const newProperties = [
    { id: 'PROP-001', name: 'Skyline Towers, Worli', value: '3BHK • ₹4.5 Cr', time: '15 mins ago', path: '/properties/PROP-001' },
    { id: 'PROP-002', name: 'Green Valley, Kharadi', value: '2BHK • ₹85 L', time: '1 hr ago', path: '/properties/PROP-002' },
    { id: 'PROP-003', name: 'Palm Heights, Whitefield', value: '4BHK • ₹2.2 Cr', time: '3 hrs ago', path: '/properties/PROP-003' },
    { id: 'PROP-004', name: 'Marina Bay, Bandra', value: '3BHK • ₹3.8 Cr', time: '5 hrs ago', path: '/properties/PROP-004' },
    { id: 'PROP-005', name: 'Sunrise Apartments, Pune', value: '2BHK • ₹72 L', time: '8 hrs ago', path: '/properties/PROP-005' },
]

// ============================================================================
// DATA: ACTION ITEMS
// ============================================================================
const actionItems = [
    { id: 'act-1', type: 'urgent', text: '3 New Leads Unassigned', action: 'Assign', path: '/leads' },
    { id: 'act-2', type: 'warning', text: '2 Partner Invoices Overdue', action: 'Review', path: '/finance/billing' },
    { id: 'act-3', type: 'info', text: 'Campaign "Diwali Offer" ending soon', action: 'Manage', path: '/campaigns' },
]

// ============================================================================
// COMPONENT: Action Items Inbox
// ============================================================================
function ActionItemsInbox() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {actionItems.map((item) => (
                <div key={item.id} className={cn(
                    "flex items-center justify-between p-3 rounded-sm border backdrop-blur-sm shadow-sm transition-all hover:shadow-md cursor-pointer group",
                    item.type === 'urgent' ? "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/30" :
                        item.type === 'warning' ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30" :
                            "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30"
                )}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-full",
                            item.type === 'urgent' ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" :
                                item.type === 'warning' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                                    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        )}>
                            {item.type === 'urgent' ? <AlertCircle className="w-4 h-4" /> :
                                item.type === 'warning' ? <Clock className="w-4 h-4" /> :
                                    <Megaphone className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:underline decoration-slate-400/50 underline-offset-4">
                            {item.text}
                        </span>
                    </div>
                    <Link to={item.path} className={cn(
                        "text-[10px] uppercase font-bold px-2 py-1 rounded-sm flex items-center gap-1 transition-colors",
                        item.type === 'urgent' ? "bg-rose-200/50 text-rose-700 hover:bg-rose-200" :
                            item.type === 'warning' ? "bg-amber-200/50 text-amber-700 hover:bg-amber-200" :
                                "bg-blue-200/50 text-blue-700 hover:bg-blue-200"
                    )}>
                        {item.action} <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>
            ))}
        </div>
    )
}


const newCampaigns = [
    { id: 'CAMP-001', name: 'Diwali Home Loan Offer', value: '₹50K Budget', time: '1 hr ago', path: '/campaigns/CAMP-001' },
    { id: 'CAMP-002', name: 'NRI Investment Drive', value: '₹1.2L Budget', time: '1 day ago', path: '/campaigns/CAMP-002' },
    { id: 'CAMP-003', name: 'First Home Buyer Scheme', value: '₹75K Budget', time: '2 days ago', path: '/campaigns/CAMP-003' },
    { id: 'CAMP-004', name: 'Premium Property Showcase', value: '₹2L Budget', time: '3 days ago', path: '/campaigns/CAMP-004' },
    { id: 'CAMP-005', name: 'Tax Saver Investment', value: '₹40K Budget', time: '5 days ago', path: '/campaigns/CAMP-005' },
]


const newOpportunities = [
    { id: 'OPP-2024-0089', name: 'Sneha Kapoor - 3BHK Pune', value: '₹85 L', time: '5 mins ago', path: '/opportunities' },
    { id: 'OPP-2024-0088', name: 'Vikram Mehta - Investment Plot', value: '₹1.2 Cr', time: '45 mins ago', path: '/opportunities' },
    { id: 'OPP-2024-0087', name: 'Priya Sharma - Home Loan', value: '₹65 L', time: '2 hrs ago', path: '/opportunities' },
    { id: 'OPP-2024-0086', name: 'Arun Joshi - Commercial Space', value: '₹2.5 Cr', time: '4 hrs ago', path: '/opportunities' },
    { id: 'OPP-2024-0085', name: 'Meera Gupta - Villa Purchase', value: '₹1.8 Cr', time: '6 hrs ago', path: '/opportunities' },
]

// Chart Data for additional visualizations
const monthlyRevenueData = [
    { month: 'Jul', revenue: 38, target: 35 },
    { month: 'Aug', revenue: 42, target: 40 },
    { month: 'Sep', revenue: 45, target: 42 },
    { month: 'Oct', revenue: 48, target: 45 },
    { month: 'Nov', revenue: 52, target: 48 },
    { month: 'Dec', revenue: 48, target: 50 },
]

const partnerPerformanceData = [
    { name: 'Sharma', leads: 45, conversions: 32 },
    { name: 'Patel', leads: 38, conversions: 28 },
    { name: 'Mumbai HC', leads: 32, conversions: 22 },
    { name: 'Bangalore', leads: 28, conversions: 18 },
    { name: 'Hyderabad', leads: 22, conversions: 14 },
]

// Additional Chart Data
const partnerGrowthData = [
    { month: 'Jul', count: 12 }, { month: 'Aug', count: 15 }, { month: 'Sep', count: 18 },
    { month: 'Oct', count: 22 }, { month: 'Nov', count: 20 }, { month: 'Dec', count: 25 }
]
const riskDistributionData = [
    { name: 'Low Risk', value: 65, color: '#10B981' },
    { name: 'Medium', value: 25, color: '#F59E0B' },
    { name: 'High', value: 10, color: '#EF4444' }
]
const campaignROITrend = [
    { month: 'Jul', roi: 2.1 }, { month: 'Aug', roi: 2.4 }, { month: 'Sep', roi: 2.8 },
    { month: 'Oct', roi: 3.0 }, { month: 'Nov', roi: 2.9 }, { month: 'Dec', roi: 3.2 }
]
const mentorSessionsTrend = [
    { month: 'Jul', sessions: 85 }, { month: 'Aug', sessions: 92 }, { month: 'Sep', sessions: 105 },
    { month: 'Oct', sessions: 115 }, { month: 'Nov', sessions: 120 }, { month: 'Dec', sessions: 128 }
]
const ticketVolumeData = [
    { day: 'Mon', tickets: 42 }, { day: 'Tue', tickets: 38 }, { day: 'Wed', tickets: 45 },
    { day: 'Thu', tickets: 35 }, { day: 'Fri', tickets: 48 }, { day: 'Sat', tickets: 22 }, { day: 'Sun', tickets: 15 }
]


// ============================================================================
// COMPONENT: Simple Line Chart
// ============================================================================
function SimpleLineChart({ data, dataKey, color }: { data: any[], dataKey: string, color: string }) {
    const maxValue = Math.max(...data.map(d => d[dataKey] as number)) || 100
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = 100 - ((d[dataKey] as number) / maxValue) * 80
        return `${x},${y}`
    }).join(' ')

    return (
        <div className="h-28 w-full relative">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <ChartDefs />
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#shadow)"
                />
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 100
                    const y = 100 - ((d[dataKey] as number) / maxValue) * 80
                    return (
                        <circle key={i} cx={x} cy={y} r="3" fill="white" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    )
                })}
            </svg>
            <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[8px] text-slate-500 font-medium px-1">
                {data.map((d, i) => <span key={i}>{d.month || d.day}</span>)}
            </div>
        </div>
    )
}

// ExecutiveKPICard and SectionKPICard removed in favor of global KPICard

// ============================================================================
// COMPONENT: Section Header - Dark Glassmorphic
// ============================================================================
function SectionHeader({ title, subtitle, color, action }: {
    title: string
    subtitle: string
    color: string
    action?: React.ReactNode
}) {
    return (
        <div className={cn(
            'flex items-center justify-between p-4',
            'bg-gradient-to-r backdrop-blur-xl',
            color,
            'border-b border-white/10'
        )}>
            <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {title}
                </h3>
                <p className="text-[10px] text-white/50 mt-0.5">{subtitle}</p>
            </div>
            {action}
        </div>
    )
}

// ============================================================================
// COMPONENT: Activity List Card - Solid Glassmorphic with 3D Shadow + Size Variants
// ============================================================================
function ActivityListCard({
    title,
    items,
    icon: Icon,
    onItemClick,
    size = 'md',
    variant = 'default',
    className
}: {
    title: string
    items: Array<{ id: string; name: string; value: string; time: string; path: string }>
    icon: React.ElementType
    onItemClick: (path: string) => void
    size?: 'sm' | 'md' | 'lg'
    variant?: CardVariant
    className?: string
}) {
    const sizeClasses = {
        sm: 'py-1.5 px-3',
        md: 'py-2 px-3',
        lg: 'py-2.5 px-4',
    }

    return (
        <Card
            title={title}
            icon={<Icon className="w-4 h-4" />}
            variant={variant}
            className={cn('overflow-hidden', className)}
            padding="none"
        >
            {/* Items List - Compact */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.slice(0, 5).map((item, idx) => (
                    <div
                        key={item.id}
                        onClick={() => onItemClick(item.path)}
                        className={cn(
                            'flex items-center justify-between gap-2',
                            sizeClasses[size],
                            'hover:bg-slate-100 dark:hover:bg-slate-800/50',
                            'cursor-pointer transition-colors group/item'
                        )}
                    >
                        <span className="text-[9px] font-bold text-slate-400 w-4">{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate group-hover/item:text-primary-600 transition-colors leading-tight">
                                {item.name}
                            </p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">{item.time}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    )
}

// ============================================================================
// COMPONENT: Mini Bar Chart (Horizontal)
// ============================================================================
function MiniHorizontalBarChart({ data, color }: { data: typeof partnerPerformanceData, color: string }) {
    const maxValue = Math.max(...data.map(d => d.leads))

    return (
        <div className="space-y-2">
            {data.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 w-3">{idx + 1}</span>
                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 w-16 truncate">{item.name}</span>
                    <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-800 relative overflow-hidden rounded-sm">
                        <div
                            className={cn("absolute inset-y-0 left-0 backdrop-blur-sm border-r border-white/20", color)}
                            style={{ width: `${(item.leads / maxValue) * 100}%`, backgroundColor: item.leads > 0 ? undefined : 'transparent' }}
                        >
                            <div className={cn("absolute inset-0 opacity-80", color.replace('bg-', 'bg-gradient-to-r from-transparent to-'))} />
                        </div>
                        <div
                            className="absolute inset-y-0 left-0 bg-emerald-500/80 border-r border-white/20 backdrop-blur-sm"
                            style={{ width: `${(item.conversions / maxValue) * 100}%` }}
                        />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 w-8 text-right">{item.conversions}/{item.leads}</span>
                </div>
            ))}
        </div>
    )
}

// ============================================================================
// COMPONENT: Revenue vs Target Chart
// ============================================================================
function RevenueTargetChart({ data }: { data: typeof monthlyRevenueData }) {
    const maxValue = Math.max(...data.flatMap(d => [d.revenue, d.target]))

    return (
        <div className="h-28 flex items-end justify-around gap-1 px-1">
            {data.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full flex gap-0.5 items-end justify-center h-20">
                        <div
                            className="w-2 bg-emerald-600/90 backdrop-blur-sm border border-emerald-400/30"
                            style={{ height: `${(d.revenue / maxValue) * 100}%` }}
                        />
                        <div
                            className="w-2 bg-slate-400/50 backdrop-blur-sm border border-slate-300/20"
                            style={{ height: `${(d.target / maxValue) * 100}%` }}
                        />
                    </div>
                    <span className="text-[8px] text-slate-400">{d.month}</span>
                </div>
            ))}
        </div>
    )
}

// ============================================================================
// COMPONENT: Simple Area Chart
// ============================================================================
function SimpleAreaChart({ data, dataKey, color }: { data: any[], dataKey: string, color: string }) {
    const maxValue = Math.max(...data.map(d => d[dataKey] as number))
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = 100 - ((d[dataKey] as number) / maxValue) * 80
        return `${x},${y}`
    }).join(' ')

    const areaPath = `M0,100 L0,${100 - ((data[0][dataKey] as number) / maxValue) * 80} ${points.split(' ').map((p) => `L${p}`).join(' ')} L100,100 Z`

    // Map legacy colors to our glass IDs
    const getColorId = (c: string) => {
        if (c.includes('blue')) return 'blue'
        if (c.includes('emerald')) return 'green'
        if (c.includes('purple')) return 'purple'
        if (c.includes('cyan')) return 'cyan'
        return 'blue'
    }
    const glassId = getColorId(color)

    return (
        <div className="h-32 w-full relative">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <ChartDefs />
                <path d={areaPath} fill={`url(#glass-${glassId})`} filter="url(#shadow)" />
                <polyline
                    points={points}
                    fill="none"
                    stroke={glassId === 'green' ? '#10B981' : '#3B82F6'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#shadow)"
                />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-slate-500 dark:text-slate-400 px-1">
                {data.map(d => <span key={d.month}>{d.month}</span>)}
            </div>
        </div>
    )
}

// ============================================================================
// COMPONENT: Simple Bar Chart
// ============================================================================
function SimpleBarChart({ data }: { data: typeof tatWeeklyData }) {
    const maxValue = Math.max(...data.flatMap(d => [d.loginSanction, d.sanctionDisbursal]))

    return (
        <div className="h-32 w-full flex items-end justify-around gap-2 px-2">
            {data.map(d => (
                <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-1 items-end justify-center h-24">
                        <div
                            className="w-3 bg-cyan-600/90 backdrop-blur-sm border border-cyan-400/30 shadow-sm"
                            style={{ height: `${(d.loginSanction / maxValue) * 100}%` }}
                            title={`Login-Sanction: ${d.loginSanction} days`}
                        />
                        <div
                            className="w-3 bg-indigo-600/90 backdrop-blur-sm border border-indigo-400/30 shadow-sm"
                            style={{ height: `${(d.sanctionDisbursal / maxValue) * 100}%` }}
                            title={`Sanction-Disbursal: ${d.sanctionDisbursal} days`}
                        />
                    </div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">{d.week}</span>
                </div>
            ))}
        </div>
    )
}

// ============================================================================
// COMPONENT: Simple Donut Chart
// ============================================================================
function SimpleDonutChart({ data, centerLabel = "₹48L" }: { data: any[], centerLabel?: React.ReactNode }) {
    let cumulativePercent = 0

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-28 h-28">
                <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
                    <ChartDefs />
                    {data.map((item, i) => {
                        const strokeDasharray = `${item.value} ${100 - item.value}`
                        const strokeDashoffset = 100 - cumulativePercent
                        cumulativePercent += item.value

                        return (
                            <circle
                                key={i}
                                cx="21"
                                cy="21"
                                r="16"
                                fill="none"
                                stroke={item.color}
                                strokeWidth="5"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-500"
                                filter="url(#shadow)"
                            />
                        )
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{centerLabel}</span>
                </div>
            </div>
            <div className="flex-1 space-y-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ============================================================================
// MAIN COMPONENT: DashboardPage
// ============================================================================


export default function DashboardPage() {
    const [orderedKPIs, setOrderedKPIs] = useState(executiveKPIs)
    const items = orderedKPIs.map(k => k.id)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active.id !== over?.id) {
            setOrderedKPIs((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over?.id)

                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }
    const navigate = useNavigate()
    const [selectedPeriod, setSelectedPeriod] = useState('30d')

    return (
        <div className="space-y-6 animate-fade-in pb-12">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        Executive Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Real-time overview of House FinMan performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className={cn(
                            'px-4 py-2 text-xs font-bold uppercase tracking-wide',
                            'bg-white dark:bg-slate-800',
                            'border border-slate-200 dark:border-white/10',
                            'text-slate-900 dark:text-white rounded-none'
                        )}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="mtd">This Month</option>
                        <option value="qtd">This Quarter</option>
                    </select>
                    <button className={cn(
                        'px-4 py-2 text-xs font-bold uppercase tracking-wide',
                        'bg-slate-900 dark:bg-white text-white dark:text-slate-900',
                        'hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors rounded-none',
                        'flex items-center gap-2'
                    )}>
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* ================================================================ */}
            {/* EXECUTIVE SUMMARY - Multi-colored Solid Glassmorphic Cards */}
            {/* ================================================================ */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <PieChart className="w-3 h-3" /> Executive Summary
                    </h2>
                    <span className="text-[10px] text-slate-400 italic hidden sm:block">
                        Drag to reorder cards
                    </span>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-sm overflow-hidden">
                            {orderedKPIs.map((kpi) => (
                                <SortableExecutiveCard key={kpi.id} id={kpi.id}>
                                    <KPICard
                                        title={kpi.title}
                                        value={kpi.value}
                                        variant={kpi.variant}
                                        icon={<kpi.icon />}
                                        trend={{
                                            value: kpi.trend.value + (kpi.id === 'approvals' || kpi.id === 'listings' ? '' : '%'),
                                            direction: kpi.trend.direction as any,
                                            label: kpi.trend.label
                                        }}
                                        className="h-full border-0" // Remove nested border
                                    />
                                </SortableExecutiveCard>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </section>

            {/* ================================================================ */}
            {/* ACTION ITEMS INBOX - HIGH PRIORITY */}
            {/* ================================================================ */}
            <section>
                <ActionItemsInbox />
            </section>

            {/* ================================================================ */}
            {/* TOP PERFORMERS & RECENT ACTIVITY - ASYMMETRIC BENTO LAYOUT */}
            {/* ================================================================ */}
            <section>
                <h2 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Top Performers & Recent Activity
                </h2>

                {/* Asymmetric Bento Grid - 12 column system */}
                <div className="grid grid-cols-12 gap-3 auto-rows-min">

                    {/* Row 1: Large card (6 cols) + 2 small cards (3 cols each) */}
                    <ActivityListCard
                        title="Top 5 Partners"
                        items={topPartners}

                        icon={UserCheck}
                        onItemClick={(path) => navigate(path)}
                        size="lg"
                        className="col-span-12 md:col-span-6"
                        variant="violet"
                    />
                    <ActivityListCard
                        title="Top 5 Vendors"
                        items={topVendors}

                        icon={Building2}
                        onItemClick={(path) => navigate(path)}
                        size="sm"
                        className="col-span-6 md:col-span-3"
                        variant="cyan"
                    />
                    <ActivityListCard
                        title="Top 5 Mentors"
                        items={topMentors}

                        icon={GraduationCap}
                        onItemClick={(path) => navigate(path)}
                        size="sm"
                        className="col-span-6 md:col-span-3"
                        variant="emerald"
                    />

                    {/* Row 2: Chart (4 cols) + Medium card (4 cols) + Small card (4 cols) */}
                    <div className="col-span-12 md:col-span-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <BarChart3 className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Partner Performance</span>
                        </div>
                        <MiniHorizontalBarChart data={partnerPerformanceData} color="bg-blue-500" />
                        <div className="flex items-center gap-3 mt-2 text-[8px] text-slate-400">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500" /> Leads</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500" /> Conversions</span>
                        </div>
                    </div>
                    <ActivityListCard
                        title="Recent Billings"
                        items={recentBillings}

                        icon={Receipt}
                        onItemClick={(path) => navigate(path)}
                        size="md"
                        className="col-span-6 md:col-span-4"
                        variant="blue"
                    />
                    <ActivityListCard
                        title="Recent Payments"
                        items={recentPayments}

                        icon={CreditCard}
                        onItemClick={(path) => navigate(path)}
                        size="sm"
                        className="col-span-6 md:col-span-4"
                        variant="indigo"
                    />

                    {/* Row 3: 3 small cards (4 cols each) */}
                    <ActivityListCard
                        title="Commissions"
                        items={recentCommissions}

                        icon={Wallet}
                        onItemClick={(path) => navigate(path)}
                        size="sm"
                        className="col-span-6 md:col-span-4"
                        variant="amber"
                    />
                    <ActivityListCard
                        title="New Properties"
                        items={newProperties}

                        icon={Home}
                        onItemClick={(path) => navigate(path)}
                        size="sm"
                        className="col-span-6 md:col-span-4"
                        variant="purple"
                    />
                    <div className="col-span-12 md:col-span-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Revenue vs Target</span>
                        </div>
                        <RevenueTargetChart data={monthlyRevenueData} />
                        <div className="flex items-center justify-center gap-3 mt-1 text-[8px] text-slate-400">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500" /> Revenue</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-400" /> Target</span>
                        </div>
                    </div>

                    {/* Row 4: Large card (8 cols) + Small card (4 cols) */}
                    <ActivityListCard
                        title="New Opportunities"
                        items={newOpportunities}

                        icon={Target}
                        onItemClick={(path) => navigate(path)}
                        size="lg"
                        className="col-span-12 md:col-span-8"
                        variant="rose"
                    />
                    <ActivityListCard
                        title="Campaigns"
                        items={newCampaigns}

                        icon={Megaphone}
                        onItemClick={(path) => navigate(path)}
                        size="sm"
                        className="col-span-12 md:col-span-4"
                        variant="orange"
                    />
                </div>
            </section>

            {/* ================================================================ */}
            {/* SALES & PIPELINE + OPERATIONS - Two Column Layout */}
            {/* ================================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Sales & Pipeline */}
                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <SectionHeader
                        title="Sales & Pipeline"
                        subtitle="Lead generation and conversion metrics"
                        color="from-indigo-900/95 to-indigo-800/95"
                        action={<button className="text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-wide">View All →</button>}
                    />
                    <div className="p-3">
                        {/* Asymmetric Grid - 12 column system */}
                        <div className="grid grid-cols-12 gap-2 mb-3">
                            <div className="col-span-5">
                                <KPICard {...salesPipelineKPIs[0]} compact />
                            </div>
                            <div className="col-span-4">
                                <KPICard {...salesPipelineKPIs[1]} compact />
                            </div>
                            <div className="col-span-3">
                                <KPICard {...salesPipelineKPIs[2]} compact />
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mb-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Lead Funnel Trend</p>
                            <SimpleAreaChart data={leadFunnelData} dataKey="leads" color="#6366F1" />
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-3">
                                <KPICard {...salesPipelineKPIs[3]} compact />
                            </div>
                            <div className="col-span-4">
                                <KPICard {...salesPipelineKPIs[4]} compact />
                            </div>
                            <div className="col-span-5">
                                <KPICard {...salesPipelineKPIs[5]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 mt-2">
                            <div className="col-span-6">
                                <KPICard {...salesPipelineKPIs[6]} compact />
                            </div>
                            <div className="col-span-6">
                                <KPICard {...salesPipelineKPIs[7]} compact />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operational Efficiency */}
                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <SectionHeader
                        title="Operational Efficiency"
                        subtitle="TAT and process metrics"
                        color="from-cyan-900/95 to-cyan-800/95"
                        action={<button className="text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-wide">View All →</button>}
                    />
                    <div className="p-3">
                        {/* Asymmetric Grid */}
                        <div className="grid grid-cols-12 gap-2 mb-3">
                            <div className="col-span-4">
                                <KPICard {...operationalKPIs[0]} compact />
                            </div>
                            <div className="col-span-5">
                                <KPICard {...operationalKPIs[1]} compact />
                            </div>
                            <div className="col-span-3">
                                <KPICard {...operationalKPIs[2]} compact />
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mb-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">TAT Weekly Comparison</p>
                            <div className="flex items-center gap-4 mb-2">
                                <span className="flex items-center gap-1 text-[8px] text-slate-500"><span className="w-2 h-2 bg-cyan-500" /> Login-Sanction</span>
                                <span className="flex items-center gap-1 text-[8px] text-slate-500"><span className="w-2 h-2 bg-indigo-500" /> Sanction-Disbursal</span>
                            </div>
                            <SimpleBarChart data={tatWeeklyData} />
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-3">
                                <KPICard {...operationalKPIs[3]} compact />
                            </div>
                            <div className="col-span-5">
                                <KPICard {...operationalKPIs[4]} compact />
                            </div>
                            <div className="col-span-4">
                                <KPICard {...operationalKPIs[5]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 mt-2">
                            <div className="col-span-7">
                                <KPICard {...operationalKPIs[6]} compact />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* FINANCE OVERVIEW + PROPERTY PORTFOLIO - Two Column Layout */}
            {/* ================================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Finance Overview */}
                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <SectionHeader
                        title="Finance Overview"
                        subtitle="Revenue, collections and payouts"
                        color="from-emerald-900/95 to-emerald-800/95"
                        action={<button className="text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-wide">View All →</button>}
                    />
                    <div className="p-3">
                        {/* Asymmetric Grid */}
                        <div className="grid grid-cols-12 gap-2 mb-3">
                            <div className="col-span-5">
                                <KPICard {...financeKPIs[0]} compact />
                            </div>
                            <div className="col-span-4">
                                <KPICard {...financeKPIs[1]} compact />
                            </div>
                            <div className="col-span-3">
                                <KPICard {...financeKPIs[2]} compact />
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mb-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Revenue Breakdown</p>
                            <SimpleDonutChart data={revenueBreakdownData} />
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-4">
                                <KPICard {...financeKPIs[3]} compact />
                            </div>
                            <div className="col-span-5">
                                <KPICard {...financeKPIs[4]} compact />
                            </div>
                            <div className="col-span-3">
                                <KPICard {...financeKPIs[5]} compact />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Portfolio */}
                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <SectionHeader
                        title="Property Portfolio"
                        subtitle="Listings, valuations and approvals"
                        color="from-violet-900/95 to-violet-800/95"
                        action={<button className="text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-wide">View All →</button>}
                    />
                    <div className="p-3">
                        {/* Asymmetric Grid */}
                        <div className="grid grid-cols-12 gap-2 mb-3">
                            <div className="col-span-7">
                                <KPICard {...propertyKPIs[0]} compact />
                            </div>
                            <div className="col-span-5">
                                <KPICard {...propertyKPIs[1]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 mb-3">
                            <div className="col-span-4">
                                <KPICard {...propertyKPIs[2]} compact />
                            </div>
                            <div className="col-span-4">
                                <KPICard {...propertyKPIs[3]} compact />
                            </div>
                            <div className="col-span-4">
                                <KPICard {...propertyKPIs[4]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 mb-3">
                            <div className="col-span-6">
                                <KPICard {...propertyKPIs[5]} compact />
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Geo Distribution</p>
                            <div className="space-y-1.5">
                                {[
                                    { city: 'Mumbai', count: 124, percent: 36 },
                                    { city: 'Pune', count: 89, percent: 26 },
                                    { city: 'Bangalore', count: 67, percent: 20 },
                                    { city: 'Hyderabad', count: 42, percent: 12 },
                                    { city: 'Others', count: 20, percent: 6 },
                                ].map(item => (
                                    <div key={item.city} className="flex items-center gap-3">
                                        <span className="text-xs text-slate-600 dark:text-slate-300 w-20">{item.city}</span>
                                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
                                                style={{ width: `${item.percent}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{item.percent}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* PARTNER/VENDOR + PORTFOLIO RISK - Two Column Layout */}
            {/* ================================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Partner & Vendor */}
                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <SectionHeader
                        title="Partner & Vendor Ecosystem"
                        subtitle="Network performance metrics"
                        color="from-blue-900/95 to-blue-800/95"
                        action={<button className="text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-wide">View All →</button>}
                    />
                    <div className="p-3">
                        {/* Asymmetric Grid */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <div className="col-span-5">
                                <KPICard {...partnerVendorKPIs[0]} compact />
                            </div>
                            <div className="col-span-4">
                                <KPICard {...partnerVendorKPIs[1]} compact />
                            </div>
                            <div className="col-span-3">
                                <KPICard {...partnerVendorKPIs[2]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <div className="col-span-6">
                                <KPICard {...partnerVendorKPIs[3]} compact />
                            </div>
                            <div className="col-span-6">
                                <KPICard {...partnerVendorKPIs[4]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-7">
                                <KPICard {...partnerVendorKPIs[5]} compact />
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mt-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Partner Growth Trend</p>
                            <SimpleLineChart data={partnerGrowthData} dataKey="count" color="#3B82F6" />
                        </div>
                    </div>
                </div>

                {/* Portfolio Risk */}
                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <SectionHeader
                        title="Portfolio Quality & Risk"
                        subtitle="Risk indicators and exposure"
                        color="from-rose-900/95 to-rose-800/95"
                        action={<button className="text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-wide">View All →</button>}
                    />
                    <div className="p-3">
                        {/* Asymmetric Grid */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <div className="col-span-4">
                                <KPICard {...portfolioRiskKPIs[0]} compact />
                            </div>
                            <div className="col-span-5">
                                <KPICard {...portfolioRiskKPIs[1]} compact />
                            </div>
                            <div className="col-span-3">
                                <KPICard {...portfolioRiskKPIs[2]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <div className="col-span-5">
                                <KPICard {...portfolioRiskKPIs[3]} compact />
                            </div>
                            <div className="col-span-7">
                                <KPICard {...portfolioRiskKPIs[4]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-6">
                                <KPICard {...portfolioRiskKPIs[5]} compact />
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mt-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Risk Distribution</p>
                            <SimpleDonutChart data={riskDistributionData} centerLabel="Risk" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* CAMPAIGNS + MENTORS - Two Column Layout */}
            {/* ================================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Campaigns */}
                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <SectionHeader
                        title="Campaign Performance"
                        subtitle="Marketing and acquisition metrics"
                        color="from-amber-900/95 to-amber-800/95"
                        action={<button className="text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-wide">View All →</button>}
                    />
                    <div className="p-3">
                        {/* Asymmetric Grid */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <div className="col-span-5">
                                <KPICard {...campaignKPIs[0]} compact />
                            </div>
                            <div className="col-span-4">
                                <KPICard {...campaignKPIs[1]} compact />
                            </div>
                            <div className="col-span-3">
                                <KPICard {...campaignKPIs[2]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-6">
                                <KPICard {...campaignKPIs[3]} compact />
                            </div>
                            <div className="col-span-6">
                                <KPICard {...campaignKPIs[4]} compact />
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mt-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">ROI Trend (6 Months)</p>
                            <SimpleLineChart data={campaignROITrend} dataKey="roi" color="#F59E0B" />
                        </div>
                    </div>
                </div>

                {/* Mentors */}
                <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <SectionHeader
                        title="Mentor Network"
                        subtitle="Training and mentorship metrics"
                        color="from-teal-900/95 to-teal-800/95"
                        action={<button className="text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-wide">View All →</button>}
                    />
                    <div className="p-3">
                        {/* Asymmetric Grid */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <div className="col-span-4">
                                <KPICard {...mentorKPIs[0]} compact />
                            </div>
                            <div className="col-span-5">
                                <KPICard {...mentorKPIs[1]} compact />
                            </div>
                            <div className="col-span-3">
                                <KPICard {...mentorKPIs[2]} compact />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-7">
                                <KPICard {...mentorKPIs[3]} compact />
                            </div>
                            <div className="col-span-5">
                                <KPICard {...mentorKPIs[4]} compact />
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mt-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Mentorship Sessions</p>
                            <SimpleAreaChart data={mentorSessionsTrend} dataKey="sessions" color="#14B8A6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* CX & SUPPORT - Full Width */}
            {/* ================================================================ */}
            <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <SectionHeader
                    title="CX & Support"
                    subtitle="Customer experience and support metrics"
                    color="from-orange-900/95 to-orange-800/95"
                    action={<button className="text-[10px] text-white/60 hover:text-white font-bold uppercase tracking-wide">View All →</button>}
                />
                <div className="p-3">
                    {/* Asymmetric Grid - Full Width */}
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-2">
                            <KPICard {...cxSupportKPIs[0]} compact />
                        </div>
                        <div className="col-span-3">
                            <KPICard {...cxSupportKPIs[1]} compact />
                        </div>
                        <div className="col-span-2">
                            <KPICard {...cxSupportKPIs[2]} compact />
                        </div>
                        <div className="col-span-2">
                            <KPICard {...cxSupportKPIs[3]} compact />
                        </div>
                        <div className="col-span-2">
                            <KPICard {...cxSupportKPIs[4]} compact />
                        </div>
                        <div className="col-span-1">
                            <KPICard {...cxSupportKPIs[5]} compact />
                        </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mt-3">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Ticket Volume (Weekly)</p>
                        <SimpleLineChart data={ticketVolumeData} dataKey="tickets" color="#F97316" />
                    </div>
                </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
                <p className="text-xs text-slate-500">
                    Last updated: <span className="font-medium text-slate-700 dark:text-slate-300">Just now</span>
                </p>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
                        <Phone className="w-3 h-3" /> Contact Support
                    </button>
                    <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
                        <Mail className="w-3 h-3" /> Send Report
                    </button>
                </div>
            </div>
        </div>
    )
}
