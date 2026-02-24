import { Loan } from '../types';
import { formatCurrency } from '@/utils';

interface LoanDetailsTabProps {
    loan: Loan;
}

const DetailRow = ({ label, value, isCurrency = false }: { label: string, value: string | number | undefined, isCurrency?: boolean }) => (
    <div className="flex flex-col p-4 bg-white dark:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">
            {isCurrency && typeof value === 'number' ? formatCurrency(value) : value || '-'}
        </span>
    </div>
);

export function LoanDetailsTab({ loan }: LoanDetailsTabProps) {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Financial Details Section */}
            <div>
                <div className="bg-slate-950 px-6 py-3 border-b border-white/10 mb-px">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Financial Structure</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                    <DetailRow label="Principal Amount" value={loan.financials.principalAmount} isCurrency />
                    <DetailRow label="Outstanding Balance" value={loan.financials.outstandingBalance} isCurrency />
                    <DetailRow label="Interest Rate" value={`${loan.financials.interestRate}%`} />
                    <DetailRow label="Rate Type" value={loan.financials.interestType} />

                    <DetailRow label="Tenure" value={`${loan.financials.termMonths} Months`} />
                    <DetailRow label="Start Date" value={loan.financials.startDate ? new Date(loan.financials.startDate).toLocaleDateString() : '-'} />
                    <DetailRow label="End Date" value={loan.financials.endDate ? new Date(loan.financials.endDate).toLocaleDateString() : '-'} />
                    <DetailRow label="EMI Amount" value={loan.financials.emiAmount} isCurrency />
                </div>
            </div>

            {/* Repayment Details */}
            <div>
                <div className="bg-slate-950 px-6 py-3 border-b border-white/10 mb-px">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Repayment Terms</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                    <DetailRow label="Method" value={loan.financials.repaymentMethod} />
                    <DetailRow label="Frequency" value={loan.financials.repaymentFrequency} />
                    <DetailRow label="Next Due Date" value={loan.financials.nextDueDate ? new Date(loan.financials.nextDueDate).toLocaleDateString() : '-'} />
                </div>
            </div>

            {/* Borrower Details (Expanded) */}
            <div>
                <div className="bg-slate-950 px-6 py-3 border-b border-white/10 mb-px">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Borrower Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                    <DetailRow label="Full Name" value={loan.borrower.name} />
                    <DetailRow label="Email Address" value={loan.borrower.email} />
                    <DetailRow label="Phone" value={loan.borrower.phone} />
                    <DetailRow label="Employment" value={loan.borrower.employmentType} />
                    <DetailRow label="Employer" value={loan.borrower.employerName} />
                    <DetailRow label="Annual Income" value={loan.borrower.annualIncome} isCurrency />
                </div>
            </div>

            {/* System Metadata */}
            <div>
                <div className="bg-slate-950 px-6 py-3 border-b border-white/10 mb-px">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">System Metadata</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                    <DetailRow label="Loan ID" value={loan.id} />
                    <DetailRow label="Reference ID" value={loan.referenceId} />
                    <DetailRow label="Assigned Officer" value={loan.assignedOfficer} />
                    <DetailRow label="Created Date" value={new Date(loan.requestDate).toLocaleDateString()} />
                </div>
            </div>
        </div>
    );
}
