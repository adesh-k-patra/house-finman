/**
 * Campaigns Page for House FinMan
 * 
 * Features:
 * - Campaign listing with card view
 * - Create Campaign Modal
 * - Analytics navigation
 * - Status filters and search
 */

import { useState } from 'react'
import { Search, Megaphone, Plus, Target, BarChart3, MoreVertical, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn, formatNumber, formatPercentage } from '@/utils'
import { CreateCampaignModal } from './components/CreateCampaignModal'
import { CampaignPerformanceDashboard } from './components/CampaignPerformanceDashboard'
import { dummyCampaigns, Campaign, CampaignStatus, CampaignType } from './data/dummyCampaigns'

const statusConfig: Record<CampaignStatus, { label: string; color: string; bgColor: string }> = {
    draft: { label: 'Draft', color: 'text-white', bgColor: 'bg-slate-500/90 backdrop-blur-md border border-white/20' },
    active: { label: 'Active', color: 'text-white', bgColor: 'bg-emerald-500/90 backdrop-blur-md border border-white/20' },
    paused: { label: 'Paused', color: 'text-white', bgColor: 'bg-amber-500/90 backdrop-blur-md border border-white/20' },
    completed: { label: 'Completed', color: 'text-white', bgColor: 'bg-blue-500/90 backdrop-blur-md border border-white/20' },
}

const typeConfig: Record<CampaignType, { label: string; color: string }> = {
    email: { label: 'Email', color: 'text-blue-500' },
    sms: { label: 'SMS', color: 'text-green-500' },
    whatsapp: { label: 'WhatsApp', color: 'text-emerald-500' },
    push: { label: 'Push', color: 'text-purple-500' },
}

function CampaignCard({ campaign, onClick, onEdit, onAnalytics }: { campaign: Campaign; onClick: () => void; onEdit: () => void; onAnalytics: () => void }) {
    const status = statusConfig[campaign.status]
    const type = typeConfig[campaign.type]
    const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent) * 100 : 0
    const clickRate = campaign.opened > 0 ? (campaign.clicked / campaign.opened) * 100 : 0
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div
            onClick={onClick}
            className={cn(
                'group relative flex flex-col',
                'bg-white dark:bg-slate-900',
                'border border-slate-200 dark:border-white/10',
                'shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-white/20',
                'transition-all duration-300 hover:-translate-y-1',
                // Sharp corners
                'rounded-none overflow-hidden'
            )}
        >
            {/* Header */}
            <div className="pb-2 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={cn('px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm shadow-sm', status.bgColor, status.color)}>{status.label}</span>
                        <span className={cn('text-[10px] uppercase font-bold tracking-wider', type.color)}>{type.label}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{campaign.name}</h3>
                </div>
                <div className="relative">
                    <button
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowMenu(!showMenu)
                        }}
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false) }} />
                            <div className="absolute right-0 top-6 w-36 bg-white dark:bg-slate-900 rounded-none shadow-xl border border-slate-200 dark:border-white/10 z-20 py-1">
                                <button
                                    className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit() }}
                                >
                                    Edit Campaign
                                </button>
                                <button className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-red-600">Delete</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Grid - "Solid Dark Glassmorphic" */}
            <div className="mx-5 mb-5 p-3 bg-slate-900/95 dark:bg-black/80 backdrop-blur-md border border-slate-800/50 dark:border-white/10 relative shadow-inner group-hover:border-white/20 transition-colors">
                {/* Decorative sheen */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none" />

                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Audience</p>
                        <p className="text-base font-bold text-white">{formatNumber(campaign.audience)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Converted</p>
                        <p className="text-base font-bold text-emerald-400">{formatNumber(campaign.converted)}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Open Rate</p>
                        <p className="text-xs font-bold text-blue-400">{formatPercentage(openRate)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Click Rate</p>
                        <p className="text-xs font-bold text-purple-400">{formatPercentage(clickRate)}</p>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="mt-auto px-5 pb-5">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onAnalytics()
                    }}
                    className="w-full py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group/btn"
                >
                    <BarChart3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    View Analytics
                </button>
            </div>
        </div>
    )
}

export default function CampaignsPage() {
    // const navigate = useNavigate() - Unused removed
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [, setEditingCampaign] = useState<Campaign | null>(null)
    const [viewingAnalyticsCampaign, setViewingAnalyticsCampaign] = useState<Campaign | null>(null)

    const filteredCampaigns = dummyCampaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // const totalBudget = dummyCampaigns.reduce((s, c) => s + c.budget, 0) // Not used in new KPI cards
    // const totalSpent = dummyCampaigns.reduce((s, c) => s + c.spent, 0) // Not used in new KPI cards
    // const totalConverted = dummyCampaigns.reduce((s, c) => s + c.converted, 0) // Not used in new KPI cards

    // const handleSaveCampaign = (updated: any) => { // Not used in new EditCampaignModal
    //     // In real app, update state/API
    //     console.log("Saved campaign:", updated)
    //     setEditingCampaign(null)
    // }

    return (
        <div className="w-full space-y-4 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Campaigns</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your marketing campaigns</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 shadow-lg shadow-primary-500/20">
                        <Plus className="w-4 h-4" /> New Campaign
                    </Button>
                </div>
            </div>

            {/* KPI Overview - Solid Multi-color Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-none shadow-xl border border-white/10 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">Total Campaigns</p>
                            <h3 className="text-3xl font-black text-white">{dummyCampaigns.length}</h3>
                            <p className="text-[10px] text-blue-200 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +12% vs last month
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-none backdrop-blur-sm">
                            <Megaphone className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 rounded-none shadow-xl border border-white/10 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-purple-100 uppercase tracking-widest mb-1">Total Audience</p>
                            <h3 className="text-3xl font-black text-white">254k</h3>
                            <p className="text-[10px] text-purple-200 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +8.5% vs last month
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-none backdrop-blur-sm">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-800 rounded-none shadow-xl border border-white/10 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-orange-100 uppercase tracking-widest mb-1">Avg. Conversion</p>
                            <h3 className="text-3xl font-black text-white">2.4%</h3>
                            <p className="text-[10px] text-orange-200 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> -1.2% vs last month
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-none backdrop-blur-sm">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-none shadow-xl border border-white/10 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Total Revenue</p>
                            <h3 className="text-3xl font-black text-white">$45,200</h3>
                            <p className="text-[10px] text-emerald-200 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +15.3% vs last month
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters - Sharp Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-slate-900 rounded-none shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="relative flex-1 w-full md:max-w-md border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm font-medium rounded-none"
                    />
                </div>
                <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar">
                    {(['all', 'draft', 'active', 'paused', 'completed'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                'px-6 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-l border-slate-200 dark:border-white/10 first:border-l-0 md:first:border-l rounded-none',
                                statusFilter === status
                                    ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            )}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Campaign Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCampaigns.map(campaign => (
                    <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onClick={() => setViewingAnalyticsCampaign(campaign)}
                        onEdit={() => setEditingCampaign(campaign)}
                        onAnalytics={() => setViewingAnalyticsCampaign(campaign)}
                    />
                ))}
            </div>

            <CreateCampaignModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={(newCampaign) => {
                    console.log("Creating campaign", newCampaign)
                    // In real app, add to list
                    setIsCreateModalOpen(false)
                }}
            />

            <CampaignPerformanceDashboard
                isOpen={viewingAnalyticsCampaign !== null}
                onClose={() => setViewingAnalyticsCampaign(null)}
                campaignName={viewingAnalyticsCampaign?.name ?? 'Campaign Analytics'}
            />
        </div>
    )
}
