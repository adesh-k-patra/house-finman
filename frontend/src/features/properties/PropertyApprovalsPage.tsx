/**
 * Property Approvals Page for House FinMan
 */

import { useState } from 'react'
import {
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    MapPin,
    DollarSign,
    FileText,
    Plus,
    Search,
    Filter,
} from 'lucide-react'
import { Button, Card, KPICard } from '@/components/ui'
import { cn, formatCurrency, formatRelativeTime } from '@/utils'

const pendingApprovals = [
    { id: 'prop_015', name: 'Skyline Heights', builder: 'Prestige Group', location: 'HSR Layout', city: 'Bangalore', type: 'apartment', units: 120, priceRange: { min: 4500000, max: 8500000 }, status: 'pending', submittedAt: '2026-01-05T09:00:00', pmayEligible: true, reraStatus: 'verified', documentsComplete: true },
    { id: 'prop_016', name: 'Green Meadows Villa', builder: 'Sobha Developers', location: 'Electronic City', city: 'Bangalore', type: 'villa', units: 45, priceRange: { min: 12000000, max: 25000000 }, status: 'pending', submittedAt: '2026-01-04T14:30:00', pmayEligible: false, reraStatus: 'pending', documentsComplete: false },
    { id: 'prop_017', name: 'Metro Square', builder: 'DLF Ltd', location: 'Sector 42', city: 'Gurugram', type: 'apartment', units: 200, priceRange: { min: 5500000, max: 9500000 }, status: 'review', submittedAt: '2026-01-03T11:00:00', pmayEligible: true, reraStatus: 'verified', documentsComplete: true },
    { id: 'prop_018', name: 'Lakeside Plots', builder: 'Brigade Group', location: 'Yelahanka', city: 'Bangalore', type: 'plot', units: 80, priceRange: { min: 3500000, max: 6000000 }, status: 'pending', submittedAt: '2026-01-02T16:00:00', pmayEligible: true, reraStatus: 'verified', documentsComplete: true },
    { id: 'prop_019', name: 'Business Hub', builder: 'Embassy Group', location: 'Whitefield', city: 'Bangalore', type: 'commercial', units: 50, priceRange: { min: 15000000, max: 35000000 }, status: 'review', submittedAt: '2026-01-01T10:00:00', pmayEligible: false, reraStatus: 'verified', documentsComplete: true },
    { id: 'prop_020', name: 'Palm Grove', builder: 'Godrej Properties', location: 'Hinjewadi', city: 'Pune', type: 'apartment', units: 150, priceRange: { min: 4000000, max: 7000000 }, status: 'pending', submittedAt: '2026-01-06T10:30:00', pmayEligible: true, reraStatus: 'pending', documentsComplete: true },
    { id: 'prop_021', name: 'River View Apartments', builder: 'Puravankara', location: 'Kochi', city: 'Kerala', type: 'apartment', units: 90, priceRange: { min: 3500000, max: 6500000 }, status: 'approved', submittedAt: '2025-12-30T14:20:00', pmayEligible: true, reraStatus: 'verified', documentsComplete: true },
    { id: 'prop_022', name: 'Tech Park Enclave', builder: 'RMZ Corp', location: 'Bellandur', city: 'Bangalore', type: 'commercial', units: 25, priceRange: { min: 25000000, max: 50000000 }, status: 'rejected', submittedAt: '2025-12-28T09:15:00', pmayEligible: false, reraStatus: 'failed', documentsComplete: false },
    { id: 'prop_023', name: 'Emerald City', builder: 'Hiranandani', location: 'Powai', city: 'Mumbai', type: 'apartment', units: 300, priceRange: { min: 15000000, max: 30000000 }, status: 'pending', submittedAt: '2026-01-07T11:45:00', pmayEligible: false, reraStatus: 'verified', documentsComplete: true },
    { id: 'prop_024', name: 'Sunrise Villas', builder: 'Casagrand', location: 'OMR', city: 'Chennai', type: 'villa', units: 60, priceRange: { min: 8000000, max: 15000000 }, status: 'review', submittedAt: '2026-01-05T16:00:00', pmayEligible: true, reraStatus: 'verified', documentsComplete: false },
    { id: 'prop_025', name: 'Golden Acres', builder: 'Prestige Group', location: 'Sarjapur Road', city: 'Bangalore', type: 'plot', units: 120, priceRange: { min: 3000000, max: 5500000 }, status: 'pending', submittedAt: '2026-01-08T09:30:00', pmayEligible: false, reraStatus: 'pending', documentsComplete: true },
    { id: 'prop_026', name: 'Urban Lofts', builder: 'Oberoi Realty', location: 'Goregaon', city: 'Mumbai', type: 'apartment', units: 85, priceRange: { min: 20000000, max: 40000000 }, status: 'approved', submittedAt: '2025-12-29T12:00:00', pmayEligible: false, reraStatus: 'verified', documentsComplete: true },
    { id: 'prop_027', name: 'Silicon Valley Phase 2', builder: 'DLF Ltd', location: 'Noida', city: 'NCR', type: 'apartment', units: 220, priceRange: { min: 6000000, max: 11000000 }, status: 'pending', submittedAt: '2026-01-06T15:15:00', pmayEligible: true, reraStatus: 'pending', documentsComplete: false },
    { id: 'prop_028', name: 'Marina Heights', builder: 'Kolte Patil', location: 'Viman Nagar', city: 'Pune', type: 'apartment', units: 110, priceRange: { min: 5000000, max: 9000000 }, status: 'review', submittedAt: '2026-01-04T10:45:00', pmayEligible: true, reraStatus: 'verified', documentsComplete: true },
    { id: 'prop_029', name: 'Central Plaza', builder: 'Brigade Group', location: 'MG Road', city: 'Bangalore', type: 'commercial', units: 15, priceRange: { min: 40000000, max: 80000000 }, status: 'pending', submittedAt: '2026-01-07T13:30:00', pmayEligible: false, reraStatus: 'verified', documentsComplete: true }
]

const statusConfig = {
    pending: { label: 'Pending Review', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    review: { label: 'Under Review', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    approved: { label: 'Approved', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
}

export default function PropertyApprovalsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Property Approvals</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review and approve property listings</p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Add Property</Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
                <KPICard title="Pending Review" value="5" variant="orange" icon={<Clock className="w-5 h-5" />} />
                <KPICard title="Under Review" value="2" variant="blue" icon={<FileText className="w-5 h-5" />} />
                <KPICard title="Approved This Month" value="12" variant="green" icon={<CheckCircle2 className="w-5 h-5" />} />
                <KPICard title="Rejected" value="3" variant="red" icon={<XCircle className="w-5 h-5" />} />
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search properties..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
                </div>
                <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
            </div>

            {/* Approvals Grid */}
            <div className="grid grid-cols-2 gap-4">
                {pendingApprovals.map(prop => {
                    const status = statusConfig[prop.status as keyof typeof statusConfig]
                    return (
                        <Card key={prop.id} padding="none">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{prop.name}</h3>
                                        <p className="text-sm text-slate-500">{prop.builder}</p>
                                    </div>
                                    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-sm', status.bgColor, status.color)}>{status.label}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{prop.location}, {prop.city}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                        <span className="capitalize">{prop.type} • {prop.units} units</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <DollarSign className="w-4 h-4 text-slate-400" />
                                        <span>{formatCurrency(prop.priceRange.min, true)} - {formatCurrency(prop.priceRange.max, true)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span>Submitted {formatRelativeTime(prop.submittedAt)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    {prop.pmayEligible && <span className="px-2 py-0.5 text-xs font-medium rounded-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600">PMAY Eligible</span>}
                                    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-sm', prop.reraStatus === 'verified' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600')}>
                                        RERA {prop.reraStatus === 'verified' ? 'Verified' : 'Pending'}
                                    </span>
                                    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-sm', prop.documentsComplete ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600')}>
                                        Docs {prop.documentsComplete ? 'Complete' : 'Incomplete'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
                                    <Button size="sm" variant="secondary" leftIcon={<Eye className="w-4 h-4" />} className="flex-1">Review</Button>
                                    <Button size="sm" variant="primary" leftIcon={<CheckCircle2 className="w-4 h-4" />}>Approve</Button>
                                    <Button size="sm" variant="secondary" leftIcon={<XCircle className="w-4 h-4" />}>Reject</Button>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
