/**
 * Loan KYC & Compliance Tab
 * AML screening, fraud checks, PEP status, adverse media, device fingerprint
 */

import { Loan } from '../types';
import { cn } from '@/utils';
import {
    Shield, AlertTriangle, CheckCircle2, XCircle, Clock, Globe, Smartphone,
    AlertCircle, User, Building2, FileSearch, Eye, Download, RefreshCw,
    ShieldCheck, Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { KPICard } from '@/components/ui';

interface LoanKYCComplianceTabProps {
    loan: Loan;
}

const StatusBadge = ({ status, size = 'default' }: { status: 'pass' | 'warn' | 'fail' | 'pending' | 'not_checked'; size?: 'default' | 'large' }) => {
    const baseClasses = size === 'large'
        ? "px-4 py-2 text-sm font-bold uppercase rounded-sm"
        : "px-2.5 py-1 text-[10px] font-bold uppercase rounded-sm";

    switch (status) {
        case 'pass':
            return <span className={cn(baseClasses, "bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1.5")}><CheckCircle2 className="w-4 h-4" /> Passed</span>;
        case 'warn':
            return <span className={cn(baseClasses, "bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1.5")}><AlertCircle className="w-4 h-4" /> Warning</span>;
        case 'fail':
            return <span className={cn(baseClasses, "bg-red-100 text-red-700 border border-red-200 flex items-center gap-1.5")}><XCircle className="w-4 h-4" /> Failed</span>;
        case 'pending':
            return <span className={cn(baseClasses, "bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5")}><Clock className="w-4 h-4" /> Pending</span>;
        default:
            return <span className={cn(baseClasses, "bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5")}>Not Checked</span>;
    }
};

const SectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
    <div className="bg-black/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between border-b border-white/10">
        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
            {icon} {title}
        </h3>
    </div>
);

export function LoanKYCComplianceTab({ loan }: LoanKYCComplianceTabProps) {
    const risk = loan.riskAssessment;
    const amlStatus = loan.amlStatus || 'pass';
    const fraudStatus = loan.fraudCheck || 'pass';

    // Mock compliance data
    const sanctionsScreening = {
        status: 'pass',
        lastChecked: loan.amlScreeningDate || new Date().toISOString(),
        source: 'OFAC, UN, EU, UK HMT',
        matchesFound: 0,
        details: 'No sanctions matches found'
    };

    const pepCheck = {
        status: risk?.pepStatus === 'not_pep' ? 'pass' : risk?.pepStatus === 'pep' ? 'warn' : 'pass',
        isPep: risk?.pepStatus !== 'not_pep',
        details: risk?.pepDetails || 'Not a Politically Exposed Person'
    };

    const adverseMedia = {
        status: (risk?.adverseMediaHits || 0) > 0 ? 'warn' : 'pass',
        hitsFound: risk?.adverseMediaHits || 0,
        details: risk?.adverseMediaDetails || []
    };

    const deviceFingerprint = risk?.deviceFingerprint || {
        deviceId: 'DFP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        riskScore: 15,
        previousApplications: 1,
        flagged: false
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Overall Compliance Status Banner */}
            <div className={cn(
                'px-6 py-5 flex items-center justify-between border',
                amlStatus === 'pass' && fraudStatus === 'pass'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            )}>
                <div className="flex items-center gap-4">
                    {amlStatus === 'pass' && fraudStatus === 'pass' ? (
                        <Shield className="w-10 h-10 text-emerald-600" />
                    ) : (
                        <AlertTriangle className="w-10 h-10 text-amber-600" />
                    )}
                    <div>
                        <h3 className={cn(
                            'text-xl font-bold',
                            amlStatus === 'pass' && fraudStatus === 'pass'
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-amber-700 dark:text-amber-400'
                        )}>
                            {amlStatus === 'pass' && fraudStatus === 'pass'
                                ? 'Compliance Checks Passed'
                                : 'Review Required'}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            All regulatory and risk checks have been completed
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
                        Re-run Checks
                    </Button>
                    <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Quick Status Grid */}
            <div className="grid grid-cols-4 gap-4">
                <KPICard
                    title="AML Status"
                    value={amlStatus.toUpperCase()}
                    variant={amlStatus === 'pass' ? 'emerald' : 'rose'}
                    icon={ShieldCheck}
                    subtitle="Anti-Money Laundering check"
                    compact
                />
                <KPICard
                    title="Fraud Check"
                    value={fraudStatus.toUpperCase()}
                    variant={fraudStatus === 'pass' ? 'blue' : 'rose'}
                    icon={Shield}
                    subtitle="Identity & document fraud"
                    compact
                />
                <KPICard
                    title="PEP Status"
                    value={pepCheck.status === 'pass' ? 'NOT PEP' : 'PEP DETECTED'}
                    variant="slate"
                    icon={User}
                    subtitle={pepCheck.details}
                    compact
                />
                <KPICard
                    title="Device Risk"
                    value={deviceFingerprint.flagged ? 'WARNING' : 'SECURE'}
                    variant={deviceFingerprint.flagged ? 'rose' : 'cyan'}
                    icon={Fingerprint}
                    subtitle={`Score: ${deviceFingerprint.riskScore}/100`}
                    compact
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Sanctions Screening */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Sanctions Screening" icon={<Globe className="w-4 h-4 text-primary-400" />} />
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                            <StatusBadge status={sanctionsScreening.status as 'pass' | 'warn' | 'fail'} size="large" />
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                <span className="text-slate-500">Lists Checked</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{sanctionsScreening.source}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                <span className="text-slate-500">Matches Found</span>
                                <span className={cn(
                                    "font-bold",
                                    sanctionsScreening.matchesFound === 0 ? "text-emerald-600" : "text-red-600"
                                )}>{sanctionsScreening.matchesFound}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500">Last Checked</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(sanctionsScreening.lastChecked).toLocaleString()}</span>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full text-xs" leftIcon={<FileSearch className="w-4 h-4" />}>
                            View Full Screening Report
                        </Button>
                    </div>
                </div>

                {/* PEP Check */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="PEP Check" icon={<User className="w-4 h-4 text-primary-400" />} />
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                            <StatusBadge status={pepCheck.status as 'pass' | 'warn' | 'fail'} size="large" />
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                <span className="text-slate-500">PEP Classification</span>
                                <span className={cn(
                                    "font-bold uppercase",
                                    pepCheck.isPep ? "text-amber-600" : "text-slate-600"
                                )}>{pepCheck.isPep ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                <span className="text-slate-500">Category</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">Not Applicable</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500">Related Parties Checked</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">Yes</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-3 rounded-sm">{pepCheck.details}</p>
                    </div>
                </div>

                {/* Adverse Media */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Adverse Media Screening" icon={<AlertCircle className="w-4 h-4 text-primary-400" />} />
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                            <StatusBadge status={adverseMedia.status as 'pass' | 'warn' | 'fail'} size="large" />
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                <span className="text-slate-500">Articles Found</span>
                                <span className={cn(
                                    "font-bold",
                                    adverseMedia.hitsFound === 0 ? "text-emerald-600" : "text-amber-600"
                                )}>{adverseMedia.hitsFound}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                <span className="text-slate-500">Sources Scanned</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">Global News DB</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500">Categories</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">Financial Crime, Fraud, Legal</span>
                            </div>
                        </div>
                        {adverseMedia.hitsFound === 0 ? (
                            <p className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-sm">No negative news articles found for this applicant</p>
                        ) : (
                            <Button variant="ghost" className="w-full text-xs text-amber-600" leftIcon={<Eye className="w-4 h-4" />}>
                                Review {adverseMedia.hitsFound} Articles
                            </Button>
                        )}
                    </div>
                </div>

                {/* Device Fingerprint */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <SectionHeader title="Device Fingerprint" icon={<Smartphone className="w-4 h-4 text-primary-400" />} />
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                            <StatusBadge status={deviceFingerprint.flagged ? 'warn' : 'pass'} size="large" />
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                <span className="text-slate-500">Device ID</span>
                                <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">{deviceFingerprint.deviceId}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                <span className="text-slate-500">Risk Score</span>
                                <span className={cn(
                                    "font-bold",
                                    deviceFingerprint.riskScore < 30 ? "text-emerald-600" :
                                        deviceFingerprint.riskScore < 60 ? "text-amber-600" : "text-red-600"
                                )}>{deviceFingerprint.riskScore}/100</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                <span className="text-slate-500">Previous Applications</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{deviceFingerprint.previousApplications}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500">Flagged</span>
                                <span className={cn(
                                    "font-bold uppercase",
                                    deviceFingerprint.flagged ? "text-red-600" : "text-emerald-600"
                                )}>{deviceFingerprint.flagged ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CKYC Registry */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                <SectionHeader title="CKYC Registry Status" icon={<Building2 className="w-4 h-4 text-primary-400" />} />
                <div className="p-5">
                    <div className="grid grid-cols-4 gap-6">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">CKYC ID</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{loan.borrower.ckycId || 'Not Registered'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Registry Status</p>
                            <p className="text-sm font-bold text-emerald-600">{loan.borrower.ckycId ? 'Verified' : 'Pending'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Last Updated</p>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Data Source</p>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">CERSAI</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fraud Indicators */}
            {risk?.fraudIndicators && risk.fraudIndicators.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-5">
                    <h4 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5" /> Fraud Indicators Detected
                    </h4>
                    <ul className="space-y-2">
                        {risk.fraudIndicators.map((indicator, i) => (
                            <li key={i} className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                <XCircle className="w-4 h-4" /> {indicator}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
