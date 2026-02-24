/**
 * Commissions Page for House FinMan
 */

import { useState } from 'react'
import { Search, Filter, Download, Plus, Clock, TrendingUp, CheckCircle2, FileText, ChevronDown, Check } from 'lucide-react'
import { Button, KPICard, SideDrawer } from '@/components/ui'
import { cn, formatCurrency } from '@/utils'
import { CreatePayRunModal } from './components/CreatePayRunModal'
import { CommissionDownloadModal } from './components/CommissionDownloadModal'
import { CommissionInvoiceModal } from './components/CommissionInvoiceModal'

// Types
type CommissionStatus = 'pending' | 'processed' | 'paid'

interface Commission {
    id: string
    partnerName: string
    leadName: string
    loanAmount: number
    commissionAmount: number
    tds: number
    netAmount: number
    status: CommissionStatus
    disbursedAt: string
    dueDate: string
}

// Configs
const statusConfig: Record<CommissionStatus, { label: string; color: string; bgColor: string }> = {
    pending: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
    processed: { label: 'Processed', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    paid: { label: 'Paid', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
}

// Dummy Data
const initialCommissions: Commission[] = [
    {
        id: 'COM-001',
        partnerName: 'Urban Estates',
        leadName: 'Rahul Verma',
        loanAmount: 5000000,
        commissionAmount: 25000,
        tds: 2500,
        netAmount: 22500,
        status: 'pending',
        disbursedAt: '2024-03-10T00:00:00Z',
        dueDate: '2024-03-25T00:00:00Z'
    },
    {
        id: 'COM-002',
        partnerName: 'PropTech Solutions',
        leadName: 'Anita Desai',
        loanAmount: 7500000,
        commissionAmount: 37500,
        tds: 3750,
        netAmount: 33750,
        status: 'processed',
        disbursedAt: '2024-03-05T00:00:00Z',
        dueDate: '2024-03-20T00:00:00Z'
    },
    {
        id: 'COM-003',
        partnerName: 'Dream Homes',
        leadName: 'Vikram Malhotra',
        loanAmount: 12000000,
        commissionAmount: 60000,
        tds: 6000,
        netAmount: 54000,
        status: 'paid',
        disbursedAt: '2024-02-28T00:00:00Z',
        dueDate: '2024-03-15T00:00:00Z'
    }
]

export default function CommissionsPage() {
    const [commissions, setCommissions] = useState(initialCommissions)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'all'>('all')
    const [statusOpen, setStatusOpen] = useState(false)
    const [isPayRunOpen, setIsPayRunOpen] = useState(false)
    const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null)
    const [downloadCommission, setDownloadCommission] = useState<Commission | null>(null)
    const [invoiceCommission, setInvoiceCommission] = useState<Commission | null>(null)

    const filteredCommissions = commissions.filter(c => {
        const matchesSearch = c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.leadName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalPending = commissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + c.netAmount, 0)

    const totalProcessed = commissions
        .filter(c => c.status === 'processed')
        .reduce((sum, c) => sum + c.netAmount, 0)

    const totalPaid = commissions
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + c.netAmount, 0)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Commissions Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track and manage partner payouts</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button>
                    <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsPayRunOpen(true)}>Create Pay Run</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KPICard
                    title="Pending Payouts"
                    value={formatCurrency(totalPending)}
                    trend={{ value: 15.3, direction: 'up' }}
                    icon={<Clock className="w-5 h-5 text-amber-500" />}
                    variant="orange"
                />
                <KPICard
                    title="Proccessed (Unpaid)"
                    value={formatCurrency(totalProcessed)}
                    trend={{ value: 5.2, direction: 'down' }}
                    icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                    variant="blue"
                />
                <KPICard
                    title="Paid This Month"
                    value={formatCurrency(totalPaid)}
                    trend={{ value: 24.8, direction: 'up' }}
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    variant="green"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search commissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        {statusOpen && <div className="fixed inset-0 z-30" onClick={() => setStatusOpen(false)} />}
                        <button
                            onClick={() => setStatusOpen(!statusOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-sm hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-sm font-medium transition-all min-w-[140px] justify-between z-30 relative"
                        >
                            <span className="capitalize">{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {statusOpen && (
                            <div className="absolute top-[110%] right-0 w-[180px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/10 rounded-sm z-40 animate-in fade-in zoom-in-95 duration-200 py-1">
                                {['all', 'pending', 'processed', 'paid'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => { setStatusFilter(status as any); setStatusOpen(false); }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 text-sm flex items-center justify-between group transition-colors",
                                            statusFilter === status
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <span className="capitalize">{status === 'all' ? 'All Status' : status}</span>
                                        {statusFilter === status && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>More Filters</Button>
                </div>
            </div>

            <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-900 dark:bg-black/80 text-white backdrop-blur-md sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest w-48 border-b border-white/10 border-r border-white/10">Commission ID</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Partner</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Lead Name</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Loan Amount</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Net Payout</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Status</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Due Date</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredCommissions.map(c => {
                            const status = statusConfig[c.status]
                            return (
                                <tr
                                    key={c.id}
                                    className="group relative hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors duration-150"
                                    onClick={() => setSelectedCommission(c)}
                                >
                                    <td className="px-4 py-4 border-r border-slate-100 dark:border-white/5">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{c.id}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{c.partnerName}</span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-center text-slate-500 font-medium border-r border-slate-100 dark:border-white/5">
                                        {c.leadName}
                                    </td>
                                    <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                                        <span className="text-sm text-slate-500 font-mono">{formatCurrency(c.loanAmount, true)}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                        <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{formatCurrency(c.netAmount)}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                                        <span className={cn('px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none inline-block min-w-[80px]', status.bgColor, status.color)}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{new Date(c.dueDate).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDownloadCommission(c);
                                                }}
                                                title="Download Breakdown"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setInvoiceCommission(c);
                                                }}
                                                title="View Invoice"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <CreatePayRunModal
                isOpen={isPayRunOpen}
                onClose={() => setIsPayRunOpen(false)}
                pendingAmount={totalPending}
                pendingCount={commissions.filter(c => c.status === 'pending').length}
                onProcess={() => {
                    setCommissions(commissions.map(c =>
                        c.status === 'pending' ? { ...c, status: 'processed' } : c
                    ))
                }}
            />

            <SideDrawer
                isOpen={!!selectedCommission}
                onClose={() => setSelectedCommission(null)}
                title="Commission Details"
                subtitle={`Transaction ID: ${selectedCommission?.id || ''}`}
                size="lg"
                variant="SD_T1"
                icon={<FileText className="w-6 h-6 text-blue-600" />}
                footer={
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Button variant="secondary" className="w-full" leftIcon={<FileText className="w-4 h-4" />}>View Invoice</Button>
                        <Button variant="primary" className="w-full" leftIcon={<Download className="w-4 h-4" />}>Download Breakdown</Button>
                    </div>
                }
            >
                {selectedCommission && (
                    <div className="space-y-6 pb-4">
                        {/* Status Card - Black */}
                        <div className="relative overflow-hidden rounded-sm border border-white/10 shadow-lg group bg-slate-950">
                            <div className={cn(
                                "absolute inset-0 opacity-20 transition-opacity duration-300",
                                selectedCommission.status === 'paid' ? 'bg-gradient-to-br from-emerald-500 to-teal-900' :
                                    selectedCommission.status === 'processed' ? 'bg-gradient-to-br from-blue-500 to-indigo-900' :
                                        'bg-gradient-to-br from-amber-500 to-orange-900'
                            )} />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Payout Status</p>
                                    <h3 className={cn(
                                        "text-2xl font-black uppercase tracking-tight",
                                        selectedCommission.status === 'paid' ? 'text-emerald-400' :
                                            selectedCommission.status === 'processed' ? 'text-blue-400' :
                                                'text-amber-400'
                                    )}>{statusConfig[selectedCommission.status].label}</h3>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-full border-2 backdrop-blur-md",
                                    selectedCommission.status === 'paid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                        selectedCommission.status === 'processed' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                            'border-amber-500/30 bg-amber-500/10 text-amber-400'
                                )}>
                                    {selectedCommission.status === 'paid' ? <CheckCircle2 className="w-6 h-6" /> :
                                        selectedCommission.status === 'processed' ? <CheckCircle2 className="w-6 h-6" /> :
                                            <Clock className="w-6 h-6" />}
                                </div>
                            </div>
                        </div>

                        {/* Financials Grid - Solid Multicolor Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-sm border border-emerald-400/20 bg-emerald-500 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <FileText className="w-12 h-12 text-emerald-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl" />
                                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-2">Net Payout</p>
                                <p className="text-2xl font-mono font-black relative z-10">{formatCurrency(selectedCommission.netAmount)}</p>
                            </div>
                            <div className="rounded-sm border border-violet-400/20 bg-violet-600 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <TrendingUp className="w-12 h-12 text-violet-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-violet-400/20 rounded-full blur-xl" />
                                <p className="text-violet-100 text-[10px] font-bold uppercase tracking-widest mb-2">Loan Amount</p>
                                <p className="text-2xl font-mono font-black relative z-10">{formatCurrency(selectedCommission.loanAmount)}</p>
                            </div>
                        </div>

                        {/* Breakdown Info */}
                        <div className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Commission Breakdown</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Gross Commission</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(selectedCommission.commissionAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">TDS Deduction (10%)</span>
                                    <span className="font-bold text-red-600">-{formatCurrency(selectedCommission.tds)}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Net Payable</span>
                                    <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedCommission.netAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Beneficiary & Transaction Details */}
                        <div className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Transaction Details</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Beneficiary</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedCommission.partnerName}</p>
                                    <p className="text-xs text-slate-500">HDFC **** 8892</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Lead Reference</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedCommission.leadName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Disbursed Date</p>
                                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{new Date(selectedCommission.disbursedAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Due Date</p>
                                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{new Date(selectedCommission.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SideDrawer>

            {downloadCommission && (
                <CommissionDownloadModal
                    isOpen={!!downloadCommission}
                    onClose={() => setDownloadCommission(null)}
                    commissionId={downloadCommission.id}
                    amount={downloadCommission.netAmount}
                />
            )}

            {invoiceCommission && (
                <CommissionInvoiceModal
                    isOpen={!!invoiceCommission}
                    onClose={() => setInvoiceCommission(null)}
                    commissionId={invoiceCommission.id}
                    amount={invoiceCommission.commissionAmount}
                    partnerName={invoiceCommission.partnerName}
                    date={invoiceCommission.disbursedAt}
                />
            )}
        </div>
    )
}
