/**
 * Finance Billing Page for House FinMan
 */



import { useState } from 'react'
import {
    Download,
    Send,
    Plus,
    Search,
    CheckCircle2,
    Clock,
    Building,
    AlertCircle,
    CreditCard,
    FileText
} from 'lucide-react'
import { Button, KPICard, SideDrawer } from '@/components/ui'
import { cn, formatCurrency, getInitials } from '@/utils'
import { CreateInvoiceModal } from './components/CreateInvoiceModal'

// Constants & Data
const statusConfig = {
    pending: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
    paid: { label: 'Paid', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    overdue: { label: 'Overdue', color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50 dark:bg-rose-900/20' },
}

const typeConfig = {
    subscription: 'Subscription Fee',
    commission: 'Commission Reversal',
    penalty: 'Late Payment Penalty',
    service: 'Service Charge'
}

const invoices = [
    {
        id: 'INV-2024-001',
        customer: 'Rajesh Kumar',
        loanId: 'LN-HOM-2023-8892',
        type: 'subscription',
        amount: 2500,
        dueDate: '2024-03-25T00:00:00Z',
        status: 'pending',
        createdAt: '2024-03-10T10:00:00Z'
    },
    {
        id: 'INV-2024-002',
        customer: 'Priya Sharma',
        loanId: 'LN-PER-2023-4451',
        type: 'service',
        amount: 1200,
        dueDate: '2024-03-20T00:00:00Z',
        status: 'paid',
        createdAt: '2024-03-05T14:30:00Z'
    },
    {
        id: 'INV-2024-003',
        customer: 'Amit Patel',
        loanId: 'LN-BUS-2023-1123',
        type: 'penalty',
        amount: 500,
        dueDate: '2024-03-01T00:00:00Z',
        status: 'overdue',
        createdAt: '2024-02-15T09:15:00Z'
    },
    {
        id: 'INV-2024-004',
        customer: 'Sneha Gupta',
        loanId: 'LN-HOM-2023-7765',
        type: 'commission',
        amount: 15000,
        dueDate: '2024-03-28T00:00:00Z',
        status: 'pending',
        createdAt: '2024-03-12T11:20:00Z'
    },
    {
        id: 'INV-2024-005',
        customer: 'Vikram Singh',
        loanId: 'LN-LAP-2023-3321',
        type: 'subscription',
        amount: 2500,
        dueDate: '2024-03-15T00:00:00Z',
        status: 'paid',
        createdAt: '2024-03-01T16:45:00Z'
    },
    {
        id: 'INV-2024-006',
        customer: 'Anjali Desai',
        loanId: 'LN-HOM-2023-9901',
        type: 'subscription',
        amount: 2500,
        dueDate: '2024-03-29T00:00:00Z',
        status: 'pending',
        createdAt: '2024-03-14T09:20:00Z'
    },
    {
        id: 'INV-2024-007',
        customer: 'Rahul Verma',
        loanId: 'LN-BUS-2023-2244',
        type: 'service',
        amount: 3500,
        dueDate: '2024-03-18T00:00:00Z',
        status: 'paid',
        createdAt: '2024-03-08T11:10:00Z'
    },
    {
        id: 'INV-2024-008',
        customer: 'Kavita Reddy',
        loanId: 'LN-PER-2023-5566',
        type: 'penalty',
        amount: 750,
        dueDate: '2024-02-28T00:00:00Z',
        status: 'overdue',
        createdAt: '2024-02-14T15:40:00Z'
    },
    {
        id: 'INV-2024-009',
        customer: 'Suresh Babu',
        loanId: 'LN-HOM-2023-1122',
        type: 'commission',
        amount: 22000,
        dueDate: '2024-03-30T00:00:00Z',
        status: 'pending',
        createdAt: '2024-03-15T13:25:00Z'
    },
    {
        id: 'INV-2024-010',
        customer: 'Meera Iyer',
        loanId: 'LN-LAP-2023-8877',
        type: 'subscription',
        amount: 2500,
        dueDate: '2024-03-10T00:00:00Z',
        status: 'overdue',
        createdAt: '2024-02-25T10:00:00Z'
    },
    {
        id: 'INV-2024-011',
        customer: 'Deepak Chopra',
        loanId: 'LN-BUS-2023-3399',
        type: 'service',
        amount: 5000,
        dueDate: '2024-03-22T00:00:00Z',
        status: 'paid',
        createdAt: '2024-03-12T12:30:00Z'
    },
    {
        id: 'INV-2024-012',
        customer: 'Pooja Hegde',
        loanId: 'LN-HOM-2023-4455',
        type: 'commission',
        amount: 18500,
        dueDate: '2024-04-01T00:00:00Z',
        status: 'pending',
        createdAt: '2024-03-16T14:50:00Z'
    },
    {
        id: 'INV-2024-013',
        customer: 'Arun Kumar',
        loanId: 'LN-PER-2023-7788',
        type: 'penalty',
        amount: 250,
        dueDate: '2024-03-05T00:00:00Z',
        status: 'paid',
        createdAt: '2024-03-01T09:45:00Z'
    },
    {
        id: 'INV-2024-014',
        customer: 'Nisha Singh',
        loanId: 'LN-HOM-2023-2211',
        type: 'subscription',
        amount: 2500,
        dueDate: '2024-04-05T00:00:00Z',
        status: 'pending',
        createdAt: '2024-03-20T11:15:00Z'
    },
    {
        id: 'INV-2024-015',
        customer: 'Rohan Gupta',
        loanId: 'LN-LAP-2023-6655',
        type: 'service',
        amount: 1800,
        dueDate: '2024-03-25T00:00:00Z',
        status: 'pending',
        createdAt: '2024-03-10T16:30:00Z'
    },
    {
        id: 'INV-2024-016',
        customer: 'Divya Nair',
        loanId: 'LN-HOM-2023-3344',
        type: 'commission',
        amount: 32000,
        dueDate: '2024-03-15T00:00:00Z',
        status: 'paid',
        createdAt: '2024-03-01T10:20:00Z'
    },
    {
        id: 'INV-2024-017',
        customer: 'Karthik Raja',
        loanId: 'LN-BUS-2023-5599',
        type: 'penalty',
        amount: 1200,
        dueDate: '2024-02-20T00:00:00Z',
        status: 'overdue',
        createdAt: '2024-02-05T13:40:00Z'
    },
    {
        id: 'INV-2024-018',
        customer: 'Swati Mishra',
        loanId: 'LN-PER-2023-1100',
        type: 'subscription',
        amount: 2500,
        dueDate: '2024-04-10T00:00:00Z',
        status: 'pending',
        createdAt: '2024-03-25T09:55:00Z'
    },
    {
        id: 'INV-2024-019',
        customer: 'Gaurav Sharma',
        loanId: 'LN-HOM-2023-7722',
        type: 'service',
        amount: 4200,
        dueDate: '2024-03-12T00:00:00Z',
        status: 'paid',
        createdAt: '2024-03-02T15:10:00Z'
    },
    {
        id: 'INV-2024-020',
        customer: 'Lakshmi Narayan',
        loanId: 'LN-LAP-2023-9988',
        type: 'commission',
        amount: 14500,
        dueDate: '2024-03-28T00:00:00Z',
        status: 'pending',
        createdAt: '2024-03-12T11:45:00Z'
    }
]

export default function FinanceBillingPage() {
    const [invoiceList, setInvoiceList] = useState(invoices)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)

    const totalOutstanding = invoiceList
        .filter(i => i.status === 'pending' || i.status === 'overdue')
        .reduce((sum, i) => sum + i.amount, 0)

    const overdueAmount = invoiceList
        .filter(i => i.status === 'overdue')
        .reduce((sum, i) => sum + i.amount, 0)

    const collectedThisMonth = invoiceList
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.amount, 0)

    const handleCreateInvoice = (newInvoice: any) => {
        const inv = {
            id: `INV-2024-${String(invoiceList.length + 1).padStart(3, '0')}`,
            ...newInvoice,
            status: 'pending',
            createdAt: new Date().toISOString()
        }
        setInvoiceList([inv, ...invoiceList])
        setIsCreateInvoiceOpen(false)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Invoices</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage invoices, payments, and billing cycles</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button>
                    <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateInvoiceOpen(true)}>Create Invoice</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KPICard
                    title="Total Outstanding"
                    value={formatCurrency(totalOutstanding)}
                    trend={{ value: 12.5, direction: 'up' }}
                    icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
                    variant="orange"
                />
                <KPICard
                    title="Collected This Month"
                    value={formatCurrency(collectedThisMonth)}
                    trend={{ value: 8.2, direction: 'up' }}
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    variant="emerald"
                />
                <KPICard
                    title="Overdue Amount"
                    value={formatCurrency(overdueAmount)}
                    trend={{ value: 5.4, direction: 'down' }}
                    icon={<Clock className="w-5 h-5 text-rose-500" />}
                    variant="red"
                />
            </div>

            {/* Filters */}
            {/* Filters */}
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                    />
                </div>
            </div>

            <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest w-48 border-b border-slate-600 border-r border-slate-600">Invoice ID</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Customer</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Type</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Amount</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Due Date</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {invoiceList.map(inv => {
                            const status = statusConfig[inv.status as keyof typeof statusConfig]
                            return (
                                <tr
                                    key={inv.id}
                                    className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                    onClick={() => setSelectedInvoice(inv)}
                                >
                                    <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                        <span className="text-sm font-bold text-primary-600 group-hover:underline decoration-2 underline-offset-4">{inv.id}</span>
                                    </td>
                                    <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-medium">
                                                {getInitials(inv.customer)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{inv.customer}</p>
                                                <p className="text-xs text-slate-500">{inv.loanId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700 text-center">{typeConfig[inv.type as keyof typeof typeConfig]}</td>
                                    <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(inv.amount)}</span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700 text-center">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700 text-center">
                                        <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm inline-block min-w-[80px]', status.bgColor, status.color)}>{status.label}</span>
                                    </td>
                                    <td className="px-4 py-4 border-slate-300 dark:border-slate-700 text-center">
                                        <div className="flex items-center justify-center gap-1 mx-auto">
                                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm" onClick={(e) => { e.stopPropagation(); console.log('Download', inv.id) }}><Download className="w-4 h-4 text-slate-400" /></button>
                                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm" onClick={(e) => { e.stopPropagation(); console.log('Send', inv.id) }}><Send className="w-4 h-4 text-slate-400" /></button>
                                            {inv.status === 'pending' && <Button size="sm" variant="primary" className="h-7 px-2 text-xs" onClick={(e) => {
                                                e.stopPropagation()
                                                if (confirm(`Mark invoice ${inv.id} as paid?`)) {
                                                    console.log('Marking as paid', inv.id)
                                                    // In a real app we would update state here
                                                }
                                            }}>Pay</Button>}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <CreateInvoiceModal
                isOpen={isCreateInvoiceOpen}
                onClose={() => setIsCreateInvoiceOpen(false)}
                onSave={handleCreateInvoice}
            />

            {/* Invoice Details Drawer */}
            <SideDrawer
                isOpen={!!selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                title="Invoice Details"
                subtitle={`Ref: ${selectedInvoice?.id}`}
                size="lg"
                variant="SD_T1"
                icon={<FileText className="w-6 h-6 text-blue-600" />}
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
                        <div className="relative overflow-hidden rounded-none border border-white/10 shadow-lg group bg-slate-950">
                            <div className={cn(
                                "absolute inset-0 opacity-20 transition-opacity duration-300",
                                selectedInvoice.status === 'paid' ? 'bg-gradient-to-br from-emerald-500 to-teal-900' :
                                    selectedInvoice.status === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-900' :
                                        'bg-gradient-to-br from-rose-500 to-red-900'
                            )} />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Invoice Status</p>
                                    <h3 className={cn(
                                        "text-2xl font-black uppercase tracking-tight",
                                        selectedInvoice.status === 'paid' ? 'text-emerald-400' :
                                            selectedInvoice.status === 'pending' ? 'text-amber-400' :
                                                'text-rose-400'
                                    )}>{statusConfig[selectedInvoice.status as keyof typeof statusConfig].label}</h3>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-full border-2 backdrop-blur-md",
                                    selectedInvoice.status === 'paid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                        selectedInvoice.status === 'pending' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                                            'border-rose-500/30 bg-rose-500/10 text-rose-400'
                                )}>
                                    {selectedInvoice.status === 'paid' ? <CheckCircle2 className="w-6 h-6" /> :
                                        selectedInvoice.status === 'overdue' ? <Clock className="w-6 h-6" /> :
                                            <AlertCircle className="w-6 h-6" />}
                                </div>
                            </div>
                        </div>

                        {/* Financials Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-none border border-emerald-400/20 bg-emerald-500 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <CreditCard className="w-12 h-12 text-emerald-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl" />
                                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-2">Total Amount</p>
                                <p className="text-2xl font-mono font-black relative z-10">{formatCurrency(selectedInvoice.amount)}</p>
                            </div>
                            <div className="rounded-none border border-violet-400/20 bg-violet-600 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <FileText className="w-12 h-12 text-violet-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-violet-400/20 rounded-full blur-xl" />
                                <p className="text-violet-100 text-[10px] font-bold uppercase tracking-widest mb-2">Loan Reference</p>
                                <p className="text-xl font-mono font-black relative z-10 truncate">{selectedInvoice.loanId}</p>
                            </div>
                        </div>

                        {/* Bill To Info */}
                        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Bill To</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                        {getInitials(selectedInvoice.customer)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wide text-sm">{selectedInvoice.customer}</p>
                                        <p className="text-xs text-slate-500">Customer ID: CUST-{selectedInvoice.loanId.split('-')[2]}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                                    <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Billing Address</p>
                                    <p>123, Main Street, Andheri West</p>
                                    <p>Mumbai, Maharashtra, 400053</p>
                                    <p className="text-slate-400">India</p>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Breakdown */}
                        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Invoice Details</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Invoice Date</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Due Date</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Type</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                                        {typeConfig[selectedInvoice.type as keyof typeof typeConfig] || selectedInvoice.type}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
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
                    </div>
                )}
            </SideDrawer>
        </div >
    )
}
