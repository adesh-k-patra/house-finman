
/**
 * Payments Page for House FinMan
 */

import { useState } from 'react'
import { Search, Download, ArrowUpRight, ArrowDownLeft, Clock, RefreshCw, FileText, CheckCircle2, AlertCircle, DollarSign } from 'lucide-react'
import { Button, SideDrawer, KPICard } from '@/components/ui'
import { cn, formatCurrency } from '@/utils'

type PaymentStatus = 'completed' | 'processing' | 'failed' | 'refunded'

interface Payment {
    id: string
    customer: string
    amount: number
    type: 'incoming' | 'outgoing'
    method: 'bank_transfer' | 'upi' | 'cheque' | 'cash'
    status: PaymentStatus
    date: string
    reference: string
    invoiceId?: string
    notes?: string
}

const payments: Payment[] = [
    { id: 'PAY-2026-001', customer: 'Rahul Sharma', amount: 25000, type: 'incoming', method: 'upi', status: 'completed', date: '2026-01-05T10:30:00', reference: 'UPI/1234567890', invoiceId: 'INV-2026-001', notes: 'Initial booking amount for Green Valley' },
    { id: 'PAY-2026-002', customer: 'Priya Patel', amount: 15000, type: 'incoming', method: 'bank_transfer', status: 'processing', date: '2026-01-05T09:15:00', reference: 'IMPS/9876543210', invoiceId: 'INV-2026-002', notes: 'Legal verification fee' },
    { id: 'PAY-2026-003', customer: 'Vendor Payments', amount: 50000, type: 'outgoing', method: 'bank_transfer', status: 'completed', date: '2026-01-04T16:00:00', reference: 'NEFT/1122334455', notes: 'Monthly maintenance contract payout' },
    { id: 'PAY-2026-004', customer: 'Amit Kumar', amount: 10000, type: 'incoming', method: 'cheque', status: 'failed', date: '2026-01-04T11:20:00', reference: 'CHQ-456123', invoiceId: 'INV-2026-005', notes: 'Cheque bounced due to signature mismatch' },
    { id: 'PAY-2026-005', customer: 'Office Supplies', amount: 2500, type: 'outgoing', method: 'upi', status: 'completed', date: '2026-01-03T14:45:00', reference: 'UPI/5544332211', notes: 'Stationery purchase for Q1' },
]

const statusConfig: Record<PaymentStatus, { label: string; color: string; bgColor: string; icon: any }> = {
    completed: { label: 'Completed', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle2 },
    processing: { label: 'Processing', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: Clock },
    failed: { label: 'Failed', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: AlertCircle },
    refunded: { label: 'Refunded', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-900/30', icon: RefreshCw },
}

import { CreatePayRunModal } from './components/CreatePayRunModal'

export default function FinancePaymentsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
    const [isCreatePayRunOpen, setIsCreatePayRunOpen] = useState(false)

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Transaction history and reconciliation</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="primary" leftIcon={<DollarSign className="w-4 h-4" />} onClick={() => setIsCreatePayRunOpen(true)}>Create Pay Run</Button>
                    <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>Sync</Button>
                    <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard
                    title="Total Volume"
                    value={formatCurrency(payments.reduce((acc, p) => acc + p.amount, 0))}
                    icon={<DollarSign className="w-4 h-4" />}
                    trend={{ value: "+12% vs last month", direction: "up" }}
                    variant="blue"
                />
                <KPICard
                    title="Incoming"
                    value={formatCurrency(payments.filter(p => p.type === 'incoming').reduce((acc, p) => acc + p.amount, 0))}
                    icon={<ArrowDownLeft className="w-4 h-4" />}
                    trend={{ value: "5 transactions", direction: "up" }}
                    variant="emerald"
                />
                <KPICard
                    title="Outgoing"
                    value={formatCurrency(payments.filter(p => p.type === 'outgoing').reduce((acc, p) => acc + p.amount, 0))}
                    icon={<ArrowUpRight className="w-4 h-4" />}
                    trend={{ value: "2 transactions", direction: "neutral" }}
                    variant="orange"
                />
                <KPICard
                    title="Pending Processing"
                    value={payments.filter(p => p.status === 'processing').length}
                    icon={<Clock className="w-4 h-4" />}
                    trend={{ value: "Requires Action", direction: "down" }}
                    variant="purple"
                />
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search payments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10 rounded-sm"
                    />
                </div>
            </div>

            <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest w-48 border-b border-slate-600 border-r border-slate-600">Transaction ID</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Party</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Type</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Amount</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {payments.map((payment) => (
                            <tr
                                key={payment.id}
                                className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                onClick={() => setSelectedPayment(payment)}
                            >
                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                    <span className="text-sm font-bold text-primary-600 group-hover:underline decoration-2 underline-offset-4">{payment.id}</span>
                                </td>
                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{payment.customer}</span>
                                        <span className="text-[10px] text-slate-500 uppercase">{payment.method.replace('_', ' ')} • {payment.reference}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700 text-center">
                                    <div className={cn(
                                        'flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm w-fit mx-auto',
                                        payment.type === 'incoming' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    )}>
                                        {payment.type === 'incoming' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                        {payment.type === 'incoming' ? 'In' : 'Out'}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(payment.amount)}</span>
                                </td>
                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700 text-center">
                                    <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm inline-block min-w-[80px]', statusConfig[payment.status].bgColor, statusConfig[payment.status].color)}>
                                        {statusConfig[payment.status].label}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-center border-slate-300 dark:border-slate-700 text-sm text-slate-500">
                                    <div className="flex items-center justify-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(payment.date).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SideDrawer
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
                title="Transaction Details"
                subtitle={`Transaction ID: ${selectedPayment?.id || ''}`}
                size="lg"
                icon={<FileText className="w-5 h-5 text-blue-600" />}
                variant="SD_T1"
                footer={
                    <>
                        {selectedPayment && (
                            <>
                                <Button variant="secondary" onClick={() => setSelectedPayment(null)}>Close</Button>
                                <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>Download Receipt</Button>
                            </>
                        )}
                    </>
                }
            >
                {selectedPayment && (
                    <div className="space-y-6 pb-4">
                        {/* Status Card - Black */}
                        <div className="relative overflow-hidden rounded-sm border border-white/10 shadow-lg group bg-slate-950">
                            <div className={cn(
                                "absolute inset-0 opacity-20 transition-opacity duration-300",
                                selectedPayment.status === 'completed' ? 'bg-gradient-to-br from-emerald-500 to-teal-900' :
                                    selectedPayment.status === 'processing' ? 'bg-gradient-to-br from-blue-500 to-indigo-900' :
                                        'bg-gradient-to-br from-red-500 to-rose-900'
                            )} />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Transaction Status</p>
                                    <h3 className={cn(
                                        "text-2xl font-black uppercase tracking-tight",
                                        selectedPayment.status === 'completed' ? 'text-emerald-400' :
                                            selectedPayment.status === 'processing' ? 'text-blue-400' :
                                                'text-red-400'
                                    )}>{statusConfig[selectedPayment.status].label}</h3>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-full border-2 backdrop-blur-md",
                                    selectedPayment.status === 'completed' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                        selectedPayment.status === 'processing' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                            'border-red-500/30 bg-red-500/10 text-red-400'
                                )}>
                                    {(() => {
                                        const StatusIcon = statusConfig[selectedPayment.status].icon
                                        return <StatusIcon className="w-6 h-6" />
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Financials Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-sm border border-emerald-400/20 bg-emerald-500 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <DollarSign className="w-12 h-12 text-emerald-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl" />
                                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-2">Txn Amount</p>
                                <p className="text-2xl font-mono font-black relative z-10">{formatCurrency(selectedPayment.amount)}</p>
                            </div>
                            <div className="rounded-sm border border-violet-400/20 bg-violet-600 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <CheckCircle2 className="w-12 h-12 text-violet-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-violet-400/20 rounded-full blur-xl" />
                                <p className="text-violet-100 text-[10px] font-bold uppercase tracking-widest mb-2">Payment Mode</p>
                                <p className="text-xl font-mono font-black relative z-10 capitalize">{selectedPayment.method.replace('_', ' ')}</p>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Payment Particulars</span>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Party Name</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedPayment.customer}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Date</p>
                                        <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{new Date(selectedPayment.date).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Notes</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{selectedPayment.notes || 'No description provided'}"</p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Reference ID</p>
                                        <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{selectedPayment.reference}</p>
                                    </div>
                                    {selectedPayment.invoiceId && (
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Linked Invoice</p>
                                            <p className="text-xs font-mono font-bold text-blue-600 cursor-pointer hover:underline">{selectedPayment.invoiceId}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SideDrawer>

            <CreatePayRunModal isOpen={isCreatePayRunOpen} onClose={() => setIsCreatePayRunOpen(false)} />
        </div >
    )
}
