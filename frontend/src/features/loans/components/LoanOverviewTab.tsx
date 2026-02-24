import { Loan } from '../types';
import { formatCurrency } from '@/utils';
import {
    User, Building, Activity, Calendar,
    CreditCard, Banknote, Briefcase, MapPin, Phone, Mail, FileText,
    Info, Shield, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { KPICard } from '@/components/ui';


interface LoanOverviewTabProps {
    loan: Loan;
}

export function LoanOverviewTab({ loan }: LoanOverviewTabProps) {
    // Helper for Data Items
    const DataItem = ({ label, value, icon: Icon, highlight = false, alert = false }: { label: string, value: React.ReactNode, icon?: any, highlight?: boolean, alert?: boolean }) => (
        <div className={`p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex flex-col justify-center transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${highlight ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                {Icon && <Icon className={`w-3 h-3 ${alert ? 'text-red-500' : 'text-slate-300'}`} />}
                {label}
            </p>
            <div className={`text-sm font-bold tracking-tight ${alert ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                {value || <span className="text-slate-300 italic">N/A</span>}
            </div>
        </div>
    );

    const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
        <div className="bg-slate-950 px-6 py-3 border-b border-white/10 flex justify-between items-center mt-6 first:mt-0">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary-400" /> {title}
            </h3>
        </div>
    );

    return (
        <div className="bg-slate-200 dark:bg-slate-800 gap-px pb-px">

            {/* 1. KEY LOAN METRICS */}
            <SectionHeader title="Loan Application Details" icon={FileText} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800">
                <DataItem label="Loan ID" value={loan.id} icon={FileText} />
                <DataItem label="Reference ID" value={loan.referenceId} icon={FileText} highlight />
                <DataItem label="Application Date" value={loan.createdAt ? new Date(loan.createdAt).toLocaleString() : 'N/A'} icon={Calendar} />
                <DataItem label="Source Channel" value="Direct / Web" icon={Activity} /> {/* Mock Data */}

                <DataItem label="Product Type" value={loan.type} icon={Briefcase} />
                <DataItem label="Requested Amount" value={formatCurrency(loan.financials.principalAmount)} icon={Banknote} highlight />
                <DataItem label="Currency" value="INR (₹)" icon={Banknote} />
                <DataItem label="Tenure" value={`${loan.financials.termMonths} Months`} icon={Calendar} />

                <DataItem label="EMI Frequency" value="Monthly" icon={Calendar} />
                <DataItem label="Proposed EMI" value={formatCurrency(loan.financials.emiAmount)} icon={CreditCard} />
                <DataItem label="Interest Rate" value={`${loan.financials.interestRate}%`} icon={Activity} />
                <DataItem label="Rate Type" value={loan.financials.interestType} icon={Activity} />

                <div className="col-span-full p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">Purpose of Loan</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {loan.purpose} <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">#BusinessExpansion</span>
                    </p>
                </div>
            </div>

            {/* 2. APPLICANT PROFILE */}
            <SectionHeader title="Applicant Profile" icon={User} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800">
                <DataItem label="Legal Name" value={loan.borrower.name} icon={User} highlight />
                <DataItem label="DOB" value={loan.borrower.dob || '12/05/1985'} icon={Calendar} />
                <DataItem label="Age / Gender" value="38 Yrs / Male" icon={User} />
                <DataItem label="National ID (PAN)" value={loan.borrower.panNumber ? `XXXXXX${loan.borrower.panNumber.slice(-4)}` : 'N/A'} icon={CreditCard} />

                <DataItem label="Email" value={loan.borrower.email} icon={Mail} />
                <DataItem label="Primary Phone" value={loan.borrower.phone} icon={Phone} />
                <DataItem label="Alt Phone" value={loan.borrower.altPhone || 'N/A'} icon={Phone} />
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex flex-col justify-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-emerald-500" /> Address Verified
                    </p>
                    <div className="text-xs font-medium text-slate-900 dark:text-white leading-tight">
                        {loan.borrower.address}
                    </div>
                </div>

                <DataItem label="Employment Type" value={loan.borrower.employmentType} icon={Briefcase} highlight />
                <DataItem label="Employer / Business" value={loan.borrower.employerName} icon={Building} />
                <DataItem label="Registration / GST" value="27AABCU9603R1ZN" icon={FileText} /> {/* Mock */}
                <DataItem label="Designation" value={loan.borrower.designation || 'Owner'} icon={User} />

                <DataItem label="Annual Income (Declared)" value={formatCurrency(loan.borrower.annualIncome)} icon={Banknote} />
                <DataItem label="Annual Income (Assessed)" value={formatCurrency(loan.borrower.annualIncome * 0.9)} icon={Banknote} highlight />
            </div>

            {/* 3. FINANCIAL & RISK */}
            <SectionHeader title="Financial & Risk Assessment" icon={Activity} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800">
                <KPICard
                    title="Credit Score"
                    value={loan.borrower.creditScore}
                    variant="indigo"
                    icon={Activity}
                    subtitle="Source: CIBIL (01/01/2024)"
                    compact
                />

                <KPICard
                    title="Existing Debt"
                    value={formatCurrency(25000)}
                    variant="rose"
                    icon={CreditCard}
                    subtitle="Monthly assessment"
                    compact
                />

                <KPICard
                    title="Bank Account"
                    value="HDFC Bank"
                    variant="royal"
                    icon={Banknote}
                    subtitle="xxxx 1234 (e-Mandate Active)"
                    compact
                />

                <div className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <KPICard
                        title="AML / Sanctions"
                        value="PASSED"
                        variant="emerald"
                        icon={ShieldCheck}
                        subtitle="No matches in sanctions list"
                        compact
                    />
                    <KPICard
                        title="Fraud Check"
                        value="CLEARED"
                        variant="blue"
                        icon={Shield}
                        subtitle="Device fingerprint verified"
                        compact
                    />
                    <KPICard
                        title="Internal Risk"
                        value="MEDIUM"
                        variant="orange"
                        icon={ShieldAlert}
                        subtitle="Score: 82/100"
                        compact
                    />
                    <KPICard
                        title="Location Risk"
                        value="TIER 1"
                        variant="cyan"
                        icon={MapPin}
                        subtitle="Metro City (High Recovery)"
                        compact
                    />
                </div>
            </div>

            {/* 4. COLLATERAL */}
            {loan.collateral && (
                <>
                    <SectionHeader title="Collateral & Security" icon={Building} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800">
                        <DataItem label="Collateral Type" value={loan.collateral.type} icon={Building} />
                        <DataItem label="Valuation" value={formatCurrency(loan.collateral.value)} icon={Banknote} highlight />
                        <DataItem label="LTV Ratio" value={`${loan.collateral.ltvRatio}%`} icon={Activity} />
                        <DataItem label="Valuation Date" value="12/12/2023" icon={Calendar} />
                        <div className="col-span-2 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">Property Address</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{loan.collateral.address}</p>
                        </div>
                        <div className="col-span-2 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">Insurance Coverage</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center justify-between">
                                {loan.insurance?.provider} - {loan.insurance?.policyNumber}
                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 text-[10px] uppercase">Active</span>
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* 5. NOTES */}
            <SectionHeader title="Underwriter Notes" icon={Info} />
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-white/5">
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        RV
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">Rahul Verma <span className="text-slate-400 font-medium ml-2">Today at 10:30 AM</span></p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Applicant has a strong credit history but is currently self-employed in a high-risk sector (Tech Consulting). Verify consistency of income via last 12 months bank statements. Property valuation came in slightly lower than expected, adjusted LTV accordingly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


