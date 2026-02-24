/**
 * Vendor Invoices Page for House FinMan
 */

import { useState } from 'react'
import {
    FileText,
    Download,
    Eye,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Plus,
    Search,
    CreditCard,
} from 'lucide-react'
import { Button, KPICard, SideDrawer } from '@/components/ui'
import { cn, formatCurrency, getInitials } from '@/utils'

const invoices = [
    { id: 'INV-2026-001', vendor: 'Legal Associates LLP', poRef: 'PO-2025-145', amount: 45000, dueDate: '2026-01-10', status: 'pending', category: 'legal', createdAt: '2026-01-01T10:00:00' },
    { id: 'INV-2026-002', vendor: 'TechVet Solutions', poRef: 'PO-2025-148', amount: 32000, dueDate: '2026-01-12', status: 'pending', category: 'technical', createdAt: '2026-01-02T11:30:00' },
    { id: 'INV-2025-198', vendor: 'ValueMax Appraisals', poRef: 'PO-2025-132', amount: 28000, dueDate: '2025-12-25', status: 'overdue', category: 'valuation', createdAt: '2025-12-18T09:00:00' },
    { id: 'INV-2025-195', vendor: 'InsureAll India', poRef: 'PO-2025-128', amount: 18500, dueDate: '2025-12-30', status: 'paid', paidAt: '2025-12-28', category: 'insurance', createdAt: '2025-12-20T14:00:00' },
    { id: 'INV-2025-192', vendor: 'Legal Associates LLP', poRef: 'PO-2025-118', amount: 52000, dueDate: '2025-12-20', status: 'paid', paidAt: '2025-12-19', category: 'legal', createdAt: '2025-12-12T10:30:00' },
    { id: 'INV-2025-188', vendor: 'PropertyCheck Services', poRef: 'PO-2025-112', amount: 15000, dueDate: '2025-12-15', status: 'paid', paidAt: '2025-12-14', category: 'technical', createdAt: '2025-12-08T16:00:00' },
    { id: 'INV-2025-185', vendor: 'TechVet Solutions', poRef: 'PO-2025-105', amount: 38000, dueDate: '2025-12-10', status: 'paid', paidAt: '2025-12-09', category: 'technical', createdAt: '2025-12-02T11:00:00' },
    { id: 'INV-2026-003', vendor: 'ValueMax Appraisals', poRef: 'PO-2026-002', amount: 22000, dueDate: '2026-01-15', status: 'pending', category: 'valuation', createdAt: '2026-01-03T09:30:00' },
]

const statusConfig = {
    pending: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    paid: { label: 'Paid', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    overdue: { label: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
}

const categoryConfig = {
    legal: { label: 'Legal', color: 'text-blue-600' },
    technical: { label: 'Technical', color: 'text-purple-600' },
    valuation: { label: 'Valuation', color: 'text-orange-600' },
    insurance: { label: 'Insurance', color: 'text-cyan-600' },
}

export default function VendorInvoicesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null)

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || inv.id.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)
    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vendor Invoices</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and process vendor invoices</p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Upload Invoice</Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
                <KPICard title="Total Invoices" value={invoices.length.toString()} variant="blue" icon={<FileText className="w-5 h-5" />} />
                <KPICard title="Pending Payment" value={formatCurrency(totalPending, true)} variant="orange" icon={<Clock className="w-5 h-5" />} />
                <KPICard title="Overdue" value={formatCurrency(totalOverdue, true)} variant="red" icon={<AlertTriangle className="w-5 h-5" />} />
                <KPICard title="Paid This Month" value={formatCurrency(totalPaid, true)} variant="green" icon={<CheckCircle2 className="w-5 h-5" />} />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search invoices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10 rounded-sm" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-48 rounded-sm">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="paid">Paid</option>
                </select>
            </div>

            {/* Invoices Table */}
            <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Invoice ID</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Vendor</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Category</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">PO Ref</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Amount</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Due Date</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredInvoices.map(invoice => {
                            const status = statusConfig[invoice.status as keyof typeof statusConfig]
                            const category = categoryConfig[invoice.category as keyof typeof categoryConfig]
                            return (
                                <tr
                                    key={invoice.id}
                                    className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                    onClick={() => setSelectedInvoice(invoice)}
                                >
                                    <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700">
                                        <span className="text-sm font-bold text-primary-600 underline decoration-dotted underline-offset-4 group-hover:text-primary-700 transition-colors">{invoice.id}</span>
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                    {getInitials(invoice.vendor)}
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{invoice.vendor}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                        <span className={cn('text-xs font-bold uppercase tracking-wider', category.color)}>{category.label}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-mono text-slate-500 border-r border-slate-300 dark:border-slate-700">{invoice.poRef}</td>
                                    <td className="px-6 py-4 text-center text-sm font-black text-slate-900 dark:text-white border-r border-slate-300 dark:border-slate-700 font-mono tracking-tight">{formatCurrency(invoice.amount)}</td>
                                    <td className="px-6 py-4 text-center text-xs text-slate-500 border-r border-slate-300 dark:border-slate-700">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                        <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm inline-block', status.bgColor, status.color)}>{status.label}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm text-slate-400 hover:text-primary-600 transition-colors"
                                                onClick={() => setSelectedInvoice(invoice)}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm text-slate-400 hover:text-primary-600 transition-colors">
                                                <Download className="w-3.5 h-3.5" />
                                            </button>
                                            {invoice.status !== 'paid' && (
                                                <button className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-sm text-emerald-600 transition-colors" title="Pay Now">
                                                    <CreditCard className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <SideDrawer
                isOpen={!!selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                title="Invoice Details"
                subtitle={`Ref: ${selectedInvoice?.id || ''}`}
                size="lg"
                icon={<FileText className="w-5 h-5 text-blue-600" />}
                variant="SD_T1"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setSelectedInvoice(null)}>Close</Button>
                        <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>Download PDF</Button>
                    </>
                }
            >
                {selectedInvoice && (
                    <div className="space-y-6 pb-4">
                        {/* Status Card - Black */}
                        <div className="relative overflow-hidden rounded-sm p-6 border border-white/10 shadow-lg group bg-slate-950">
                            <div className={cn(
                                "absolute inset-0 opacity-20 transition-opacity duration-300",
                                selectedInvoice.status === 'paid' ? 'bg-gradient-to-br from-emerald-500 to-teal-900' :
                                    selectedInvoice.status === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-900' :
                                        'bg-gradient-to-br from-red-500 to-rose-900'
                            )} />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Invoice Status</p>
                                    <h3 className={cn(
                                        "text-2xl font-black uppercase tracking-tight",
                                        selectedInvoice.status === 'paid' ? 'text-emerald-400' :
                                            selectedInvoice.status === 'pending' ? 'text-amber-400' :
                                                'text-red-400'
                                    )}>{statusConfig[selectedInvoice.status as keyof typeof statusConfig].label}</h3>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-full border-2 backdrop-blur-md",
                                    selectedInvoice.status === 'paid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                        selectedInvoice.status === 'pending' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                                            'border-red-500/30 bg-red-500/10 text-red-400'
                                )}>
                                    {selectedInvoice.status === 'pending' ? <Clock className="w-6 h-6" /> :
                                        selectedInvoice.status === 'overdue' ? <AlertTriangle className="w-6 h-6" /> :
                                            <CheckCircle2 className="w-6 h-6" />}
                                </div>
                            </div>
                        </div>

                        {/* Financials Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-sm border border-emerald-400/20 bg-emerald-500 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <CreditCard className="w-12 h-12 text-emerald-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl" />
                                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-2">Total Amount</p>
                                <p className="text-2xl font-mono font-black relative z-10">{formatCurrency(selectedInvoice.amount)}</p>
                            </div>
                            <div className="rounded-sm border border-violet-400/20 bg-violet-600 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <FileText className="w-12 h-12 text-violet-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-violet-400/20 rounded-full blur-xl" />
                                <p className="text-violet-100 text-[10px] font-bold uppercase tracking-widest mb-2">PO Reference</p>
                                <p className="text-xl font-mono font-black relative z-10 truncate">{selectedInvoice.poRef}</p>
                            </div>
                        </div>

                        {/* Bill To & Vendor Info */}
                        <div className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Invoice Details</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Vendor</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedInvoice.vendor}</p>
                                    <p className="text-xs text-slate-500">{selectedInvoice.vendor.toLowerCase().replace(/\s/g, '')}@example.com</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Date</p>
                                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-500">Subtotal</span>
                                        <span className="text-xs font-mono font-bold">{formatCurrency(selectedInvoice.amount * 0.82)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-500">Tax (18%)</span>
                                        <span className="text-xs font-mono font-bold">{formatCurrency(selectedInvoice.amount * 0.18)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">Total Payable</span>
                                        <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedInvoice.amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedInvoice.status !== 'paid' && (
                            <Button className="w-full h-12 uppercase tracking-wider font-bold shadow-lg shadow-blue-500/20" variant="primary">
                                Process Payment Now
                            </Button>
                        )}
                    </div>
                )}
            </SideDrawer>
        </div>
    )
}
