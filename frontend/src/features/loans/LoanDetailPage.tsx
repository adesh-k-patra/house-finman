import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn, formatCurrency, getInitials } from '@/utils';
import { Loan, LoanDocument } from './types';
import {
    ArrowLeft,
    MessageCircle,
    User,
    FileText,
    Banknote,
    Calendar,
    Briefcase,
    ShieldAlert,
    Building2,
    BadgeCheck,
    Shield,
    BarChart3,
    Settings,
    Users,
    Clock
} from 'lucide-react';
import { mockLoans } from './dummyData';
import {
    LoanOverviewTab,
    LoanDocumentsTab,
    LoanPaymentsTab,
    LoanCalendarTab
} from './components';
import { LoanActionToolbar } from './components/LoanActionToolbar';
import { LoanActionModals } from './components/LoanActionModals';
import { LoanBorrowerProfileTab } from './components/LoanBorrowerProfileTab';
import { LoanTimelineTab } from './components/LoanTimelineTab';
import { LoanNotesTab } from './components/LoanNotesTab';
import { LoanKYCComplianceTab } from './components/LoanKYCComplianceTab';
import { LoanCollateralGuarantorTab } from './components/LoanCollateralGuarantorTab';
import { LoanRiskDashboardTab } from './components/LoanRiskDashboardTab';
import { LoanSettingsTab } from './components/LoanSettingsTab';
import { LoanAgreementsTab } from './components/LoanAgreementsTab';
import { LoanApproverTab } from './components/LoanApproverTab';

import { PDFGenerator } from './utils/PDFGenerator';
import { KPICard } from '@/components/ui/KPICard';

// ... (imports remain)

export function LoanDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [actionPayload, setActionPayload] = useState<any>(null);

    // State for Loan Data
    const [loan, setLoan] = useState<Loan | null>(null);

    useEffect(() => {
        const found = mockLoans.find(l => l.id === id || l.referenceId === id) || mockLoans[0];
        setLoan(found);
    }, [id]);

    if (!loan) return null;

    const handleAction = (action: string, payload?: any) => {
        console.log(`Action triggered: ${action}`, payload);

        // PDF Generation Actions (Client-side)
        if (action === 'statement' || action === 'final_statement') {
            PDFGenerator.generateStatement(loan);
            return;
        }
        if (action === 'download_noc') {
            PDFGenerator.generateNOC(loan);
            return;
        }
        if (action === 'download_loan_details') {
            PDFGenerator.generateLoanDetails(loan);
            return;
        }

        setActionPayload(payload || null);
        setActiveAction(action);
    };

    const handleConfirmAction = (action: string, data: any) => {
        console.log('Confirmed:', action, data);

        // DOCUMENT VALIDATION LOGIC
        if (action === 'view_document') {
            const { action: decision } = data; // 'verify', 'reject', 'review'
            const docToUpdate = actionPayload; // The document object passed originally

            if (docToUpdate) {
                setLoan((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        documents: prev.documents.map((d: LoanDocument) =>
                            d.id === docToUpdate.id
                                ? { ...d, status: decision === 'verify' ? 'verified' : decision === 'reject' ? 'rejected' : 'review' }
                                : d
                        )
                    };
                });
            }
        }

        // Here we would call the API
        setActiveAction(null);
        setActionPayload(null);
    };

    // Conditional Tabs
    const showCalendar = loan.status === 'ongoing' || loan.status === 'approved';
    const showRisk = loan.status !== 'completed';
    const showSettings = loan.status === 'ongoing' || loan.status === 'approved';

    const tabs = [
        { key: 'overview', label: 'Overview', icon: User },
        { key: 'borrower', label: 'Borrower', icon: Users },
        { key: 'approver', label: 'Approver', icon: User },
        ...(showCalendar ? [{ key: 'calendar', label: 'Calendar', icon: Calendar }] : []),
        { key: 'timeline', label: 'Timeline', icon: Clock },
        { key: 'documents', label: 'Documents', icon: FileText },
        { key: 'payments', label: 'Ledger', icon: Banknote },
        { key: 'notes', label: 'Notes', icon: MessageCircle },
        { key: 'kyc', label: 'KYC', icon: Shield },
        { key: 'collateral', label: 'Collateral', icon: Building2 },
        ...(showRisk ? [{ key: 'risk', label: 'Risk', icon: BarChart3 }] : []),
        { key: 'agreements', label: 'Agreements', icon: FileText },
        ...(showSettings ? [{ key: 'settings', label: 'Settings', icon: Settings }] : []),
    ];

    return (
        <div className="animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
            {/* Top Navigation Bar - Sticky & Sharp */}
            <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between pl-6 pr-0 h-[50px]">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/loans')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-primary-600 transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                        <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">{loan.referenceId}</span>

                        {/* Status Badge in Header */}
                        <span className={cn(
                            'px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm ml-2',
                            loan.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                            loan.status === 'approved' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                            loan.status === 'ongoing' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                            loan.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                            loan.status === 'under-review' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                            loan.status === 'rejected' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                        )}>
                            {loan.status.replace('-', ' ')}
                        </span>
                    </div>

                    <div className="flex items-center h-full">
                        <LoanActionToolbar loan={loan} onAction={handleAction} />
                    </div>
                </div>
            </div>

            {/* Hero Section - Full Width, Gradient, Sharp */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-4 relative overflow-hidden shrink-0 group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-4 h-full">

                    {/* Left: Identity */}
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-none bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl ring-1 ring-white/10">
                            <span className="text-3xl font-black text-white/90">{getInitials(loan.borrower.name)}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1.5">
                                <h1 className="text-3xl font-black text-white tracking-tight leading-none">{loan.borrower.name}</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 mb-3">
                                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-500" /> {loan.borrower.employmentType} @ {loan.borrower.employerName}</span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-emerald-400" /> {loan.type} Loan</span>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2">
                                {loan.riskTags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] uppercase font-bold tracking-wider backdrop-blur-md flex items-center gap-1">
                                        <ShieldAlert className="w-3 h-3" /> {tag}
                                    </span>
                                ))}
                                {loan.borrower.kycStatus === 'verified' && (
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-bold tracking-wider backdrop-blur-md flex items-center gap-1">
                                        <BadgeCheck className="w-3 h-3" /> KYC Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Key Metrics & Manager */}
                    <div className="flex gap-4">
                        <KPICard
                            title="Principal"
                            value={formatCurrency(loan.financials.principalAmount, true)}
                            variant="royal"
                            icon={Banknote}
                            compact
                            className="min-w-[140px]"
                        />
                        {loan.status === 'ongoing' && (
                            <KPICard
                                title="Outstanding"
                                value={formatCurrency(loan.financials.outstandingBalance, true)}
                                variant="emerald"
                                icon={Activity}
                                compact
                                className="min-w-[140px]"
                            />
                        )}
                        <KPICard
                            title="Rate"
                            value={`${loan.financials.interestRate}%`}
                            variant="violet"
                            icon={BarChart3}
                            compact
                            className="min-w-[100px]"
                        />
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-[50px] z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="flex items-center px-8 gap-4 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'group flex items-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap',
                                activeTab === tab.key
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                            )}
                        >
                            <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.key ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
                            {tab.label}
                            {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area - Fit to Borders */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-0 overflow-y-auto custom-scrollbar">
                <div className="w-full pt-6">
                    {activeTab === 'overview' && <div className="animate-fade-in"><LoanOverviewTab loan={loan} /></div>}
                    {activeTab === 'borrower' && <div className="animate-fade-in"><LoanBorrowerProfileTab loan={loan} /></div>}
                    {activeTab === 'approver' && <div className="animate-fade-in"><LoanApproverTab loan={loan} /></div>}
                    {activeTab === 'calendar' && showCalendar && <div className="animate-fade-in"><LoanCalendarTab loan={loan} /></div>}
                    {activeTab === 'timeline' && <div className="animate-fade-in"><LoanTimelineTab loan={loan} /></div>}
                    {activeTab === 'documents' && <div className="animate-fade-in"><LoanDocumentsTab loan={loan} onAction={handleAction} /></div>}
                    {activeTab === 'payments' && <div className="animate-fade-in"><LoanPaymentsTab loan={loan} onAction={handleAction} /></div>}
                    {activeTab === 'notes' && <div className="animate-fade-in"><LoanNotesTab loan={loan} /></div>}
                    {activeTab === 'kyc' && <div className="animate-fade-in"><LoanKYCComplianceTab loan={loan} /></div>}
                    {activeTab === 'collateral' && <div className="animate-fade-in"><LoanCollateralGuarantorTab loan={loan} /></div>}
                    {activeTab === 'risk' && showRisk && <div className="animate-fade-in"><LoanRiskDashboardTab loan={loan} /></div>}
                    {activeTab === 'agreements' && <div className="animate-fade-in"><LoanAgreementsTab loan={loan} /></div>}
                    {activeTab === 'settings' && showSettings && <div className="animate-fade-in"><LoanSettingsTab loan={loan} /></div>}
                </div>
            </div>

            {/* Action Modals */}
            <LoanActionModals
                loan={loan}
                activeAction={activeAction}
                payload={actionPayload}
                onClose={() => { setActiveAction(null); setActionPayload(null); }}
                onConfirm={handleConfirmAction}
            />
        </div>
    );
}
