import { Loan } from '../types';
import { Button } from '@/components/ui/Button';
import {
    XCircle, Clock, FileText, Banknote,
    MoreHorizontal, BadgeCheck, Lock, Download
} from 'lucide-react';
import { useState } from 'react';

interface LoanActionToolbarProps {
    loan: Loan;
    onAction: (action: string, payload?: any) => void;
}

export function LoanActionToolbar({ loan, onAction }: LoanActionToolbarProps) {
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    // Common Button Styles
    const baseBtn = "h-9 px-4 text-xs font-bold uppercase tracking-wider rounded-none flex items-center gap-2 border-r border-slate-200 dark:border-white/10 last:border-r-0 transition-all";

    const handleInstantApprove = () => {
        // Validation will be handled inside the modal
        onAction('approve_instant');
    };

    const renderPendingActions = () => (
        <>
            <Button variant="primary" className={`${baseBtn} bg-emerald-600 hover:bg-emerald-700 text-white`} onClick={handleInstantApprove}>
                <BadgeCheck className="w-4 h-4" /> Instant Approve
            </Button>
            <Button variant="secondary" className={`${baseBtn} bg-blue-600 hover:bg-blue-700 text-white`} onClick={() => onAction('approve_schedule')}>
                <Clock className="w-4 h-4" /> Approve (24h)
            </Button>
            <Button variant="ghost" className={`${baseBtn} text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`} onClick={() => onAction('reject')}>
                <XCircle className="w-4 h-4" /> Reject
            </Button>
            <Button variant="ghost" className={`${baseBtn} text-slate-600 dark:text-slate-400`} onClick={() => onAction('request_info')}>
                Request Info
            </Button>
        </>
    );

    const renderApprovedActions = () => {
        const isScheduled = loan.approvalWindow?.approvalType === 'scheduled_24h' && loan.approvalWindow?.notificationStatus === 'waiting';
        // const expiresAt = loan.approvalWindow?.expiresAt ? new Date(loan.approvalWindow.expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Simple countdown mock (in real app, use a hook)
        const timeRemaining = "23H 45M";

        return (
            <>
                {isScheduled && (
                    <div className="flex items-center px-4 gap-2 text-xs font-bold text-amber-600 dark:text-amber-500 border-r border-slate-200 dark:border-white/10 bg-amber-50 dark:bg-amber-900/10 h-full">
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        <span>Autosending in {timeRemaining}</span>
                    </div>
                )}
                <Button variant="primary" className={`${baseBtn} bg-emerald-600 hover:bg-emerald-700 text-white`} onClick={() => onAction('download_pdf')}>
                    <Download className="w-4 h-4" /> Download PDF
                </Button>
                <Button variant="ghost" className={`${baseBtn} text-red-600 hover:bg-red-50`} onClick={() => onAction('cancel_approval')}>
                    Cancel Approval
                </Button>
                <Button variant="ghost" className={baseBtn} onClick={() => onAction('edit_terms')}>
                    Edit Terms
                </Button>
            </>
        );
    };

    const renderActiveActions = () => (
        <>
            <Button variant="primary" className={`${baseBtn} bg-emerald-600 hover:bg-emerald-700 text-white`} onClick={() => onAction('download_pdf')}>
                <Download className="w-4 h-4" /> Download PDF
            </Button>
            <Button variant="primary" className={`${baseBtn} bg-indigo-600 hover:bg-indigo-700 text-white`} onClick={() => onAction('add_payment')}>
                <Banknote className="w-4 h-4" /> Add Payment
            </Button>
            <Button variant="ghost" className={`${baseBtn} text-slate-700 dark:text-slate-300`} onClick={() => onAction('close_loan')}>
                <Lock className="w-4 h-4" /> Close Loan
            </Button>
            <Button variant="ghost" className={baseBtn} onClick={() => onAction('restructure')}>
                Restructure
            </Button>
            <Button variant="ghost" className={baseBtn} onClick={() => onAction('statement')}>
                <FileText className="w-4 h-4" /> Statement
            </Button>
        </>
    );

    const renderCompletedActions = () => (
        <>
            <Button variant="primary" className={`${baseBtn} bg-emerald-600 hover:bg-emerald-700 text-white`} onClick={() => onAction('download_pdf')}>
                <Download className="w-4 h-4" /> Download PDF
            </Button>
            <Button variant="ghost" className={baseBtn} onClick={() => onAction('download_noc')}>
                <BadgeCheck className="w-4 h-4 text-emerald-600" /> NOC
            </Button>
            <Button variant="ghost" className={baseBtn} onClick={() => onAction('final_statement')}>
                <FileText className="w-4 h-4" /> Final Ledger
            </Button>
        </>
    );

    return (
        <div className="flex items-center h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10">
            {loan.status === 'pending' && renderPendingActions()}
            {loan.status === 'under-review' && renderPendingActions()}
            {loan.status === 'approved' && renderApprovedActions()}
            {loan.status === 'ongoing' && renderActiveActions()}
            {loan.status === 'completed' && renderCompletedActions()}

            {/* Overflow Menu */}
            <div className="relative h-full">
                <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="h-full px-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center border-l border-slate-200 dark:border-white/10"
                >
                    <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </button>

                {showMoreMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-white/10 z-20 py-1 rounded-sm animate-fade-in-up origin-top-right">
                            <button
                                onClick={() => { onAction('download_loan_details'); setShowMoreMenu(false); }}
                                className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                            >
                                <Download className="w-3.5 h-3.5" /> Download Loan Details
                            </button>
                            <button
                                onClick={() => { onAction('view_audit_log'); setShowMoreMenu(false); }}
                                className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                            >
                                <FileText className="w-3.5 h-3.5" /> Audit Log
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                            <button
                                onClick={() => { onAction('cancel_approval'); setShowMoreMenu(false); }}
                                className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600"
                            >
                                <XCircle className="w-3.5 h-3.5" /> Cancel / Reject
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
