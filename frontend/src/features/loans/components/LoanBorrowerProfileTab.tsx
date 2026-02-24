/**
 * Loan Borrower Profile Tab
 * Detailed borrower information, KYC, employment, bank details, co-borrowers
 */

import { Loan } from '../types';
import { cn, formatCurrency } from '@/utils';
import {
    User, Mail, Phone, MapPin, Building2, Briefcase, CreditCard, Shield,
    FileCheck, AlertCircle, CheckCircle2, Clock, Users, Wallet, Calendar,
    Globe, Home, BadgeCheck, Smartphone, Activity
} from 'lucide-react';
import { KPICard } from '@/components/ui';

interface LoanBorrowerProfileTabProps {
    loan: Loan;
}

const DataItem = ({ label, value, icon, verified, className }: {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    verified?: boolean;
    className?: string;
}) => (
    <div className={cn("flex items-start gap-3 py-3 border-b border-slate-100 dark:border-white/5 last:border-b-0", className)}>
        {icon && <div className="text-slate-400 mt-0.5">{icon}</div>}
        <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white break-words">{value || '—'}</p>
        </div>
        {verified !== undefined && (
            verified ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            ) : (
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            )
        )}
    </div>
);

const SectionHeader = ({ title, icon, badge }: { title: string; icon: React.ReactNode; badge?: React.ReactNode }) => (
    <div className="bg-black/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between border-b border-white/10">
        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
            {icon} {title}
        </h3>
        {badge}
    </div>
);

export function LoanBorrowerProfileTab({ loan }: LoanBorrowerProfileTabProps) {
    const borrower = loan.borrower;

    const KycStatusBadge = () => {
        switch (borrower.kycStatus) {
            case 'verified':
                return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-100"><BadgeCheck className="w-3.5 h-3.5" /> Verified</span>;
            case 'pending':
                return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-100"><Clock className="w-3.5 h-3.5" /> Pending</span>;
            case 'rejected':
                return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-sm border border-red-100"><AlertCircle className="w-3.5 h-3.5" /> Rejected</span>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex items-center gap-6 border border-white/10">
                <div className="w-20 h-20 rounded-sm bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {borrower.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-white">{borrower.name}</h2>
                        <KycStatusBadge />
                    </div>
                    <p className="text-slate-400 text-sm">{borrower.email}</p>
                    <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-white/60"><span className="font-bold text-white">ID:</span> {borrower.id}</span>
                        {borrower.ckycId && <span className="text-xs text-white/60"><span className="font-bold text-white">CKYC:</span> {borrower.ckycId}</span>}
                    </div>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Credit Score</p>
                        <p className="text-3xl font-bold text-emerald-400">{borrower.creditScore}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Risk Grade</p>
                        <p className="text-lg font-bold text-white">{borrower.internalRiskGrade || 'A'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Personal Details */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Personal Details" icon={<User className="w-4 h-4 text-primary-400" />} />
                    <div className="p-4">
                        <DataItem label="Full Name" value={borrower.name} icon={<User className="w-4 h-4" />} />
                        <DataItem label="Date of Birth" value={borrower.dob} icon={<Calendar className="w-4 h-4" />} />
                        <DataItem label="Age" value={borrower.age ? `${borrower.age} years` : undefined} />
                        <DataItem label="Gender" value={borrower.gender} />
                        <DataItem label="Communication Preference" value={borrower.communicationPreference?.toUpperCase()} icon={<Smartphone className="w-4 h-4" />} />
                    </div>
                </div>

                {/* Contact Details */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Contact Information" icon={<Phone className="w-4 h-4 text-primary-400" />} />
                    <div className="p-4">
                        <DataItem label="Primary Phone" value={borrower.phone} icon={<Phone className="w-4 h-4" />} verified />
                        <DataItem label="Alternate Phone" value={borrower.altPhone} icon={<Phone className="w-4 h-4" />} />
                        <DataItem label="Email" value={borrower.email} icon={<Mail className="w-4 h-4" />} verified />
                    </div>
                </div>

                {/* KYC Documents */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader
                        title="KYC Documents"
                        icon={<FileCheck className="w-4 h-4 text-primary-400" />}
                        badge={<KycStatusBadge />}
                    />
                    <div className="p-4">
                        <DataItem label="PAN Number" value={borrower.panNumber} icon={<CreditCard className="w-4 h-4" />} verified={borrower.kycStatus === 'verified'} />
                        <DataItem label="Aadhaar Number" value={borrower.aadhaarNumber} icon={<Shield className="w-4 h-4" />} verified={borrower.kycStatus === 'verified'} />
                        <DataItem label="CKYC ID" value={borrower.ckycId} icon={<BadgeCheck className="w-4 h-4" />} />
                        {borrower.passportNumber && <DataItem label="Passport" value={borrower.passportNumber} icon={<Globe className="w-4 h-4" />} />}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Address Details */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Residential Address" icon={<Home className="w-4 h-4 text-primary-400" />} />
                    <div className="p-4">
                        <DataItem label="Current Address" value={borrower.address} icon={<MapPin className="w-4 h-4" />} />
                        <div className="grid grid-cols-2 gap-x-4">
                            <DataItem label="City" value={borrower.city} />
                            <DataItem label="State" value={borrower.state} />
                            <DataItem label="Pincode" value={borrower.pincode} />
                            <DataItem label="Residence Type" value={borrower.residenceType} icon={<Home className="w-4 h-4" />} />
                        </div>
                        <DataItem label="Years at Address" value={borrower.yearsAtAddress ? `${borrower.yearsAtAddress} years` : undefined} />
                        {borrower.mailingAddress && <DataItem label="Mailing Address" value={borrower.mailingAddress} />}
                    </div>
                </div>

                {/* Employment Details */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Employment Details" icon={<Briefcase className="w-4 h-4 text-primary-400" />} />
                    <div className="p-4">
                        <DataItem label="Employment Type" value={borrower.employmentType} icon={<Briefcase className="w-4 h-4" />} />
                        <DataItem label="Employer Name" value={borrower.employerName} icon={<Building2 className="w-4 h-4" />} />
                        <DataItem label="Designation" value={borrower.designation} />
                        <DataItem label="Years with Employer" value={borrower.yearsWithEmployer ? `${borrower.yearsWithEmployer} years` : undefined} />
                        {borrower.employerAddress && <DataItem label="Employer Address" value={borrower.employerAddress} icon={<MapPin className="w-4 h-4" />} />}
                        {borrower.gstNumber && <DataItem label="GST Number" value={borrower.gstNumber} verified />}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Financial Details */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Financial Details" icon={<Wallet className="w-4 h-4 text-primary-400" />} />
                    <div className="p-4">
                        <DataItem
                            label="Annual Income"
                            value={borrower.annualIncome ? `₹${(borrower.annualIncome / 100000).toFixed(1)}L` : undefined}
                            icon={<Wallet className="w-4 h-4" />}
                        />
                        <DataItem label="Pay Frequency" value={borrower.payFrequency} />
                        <DataItem label="Bank Name" value={borrower.bankName} icon={<Building2 className="w-4 h-4" />} />
                        <DataItem label="Account Number" value={borrower.bankAccountNumber ? `XXXX ${borrower.bankAccountNumber}` : undefined} />
                        <DataItem label="IFSC Code" value={borrower.ifscCode} />
                        <DataItem
                            label="E-Mandate Status"
                            value={
                                <span className={cn(
                                    "px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm",
                                    borrower.eMandateStatus === 'active' && "bg-emerald-100 text-emerald-700",
                                    borrower.eMandateStatus === 'pending' && "bg-amber-100 text-amber-700",
                                    borrower.eMandateStatus === 'failed' && "bg-red-100 text-red-700",
                                    borrower.eMandateStatus === 'inactive' && "bg-slate-100 text-slate-700"
                                )}>
                                    {borrower.eMandateStatus || 'N/A'}
                                </span>
                            }
                        />
                    </div>
                </div>

                {/* Credit & Risk Profile */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Credit & Risk Profile" icon={<Shield className="w-4 h-4 text-primary-400" />} />
                    <div className="p-4 grid grid-cols-2 gap-4">
                        <KPICard
                            title="Credit Score"
                            value={borrower.creditScore || '—'}
                            variant="emerald"
                            icon={CreditCard}
                            subtitle={borrower.creditBureau}
                            compact
                        />
                        <KPICard
                            title="Risk Grade"
                            value={borrower.internalRiskGrade || '—'}
                            variant="violet"
                            icon={Activity}
                            subtitle={`Score: ${borrower.riskScore || 0}`}
                            compact
                        />
                        <KPICard
                            title="Existing Debt"
                            value={borrower.existingDebtAmount ? formatCurrency(borrower.existingDebtAmount) : '₹0'}
                            variant="rose"
                            icon={Wallet}
                            subtitle={`${borrower.totalExistingLoans || 0} active loans`}
                            compact
                        />
                        <KPICard
                            title="Monthly EMI"
                            value={borrower.existingEmiAmount ? formatCurrency(borrower.existingEmiAmount) : '₹0'}
                            variant="orange"
                            icon={CreditCard}
                            compact
                        />
                    </div>
                </div>
            </div>

            {/* Co-Borrowers Section */}
            {borrower.coBorrowers && borrower.coBorrowers.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader
                        title="Co-Borrowers"
                        icon={<Users className="w-4 h-4 text-primary-400" />}
                        badge={<span className="text-xs font-bold text-white bg-primary-600 px-2 py-0.5 rounded-sm">{borrower.coBorrowers.length}</span>}
                    />
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            {borrower.coBorrowers.map((coBorrower, index) => (
                                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-sm bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                            {coBorrower.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{coBorrower.name}</p>
                                            <p className="text-xs text-slate-500">{coBorrower.relation}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-slate-500">Phone:</span>
                                            <p className="font-medium text-slate-700 dark:text-slate-300">{coBorrower.phone || '—'}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">KYC:</span>
                                            <p className={cn(
                                                "font-medium",
                                                coBorrower.kycStatus === 'verified' && "text-emerald-600",
                                                coBorrower.kycStatus === 'pending' && "text-amber-600",
                                                coBorrower.kycStatus === 'rejected' && "text-red-600"
                                            )}>{coBorrower.kycStatus}</p>
                                        </div>
                                        {coBorrower.creditScore && (
                                            <div>
                                                <span className="text-slate-500">Credit Score:</span>
                                                <p className="font-medium text-slate-700 dark:text-slate-300">{coBorrower.creditScore}</p>
                                            </div>
                                        )}
                                        {coBorrower.annualIncome && (
                                            <div>
                                                <span className="text-slate-500">Income:</span>
                                                <p className="font-medium text-slate-700 dark:text-slate-300">₹{(coBorrower.annualIncome / 100000).toFixed(1)}L</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* No Co-Borrowers Message */}
            {(!borrower.coBorrowers || borrower.coBorrowers.length === 0) && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Co-Borrowers" icon={<Users className="w-4 h-4 text-primary-400" />} />
                    <div className="p-8 text-center">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">No co-borrowers on this loan</p>
                    </div>
                </div>
            )}
        </div>
    );
}
