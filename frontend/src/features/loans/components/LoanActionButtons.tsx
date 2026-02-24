import { Loan } from '../types';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, Clock, ArrowUpRight, Ban, FileText, Banknote } from 'lucide-react';

interface LoanActionButtonsProps {
    loan: Loan;
    onAction: (action: string) => void;
}

export function LoanActionButtons({ loan, onAction }: LoanActionButtonsProps) {
    const buttonClass = "rounded-none h-10 px-6 font-bold uppercase tracking-wide text-xs shadow-sm border-r last:border-r-0 border-slate-200 dark:border-white/10";

    switch (loan.status) {
        case 'pending':
            return (
                <div className="flex items-center">
                    <Button variant="primary" className={`${buttonClass} bg-green-600 hover:bg-green-700 text-white`} onClick={() => onAction('Accept')}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Accept
                    </Button>
                    <Button variant="ghost" className={`${buttonClass} text-red-600 hover:bg-red-50`} onClick={() => onAction('Reject')}>
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button variant="ghost" className={buttonClass} onClick={() => onAction('Mark for Review')}>
                        <Clock className="w-4 h-4 mr-2" /> Review
                    </Button>
                </div>
            );
        case 'under-review':
            return (
                <div className="flex items-center">
                    <Button variant="primary" className={buttonClass} onClick={() => onAction('Approve')}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button variant="ghost" className={buttonClass} onClick={() => onAction('Return to Pending')}>
                        Return to Pending
                    </Button>
                    <Button variant="ghost" className={`${buttonClass} text-orange-600 hover:bg-orange-50`} onClick={() => onAction('Escalate')}>
                        <ArrowUpRight className="w-4 h-4 mr-2" /> Escalate
                    </Button>
                </div>
            );
        case 'ongoing': // Approved/Active
            return (
                <div className="flex items-center">
                    <Button variant="primary" className={buttonClass} onClick={() => onAction('Disburse')}>
                        <Banknote className="w-4 h-4 mr-2" /> Disburse
                    </Button>
                    <Button variant="ghost" className={buttonClass} onClick={() => onAction('Modify Terms')}>
                        <FileText className="w-4 h-4 mr-2" /> Modify
                    </Button>
                    <Button variant="ghost" className={`${buttonClass} text-yellow-600 hover:bg-yellow-50`} onClick={() => onAction('Pause')}>
                        <Ban className="w-4 h-4 mr-2" /> Pause
                    </Button>
                </div>
            );
        case 'completed':
            return (
                <div className="flex items-center">
                    <Button variant="ghost" className={buttonClass} onClick={() => onAction('Download Statement')}>Statement</Button>
                    <Button variant="ghost" className={buttonClass} onClick={() => onAction('Archive')}>Archive</Button>
                </div>
            );
        case 'rejected':
            return (
                <div className="flex items-center">
                    <Button variant="ghost" className={buttonClass} onClick={() => onAction('Reopen')}>Reopen Application</Button>
                </div>
            );
        default:
            return null;
    }
}
