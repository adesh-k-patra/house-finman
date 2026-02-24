import { Loan } from '../types';
import { Button } from '@/components/ui/Button';
import { KPICard } from '@/components/ui/KPICard';
import {
    FileText, Eye, ShieldCheck, XCircle, Clock,
    CheckCircle2, AlertTriangle
} from 'lucide-react';

export function LoanDocumentsTab({ loan, onAction }: { loan: Loan, onAction: (action: string, data: any) => void }) {
    // Determine status badge
    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'verified': return <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 border border-emerald-100 dark:border-emerald-900"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>;
            case 'rejected': return <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 border border-red-100 dark:border-red-900"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
            case 'review': return <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 border border-amber-100 dark:border-amber-900"><Clock className="w-3.5 h-3.5" /> Review</span>;
            default: return <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 border border-slate-200 dark:border-white/10">Pending</span>;
        }
    };

    return (
        <div className="flex flex-col gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">

            {/* Header / Summary */}
            <div className="bg-white dark:bg-slate-900 p-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-none">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        Underwriting Checklist
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1 ml-14">Verify all mandatory documents before approval.</p>
                </div>
                <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion Status</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">
                            {loan.documents?.filter(d => d.status === 'verified').length} <span className="text-slate-300">/</span> {loan.documents?.length}
                        </p>
                    </div>
                    <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-none overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-500 rounded-none" style={{ width: `${(loan.documents?.filter(d => d.status === 'verified').length || 0) / (loan.documents?.length || 1) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* Document Status KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10">
                <KPICard
                    title="Total Documents"
                    value={loan.documents?.length || 0}
                    variant="slate"
                    icon={FileText}
                    compact
                />
                <KPICard
                    title="Verified"
                    value={loan.documents?.filter(d => d.status === 'verified').length || 0}
                    variant="emerald"
                    icon={CheckCircle2}
                    compact
                />
                <KPICard
                    title="Review Needed"
                    value={loan.documents?.filter(d => d.status === 'review').length || 0}
                    variant="amber"
                    icon={Clock}
                    compact
                />
                <KPICard
                    title="Rejected"
                    value={loan.documents?.filter(d => d.status === 'rejected').length || 0}
                    variant="red"
                    icon={XCircle}
                    compact
                />
            </div>

            {/* Document Table */}
            <div className="bg-white dark:bg-slate-900">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-400">
                            <th className="px-6 py-4 w-[45%]">Document Details</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Quick Actions</th>
                            <th className="px-6 py-4 text-right">Metadata</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {loan.documents?.map((doc) => (
                            <tr key={doc.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => onAction('view_document', doc)}>
                                <td className="px-6 py-5">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-none group-hover:bg-indigo-100 transition-colors">
                                            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                                                {doc.name}
                                                {doc.category === 'mandatory' && (
                                                    <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 uppercase tracking-wider font-bold border border-red-200">Required</span>
                                                )}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-none">{doc.type}</span>
                                                <span className="text-[10px] font-medium text-slate-400">• {((Math.random() * 5) + 1).toFixed(1)} MB</span>
                                            </div>
                                            {doc.verification?.verificationNotes && (
                                                <p className="text-[11px] font-medium text-amber-600 mt-2 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 w-fit border border-amber-100 dark:border-amber-900/20 rounded-none">
                                                    <AlertTriangle className="w-3 h-3" /> {doc.verification.verificationNotes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex justify-center">
                                        <StatusBadge status={doc.status} />
                                    </div>
                                </td>
                                <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-3 rounded-none hover:bg-slate-100 border border-transparent hover:border-slate-200"
                                            onClick={() => onAction('view_document', doc)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" /> View
                                        </Button>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="text-[10px] font-medium text-slate-500">
                                        <p className="font-mono">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                        <p className="text-[9px] uppercase tracking-wider mt-0.5 text-slate-400">by {doc.uploadedBy.split(' ')[0]}</p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
