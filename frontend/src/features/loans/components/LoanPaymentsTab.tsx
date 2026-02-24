import { useState } from 'react';
import { Loan } from '../types';
import { Button } from '@/components/ui/Button';
import { KPICard } from '@/components/ui/KPICard';
import { cn, formatCurrency } from '@/utils';
import { Banknote, Clock, Download, Plus, Edit3, XCircle, CheckCircle2, CreditCard } from 'lucide-react';

interface LoanPaymentsTabProps {
    loan: Loan;
    onAction?: (action: string, payload?: any) => void;
}

export function LoanPaymentsTab({ loan, onAction }: LoanPaymentsTabProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

    // Generate mock amortization schedule if empty (for demo)
    // In real app, this would come from backend
    const mockSchedule = Array.from({ length: 12 }).map((_, i) => ({
        no: i + 1,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + i)).toISOString(),
        principal: Math.round(loan.financials.emiAmount * 0.7),
        interest: Math.round(loan.financials.emiAmount * 0.3),
        total: loan.financials.emiAmount,
        balance: loan.financials.principalAmount - (loan.financials.emiAmount * i),
        status: i === 0 ? 'paid' : i === 1 ? 'due' : 'upcoming'
    }));

    const handleTransactionClick = (tx: any) => {
        setSelectedTransaction(tx.id);
        onAction?.('edit_payment', { transaction: tx });
    };

    const handleAddPayment = (emiNo?: number) => {
        onAction?.('add_payment', { emiNo });
    };

    return (
        <div className="grid grid-cols-12 gap-8">

            {/* Left Column: Payment Tables */}
            <div className="col-span-12 lg:col-span-8 space-y-8">

                {/* Recent Transactions Table */}
                <div>
                    <div className="bg-slate-950 px-6 py-3 border-b border-white/10 mb-px flex justify-between items-center">
                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-emerald-400" /> Recent Transactions
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/10 text-[10px] uppercase font-bold"
                            leftIcon={<Plus className="w-3.5 h-3.5" />}
                            onClick={() => handleAddPayment()}
                        >
                            Add Payment
                        </Button>
                    </div>
                    {loan.paymentHistory.length > 0 ? (
                        <div className="overflow-x-auto ring-1 ring-slate-900/5 bg-white dark:bg-slate-900">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-800 border-b border-slate-700">
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">Date</th>
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">Ref ID</th>
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">Type</th>
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">Method</th>
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-right">Amount</th>
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-center">Status</th>
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-right">Receipt</th>
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loan.paymentHistory.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            className={cn(
                                                "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer",
                                                selectedTransaction === tx.id && "bg-primary-50 dark:bg-primary-900/20"
                                            )}
                                            onClick={() => handleTransactionClick(tx)}
                                        >
                                            <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-300">{tx.date}</td>
                                            <td className="px-6 py-4 text-xs font-mono text-slate-500">{tx.referenceId}</td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-700 dark:text-slate-200 capitalize">{tx.type}</td>
                                            <td className="px-6 py-4 text-xs text-slate-500">{tx.instrument}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white text-right font-mono">{formatCurrency(tx.amount)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide",
                                                    tx.status === 'completed' && "bg-emerald-50 text-emerald-600 border border-emerald-100",
                                                    tx.status === 'failed' && "bg-red-50 text-red-600 border border-red-100",
                                                    tx.status === 'reversed' && "bg-amber-50 text-amber-600 border border-amber-100",
                                                    !['completed', 'failed', 'reversed'].includes(tx.status) && "bg-slate-50 text-slate-600 border border-slate-100"
                                                )}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-primary-600">
                                                    <Download className="w-3.5 h-3.5" />
                                                </Button>
                                            </td>
                                            <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-slate-400 hover:text-primary-600"
                                                        onClick={() => handleTransactionClick(tx)}
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    {tx.status === 'completed' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
                                                            onClick={() => onAction?.('reject_payment', { transaction: tx })}
                                                        >
                                                            <XCircle className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 p-8 text-center border border-slate-200 dark:border-slate-800">
                            <p className="text-sm text-slate-500">No recent transactions found.</p>
                        </div>
                    )}
                </div>

                {/* Repayment Schedule Table */}
                <div>
                    <div className="bg-slate-950 px-6 py-3 border-b border-white/10 mb-px flex justify-between items-center">
                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" /> Repayment Schedule
                        </h3>
                    </div>
                    <div className="overflow-x-auto ring-1 ring-slate-900/5 bg-white dark:bg-slate-900">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800 border-b border-slate-700">
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">Period</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">Due Date</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-right">Principal</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-right">Interest</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-right">Total EMI</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-right">Balance</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-center">Status</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {mockSchedule.map((row) => (
                                    <tr key={row.no} className={cn(
                                        "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                                        row.status === 'due' && "bg-amber-50/30 dark:bg-amber-900/10"
                                    )}>
                                        <td className="px-6 py-3 text-xs font-mono text-slate-500">#{row.no}</td>
                                        <td className="px-6 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">{new Date(row.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-xs text-slate-500 text-right font-mono">{formatCurrency(row.principal)}</td>
                                        <td className="px-6 py-3 text-xs text-slate-500 text-right font-mono">{formatCurrency(row.interest)}</td>
                                        <td className="px-6 py-3 text-xs font-bold text-slate-900 dark:text-white text-right font-mono">{formatCurrency(row.total)}</td>
                                        <td className="px-6 py-3 text-xs text-slate-500 text-right font-mono">{formatCurrency(row.balance)}</td>
                                        <td className="px-6 py-3 text-center">
                                            <span className={cn(
                                                "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm flex items-center justify-center gap-1 w-fit mx-auto",
                                                row.status === 'paid' && "bg-emerald-100 text-emerald-700",
                                                row.status === 'due' && "bg-amber-100 text-amber-700",
                                                row.status === 'upcoming' && "bg-slate-100 text-slate-500"
                                            )}>
                                                {row.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {row.status !== 'paid' && (
                                                <Button
                                                    variant={row.status === 'due' ? 'primary' : 'outline'}
                                                    size="sm"
                                                    className={cn(
                                                        "text-[9px] uppercase font-bold h-6 px-2",
                                                        row.status === 'due' && "bg-emerald-600 hover:bg-emerald-700"
                                                    )}
                                                    onClick={() => handleAddPayment(row.no)}
                                                >
                                                    {row.status === 'due' ? 'Pay Now' : 'Pay'}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Right Column: Summary Cards - Redesigned with Premium KPICards */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
                <KPICard
                    title="Total Paid"
                    value={formatCurrency(loan.financials.principalAmount - loan.financials.outstandingBalance)}
                    variant="emerald"
                    icon={Banknote}
                    subtitle="25% Completed"
                    trend={{
                        value: '25%',
                        direction: 'up',
                        label: 'Progress'
                    }}
                />

                <KPICard
                    title="Payment Method"
                    value="Auto-Debit (HDFC)"
                    variant="blue"
                    icon={CreditCard}
                    subtitle="**** 8832 | ACH"
                />

                <KPICard
                    title="Next Invoice"
                    value={formatCurrency(loan.financials.emiAmount)}
                    variant="purple"
                    icon={Clock}
                    subtitle="Due: Nov 2023"
                />

                <div className="pt-2">
                    <Button
                        variant="primary"
                        size="md"
                        className="w-full text-xs uppercase font-bold py-4"
                        onClick={() => handleAddPayment()}
                    >
                        Make Individual Payment
                    </Button>
                </div>
            </div>

        </div>
    );
}
