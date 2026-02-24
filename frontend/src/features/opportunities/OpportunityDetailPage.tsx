
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    DollarSign,
    Calendar,
    Building,
    User,
    Phone,
    Clock,
    FileText,
    MessageSquare,
    TrendingUp,
    AlertCircle,
    Send
} from 'lucide-react'
import { Button, Card, KPICard } from '@/components/ui'
import { cn, formatCurrency, formatRelativeTime, getInitials } from '@/utils'

// Dummy Data for Opportunity
const dummyOpportunity = {
    id: 'OPP-2025-001',
    title: 'Corporate Office Expansion - TechFlow',
    value: 45000000,
    stage: 'negotiation',
    probability: 75,
    client: 'TechFlow Systems',
    contactPerson: 'Vikram Malhotra',
    email: 'vikram.m@techflow.com',
    phone: '+91 98765 43210',
    expectedClose: '2026-02-15',
    type: 'Commercial Lease',
    priority: 'high',
    assignedTo: 'Rahul Sharma',
    createdAt: '2024-11-20T10:00:00Z',
    description: 'Requirement for 15,000 sqft premium office space in Cyber City or Golf Course Road area. Client is expanding their R&D center and needs immediate occupancy by March 2026.'
}

const timeline = [
    { id: 1, type: 'stage_change', content: 'Moved to Negotiation stage', date: '2026-01-05T10:30:00', author: 'Rahul Sharma' },
    { id: 2, type: 'meeting', content: 'Site visit completed with client team', date: '2026-01-03T14:00:00', author: 'Rahul Sharma' },
    { id: 3, type: 'proposal', content: 'Sent revised commercial proposal v2', date: '2025-12-28T16:45:00', author: 'Rahul Sharma' },
    { id: 4, type: 'email', content: 'Received feedback on initial longlist', date: '2025-12-20T11:20:00', author: 'Vikram Malhotra' }
]

const quotes = [
    { id: 'QT-1001', property: 'Cyber Park Tower A', rent: 120, area: 15000, deposit: 6, status: 'active', sentDate: '2025-12-28' },
    { id: 'QT-1002', property: 'DLF Horizon', rent: 145, area: 14500, deposit: 6, status: 'rejected', sentDate: '2025-12-15' },
]

const stakeholders = [
    { id: 1, name: 'Vikram Malhotra', role: 'Decision Maker', title: 'VP Operations', phone: '+91 98765 43210', email: 'vikram.m@techflow.com' },
    { id: 2, name: 'Priya Singh', role: 'Influencer', title: 'HR Director', phone: '+91 98765 43211', email: 'priya.s@techflow.com' },
    { id: 3, name: 'Amit Kapoor', role: 'Gatekeeper', title: 'Admin Head', phone: '+91 98765 43212', email: 'amit.k@techflow.com' },
]

type TabType = 'overview' | 'activities' | 'proposals' | 'stakeholders'

export default function OpportunityDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [opportunity] = useState(dummyOpportunity)
    const [note, setNote] = useState('')

    // In a real app, fetch data based on ID
    useEffect(() => {
        // Mock fetch
        console.log('Fetching opportunity:', id)
    }, [id])

    const stageConfig = {
        new: { label: 'New', color: 'bg-slate-100 text-slate-700', progress: 10 },
        qualification: { label: 'Qualification', color: 'bg-blue-100 text-blue-700', progress: 30 },
        proposal: { label: 'Proposal', color: 'bg-purple-100 text-purple-700', progress: 50 },
        negotiation: { label: 'Negotiation', color: 'bg-amber-100 text-amber-700', progress: 75 },
        closed_won: { label: 'Closed Won', color: 'bg-emerald-100 text-emerald-700', progress: 100 },
        closed_lost: { label: 'Closed Lost', color: 'bg-red-100 text-red-700', progress: 0 },
    }

    const currentStage = stageConfig[opportunity.stage as keyof typeof stageConfig]

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <button
                onClick={() => navigate('/opportunities')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Pipeline
            </button>

            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-600/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative p-6 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-white dark:ring-slate-900">
                            <DollarSign className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{opportunity.title}</h1>
                                <span className={cn('px-3 py-1 text-sm font-semibold rounded-full uppercase tracking-wide', currentStage.color)}>
                                    {currentStage.label}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-2"><Building className="w-4 h-4" />{opportunity.client}</span>
                                <span className="flex items-center gap-2 font-medium text-slate-900 dark:text-white"><DollarSign className="w-4 h-4" />{formatCurrency(opportunity.value)}</span>
                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />Close: {new Date(opportunity.expectedClose).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-full">
                            <div className="flex justify-between text-xs mb-1 font-medium">
                                <span className="text-slate-500">Probability</span>
                                <span className={cn(opportunity.probability > 50 ? 'text-emerald-600' : 'text-amber-600')}>{opportunity.probability}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-1000",
                                        opportunity.probability > 70 ? "bg-emerald-500" :
                                            opportunity.probability > 40 ? "bg-amber-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${opportunity.probability}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <Button variant="secondary" size="sm">Mark Lost</Button>
                                <Button variant="primary" size="sm">Won!</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 sm:px-8 pb-0">
                    <div className="flex items-center gap-4 border-t border-slate-100 dark:border-white/5 pt-1">
                        {[
                            { key: 'overview', label: 'Overview', icon: FileText },
                            { key: 'activities', label: 'Activities', icon: Clock },
                            { key: 'proposals', label: 'Proposals', icon: FileText },
                            { key: 'stakeholders', label: 'Stakeholders', icon: User },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as TabType)}
                                className={cn(
                                    'flex items-center gap-2 py-4 text-sm font-medium transition-all relative',
                                    activeTab === tab.key ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                )}
                            >
                                <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.key && "fill-current opacity-20")} />
                                {tab.label}
                                {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-400 rounded-t-full" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up">
                        <div className="col-span-1 lg:col-span-2 space-y-6">
                            <Card title="Opportunity Details">
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{opportunity.description}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase">Deal Type</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{opportunity.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase">Source</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">Direct Referral</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase">Assigned To</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{opportunity.assignedTo}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase">Created On</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{new Date(opportunity.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card title="Quick Note">
                                <textarea
                                    placeholder="Add a quick internal note..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="input min-h-[80px] resize-none mb-3"
                                />
                                <div className="flex justify-end">
                                    <Button variant="secondary" size="sm" rightIcon={<Send className="w-3 h-3" />}>Post Note</Button>
                                </div>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <KPICard title="Revenue Potential" value={formatCurrency(opportunity.value)} variant="green" icon={<TrendingUp className="w-5 h-5" />} />
                            <Card title="Stage Velocity">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Days in current stage</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">12 Days</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Avg deal cycle</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">45 Days</span>
                                    </div>
                                    <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />
                                    <div className="flex items-center gap-2 text-sm text-amber-600">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="font-medium">2 days overdue for follow-up</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'activities' && (
                    <div className="animate-fade-in-up">
                        <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-4 space-y-8 pl-8 py-2">
                            {timeline.map((item) => (
                                <div key={item.id} className="relative group">
                                    <div className={cn(
                                        "absolute -left-[41px] top-0 w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-sm z-10",
                                        item.type === 'stage_change' ? 'bg-amber-500' :
                                            item.type === 'proposal' ? 'bg-purple-500' : 'bg-blue-500'
                                    )}>
                                        {item.type === 'stage_change' && <TrendingUp className="w-3 h-3 text-white" />}
                                        {item.type === 'meeting' && <User className="w-3 h-3 text-white" />}
                                        {item.type === 'proposal' && <FileText className="w-3 h-3 text-white" />}
                                        {item.type === 'email' && <MessageSquare className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-semibold text-slate-900 dark:text-white">{item.content}</p>
                                            <span className="text-xs text-slate-400">{formatRelativeTime(item.date)}</span>
                                        </div>
                                        <p className="text-sm text-slate-500">{item.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'proposals' && (
                    <div className="animate-fade-in-up space-y-4">
                        <div className="flex justify-end">
                            <Button variant="primary" leftIcon={<FileText className="w-4 h-4" />}>Create New Proposal</Button>
                        </div>
                        {quotes.map(quote => (
                            <div key={quote.id} className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-amber-500/50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{quote.property}</p>
                                        <p className="text-xs text-slate-500">{quote.id} • {quote.area} sqft • <span className="font-medium text-slate-900 dark:text-white">₹{quote.rent}/sqft</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full uppercase',
                                        quote.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                    )}>{quote.status}</span>
                                    <p className="text-xs text-slate-400 mt-1">Sent: {new Date(quote.sentDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'stakeholders' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
                        {stakeholders.map(stakeholder => (
                            <div key={stakeholder.id} className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 group hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                                            {getInitials(stakeholder.name)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{stakeholder.name}</p>
                                            <p className="text-xs text-slate-500">{stakeholder.title}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-600 rounded-sm">{stakeholder.role}</span>
                                </div>
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MessageSquare className="w-3 h-3" />
                                        <span>{stakeholder.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Phone className="w-3 h-3" />
                                        <span>{stakeholder.phone}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-600 hover:border-slate-300 cursor-pointer transition-colors">
                            <div className="text-center">
                                <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <span className="text-sm font-medium">Add Stakeholder</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
