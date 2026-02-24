/**
 * Partners Page for House FinMan
 * 
 * Features:
 * - Partner Directory with search and filters
 * - Add Partner Modal
 * - Partner Card with Click Navigation
 * - Quick Actions (Edit, Delete, Invite)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Search,
    Plus,
    MapPin,
    Phone,
    Mail,
    TrendingUp,
    Users,
    MoreVertical,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
    Pencil,
    Trash2
} from 'lucide-react'
import { Button, KPICard } from '@/components/ui'
import { cn, formatCurrency, formatNumber } from '@/utils'
import { AddPartnerModal } from './components/AddPartnerModal'
import { EditPartnerModal } from './components/EditPartnerModal'
import { dummyPartners, Partner, PartnerTier, PartnerStatus } from './data/dummyPartners'

const tierConfig: Record<PartnerTier, { label: string; color: string; bgColor: string }> = {
    platinum: { label: 'Platinum', color: 'text-purple-600', bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-600' },
    gold: { label: 'Gold', color: 'text-amber-600', bgColor: 'bg-gradient-to-r from-amber-400 to-orange-500' },
    silver: { label: 'Silver', color: 'text-slate-500', bgColor: 'bg-gradient-to-r from-slate-400 to-slate-500' },
    bronze: { label: 'Bronze', color: 'text-orange-700', bgColor: 'bg-gradient-to-r from-orange-600 to-amber-700' },
}

const statusConfig: Record<PartnerStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
    active: { label: 'Active', icon: CheckCircle2, color: 'text-emerald-500' },
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-500' },
    inactive: { label: 'Inactive', icon: XCircle, color: 'text-red-500' },
}

function PartnerCard({ partner, onClick, onEdit }: { partner: Partner; onClick: () => void; onEdit: () => void }) {
    const tier = tierConfig[partner.tier]
    const status = statusConfig[partner.status]
    const StatusIcon = status.icon
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div
            onClick={onClick}
            className={cn(
                'rounded-sm overflow-hidden cursor-pointer group',
                'bg-white dark:bg-slate-800/50',
                'border border-slate-200 dark:border-white/10',
                'shadow-card hover:shadow-card-hover',
                'transition-all duration-200 hover:-translate-y-0.5'
            )}
        >
            {/* Tier Banner */}
            <div className={cn('h-1', tier.bgColor)} />

            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            'flex items-center justify-center w-12 h-12 rounded-sm text-white font-bold text-lg',
                            tier.bgColor
                        )}>
                            {partner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
                                {partner.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                    'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-sm',
                                    tier.color,
                                    'bg-slate-100 dark:bg-slate-700/50'
                                )}>
                                    {tier.label}
                                </span>
                                <span className={cn('flex items-center gap-1 text-xs', status.color)}>
                                    <StatusIcon className="w-3 h-3" />
                                    {status.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowMenu(!showMenu)
                            }}
                        >
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={(e) => {
                                    e.stopPropagation()
                                    setShowMenu(false)
                                }} />
                                <div className="absolute right-0 top-4 w-32 bg-white dark:bg-slate-800 rounded-sm shadow-xl border border-slate-200 dark:border-white/10 z-20 py-1">
                                    <button
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onClick() // Go to details
                                        }}
                                    >
                                        <FileText className="w-3 h-3" /> View Details
                                    </button>
                                    <button
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowMenu(false)
                                            onEdit()
                                        }}
                                    >
                                        <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                    <button
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (confirm(`Are you sure you want to deactivate ${partner.name}?`)) {
                                                // Mock deactivation
                                                console.log('Deactivating partner:', partner.id)
                                                setShowMenu(false)
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-3 h-3" /> Deactivate
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Contact */}
                <div className="space-y-1 mb-4 text-sm">
                    <p className="text-slate-700 dark:text-slate-300">{partner.contactPerson}</p>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs">{partner.city}, {partner.state}</span>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={cn(
                        "p-2 rounded-sm",
                        "bg-slate-900",
                        "border border-white/10",
                        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    )}>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mb-1 font-bold tracking-wide uppercase">
                            <Users className="w-3 h-3" />
                            Total Leads
                        </div>
                        <p className="text-sm font-black text-white tracking-tight">
                            {formatNumber(partner.totalLeads)}
                        </p>
                    </div>
                    <div className={cn(
                        "p-2 rounded-sm",
                        "bg-slate-900",
                        "border border-white/10",
                        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    )}>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mb-1 font-bold tracking-wide uppercase">
                            <TrendingUp className="w-3 h-3" />
                            Conversion
                        </div>
                        <p className="text-sm font-black text-emerald-400 tracking-tight">
                            {partner.conversionRate}%
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="text-xs text-slate-400">
                        Pending: {formatCurrency(partner.pendingCommission, true)}
                    </span>
                    <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm" onClick={(e) => e.stopPropagation()}>
                            <Phone className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm" onClick={(e) => e.stopPropagation()}>
                            <Mail className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PartnersPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [tierFilter, setTierFilter] = useState<PartnerTier | 'all'>('all')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null)

    const filteredPartners = dummyPartners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.city.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTier = tierFilter === 'all' || partner.tier === tierFilter
        return matchesSearch && matchesTier
    })

    const handleSavePartner = (updated: any) => {
        console.log("Updated partner:", updated)
        setEditingPartner(null)
    }

    return (
        <div className="w-full space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Partner Directory
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {dummyPartners.length} partners • {dummyPartners.filter(p => p.status === 'active').length} active
                    </p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddOpen(true)}>
                    Add Partner
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Partners"
                    value={formatNumber(dummyPartners.length)}
                    icon={<Users className="w-5 h-5" />}
                    variant="violet"
                />
                <KPICard
                    title="Active Partners"
                    value={formatNumber(dummyPartners.filter(p => p.status === 'active').length)}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    variant="emerald"
                />
                <KPICard
                    title="Total Disbursed"
                    value={formatCurrency(dummyPartners.reduce((sum, p) => sum + p.totalDisbursed, 0), true)}
                    icon={<TrendingUp className="w-5 h-5" />}
                    variant="cyan"
                />
                <KPICard
                    title="Pending Commissions"
                    value={formatCurrency(dummyPartners.reduce((sum, p) => sum + p.pendingCommission, 0), true)}
                    icon={<Clock className="w-5 h-5" />}
                    variant="amber"
                />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search partners..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10"
                    />
                </div>
                <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value as PartnerTier | 'all')}
                    className="input w-auto min-w-[140px]"
                >
                    <option value="all">All Tiers</option>
                    <option value="platinum">Platinum</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                </select>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPartners.map((partner) => (
                    <PartnerCard
                        key={partner.id}
                        partner={partner}
                        onClick={() => navigate(`/partners/${partner.id}`)}
                        onEdit={() => setEditingPartner(partner)}
                    />
                ))}
            </div>

            <AddPartnerModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

            <EditPartnerModal
                partner={editingPartner}
                isOpen={!!editingPartner}
                onClose={() => setEditingPartner(null)}
                onSave={handleSavePartner}
            />
        </div>
    )
}
