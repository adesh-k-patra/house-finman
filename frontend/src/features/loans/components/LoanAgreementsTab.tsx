/**
 * Loan Agreements Tab
 * Signed agreements, e-sign status, document downloads
 */

import { Loan } from '../types';
import { Button } from '@/components/ui/Button';
import { KPICard } from '@/components/ui/KPICard';
import { cn } from '@/utils';
import {
    FileText, CheckCircle2, Clock, XCircle, Download, Eye, Send, AlertCircle,
    Pen, CalendarCheck, Shield, FileSignature, ExternalLink
} from 'lucide-react';

interface LoanAgreementsTabProps {
    loan: Loan;
}

const mockAgreements = [
    {
        id: 'AGR-001',
        name: 'Home Loan Agreement',
        type: 'Loan Agreement',
        signedAt: '2024-02-01T09:00:00Z',
        signedBy: 'Michael Chen',
        eSignStatus: 'signed' as const,
        documentUrl: '#',
        certificateUrl: '#',
        pages: 24,
        version: '1.0'
    },
    {
        id: 'AGR-002',
        name: 'Property Mortgage Deed',
        type: 'Mortgage',
        signedAt: '2024-02-01T09:30:00Z',
        signedBy: 'Michael Chen',
        eSignStatus: 'signed' as const,
        documentUrl: '#',
        pages: 12,
        version: '1.0'
    },
    {
        id: 'AGR-003',
        name: 'Personal Guarantee',
        type: 'Guarantee',
        signedAt: '2024-02-01T10:00:00Z',
        signedBy: 'Priya Chen',
        eSignStatus: 'signed' as const,
        documentUrl: '#',
        pages: 8,
        version: '1.0'
    },
    {
        id: 'AGR-004',
        name: 'NACH Mandate Form',
        type: 'Mandate',
        signedAt: '2024-02-01T10:30:00Z',
        signedBy: 'Michael Chen',
        eSignStatus: 'signed' as const,
        documentUrl: '#',
        pages: 4,
        version: '1.0'
    },
    {
        id: 'AGR-005',
        name: 'Insurance Consent Form',
        type: 'Consent',
        signedAt: null,
        signedBy: null,
        eSignStatus: 'pending' as const,
        documentUrl: '#',
        pages: 2,
        version: '1.0'
    }
];

export function LoanAgreementsTab({ loan }: LoanAgreementsTabProps) {
    const agreements = loan.agreements || mockAgreements;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'signed':
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Signed
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-600 bg-amber-50 border border-amber-200 rounded-sm">
                        <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                );
            case 'rejected':
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase text-red-600 bg-red-50 border border-red-200 rounded-sm">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                );
            case 'expired':
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600 bg-slate-100 border border-slate-200 rounded-sm">
                        <AlertCircle className="w-3.5 h-3.5" /> Expired
                    </span>
                );
            default:
                return null;
        }
    };

    const signedCount = agreements.filter(a => a.eSignStatus === 'signed').length;
    const pendingCount = agreements.filter(a => a.eSignStatus === 'pending').length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Summary Cards - Redesigned with Premium KPICards */}
            <div className="grid grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/10 mb-6">
                <KPICard
                    title="Total Agreements"
                    value={agreements.length}
                    variant="blue"
                    icon={FileText}
                    subtitle="All documents"
                    compact
                />
                <KPICard
                    title="Signed"
                    value={signedCount}
                    variant="emerald"
                    icon={CheckCircle2}
                    subtitle="Executed"
                    compact
                />
                <KPICard
                    title="Pending Signature"
                    value={pendingCount}
                    variant="amber"
                    icon={Clock}
                    subtitle="Action required"
                    compact
                />
                <KPICard
                    title="Compliance"
                    value="100%"
                    variant="indigo"
                    icon={Shield}
                    subtitle="Fully compliant"
                    compact
                />
            </div>

            {/* Pending Signature Alert */}
            {pendingCount > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400">Pending Signatures</h4>
                            <p className="text-xs text-amber-600">{pendingCount} agreement{pendingCount !== 1 ? 's' : ''} awaiting signature</p>
                        </div>
                    </div>
                    <Button variant="primary" size="sm" leftIcon={<Send className="w-4 h-4" />}>
                        Send Reminder
                    </Button>
                </div>
            )}

            {/* Agreements List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                <div className="bg-black/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between border-b border-white/10">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <FileSignature className="w-4 h-4 text-primary-400" /> All Agreements
                    </h3>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" leftIcon={<Download className="w-4 h-4" />}>
                        Download All
                    </Button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {agreements.map((agreement) => (
                        <div key={agreement.id} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-sm",
                                    agreement.eSignStatus === 'signed' && "bg-emerald-100 text-emerald-600",
                                    agreement.eSignStatus === 'pending' && "bg-amber-100 text-amber-600",
                                    agreement.eSignStatus === 'rejected' && "bg-red-100 text-red-600",
                                    agreement.eSignStatus === 'expired' && "bg-slate-100 text-slate-600"
                                )}>
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{agreement.name}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                        <span>{agreement.type}</span>
                                        <span className="text-slate-300">•</span>
                                        <span>4 pages</span>
                                        <span className="text-slate-300">•</span>
                                        <span>v1.0</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Signature Info */}
                                <div className="text-right">
                                    {agreement.signedAt ? (
                                        <>
                                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                <Pen className="w-4 h-4 text-emerald-500" />
                                                <span>{agreement.signedBy}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <CalendarCheck className="w-3 h-3" />
                                                <span>{new Date(agreement.signedAt).toLocaleString()}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-slate-500">Awaiting signature</p>
                                    )}
                                </div>

                                {/* Status Badge */}
                                {getStatusBadge(agreement.eSignStatus)}

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" title="View">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" title="Download">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    {agreement.certificateUrl && (
                                        <Button variant="ghost" size="sm" title="View Certificate">
                                            <Shield className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {agreement.eSignStatus === 'pending' && (
                                        <Button variant="ghost" size="sm" className="text-primary-600" title="Request Signature">
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* E-Sign Provider Info */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Digital signatures powered by <strong>e-Sign (Aadhaar eKYC)</strong></p>
                        <p className="text-xs text-slate-500">IT Act 2000 & 2008 Compliant | SHA-256 Encrypted | Legally Binding</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-4 h-4" />}>
                    Verify Signatures
                </Button>
            </div>
        </div>
    );
}
