/**
 * Vendors Page for House FinMan
 * 
 * Purpose: Vendor Directory with cards, search, and filters
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Search,
    Plus,
    MoreVertical,
    FileText,
    Mail,
    Phone,
    MapPin,
    Star,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Package,
    Pencil,
    Trash2
} from 'lucide-react'
import { Button, KPICard } from '@/components/ui'
import { cn, formatCurrency, formatNumber } from '@/utils'
import { dummyVendors, Vendor, VendorCategory, VendorStatus } from './data/dummyVendors'
import { AddVendorModal } from './components/AddVendorModal'
import { EditVendorModal } from './components/EditVendorModal'

const categoryConfig: Record<VendorCategory, { label: string; color: string; bgColor: string }> = {
    legal: { label: 'Legal', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    technical: { label: 'Technical', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    valuation: { label: 'Valuation', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    insurance: { label: 'Insurance', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    other: { label: 'Other', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-700/30' },
}

const statusConfig: Record<VendorStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
    active: { label: 'Active', icon: CheckCircle2, color: 'text-emerald-500' },
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-500' },
    blocked: { label: 'Blocked', icon: AlertTriangle, color: 'text-red-500' },
}

function VendorCard({ vendor, onClick, onEdit }: { vendor: Vendor; onClick: () => void; onEdit: () => void }) {
    const category = categoryConfig[vendor.category]
    const status = statusConfig[vendor.status]
    const StatusIcon = status.icon
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div
            onClick={onClick}
            className={cn(
                'p-4 cursor-pointer group rounded-none',
                'bg-white dark:bg-slate-800/50',
                'border border-slate-200 dark:border-white/10',
                'hover:border-primary-500/50 transition-all duration-200'
            )}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-sm',
                        category.bgColor
                    )}>
                        <Package className={cn('w-5 h-5', category.color)} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {vendor.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn('text-xs px-1.5 py-0.5 rounded-sm', category.bgColor, category.color)}>
                                {category.label}
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
                            <div className="absolute right-0 top-6 w-32 bg-white dark:bg-slate-800 rounded-sm shadow-xl border border-slate-200 dark:border-white/10 z-20 py-1">
                                <button
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onClick()
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
                                        if (confirm(`Are you sure you want to deactivate ${vendor.name}?`)) {
                                            console.log('Deactivating vendor:', vendor.id)
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

            <div className="space-y-1 mb-3 text-sm">
                <p className="text-slate-600 dark:text-slate-300">{vendor.contactPerson}</p>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                    <MapPin className="w-3 h-3" />
                    {vendor.city}
                </div>
            </div>

            <div className="grid grid-cols-2 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 mb-4 divide-x divide-y divide-slate-200 dark:divide-slate-700">
                <div className="p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total POs</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{vendor.totalPOs}</p>
                </div>
                <div className="p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pending</p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{formatCurrency(vendor.pendingInvoices, true)}</p>
                </div>
                <div className="p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Lead Time</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{vendor.avgLeadTime} <span className="text-xs font-medium text-slate-500">days</span></p>
                </div>
                <div className="p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SLA Score</p>
                    <div className="flex items-center gap-2">
                        <p className={cn('text-lg font-bold', vendor.slaCompliance >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600')}>
                            {vendor.slaCompliance}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{vendor.rating}</span>
                </div>
                <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm" onClick={e => e.stopPropagation()}>
                        <Phone className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm" onClick={e => e.stopPropagation()}>
                        <Mail className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function VendorsPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<VendorCategory | 'all'>('all')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

    const filteredVendors = dummyVendors.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const handleSaveVendor = (updated: any) => {
        console.log("Updated vendor:", updated)
        setEditingVendor(null)
    }

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vendor Directory</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {dummyVendors.length} vendors • {dummyVendors.filter(v => v.status === 'active').length} active
                    </p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddOpen(true)}>Add Vendor</Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <KPICard
                    title="Total Vendors"
                    value={dummyVendors.length}
                    variant="blue"
                    icon={<Package className="w-5 h-5" />}
                />
                <KPICard
                    title="Active"
                    value={dummyVendors.filter(v => v.status === 'active').length}
                    variant="emerald"
                    icon={<CheckCircle2 className="w-5 h-5" />}
                />
                <KPICard
                    title="Total POs"
                    value={formatNumber(dummyVendors.reduce((s, v) => s + v.totalPOs, 0))}
                    variant="purple"
                    icon={<FileText className="w-5 h-5" />}
                />
                <KPICard
                    title="Pending Invoices"
                    value={formatCurrency(dummyVendors.reduce((s, v) => s + v.pendingInvoices, 0), true)}
                    variant="orange"
                    icon={<Clock className="w-5 h-5" />}
                />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search vendors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
                </div>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as VendorCategory | 'all')} className="input w-auto min-w-[140px]">
                    <option value="all">All Categories</option>
                    <option value="legal">Legal</option>
                    <option value="technical">Technical</option>
                    <option value="valuation">Valuation</option>
                    <option value="insurance">Insurance</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVendors.map((vendor) => (
                    <VendorCard
                        key={vendor.id}
                        vendor={vendor}
                        onClick={() => navigate(`/vendors/${vendor.id}`)}
                        onEdit={() => setEditingVendor(vendor)}
                    />
                ))}
            </div>

            <AddVendorModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

            <EditVendorModal
                vendor={editingVendor}
                isOpen={!!editingVendor}
                onClose={() => setEditingVendor(null)}
                onSave={handleSaveVendor}
            />
        </div>
    )
}
