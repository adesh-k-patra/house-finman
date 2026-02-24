import { Loan } from '../types';
import { formatCurrency, getInitials, cn } from '@/utils';
import { KPICard } from '@/components/ui/KPICard';
import { CheckCircle2, Calendar, Clock, Shield, UserCheck, BadgeCheck, Building2, Phone, Mail, Banknote, Globe } from 'lucide-react';

interface LoanApproverTabProps {
    loan: Loan;
}

export function LoanApproverTab({ loan }: LoanApproverTabProps) {
    // Mock approver data (in real app, this would come from the loan object)
    const approver = {
        id: 'EMP-2024-001',
        name: 'Vikram Malhotra',
        designation: 'Senior Credit Manager',
        department: 'Credit & Underwriting',
        branch: loan.branchName || 'Mumbai Central',
        email: 'vikram.malhotra@housefinman.com',
        phone: '+91 98765 43210',
        approvedAt: loan.approvedAt || new Date().toISOString(),
        creditCommittee: true,
        approvalNotes: 'Application meets all credit criteria. Collateral valuation verified. Recommend for disbursement.',
        sanctionedAmount: loan.financials.sanctionedAmount || loan.financials.principalAmount,
        conditions: [
            'Property insurance to be obtained before disbursement',
            'Post-dated cheques for 12 months',
            'Salary account mandate to be submitted'
        ]
    };

    const isApproved = loan.status === 'approved' || loan.status === 'ongoing' || loan.status === 'completed';

    return (
        <div className="space-y-6 animate-fade-in p-6">
            {/* Approval Status Banner */}
            <div className={cn(
                "p-6 border backdrop-blur-sm",
                isApproved
                    ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30"
                    : "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30"
            )}>
                <div className="flex items-start gap-4">
                    {isApproved ? (
                        <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-amber-500 flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className={cn(
                            "text-lg font-bold",
                            isApproved ? "text-emerald-800 dark:text-emerald-400" : "text-amber-800 dark:text-amber-400"
                        )}>
                            {isApproved ? 'Loan Approved' : 'Pending Approval'}
                        </h3>
                        <p className={cn(
                            "text-sm mt-1",
                            isApproved ? "text-emerald-700/80 dark:text-emerald-400/80" : "text-amber-700/80 dark:text-amber-400/80"
                        )}>
                            {isApproved
                                ? `Sanctioned amount of ${formatCurrency(approver.sanctionedAmount)} approved on ${new Date(approver.approvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                : 'This application is currently under review by the credit team.'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {isApproved && (
                <>
                    {/* Approver Profile Card */}
                    <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start gap-6">
                                {/* Avatar */}
                                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0">
                                    <span className="text-2xl font-black text-white">{getInitials(approver.name)}</span>
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-xl font-bold text-white">{approver.name}</h4>
                                        {approver.creditCommittee && (
                                            <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                <BadgeCheck className="w-3 h-3" /> Credit Committee
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3">{approver.designation} • {approver.department}</p>

                                    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5" /> {approver.branch}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5" /> {approver.email}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5" /> {approver.phone}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Approval Timeline */}
                        <div className="border-t border-slate-800 grid grid-cols-3 divide-x divide-slate-800">
                            <div className="p-4 text-center">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Approved On</p>
                                <p className="text-sm font-bold text-white flex items-center justify-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-400" />
                                    {new Date(approver.approvedAt).toLocaleDateString('en-IN')}
                                </p>
                            </div>
                            <div className="p-4 text-center">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Time</p>
                                <p className="text-sm font-bold text-white flex items-center justify-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    {new Date(approver.approvedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="p-4 text-center">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Employee ID</p>
                                <p className="text-sm font-bold text-white font-mono">{approver.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sanctioned Terms - Redesigned with Premium KPICards */}
                    <div>
                        <div className="bg-slate-950 px-6 py-3 border-b border-white/10 mb-px">
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Sanctioned Terms</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                            <KPICard
                                title="Sanctioned Amount"
                                value={formatCurrency(approver.sanctionedAmount)}
                                variant="emerald"
                                icon={Building2}
                                compact
                            />
                            <KPICard
                                title="Interest Rate"
                                value={`${loan.financials.interestRate}%`}
                                variant="slate"
                                icon={Globe}
                                compact
                            />
                            <KPICard
                                title="Tenure"
                                value={`${loan.financials.termMonths} Months`}
                                variant="slate"
                                icon={Calendar}
                                compact
                            />
                            <KPICard
                                title="Monthly EMI"
                                value={formatCurrency(loan.financials.emiAmount)}
                                variant="slate"
                                icon={Banknote}
                                compact
                            />
                        </div>
                    </div>

                    {/* Approval Conditions */}
                    <div>
                        <div className="bg-slate-950 px-6 py-3 border-b border-white/10 mb-px">
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Pre-Disbursement Conditions</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800">
                            {approver.conditions.map((condition, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-amber-600">{idx + 1}</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{condition}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Approval Notes */}
                    <div>
                        <div className="bg-slate-950 px-6 py-3 border-b border-white/10 mb-px">
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Approval Notes</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex items-start gap-4">
                                <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {approver.approvalNotes}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!isApproved && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCheck className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Awaiting Approval</h4>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        This loan application is currently {loan.status === 'pending' ? 'pending review' : 'under review'} by the credit team.
                        Approver information will be displayed once the application is sanctioned.
                    </p>
                </div>
            )}
        </div>
    );
}
