import { useState, useEffect } from 'react';
import { Loan } from '../types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils';
import {
    CheckCircle2, Clock, Banknote, AlertTriangle, FileText, Upload,
    Calendar, Settings, AlertOctagon, User, ShieldAlert,
    ChevronRight, CreditCard, Download, Edit3
} from 'lucide-react';
import { ModalWrapper } from './ModalWrapper';
import { WizardModal, WizardStep } from '@/components/ui';
import { QuickActionLayout, QuickSidebarItem } from './QuickActionLayout';

interface LoanActionModalsProps {
    loan: Loan;
    activeAction: string | null;
    payload?: any;
    onClose: () => void;
    onConfirm: (action: string, data: any) => void;
}

export function LoanActionModals({ loan, activeAction, payload, onClose, onConfirm }: LoanActionModalsProps) {
    const [scheduleDate, setScheduleDate] = useState<string>('');
    const [scheduleTime, setScheduleTime] = useState<string>('');

    // Document Action State
    const [docAction, setDocAction] = useState<'verify' | 'reject' | 'review' | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Initialize schedule defaults
    useEffect(() => {
        if (activeAction === 'approve_schedule') {
            const tomorrow = new Date(Date.now() + 86400000);
            setScheduleDate(tomorrow.toISOString().split('T')[0]);
            setScheduleTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
        }
        // Reset doc action on open
        if (activeAction === 'view_document') {
            setDocAction(null);
            setRejectionReason('');
        }
    }, [activeAction]);

    // --- SHARED COMPONENTS (Internal to Modals) ---

    const SectionLabel = ({ label }: { label: string }) => (
        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">{label}</label>
    );

    const InfoBlock = ({ label, value, highlight = false, subValue }: { label: string, value: string, highlight?: boolean, subValue?: string }) => (
        <div className={cn(
            "p-4 border border-slate-200 dark:border-slate-800",
            highlight ? "bg-slate-50 dark:bg-slate-800" : "bg-white dark:bg-slate-900"
        )}>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">{label}</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{value}</p>
            {subValue && <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>}
        </div>
    );

    // --- NEW: DOCUMENT VIEW CONTENT ---
    const ViewDocumentContent = () => {
        const doc = payload; // The document object passed from the tab
        if (!doc) return <div className="p-8 text-center text-slate-500">Document data missing.</div>;

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Review', description: 'Validate Document' },
            { id: 2, label: 'Decision', description: 'Approve / Reject' }
        ];

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="DOCUMENT VALIDATION"
                subtitle={doc.name}
                steps={STEPS}
                currentStep={1}
                contentTitle={doc.name}
                sidebarWidth="w-[320px]"
                maxWidth="max-w-[90vw]"
                fullWidthContent={true}
                footer={null} // Actions are inside the split view
            >
                <div className="flex h-[600px] border border-slate-200 dark:border-slate-800 -m-8">
                    {/* LEFT: Preview Pane (65%) */}
                    <div className="w-[65%] bg-slate-100 dark:bg-slate-950/50 flex flex-col relative overflow-hidden group border-r border-slate-200 dark:border-slate-800">
                        {/* Toolbar Overlay */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><Upload className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
                            <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">-</button>
                            <span className="text-xs font-bold font-mono">100%</span>
                            <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">+</button>
                        </div>

                        {/* Mock Preview */}
                        <div className="flex-1 p-8 flex items-center justify-center overflow-auto custom-scrollbar">
                            <div className="w-full h-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center gap-4 text-slate-300">
                                <FileText className="w-24 h-24 opacity-20" />
                                <p className="text-sm font-medium uppercase tracking-widest opacity-40">Preview Not Available</p>
                                <p className="text-xs text-slate-400 opacity-60 font-mono">{doc.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Action Pane (35%) */}
                    <div className="w-[35%] flex flex-col bg-white dark:bg-slate-900">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider border border-slate-200 dark:border-slate-700">{doc.type}</span>
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider border border-slate-200 dark:border-slate-700">2.4 MB</span>
                                {doc.category === 'mandatory' && <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-[10px] uppercase font-bold text-red-600 tracking-wider border border-red-100 dark:border-red-900">Mandatory</span>}
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-8">
                            {/* Current Status */}
                            <div>
                                <SectionLabel label="Current Status" />
                                <div className={cn(
                                    "flex items-center gap-3 p-4 border transition-all",
                                    doc.status === 'verified' && "bg-emerald-50 border-emerald-200 text-emerald-700",
                                    doc.status === 'rejected' && "bg-red-50 border-red-200 text-red-700",
                                    (doc.status === 'pending' || doc.status === 'review') && "bg-slate-50 border-slate-200 text-slate-600"
                                )}>
                                    <div className={cn(
                                        "p-2 rounded-full",
                                        doc.status === 'verified' ? "bg-emerald-100" :
                                            doc.status === 'rejected' ? "bg-red-100" : "bg-white border border-slate-200"
                                    )}>
                                        {doc.status === 'verified' && <CheckCircle2 className="w-5 h-5" />}
                                        {doc.status === 'rejected' && <AlertOctagon className="w-5 h-5" />}
                                        {(doc.status === 'pending' || doc.status === 'review') && <Clock className="w-5 h-5" />}
                                    </div>
                                    <span className="text-lg font-black uppercase tracking-tight">{doc.status}</span>
                                </div>
                            </div>

                            {/* Action Selection */}
                            <div>
                                <SectionLabel label="Validation Decision" />
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => setDocAction('verify')}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-4 border-2 transition-all group text-left relative overflow-hidden",
                                            docAction === 'verify'
                                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                                : "border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-full transition-colors", docAction === 'verify' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600")}>
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className={cn("text-sm font-black uppercase tracking-wider", docAction === 'verify' ? "text-emerald-700" : "text-slate-600")}>Verify Document</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Mark as valid & clear gating check</p>
                                        </div>
                                        {docAction === 'verify' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                                    </button>

                                    <button
                                        onClick={() => setDocAction('reject')}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-4 border-2 transition-all group text-left relative overflow-hidden",
                                            docAction === 'reject'
                                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                                : "border-slate-100 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-full transition-colors", docAction === 'reject' ? "bg-red-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-red-100 group-hover:text-red-600")}>
                                            <AlertOctagon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className={cn("text-sm font-black uppercase tracking-wider", docAction === 'reject' ? "text-red-700" : "text-slate-600")}>Reject Document</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Invalid or unclear (Requires Reason)</p>
                                        </div>
                                        {docAction === 'reject' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500" />}
                                    </button>

                                    <button
                                        onClick={() => setDocAction('review')}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-4 border-2 transition-all group text-left relative overflow-hidden",
                                            docAction === 'review'
                                                ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                                : "border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-full transition-colors", docAction === 'review' ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600")}>
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className={cn("text-sm font-black uppercase tracking-wider", docAction === 'review' ? "text-amber-700" : "text-slate-600")}>Flag for Review</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Escalate to Senior Underwriter</p>
                                        </div>
                                        {docAction === 'review' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500" />}
                                    </button>
                                </div>
                            </div>

                            {/* Rejection Details (Conditional) */}
                            {docAction === 'reject' && (
                                <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                                    <SectionLabel label="Rejection Reason" />
                                    <select
                                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none text-xs font-bold focus:border-red-500 outline-none mb-3"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    >
                                        <option value="">Select a reason...</option>
                                        <option value="blurry">Image Unclear / Blurry</option>
                                        <option value="expired">Document Expired</option>
                                        <option value="mismatch">Details Mismatch</option>
                                        <option value="fraud">Potential Fraud / Tampered</option>
                                    </select>
                                    <textarea
                                        className="w-full h-20 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none text-xs focus:border-red-500 outline-none resize-none placeholder:text-slate-400"
                                        placeholder="Add specific notes for the borrower..."
                                    />
                                </div>
                            )}
                        </div>
                        {/* Action Footer */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
                            <Button
                                variant={docAction === 'reject' ? 'danger' : 'primary'}
                                className={cn(
                                    "rounded-none shadow-lg",
                                    !docAction && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => docAction && onConfirm('view_document', { action: docAction, reason: rejectionReason })}
                                disabled={!docAction}
                            >
                                {docAction === 'reject' ? 'Reject Document' : docAction === 'verify' ? 'Confirm Validation' : 'Flag for Review'}
                            </Button>
                        </div>
                    </div>
                </div>
            </WizardModal>
        );
    };

    // ... (Other Contents remain)


    // --- CONTENT VARIATIONS ---


    const ReversePaymentContent = () => (
        <div className="p-0">
            <div className="p-6 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
                <div className="flex gap-4 items-center">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-black text-red-800 dark:text-red-400 uppercase tracking-tight">Reversal Authorization</h4>
                        <p className="text-sm text-red-700/80 mt-1">
                            Reversing this payment will impact the General Ledger and customer statement. This action requires senior authorization.
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <SectionLabel label="Reversal Reason" />
                    <select className="w-full px-3 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold focus:border-red-500 outline-none">
                        <option>Clerical Error (Wrong Amount)</option>
                        <option>Duplicate Entry</option>
                        <option>Cheque Bounce / Failed Transfer</option>
                        <option>Fraudulent Transaction</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <SectionLabel label="Approver (Senior)" />
                    <select className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-500 cursor-not-allowed" disabled>
                        <option>Rahul Verma (Risk Head)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1 italic">Only Senior Finance users can be assigned.</p>
                </div>
                <div>
                    <SectionLabel label="Explanation" />
                    <textarea className="w-full h-24 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm resize-none focus:border-red-500 outline-none" placeholder="Provide context..." />
                </div>
            </div>
        </div>
    );

    const AssignOfficerContent = () => (
        <QuickActionLayout
            sidebar={
                <>
                    <QuickSidebarItem number="1" title="Select" subtitle="Find Officer" active />
                    <QuickSidebarItem number="2" title="Workload" subtitle="Capacity Check" />
                    <QuickSidebarItem number="3" title="Assign" subtitle="Confirm Handover" />
                </>
            }
        >
            <div className="p-6 space-y-6">
                <div>
                    <SectionLabel label="Search Officer" />
                    <input type="text" placeholder="Search by name, region, or ID..." className="w-full p-3 border border-slate-200 dark:border-slate-800 font-bold text-sm outline-none focus:border-indigo-500" />
                </div>

                <div>
                    <SectionLabel label="Suggested Officers (Load Balanced)" />
                    <div className="space-y-2 mt-2">
                        {[
                            { name: 'Amit Singh', role: 'FOS - North', load: '12 Active', status: 'Available' },
                            { name: 'Priya Sharma', role: 'Credit Manager', load: '28 Active', status: 'High Load' },
                            { name: 'Vikram Malhotra', role: 'Recovery Agent', load: '5 Active', status: 'Available' },
                        ].map((officer, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 hover:border-indigo-500 cursor-pointer group transition-all">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">{officer.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{officer.role}</p>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-1 uppercase tracking-wider",
                                        officer.status === 'Available' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                    )}>{officer.status}</span>
                                    <p className="text-[10px] text-slate-400 mt-1">{officer.load}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <SectionLabel label="Assignment Note" />
                    <textarea className="w-full h-20 p-3 border border-slate-200 dark:border-slate-800 text-xs resize-none outline-none focus:border-indigo-500" placeholder="Instructions..." />
                </div>
            </div>
        </QuickActionLayout>
    );

    const EditInterestContent = () => (
        <QuickActionLayout
            sidebar={
                <>
                    <QuickSidebarItem number="1" title="Proposal" subtitle="New Terms" active />
                    <QuickSidebarItem number="2" title="Impact" subtitle="EMI & Interest" />
                    <QuickSidebarItem number="3" title="Approval" subtitle="Submit for Review" />
                </>
            }
        >
            <div className="p-0">
                <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800 h-[500px]">
                    {/* Left: Current State */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                        <SectionLabel label="Current Terms" />
                        <div className="space-y-6 mt-4 opacity-70">
                            <InfoBlock label="Sanctioned Amount" value={`₹${loan.financials.principalAmount.toLocaleString()}`} />
                            <InfoBlock label="Interest Rate" value={`${loan.financials.interestRate}%`} subValue="Fixed" />
                            <InfoBlock label="Tenure" value={`${loan.financials.termMonths} Months`} />
                            <InfoBlock label="Current EMI" value={`₹${loan.financials.emiAmount.toLocaleString()}`} />
                        </div>
                    </div>

                    {/* Right: New State */}
                    <div className="p-6 bg-white dark:bg-slate-900">
                        <SectionLabel label="Proposed Terms" />
                        <div className="space-y-6 mt-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">New Interest Rate</label>
                                <div className="flex gap-2">
                                    <input type="number" defaultValue={loan.financials.interestRate} className="w-24 p-2 border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
                                    <span className="p-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center border border-l-0 border-slate-300 dark:border-slate-700">PERCENT</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Approved Amount (Partial)</label>
                                <div className="flex gap-2">
                                    <span className="p-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center border border-r-0 border-slate-300 dark:border-slate-700">₹</span>
                                    <input type="number" defaultValue={loan.financials.principalAmount} className="flex-1 p-2 border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
                                </div>
                            </div>

                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 mt-8">
                                <h4 className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Projected Impact</h4>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-indigo-600/80 font-bold">New EMI</span>
                                    <span className="text-xl font-black text-indigo-700 dark:text-indigo-400">₹{(Math.round(loan.financials.emiAmount * 1.05)).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </QuickActionLayout>
    );

    // Download PDF Content - Comprehensive Loan Document
    const DownloadPDFContent = () => {
        const [isGenerating, setIsGenerating] = useState(false);
        const [generated, setGenerated] = useState(false);

        const sections = [
            { id: 'cover', label: 'Cover Page', pages: '1', included: true },
            { id: 'summary', label: 'Loan Summary', pages: '2', included: true },
            { id: 'borrower', label: 'Borrower Profile', pages: '3-4', included: true },
            { id: 'terms', label: 'Loan Terms & Conditions', pages: '5-6', included: true },
            { id: 'schedule', label: 'Repayment Schedule', pages: '7', included: true },
            { id: 'payments', label: 'Payment History', pages: '8', included: true },
            { id: 'collateral', label: 'Collateral Details', pages: '9', included: true },
            { id: 'approvals', label: 'Approval Trail', pages: '10', included: true },
            { id: 'documents', label: 'Document Checklist', pages: '11', included: true },
            { id: 'declaration', label: 'Declaration & Terms', pages: '12', included: true },
        ];

        const handleGenerate = () => {
            setIsGenerating(true);
            setTimeout(() => {
                setIsGenerating(false);
                setGenerated(true);
            }, 2000);
        };

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="DOWNLOAD PDF"
                subtitle="COMPREHENSIVE LOAN DOCUMENT"
                steps={[
                    { id: 1, label: 'Configure', description: 'Select Sections' },
                    { id: 2, label: 'Generate', description: 'Create PDF' }
                ]}
                currentStep={generated ? 2 : 1}
                onStepClick={() => { }}
                contentTitle={generated ? 'Download Ready' : 'Document Sections'}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        <Button
                            variant="secondary"
                            className="rounded-none border-slate-200 dark:border-white/10"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        {!generated ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                leftIcon={isGenerating ? <Clock className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                            >
                                {isGenerating ? 'Generating...' : 'Generate PDF'}
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                onClick={() => onConfirm('download_pdf', { loanId: loan.id })}
                                leftIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Download (2.4 MB)
                            </Button>
                        )}
                    </div>
                }
            >
                {!generated ? (
                    <div className="space-y-6 animate-fade-in">
                        {/* Loan Summary Card */}
                        <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                            <div className="grid grid-cols-4 gap-4 text-center">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Loan ID</p>
                                    <p className="text-sm font-bold text-white">{loan.id}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                                    <p className="text-sm font-bold text-emerald-400">₹{loan.financials.principalAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-bold text-white capitalize">{loan.status}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Pages</p>
                                    <p className="text-sm font-bold text-blue-400">12</p>
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Sections</div>
                        <div className="space-y-2">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="flex items-center justify-between p-3 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm font-medium text-slate-800 dark:text-white">{section.label}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">Page {section.pages}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in text-center py-8">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">PDF Ready for Download</h3>
                            <p className="text-sm text-slate-500">Your comprehensive loan document has been generated.</p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left max-w-sm mx-auto">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Document Details</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">File Name</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{loan.id}_Full.pdf</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Size</span>
                                    <span className="font-bold text-slate-900 dark:text-white">2.4 MB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Pages</span>
                                    <span className="font-bold text-slate-900 dark:text-white">12</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Generated</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{new Date().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </WizardModal>
        );
    };

    const PermissionDeniedContent = () => (
        <div className="p-12 text-center bg-white dark:bg-slate-900">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Access Denied</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm">
                You do not have the required permissions <strong>(Senior Approver)</strong> to perform this action.
            </p>
            <Button variant="outline" className="rounded-none border-slate-300 dark:border-slate-700 font-bold uppercase text-xs tracking-wider">Request Access</Button>
        </div>
    );

    const NOCPreviewContent = () => (
        <QuickActionLayout
            sidebar={
                <>
                    <QuickSidebarItem number="1" title="Preview" subtitle="Verify Content" active />
                    <QuickSidebarItem number="2" title="Sign" subtitle="Digital Signature" />
                    <QuickSidebarItem number="3" title="Issue" subtitle="Release NOC" />
                </>
            }
        >
            <div className="flex flex-col h-full">
                <div className="p-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs">NOC_FINAL_DRAFT.pdf</h4>
                    <span className="text-xs font-mono text-slate-500">Page 1 of 1</span>
                </div>
                <div className="flex-1 bg-slate-200 dark:bg-slate-950 flex items-center justify-center p-8 overflow-auto custom-scrollbar">
                    <div className="w-[400px] h-[500px] bg-white shadow-xl p-8 flex flex-col gap-4 scale-90 sm:scale-100 transition-transform">
                        {/* Mock PDF Content */}
                        <div className="h-4 w-24 bg-slate-900 mb-4" />
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-slate-100" />
                            <div className="h-2 w-full bg-slate-100" />
                            <div className="h-2 w-2/3 bg-slate-100" />
                        </div>

                        <div className="p-4 border border-slate-100 mt-8">
                            <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2">Loan Details</h5>
                            <div className="space-y-1">
                                <div className="h-2 w-1/2 bg-slate-100" />
                                <div className="h-2 w-1/3 bg-slate-100" />
                            </div>
                        </div>

                        <div className="mt-auto flex justify-between items-end">
                            <div className="h-16 w-16 bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">QR</div>
                            <div className="text-center">
                                <div className="h-8 w-24 border-b border-slate-300 mb-1" />
                                <span className="text-[8px] font-bold uppercase text-slate-400">Authorized Signatory</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </QuickActionLayout>
    );

    const EscalateContent = () => (
        <div className="p-0">
            <div className="p-6 bg-rose-50 dark:bg-rose-900/10 border-b border-rose-100 dark:border-rose-900/20">
                <div className="flex gap-4 items-start">
                    <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-rose-800 dark:text-rose-400">Escalation Required</h4>
                        <p className="text-xs text-rose-700/80 mt-1 leading-relaxed">
                            Flag this application for senior review or compliance check. This will pause the SLA timer.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <SectionLabel label="Escalation Reason" />
                    <div className="grid grid-cols-2 gap-3">
                        {['Potential Fraud', 'Compliance Flag', 'High Value Loan', 'Politically Exposed Person', 'Document Discrepancy', 'Other'].map((item) => (
                            <label key={item} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 hover:border-rose-500 cursor-pointer group bg-white dark:bg-slate-900 transition-all">
                                <input type="radio" name="escalate_reason" className="rounded-full border-slate-300 text-rose-600 focus:ring-0" />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">{item}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <SectionLabel label="Assign To (Optional)" />
                    <select className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none text-xs font-bold focus:border-rose-500 outline-none">
                        <option value="">Select Senior Officer...</option>
                        <option value="rahul">Rahul Verma (Risk Head)</option>
                        <option value="priya">Priya Singh (Compliance)</option>
                        <option value="amit">Amit Shah (Fraud Unit)</option>
                    </select>
                </div>

                <div>
                    <SectionLabel label="Internal Note" />
                    <textarea
                        className="w-full h-20 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none text-xs focus:border-rose-500 outline-none resize-none placeholder:text-slate-400"
                        placeholder="Provide details for the escalation..."
                    />
                </div>
            </div>
        </div>
    );

    const RequestInfoContent = () => {
        const [step, setStep] = useState(1);
        const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
        const [message, setMessage] = useState('');

        const DOCS = [
            'Bank Statement (Last 6 Months)',
            'Salary Slips (Last 3 Months)',
            'ID Proof (Aadhar/Passport)',
            'Address Proof (Utility Bill)',
            'Business Registration',
            'Tax Returns (ITR)'
        ];

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Documents', description: 'Select Missing Proofs' },
            { id: 2, label: 'Message', description: 'Write to Borrower' }
        ];

        const toggleDoc = (doc: string) => {
            setSelectedDocs(prev =>
                prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
            );
        };

        const renderDocumentsStep = () => (
            <div className="space-y-6 animate-fade-in">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 flex gap-3 backdrop-blur-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Documentation Required</p>
                        <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                            Select the documents that need to be submitted by the borrower.
                        </p>
                    </div>
                </div>

                <div>
                    <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Missing Documents</div>
                    <div className="grid grid-cols-2 gap-3">
                        {DOCS.map((item) => (
                            <label
                                key={item}
                                className={cn(
                                    "flex items-center gap-3 p-4 border cursor-pointer group transition-all",
                                    selectedDocs.includes(item)
                                        ? "bg-amber-50 dark:bg-amber-900/10 border-amber-500"
                                        : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-amber-400"
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedDocs.includes(item)}
                                    onChange={() => toggleDoc(item)}
                                    className="hidden"
                                />
                                <div className={cn(
                                    "w-5 h-5 border flex items-center justify-center transition-colors",
                                    selectedDocs.includes(item)
                                        ? "bg-amber-500 border-amber-500"
                                        : "border-slate-300 dark:border-slate-600"
                                )}>
                                    {selectedDocs.includes(item) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <span className={cn(
                                    "text-xs font-bold",
                                    selectedDocs.includes(item)
                                        ? "text-amber-700 dark:text-amber-400"
                                        : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                                )}>{item}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        );

        const renderMessageStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Selected Docs Summary */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Requested Documents ({selectedDocs.length})</div>
                    <div className="flex flex-wrap gap-2">
                        {selectedDocs.map(doc => (
                            <span key={doc} className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold">{doc}</span>
                        ))}
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">
                        Additional Instructions
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-32 p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all text-sm text-slate-900 dark:text-white resize-none placeholder:text-slate-400"
                        placeholder="E.g., Please ensure the bank statement includes the stamp of the bank manager..."
                    />
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="REQUEST INFO"
                subtitle="BORROWER QUERY"
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < 2 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                                onClick={() => setStep(step + 1)}
                                disabled={selectedDocs.length === 0}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/20"
                                onClick={() => onConfirm('request_info', { documents: selectedDocs, message })}
                                leftIcon={<AlertTriangle className="w-4 h-4" />}
                            >
                                Send Request
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderDocumentsStep()}
                {step === 2 && renderMessageStep()}
            </WizardModal>
        );
    };

    const RestructureLoanContent = () => {
        const [step, setStep] = useState(1);
        const [newTenure, setNewTenure] = useState(loan.financials.termMonths);
        const [newRate, setNewRate] = useState(loan.financials.interestRate);

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Terms', description: 'Adjust Parameters' },
            { id: 2, label: 'Impact', description: 'Review Changes' }
        ];

        const oldEMI = loan.financials.emiAmount;
        const newEMI = Math.round(oldEMI * (1 + ((newRate - loan.financials.interestRate) / 100)));
        const emiDiff = newEMI - oldEMI;
        const tenureDiff = newTenure - loan.financials.termMonths;

        const renderTermsStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Dark Summary Card */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Outstanding</p>
                            <p className="text-xl font-black text-white">₹{loan.financials.outstandingBalance.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Current Rate</p>
                            <p className="text-xl font-black text-blue-400">{loan.financials.interestRate}%</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Tenure</p>
                            <p className="text-xl font-black text-white">{loan.financials.termMonths} months</p>
                        </div>
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-blue-500 transition-colors">
                        New Tenure (Months): <span className="text-blue-500 dark:text-blue-400">{newTenure}</span>
                    </label>
                    <input
                        type="range" min="12" max="60" step="6"
                        value={newTenure}
                        onChange={(e) => setNewTenure(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                        <span>12 months</span>
                        <span>60 months</span>
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-blue-500 transition-colors">
                        New Interest Rate: <span className="text-blue-500 dark:text-blue-400">{newRate}%</span>
                    </label>
                    <input
                        type="range" min="8" max="24" step="0.5"
                        value={newRate}
                        onChange={(e) => setNewRate(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                        <span>8%</span>
                        <span>24%</span>
                    </div>
                </div>

                {/* Real-time Preview */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Estimated New EMI</span>
                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{newEMI.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        );

        const renderImpactStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Warning */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 flex gap-3 backdrop-blur-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Restructuring Impact</p>
                        <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                            This will capitalize outstanding interest and may affect asset classification.
                        </p>
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Current Terms</p>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-500">EMI</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">₹{oldEMI.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Rate</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{loan.financials.interestRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Tenure</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{loan.financials.termMonths} mo</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">New Terms</p>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-xs text-blue-500">EMI</span>
                                <span className="text-sm font-black text-blue-700 dark:text-blue-400">₹{newEMI.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-blue-500">Rate</span>
                                <span className="text-sm font-black text-blue-700 dark:text-blue-400">{newRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-blue-500">Tenure</span>
                                <span className="text-sm font-black text-blue-700 dark:text-blue-400">{newTenure} mo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Net Impact */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">EMI Change</p>
                            <p className={cn("text-xl font-black", emiDiff >= 0 ? "text-red-400" : "text-emerald-400")}>
                                {emiDiff >= 0 ? '+' : ''}₹{emiDiff.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Tenure Change</p>
                            <p className={cn("text-xl font-black", tenureDiff >= 0 ? "text-amber-400" : "text-emerald-400")}>
                                {tenureDiff >= 0 ? '+' : ''}{tenureDiff} months
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="RESTRUCTURE LOAN"
                subtitle="MODIFICATION WORKFLOW"
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < 2 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                                onClick={() => setStep(step + 1)}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                onClick={() => onConfirm('restructure_loan', { newTenure, newRate, newEMI })}
                                leftIcon={<Settings className="w-4 h-4" />}
                            >
                                Apply Restructure
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderTermsStep()}
                {step === 2 && renderImpactStep()}
            </WizardModal>
        );
    };

    const ApproveInstantContent = () => {
        const [step, setStep] = useState(1);

        // Customization State
        const [sanctionedAmount, setSanctionedAmount] = useState(loan.financials.principalAmount);
        const [interestRate, setInterestRate] = useState(loan.financials.interestRate);
        const [tenure, setTenure] = useState(loan.financials.termMonths);

        // Calculate EMI
        const calculateEMI = (p: number, r: number, t: number) => {
            const rMon = r / 1200;
            if (r === 0) return Math.round(p / t);
            return Math.round(p * rMon * Math.pow(1 + rMon, t) / (Math.pow(1 + rMon, t) - 1));
        };

        const currentEMI = calculateEMI(sanctionedAmount, interestRate, tenure);
        const percentage = Math.round((sanctionedAmount / loan.financials.principalAmount) * 100);
        const totalInterest = currentEMI * tenure - sanctionedAmount;
        const totalPayable = currentEMI * tenure;

        // Validation Checks
        const checklist = [
            { label: 'KYC Verification', status: loan.borrower.kycStatus === 'verified', required: true },
            { label: 'Credit Score > 700', status: loan.borrower.creditScore >= 700, required: true },
            { label: 'AML Screening', status: true, required: true },
            { label: 'Income Verification', status: true, required: true },
            { label: 'Collateral Check', status: true, required: true }
        ];
        const allPassed = checklist.every(c => !c.required || c.status);

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Validation', description: 'Pre-flight Checks' },
            { id: 2, label: 'Terms', description: 'Customize Offer' },
            { id: 3, label: 'Confirmation', description: 'Final Approval' }
        ];

        const renderValidationStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Dark Info Cards for Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm p-4 border border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Requested Amount</p>
                        <p className="text-xl font-black text-white">₹{loan.financials.principalAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm p-4 border border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Credit Score</p>
                        <p className="text-xl font-black text-emerald-400">{loan.borrower.creditScore}</p>
                    </div>
                    <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm p-4 border border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Loan Type</p>
                        <p className="text-xl font-black text-white">{loan.type}</p>
                    </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Sanction Prerequisites</h4>
                    <div className="grid gap-2">
                        {checklist.map((item, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex items-center justify-between p-4 border transition-all",
                                    item.status
                                        ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30"
                                        : "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30"
                                )}
                            >
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3">
                                    {item.status ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    )}
                                    {item.label}
                                </span>
                                {item.required && (
                                    <span className="text-[9px] bg-slate-900 dark:bg-slate-800 text-slate-300 px-2 py-1 font-bold tracking-wider">REQUIRED</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {!allPassed && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 flex gap-3 backdrop-blur-sm">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Conditional Approval Available</p>
                            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                                Some checks have failed. A manual review will be triggered before disbursement.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );

        const renderCustomizationStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Dark EMI Calculator Card */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-6">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Monthly EMI</p>
                            <p className="text-2xl font-black text-emerald-400">₹{currentEMI.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Interest</p>
                            <p className="text-2xl font-black text-white">₹{totalInterest.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                            <p className="text-2xl font-black text-white">₹{totalPayable.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Loan Amount Slider */}
                <div className="group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Sanction Amount <span className="text-emerald-500">({percentage}%)</span>
                        </label>
                        <span className="text-sm font-black text-slate-900 dark:text-white">₹{sanctionedAmount.toLocaleString()}</span>
                    </div>
                    <input
                        type="range"
                        min="50" max="100" step="5"
                        value={percentage}
                        onChange={(e) => setSanctionedAmount(Math.round(loan.financials.principalAmount * (Number(e.target.value) / 100)))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>50% (₹{Math.round(loan.financials.principalAmount * 0.5).toLocaleString()})</span>
                        <span>100% (₹{loan.financials.principalAmount.toLocaleString()})</span>
                    </div>
                </div>

                {/* Interest Rate & Tenure */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-emerald-500 transition-colors">
                            Interest Rate (% p.a.) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="30"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-slate-900 dark:text-white"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">FIXED</span>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-emerald-500 transition-colors">
                            Tenure (Months) <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-slate-900 dark:text-white appearance-none cursor-pointer"
                        >
                            {[12, 24, 36, 48, 60, 72, 84, 96, 120, 180, 240, 360].map(m => (
                                <option key={m} value={m}>{m} Months ({Math.round(m / 12)} Years)</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );

        const renderConfirmationStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready for Sanction</h3>
                    <p className="text-sm text-slate-500 mt-1">Review the final terms before approval</p>
                </div>

                {/* Summary Card */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 divide-y divide-slate-800">
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-sm text-slate-400">Borrower</span>
                        <span className="font-bold text-white">{loan.borrower.name}</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-sm text-slate-400">Sanctioned Amount</span>
                        <span className="font-bold text-emerald-400">₹{sanctionedAmount.toLocaleString()}</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-sm text-slate-400">Interest Rate</span>
                        <span className="font-bold text-white">{interestRate}% p.a. (Fixed)</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-sm text-slate-400">Tenure</span>
                        <span className="font-bold text-white">{tenure} Months</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-sm text-slate-400">Monthly EMI</span>
                        <span className="font-bold text-white">₹{currentEMI.toLocaleString()}</span>
                    </div>
                    <div className="p-4 flex justify-between items-center bg-emerald-900/20">
                        <span className="text-sm font-bold text-emerald-400">Total Payable</span>
                        <span className="text-lg font-black text-emerald-400">₹{totalPayable.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="INSTANT APPROVAL"
                subtitle="SANCTION WORKFLOW"
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                                onClick={() => setStep(step + 1)}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                                onClick={() => onConfirm('approve_instant', { sanctionedAmount, interestRate, tenure })}
                                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                            >
                                Approve Loan
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderValidationStep()}
                {step === 2 && renderCustomizationStep()}
                {step === 3 && renderConfirmationStep()}
            </WizardModal>
        );
    };


    const ApproveScheduleContent = () => {
        const [step, setStep] = useState(1);

        // Customization State (Independent of Instant Approve)
        const [sanctionedAmount, setSanctionedAmount] = useState(loan.financials.principalAmount);
        const [interestRate, setInterestRate] = useState(loan.financials.interestRate);
        const [tenure, setTenure] = useState(loan.financials.termMonths);

        // Calculate EMI
        const calculateEMI = (p: number, r: number, t: number) => {
            const rMon = r / 1200;
            if (r === 0) return Math.round(p / t);
            return Math.round(p * rMon * Math.pow(1 + rMon, t) / (Math.pow(1 + rMon, t) - 1));
        };

        const currentEMI = calculateEMI(sanctionedAmount, interestRate, tenure);
        const percentage = Math.round((sanctionedAmount / loan.financials.principalAmount) * 100);

        const totalInterest = currentEMI * tenure - sanctionedAmount;
        const totalPayable = currentEMI * tenure;

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Terms', description: 'Customize Offer' },
            { id: 2, label: 'Schedule', description: 'Set Activation Time' }
        ];

        const renderCustomizationStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Dark EMI Calculator Card */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-6">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Monthly EMI</p>
                            <p className="text-2xl font-black text-blue-400">₹{currentEMI.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Interest</p>
                            <p className="text-2xl font-black text-white">₹{totalInterest.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                            <p className="text-2xl font-black text-white">₹{totalPayable.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Loan Amount Slider */}
                <div className="group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Sanction Amount <span className="text-blue-500">({percentage}%)</span>
                        </label>
                        <span className="text-sm font-black text-slate-900 dark:text-white">₹{sanctionedAmount.toLocaleString()}</span>
                    </div>
                    <input
                        type="range"
                        min="50" max="100" step="5"
                        value={percentage}
                        onChange={(e) => setSanctionedAmount(Math.round(loan.financials.principalAmount * (Number(e.target.value) / 100)))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>50% (₹{Math.round(loan.financials.principalAmount * 0.5).toLocaleString()})</span>
                        <span>100% (₹{loan.financials.principalAmount.toLocaleString()})</span>
                    </div>
                </div>

                {/* Interest Rate & Tenure */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                            Interest Rate (% p.a.) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="30"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-bold text-slate-900 dark:text-white"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">FIXED</span>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                            Tenure (Months) <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-bold text-slate-900 dark:text-white appearance-none cursor-pointer"
                        >
                            {[12, 24, 36, 48, 60, 72, 84, 96, 120, 180, 240, 360].map(m => (
                                <option key={m} value={m}>{m} Months ({Math.round(m / 12)} Years)</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );

        const renderScheduleStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Info Banner */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm">
                    <div className="flex gap-4 items-start">
                        <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-sm">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">24-Hour Cooling Period</h4>
                            <p className="text-xs text-blue-700/80 dark:text-blue-400/70 mt-1 leading-relaxed">
                                Loan status set to <strong className="text-blue-900 dark:text-blue-300">Approved (Pending Notify)</strong>. Notification sends automatically after window.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Date & Time Pickers */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                            Scheduled Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10" />
                            <input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className={cn(
                                    "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none",
                                    "text-sm font-bold text-slate-900 dark:text-white",
                                    "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-blue-50/50 dark:focus:bg-blue-900/10",
                                    "transition-all duration-200 cursor-pointer",
                                    scheduleDate && "border-blue-400 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-900/10"
                                )}
                            />
                            {scheduleDate && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            )}
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                            Scheduled Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10" />
                            <input
                                type="time"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                                className={cn(
                                    "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none",
                                    "text-sm font-bold text-slate-900 dark:text-white",
                                    "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-blue-50/50 dark:focus:bg-blue-900/10",
                                    "transition-all duration-200 cursor-pointer",
                                    scheduleTime && "border-blue-400 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-900/10"
                                )}
                            />
                            {scheduleTime && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                {scheduleDate && scheduleTime && (
                    <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-sm">
                                <Calendar className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Activation Scheduled</p>
                                <p className="text-sm font-black text-white">
                                    {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString('en-IN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                        Add Note for Reviewer (Optional)
                    </label>
                    <textarea
                        className="w-full h-24 p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none placeholder:text-slate-400"
                        placeholder="e.g. Pending final verification check on property address..."
                    />
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="SCHEDULE APPROVAL"
                subtitle="TIME-BOUND ACTIVATION"
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 hover:bg-slate-100 text-slate-600"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < 2 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 text-white hover:bg-slate-800"
                                onClick={() => setStep(step + 1)}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                onClick={() => onConfirm('approve_schedule', { sanctionedAmount, interestRate, tenure, scheduleDate, scheduleTime })}
                                leftIcon={<Clock className="w-4 h-4" />}
                            >
                                Confirm Schedule
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderCustomizationStep()}
                {step === 2 && renderScheduleStep()}
            </WizardModal>
        );
    };

    const RejectContent = () => {
        const [step, setStep] = useState(1);
        const [reason, setReason] = useState<string>('');
        const [comment, setComment] = useState('');

        const REASONS = ['Policy Violation', 'Credit Score', 'DTI Ratio', 'Doc Mismatch', 'Fraud Suspected', 'Other'];

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Reason', description: 'Categorize Rejection' },
            { id: 2, label: 'Audit', description: 'Internal Logging' }
        ];

        const renderReasonStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Dark Info Card */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Application</p>
                            <p className="text-sm font-black text-white">{loan.referenceId}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Borrower</p>
                            <p className="text-sm font-black text-white">{loan.borrower.name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                            <p className="text-sm font-black text-red-400">₹{loan.financials.principalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div className="p-4 bg-red-500/10 border border-red-500/30 flex gap-3 backdrop-blur-sm">
                    <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-red-600 dark:text-red-400">Action is Irreversible</p>
                        <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                            This application will be archived as Rejected. The borrower will receive formal communication.
                        </p>
                    </div>
                </div>

                <div>
                    <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Rejection Reason</div>
                    <div className="grid grid-cols-2 gap-3">
                        {REASONS.map(r => (
                            <label
                                key={r}
                                className={cn(
                                    "flex items-center gap-3 p-4 border cursor-pointer group transition-all",
                                    reason === r
                                        ? "bg-red-50 dark:bg-red-900/20 border-red-500 shadow-lg shadow-red-500/10"
                                        : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-red-400"
                                )}
                            >
                                <input
                                    type="radio"
                                    name="reject_reason"
                                    checked={reason === r}
                                    onChange={() => setReason(r)}
                                    className="hidden"
                                />
                                <div className={cn(
                                    "w-5 h-5 border flex items-center justify-center transition-colors",
                                    reason === r ? "border-red-600 bg-red-600" : "border-slate-300 dark:border-slate-600"
                                )}>
                                    {reason === r && <div className="w-2 h-2 bg-white" />}
                                </div>
                                <span className={cn(
                                    "text-xs font-bold",
                                    reason === r ? "text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                                )}>{r}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        );

        const renderAuditStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Selected Reason Summary */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Selected Reason</div>
                    <span className="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm font-bold">{reason}</span>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">
                        Rejection Template
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-bold text-slate-900 dark:text-white appearance-none cursor-pointer">
                        <option>Standard Rejection (Polite)</option>
                        <option>Strict Policy Rejection</option>
                        <option>Document Mismatch Rejection</option>
                    </select>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">
                        Internal Compliance Note
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full h-32 p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all text-sm text-slate-900 dark:text-white resize-none placeholder:text-slate-400"
                        placeholder="Detailed justification for audit log..."
                    />
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="REJECT APPLICATION"
                subtitle="CLOSURE PROCESS"
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 hover:bg-slate-100 text-slate-600"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < 2 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 text-white hover:bg-slate-800"
                                onClick={() => setStep(step + 1)}
                                disabled={!reason}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20"
                                onClick={() => onConfirm('reject', { reason, comment })}
                                leftIcon={<AlertOctagon className="w-4 h-4" />}
                            >
                                Confirm Rejection
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderReasonStep()}
                {step === 2 && renderAuditStep()}
            </WizardModal>
        );
    };

    const AddPaymentContent = () => {
        const [step, setStep] = useState(1);
        const [selectedEmi, setSelectedEmi] = useState<number | null>(payload?.emiNo || null);
        const [useCustomAmount, setUseCustomAmount] = useState(false);
        const [amount, setAmount] = useState(loan.financials.emiAmount);
        const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
        const [transactionRef, setTransactionRef] = useState('');
        const [receiveDate, setReceiveDate] = useState(new Date().toISOString().split('T')[0]);
        const [paymentNote, setPaymentNote] = useState('');
        const [documentName, setDocumentName] = useState('');

        // Mock EMI schedule for selection
        const emiSchedule = Array.from({ length: 6 }).map((_, i) => ({
            no: i + 1,
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + i)).toISOString(),
            amount: loan.financials.emiAmount,
            status: i === 0 ? 'paid' : i === 1 ? 'due' : 'upcoming'
        }));

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Tenure', description: 'Select EMI Period' },
            { id: 2, label: 'Details', description: 'Payment Info' },
            { id: 3, label: 'Confirm', description: 'Review & Post' }
        ];

        const METHODS = ['Bank Transfer', 'UPI', 'NEFT', 'RTGS', 'Cheque', 'Cash'];

        const principalAmount = Math.round(amount * 0.7);
        const interestAmount = Math.round(amount * 0.3);

        const handleEmiSelect = (emiNo: number) => {
            setSelectedEmi(emiNo);
            const emi = emiSchedule.find(e => e.no === emiNo);
            if (emi) setAmount(emi.amount);
        };

        // Initialize from payload if provided
        if (payload?.emiNo && selectedEmi === null) {
            handleEmiSelect(payload.emiNo);
        }

        const renderTenureStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Summary Header */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Outstanding</p>
                            <p className="text-xl font-black text-white">₹{loan.financials.outstandingBalance.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">EMI Amount</p>
                            <p className="text-xl font-black text-emerald-400">₹{loan.financials.emiAmount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Pending EMIs</p>
                            <p className="text-xl font-black text-white">{emiSchedule.filter(e => e.status !== 'paid').length}</p>
                        </div>
                    </div>
                </div>

                {/* EMI Selection Grid */}
                <div>
                    <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select EMI to Mark as Paid</div>
                    <div className="grid grid-cols-3 gap-3">
                        {emiSchedule.map(emi => (
                            <button
                                key={emi.no}
                                disabled={emi.status === 'paid'}
                                onClick={() => { handleEmiSelect(emi.no); setUseCustomAmount(false); }}
                                className={cn(
                                    "p-4 border transition-all text-left",
                                    emi.status === 'paid' && "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800",
                                    selectedEmi === emi.no && !useCustomAmount
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-lg shadow-emerald-500/10"
                                        : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-emerald-400"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">EMI #{emi.no}</span>
                                    <span className={cn(
                                        "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-sm",
                                        emi.status === 'paid' && "bg-emerald-100 text-emerald-700",
                                        emi.status === 'due' && "bg-amber-100 text-amber-700",
                                        emi.status === 'upcoming' && "bg-slate-100 text-slate-500"
                                    )}>{emi.status}</span>
                                </div>
                                <p className="text-lg font-black text-slate-900 dark:text-white">₹{emi.amount.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-500 mt-1">{new Date(emi.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Amount Option */}
                <div className="border-t border-slate-200 dark:border-white/10 pt-4">
                    <button
                        onClick={() => { setUseCustomAmount(true); setSelectedEmi(null); }}
                        className={cn(
                            "w-full p-4 border transition-all text-left flex items-center justify-between",
                            useCustomAmount
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                                : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-blue-400"
                        )}
                    >
                        <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">Custom Amount</span>
                            <p className="text-[10px] text-slate-500 mt-0.5">For partial payment, prepayment, or advance</p>
                        </div>
                        {useCustomAmount && (
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-32 px-3 py-2 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-600 rounded-none text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    placeholder="Enter amount"
                                />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        );

        const renderDetailsStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Selected Payment Summary */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                                {selectedEmi ? `EMI #${selectedEmi}` : 'Custom Amount'}
                            </p>
                            <p className="text-2xl font-black text-emerald-400">₹{amount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Breakdown</p>
                            <p className="text-xs text-slate-300">Principal: ₹{principalAmount.toLocaleString()}</p>
                            <p className="text-xs text-slate-300">Interest: ₹{interestAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div>
                    <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method <span className="text-red-500">*</span></div>
                    <div className="grid grid-cols-3 gap-2">
                        {METHODS.map(m => (
                            <button
                                key={m}
                                onClick={() => setPaymentMethod(m)}
                                className={cn(
                                    "py-2.5 text-xs font-bold uppercase border transition-all",
                                    paymentMethod === m
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                                        : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-emerald-400"
                                )}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date and Transaction ID */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-emerald-500">
                            Payment Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={receiveDate}
                            onChange={(e) => setReceiveDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-emerald-500">
                            Transaction ID / UTR <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            placeholder="e.g. IBKL12345678"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Document Upload */}
                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Upload Payment Proof (Optional)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-white/20 p-6 text-center bg-slate-50 dark:bg-black/10 hover:border-emerald-400 transition-colors cursor-pointer">
                        {documentName ? (
                            <div className="flex items-center justify-center gap-2">
                                <FileText className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{documentName}</span>
                                <button onClick={() => setDocumentName('')} className="text-red-500 hover:text-red-600">
                                    <AlertTriangle className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-xs text-slate-500">Click to upload receipt, screenshot, or bank statement</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setDocumentName(e.target.files?.[0]?.name || '')}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Payment Notes (Optional)
                    </label>
                    <textarea
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="Any additional notes about this payment..."
                        className="w-full h-20 p-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm text-slate-900 dark:text-white resize-none placeholder:text-slate-400"
                    />
                </div>
            </div>
        );

        const renderConfirmStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Payment Summary */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-6">
                    <div className="text-center mb-6">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Payment Amount</p>
                        <p className="text-4xl font-black text-white mt-1">₹{amount.toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Method</p>
                            <p className="text-sm font-bold text-white">{paymentMethod}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Date</p>
                            <p className="text-sm font-bold text-white">{new Date(receiveDate).toLocaleDateString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* Allocation Breakdown */}
                <div>
                    <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allocation Breakdown</div>
                    <div className="grid grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                        <div className="p-4 bg-white dark:bg-slate-900 text-center">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Principal</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">₹{principalAmount.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 text-center">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Interest</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">₹{interestAmount.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 text-center">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Penalty</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">₹0</p>
                        </div>
                    </div>
                </div>

                {/* Reference Info */}
                {transactionRef && (
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Transaction Reference</p>
                        <p className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-300">{transactionRef}</p>
                    </div>
                )}

                {/* Document Attached */}
                {documentName && (
                    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest">Document Attached</p>
                            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{documentName}</p>
                        </div>
                    </div>
                )}
            </div>
        );

        const canProceed = step === 1 ? (selectedEmi || (useCustomAmount && amount > 0)) :
            step === 2 ? (transactionRef.length > 0) : true;

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="RECORD PAYMENT"
                subtitle="LEDGER ENTRY"
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                                onClick={() => setStep(step + 1)}
                                disabled={!canProceed}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                                onClick={() => onConfirm('add_payment', {
                                    emiNo: selectedEmi,
                                    amount,
                                    method: paymentMethod,
                                    date: receiveDate,
                                    ref: transactionRef,
                                    note: paymentNote,
                                    document: documentName
                                })}
                                leftIcon={<Banknote className="w-4 h-4" />}
                            >
                                Post Payment
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderTenureStep()}
                {step === 2 && renderDetailsStep()}
                {step === 3 && renderConfirmStep()}
            </WizardModal>
        );
    };

    // --- EDIT PAYMENT MODAL ---
    const EditPaymentContent = () => {
        const tx = payload?.transaction;
        const [step, setStep] = useState(1);
        const [amount, setAmount] = useState(tx?.amount || 0);
        const [paymentMethod, setPaymentMethod] = useState(tx?.instrument || 'Bank Transfer');
        const [transactionRef, setTransactionRef] = useState(tx?.referenceId || '');
        const [receiveDate, setReceiveDate] = useState(tx?.date || new Date().toISOString().split('T')[0]);
        const [paymentNote, setPaymentNote] = useState(tx?.notes || '');

        // Mock invoice data - in real app would come from backend
        const mockInvoice = {
            id: 'INV-2024-001',
            generatedOn: '2024-01-05',
            dueDate: '2024-01-15',
            principalComponent: Math.round((tx?.amount || 0) * 0.7),
            interestComponent: Math.round((tx?.amount || 0) * 0.3),
            penaltyComponent: 0,
            status: 'paid'
        };

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Transaction', description: 'View Details' },
            { id: 2, label: 'Edit', description: 'Modify Payment' },
            { id: 3, label: 'Confirm', description: 'Save Changes' }
        ];

        const METHODS = ['Bank Transfer', 'UPI', 'NEFT', 'RTGS', 'Cheque', 'Cash'];

        // Step 1: Transaction Details View (Schedule Approval style)
        const renderTransactionStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Premium Transaction Header Card */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-500/20 rounded-sm">
                                <Banknote className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Transaction ID</p>
                                <p className="text-lg font-black text-white font-mono tracking-tight">{tx?.id || 'PAY-2026-004'}</p>
                            </div>
                        </div>
                        <span className={cn(
                            "inline-flex items-center px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
                            tx?.status === 'completed' && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
                            tx?.status === 'failed' && "bg-red-500/20 text-red-400 border border-red-500/30",
                            tx?.status === 'reversed' && "bg-amber-500/20 text-amber-400 border border-amber-500/30",
                            !tx?.status && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        )}>
                            <CheckCircle2 className="w-3 h-3 mr-1.5" />
                            {tx?.status || 'Completed'}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Amount</p>
                            <p className="text-xl font-black text-emerald-400">₹{(tx?.amount || 0).toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Method</p>
                            <p className="text-sm font-bold text-white">{tx?.instrument || 'Bank Transfer'}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Date</p>
                            <p className="text-sm font-bold text-white">{tx?.date || new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* Invoice Details Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice Details</span>
                        </div>
                        <span className="text-[10px] font-mono text-blue-400">Ref: {mockInvoice.id}</span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest mb-1">Generated On</p>
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-200">{new Date(mockInvoice.generatedOn).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest mb-1">Due Date</p>
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-200">{new Date(mockInvoice.dueDate).toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-px bg-blue-200/50 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-800/50">
                            <div className="p-3 bg-white dark:bg-slate-900/80 text-center">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Principal</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">₹{mockInvoice.principalComponent.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900/80 text-center">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Interest</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">₹{mockInvoice.interestComponent.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900/80 text-center">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Penalty</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">₹{mockInvoice.penaltyComponent}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction Reference Card */}
                {transactionRef && (
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-sm">
                            <CreditCard className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">UTR / Reference ID</p>
                            <p className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-300">{transactionRef}</p>
                        </div>
                    </div>
                )}

                {/* Quick Actions Info */}
                <div className="p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Download className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Download Payment Receipt</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-slate-500 hover:text-blue-600">
                        Download
                    </Button>
                </div>
            </div>
        );

        // Step 2: Edit Details
        const renderEditStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Edit Info Banner */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200/50 dark:border-amber-700/30 backdrop-blur-sm flex gap-3">
                    <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-sm">
                        <Edit3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">Modify Transaction</h4>
                        <p className="text-xs text-amber-700/80 dark:text-amber-400/70 mt-0.5">Changes will be logged in the audit trail</p>
                    </div>
                </div>

                {/* Amount */}
                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                        Payment Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none",
                                "text-lg font-black text-slate-900 dark:text-white",
                                "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-blue-50/50 dark:focus:bg-blue-900/10",
                                "transition-all duration-200"
                            )}
                        />
                    </div>
                </div>

                {/* Payment Method */}
                <div>
                    <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</div>
                    <div className="grid grid-cols-3 gap-2">
                        {METHODS.map(m => (
                            <button
                                key={m}
                                onClick={() => setPaymentMethod(m)}
                                className={cn(
                                    "py-2.5 text-xs font-bold uppercase border transition-all",
                                    paymentMethod === m
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-500/10"
                                        : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-400"
                                )}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date and Ref */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                            Payment Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10" />
                            <input
                                type="date"
                                value={receiveDate}
                                onChange={(e) => setReceiveDate(e.target.value)}
                                className={cn(
                                    "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none",
                                    "text-sm font-bold text-slate-900 dark:text-white",
                                    "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-blue-50/50 dark:focus:bg-blue-900/10",
                                    "transition-all duration-200"
                                )}
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                            Transaction ID / UTR
                        </label>
                        <input
                            type="text"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            className={cn(
                                "w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none",
                                "text-sm font-bold text-slate-900 dark:text-white font-mono",
                                "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-blue-50/50 dark:focus:bg-blue-900/10",
                                "transition-all duration-200"
                            )}
                        />
                    </div>
                </div>

                {/* Notes */}
                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                        Notes (Optional)
                    </label>
                    <textarea
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="Add notes about this modification..."
                        className={cn(
                            "w-full h-20 p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none",
                            "text-sm text-slate-900 dark:text-white resize-none placeholder:text-slate-400",
                            "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-blue-50/50 dark:focus:bg-blue-900/10",
                            "transition-all duration-200"
                        )}
                    />
                </div>
            </div>
        );

        // Step 3: Confirm Changes
        const renderConfirmStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Updated Amount Display */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-6 text-center">
                    <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Updated Amount</p>
                    <p className="text-4xl font-black text-white mt-1">₹{amount.toLocaleString()}</p>
                </div>

                {/* Changes Summary */}
                <div>
                    <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Changes Summary</div>
                    <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                        <div className="p-4 bg-white dark:bg-slate-900">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Method</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{paymentMethod}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Date</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(receiveDate).toLocaleDateString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* Reference Info */}
                {transactionRef && (
                    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-sm">
                            <CreditCard className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest">Transaction Reference</p>
                            <p className="text-sm font-mono font-bold text-blue-700 dark:text-blue-300">{transactionRef}</p>
                        </div>
                    </div>
                )}

                {/* Audit Note */}
                <div className="p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        This modification will be logged in the activity trail with your user ID and timestamp.
                    </p>
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="TRANSACTION DETAILS"
                subtitle={tx?.id || 'PAY-2026-004'}
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step === 1 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                                onClick={() => setStep(step + 1)}
                                rightIcon={<Edit3 className="w-4 h-4" />}
                            >
                                Edit Payment
                            </Button>
                        ) : step === 2 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                                onClick={() => setStep(step + 1)}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                onClick={() => onConfirm('edit_payment', {
                                    transactionId: tx?.id,
                                    amount,
                                    method: paymentMethod,
                                    date: receiveDate,
                                    ref: transactionRef,
                                    note: paymentNote
                                })}
                                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                            >
                                Save Changes
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderTransactionStep()}
                {step === 2 && renderEditStep()}
                {step === 3 && renderConfirmStep()}
            </WizardModal>
        );
    };

    // --- REJECT/REVERSE PAYMENT MODAL ---
    const RejectPaymentContent = () => {
        const tx = payload?.transaction;
        const [step, setStep] = useState(1);
        const [reason, setReason] = useState('');
        const [notes, setNotes] = useState('');

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Reason', description: 'Select Reason' },
            { id: 2, label: 'Confirm', description: 'Reverse Payment' }
        ];

        const REASONS = [
            'Failed Transaction',
            'Duplicate Payment',
            'Fraudulent Transaction',
            'Data Entry Error',
            'Customer Request',
            'Other'
        ];

        const renderReasonStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Transaction Summary */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Transaction</p>
                            <p className="text-lg font-bold text-white font-mono">{tx?.referenceId || tx?.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                            <p className="text-xl font-black text-red-400">₹{(tx?.amount || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Reason Selection */}
                <div>
                    <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Reason for Reversal <span className="text-red-500">*</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {REASONS.map(r => (
                            <button
                                key={r}
                                onClick={() => setReason(r)}
                                className={cn(
                                    "p-4 border transition-all text-left",
                                    reason === r
                                        ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                                        : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-red-400"
                                )}
                            >
                                <span className="text-xs font-bold uppercase">{r}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Additional Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Provide additional context for this reversal..."
                        className="w-full h-24 p-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 text-sm text-slate-900 dark:text-white resize-none"
                    />
                </div>
            </div>
        );

        const renderConfirmStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Warning */}
                <div className="bg-red-900/20 border border-red-500/30 p-4 flex gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-red-400">This action cannot be undone</p>
                        <p className="text-xs text-red-300/70 mt-1">Reversing this payment will update the ledger and reflect in the outstanding balance.</p>
                    </div>
                </div>

                {/* Reversal Summary */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-6 text-center">
                    <AlertOctagon className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Amount to Reverse</p>
                    <p className="text-4xl font-black text-red-400 mt-1">₹{(tx?.amount || 0).toLocaleString()}</p>
                </div>

                <div className="p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Reason</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{reason}</p>
                    {notes && <p className="text-xs text-slate-500 mt-2">{notes}</p>}
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="REVERSE PAYMENT"
                subtitle="LEDGER CORRECTION"
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < 2 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-red-600 hover:bg-red-700"
                                onClick={() => setStep(step + 1)}
                                disabled={!reason}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20"
                                onClick={() => onConfirm('reject_payment', {
                                    transactionId: tx?.id,
                                    reason,
                                    notes
                                })}
                                leftIcon={<AlertTriangle className="w-4 h-4" />}
                            >
                                Reverse Payment
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderReasonStep()}
                {step === 2 && renderConfirmStep()}
            </WizardModal>
        );
    };

    const CloseLoanContent = () => {
        const [step, setStep] = useState(1);
        const [mode, setMode] = useState<'settlement' | 'writeoff'>('settlement');
        const [transactionId, setTransactionId] = useState('');
        const [settlementDate, setSettlementDate] = useState(new Date().toISOString().split('T')[0]);
        const [generateNOC, setGenerateNOC] = useState(true);
        const [closureReason, setClosureReason] = useState('Write-off (Bad Debt)');

        const calculateSettlement = () => loan.financials.outstandingBalance + 2400;

        const STEPS: WizardStep[] = mode === 'settlement'
            ? [
                { id: 1, label: 'Mode', description: 'Select Closure Type' },
                { id: 2, label: 'Settlement', description: 'Payment Details' },
                { id: 3, label: 'Confirm', description: 'Final Review' }
            ]
            : [
                { id: 1, label: 'Mode', description: 'Select Closure Type' },
                { id: 2, label: 'Write-off', description: 'Loss Declaration' }
            ];

        const renderModeStep = () => (
            <div className="space-y-6 animate-fade-in">
                {/* Dark Loan Summary */}
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Outstanding</p>
                            <p className="text-xl font-black text-white">₹{loan.financials.outstandingBalance.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">EMIs Paid</p>
                            <p className="text-xl font-black text-emerald-400">{0}/{loan.financials.termMonths}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Borrower</p>
                            <p className="text-sm font-bold text-white">{loan.borrower.name}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Closure Type</div>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setMode('settlement')}
                        className={cn(
                            "p-6 border transition-all text-left",
                            mode === 'settlement'
                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-lg shadow-emerald-500/10"
                                : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-emerald-400"
                        )}
                    >
                        <CheckCircle2 className={cn("w-8 h-8 mb-3", mode === 'settlement' ? "text-emerald-500" : "text-slate-400")} />
                        <h4 className={cn("text-sm font-bold mb-1", mode === 'settlement' ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300")}>Full Settlement</h4>
                        <p className="text-xs text-slate-500">Borrower pays remaining balance. NOC will be generated.</p>
                    </button>
                    <button
                        onClick={() => setMode('writeoff')}
                        className={cn(
                            "p-6 border transition-all text-left",
                            mode === 'writeoff'
                                ? "bg-red-50 dark:bg-red-900/20 border-red-500 shadow-lg shadow-red-500/10"
                                : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-red-400"
                        )}
                    >
                        <AlertTriangle className={cn("w-8 h-8 mb-3", mode === 'writeoff' ? "text-red-500" : "text-slate-400")} />
                        <h4 className={cn("text-sm font-bold mb-1", mode === 'writeoff' ? "text-red-700 dark:text-red-400" : "text-slate-700 dark:text-slate-300")}>Write-off / Loss</h4>
                        <p className="text-xs text-slate-500">Declare as bad debt. Requires senior authorization.</p>
                    </button>
                </div>
            </div>
        );

        const renderSettlementStep = () => (
            <div className="space-y-6 animate-fade-in">
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider mb-1">Final Settlement Amount</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">₹{calculateSettlement().toLocaleString()}</span>
                                <span className="text-xs font-bold text-emerald-600/60">incl. interest</span>
                            </div>
                        </div>
                        <Badge variant="success" className="text-[10px]">SYSTEM CALCULATED</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-emerald-500 transition-colors">
                            Settlement Date
                        </label>
                        <input
                            type="date"
                            value={settlementDate}
                            onChange={(e) => setSettlementDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-emerald-500 transition-colors">
                            Payment Mode
                        </label>
                        <select className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-slate-900 dark:text-white">
                            <option>Bank Transfer</option>
                            <option>Cheque</option>
                            <option>Demand Draft</option>
                        </select>
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-emerald-500 transition-colors">
                        Transaction ID
                    </label>
                    <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Required for reconciliation"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Generate & Send NOC Automatically</span>
                    <button
                        onClick={() => setGenerateNOC(!generateNOC)}
                        className={cn(
                            "w-12 h-6 rounded-full transition-colors relative",
                            generateNOC ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                            generateNOC ? "left-7" : "left-1"
                        )} />
                    </button>
                </div>
            </div>
        );

        const renderWriteoffStep = () => (
            <div className="space-y-6 animate-fade-in">
                <div className="p-4 bg-red-500/10 border border-red-500/30 flex gap-3 backdrop-blur-sm">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-red-600 dark:text-red-400">Write-off Initiation</p>
                        <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                            This will trigger a debt recovery workflow and negatively impact the borrower's credit score. Senior authorization required.
                        </p>
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">
                        Closure Reason
                    </label>
                    <select
                        value={closureReason}
                        onChange={(e) => setClosureReason(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-bold text-slate-900 dark:text-white"
                    >
                        <option>Write-off (Bad Debt)</option>
                        <option>Settlement (Partial Waiver)</option>
                        <option>Transfer to Collections Agency</option>
                        <option>Repossession of Asset</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">
                            Recovered Amount (If Any)
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-bold text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Authority Letter
                        </label>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 border-dashed text-xs font-bold uppercase text-slate-500 hover:border-red-400 transition-colors">
                            <Upload className="w-4 h-4" /> Upload Document
                        </button>
                    </div>
                </div>
            </div>
        );

        const renderConfirmStep = () => (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-6 text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Final Settlement</p>
                    <p className="text-4xl font-black text-white mt-2">₹{calculateSettlement().toLocaleString()}</p>
                    <p className="text-sm text-slate-400 mt-2">Loan will be marked as Closed</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Settlement Date</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(settlementDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">NOC Generation</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{generateNOC ? 'Automatic' : 'Manual'}</p>
                    </div>
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="CLOSE LOAN"
                subtitle={mode === 'settlement' ? 'FULL SETTLEMENT' : 'WRITE-OFF'}
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1]?.label || 'Close'}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < STEPS.length ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                                onClick={() => setStep(step + 1)}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className={cn(
                                    "rounded-none shadow-lg",
                                    mode === 'settlement'
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20"
                                        : "bg-red-600 text-white hover:bg-red-700 shadow-red-500/20"
                                )}
                                onClick={() => onConfirm('close_loan', { mode, transactionId, settlementDate, generateNOC, closureReason })}
                                leftIcon={mode === 'settlement' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            >
                                {mode === 'settlement' ? 'Close as Paid' : 'Submit Write-off'}
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderModeStep()}
                {step === 2 && mode === 'settlement' && renderSettlementStep()}
                {step === 2 && mode === 'writeoff' && renderWriteoffStep()}
                {step === 3 && mode === 'settlement' && renderConfirmStep()}
            </WizardModal>
        );
    };

    const CancelApprovalContent = () => {
        const [step, setStep] = useState(1);
        const [reason, setReason] = useState('Error in Terms (Rate/Amount)');
        const [note, setNote] = useState('');

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Reason', description: 'Justification' },
            { id: 2, label: 'Confirm', description: 'Revoke Status' }
        ];

        const renderReasonStep = () => (
            <div className="space-y-6 animate-fade-in">
                <div>
                    <SectionLabel label="Reason for Cancellation" />
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                        <option>Error in Terms (Rate/Amount)</option>
                        <option>Borrower Requested Change</option>
                        <option>New Risk Information Found</option>
                        <option>Duplicate Application</option>
                        <option>Other / Administrative</option>
                    </select>
                </div>
                <div>
                    <SectionLabel label="Internal Note" />
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full h-32 p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all text-sm text-slate-900 dark:text-white resize-none placeholder:text-slate-400"
                        placeholder="Explain why the approval is being revoked..."
                    />
                </div>
            </div>
        );

        const renderConfirmStep = () => (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-8 text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertOctagon className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">REVOKE APPROVAL?</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
                        This will stop the disbursement process and revert the loan status to <strong className="text-white">Pending</strong>.
                    </p>

                    <div className="text-left bg-slate-800/50 p-4 border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Selected Reason</span>
                        </div>
                        <p className="font-bold text-white text-sm">{reason}</p>
                    </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600/90 dark:text-red-400/90 leading-relaxed font-medium">
                        <strong>Warning:</strong> The scheduled 24-hour notification timer will be aborted immediately. Integrations with Disbursement systems will be paused.
                    </p>
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="CANCEL APPROVAL"
                subtitle="REVOKE SCHEDULED NOTIFICATION"
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < 2 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                                onClick={() => setStep(step + 1)}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20"
                                onClick={() => onConfirm('cancel_approval', { reason, note })}
                                leftIcon={<AlertOctagon className="w-4 h-4" />}
                            >
                                Confirm Cancellation
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderReasonStep()}
                {step === 2 && renderConfirmStep()}
            </WizardModal>
        );
    };

    const EditTermsContent = () => {
        const [step, setStep] = useState(1);
        // Initialize with safe defaults even if loan data might be missing specific fields
        const [amount, setAmount] = useState(loan.financials.principalAmount);
        const [rate, setRate] = useState(loan.financials.interestRate);
        const [tenure, setTenure] = useState(loan.financials.termMonths);
        const [fee, setFee] = useState('1.5%');

        const STEPS: WizardStep[] = [
            { id: 1, label: 'Terms', description: 'Modify Parameters' },
            { id: 2, label: 'Confirm', description: 'Reset Verification' }
        ];

        const renderTermsStep = () => (
            <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">
                            Sanctioned Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">
                            Interest Rate (%)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Fixed</span>
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">
                            Tenure (Months)
                        </label>
                        <input
                            type="number"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">
                            Processing Fee
                        </label>
                        <input
                            type="text"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 flex gap-3">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full h-fit">
                        <Clock className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300">Estimated New EMI</p>
                        <p className="text-xl font-black text-blue-800 dark:text-blue-200 mt-1">
                            ₹{Math.round((amount * (rate / 1200) * Math.pow(1 + rate / 1200, tenure)) / (Math.pow(1 + rate / 1200, tenure) - 1)).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-blue-600/70 mt-1">Calculated based on fixed interest method</p>
                    </div>
                </div>
            </div>
        );

        const renderConfirmStep = () => (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900 dark:bg-black/60 backdrop-blur-sm border border-slate-800 p-8 text-center">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Settings className="w-10 h-10 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">VERIFICATION RESET</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
                        Modifying critical terms will invalidate the current approval. The loan will be moved back to the <strong>Underwriting</strong> stage.
                    </p>

                    <div className="grid grid-cols-2 gap-px bg-slate-800 border border-slate-700 mt-4 text-left">
                        <div className="p-3 bg-slate-900/50">
                            <p className="text-[10px] uppercase font-bold text-slate-500">New Amount</p>
                            <p className="font-bold text-white">₹{amount.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-slate-900/50">
                            <p className="text-[10px] uppercase font-bold text-slate-500">New Tenure</p>
                            <p className="font-bold text-white">{tenure} Months</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-600/90 dark:text-amber-400/90 leading-relaxed font-medium">
                        <strong>Action Required:</strong> You will need to re-generate the sanction letter and obtain borrower e-signatures again.
                    </p>
                </div>
            </div>
        );

        return (
            <WizardModal
                isOpen={true}
                onClose={onClose}
                title="EDIT LOAN TERMS"
                subtitle="REQUIRES RE-APPROVAL"
                steps={STEPS}
                currentStep={step}
                onStepClick={(id) => setStep(Number(id))}
                contentTitle={STEPS[step - 1].label}
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {step < 2 ? (
                            <Button
                                variant="primary"
                                className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                                onClick={() => setStep(step + 1)}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-none bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/20"
                                onClick={() => onConfirm('edit_terms', { amount, rate, tenure, fee })}
                                leftIcon={<Settings className="w-4 h-4" />}
                            >
                                Save & Re-queue
                            </Button>
                        )}
                    </div>
                }
            >
                {step === 1 && renderTermsStep()}
                {step === 2 && renderConfirmStep()}
            </WizardModal>
        );
    };



    const getModalConfig = () => {
        switch (activeAction) {

            case 'escalate':
                return {
                    title: 'Escalate Application',
                    subtitle: 'Senior Review Required',
                    icon: ShieldAlert,
                    color: 'text-rose-600',
                    content: <EscalateContent />,
                    primaryAction: 'Submit Escalation',
                    primaryVariant: 'danger' as const,
                    maxWidth: 'max-w-xl'
                };
            case 'permission_denied':
                return {
                    title: 'Permission Required',
                    subtitle: 'Access Control',
                    icon: ShieldAlert,
                    color: 'text-slate-900',
                    content: <PermissionDeniedContent />,
                    primaryAction: undefined,
                    secondaryAction: 'Close',
                    maxWidth: 'max-w-md'
                };
            case 'reverse_payment':
                return {
                    title: 'Reverse Transaction',
                    subtitle: 'Audit & Ledger Impact',
                    icon: AlertTriangle,
                    color: 'text-red-600',
                    content: <ReversePaymentContent />,
                    primaryAction: 'Request Reversal',
                    primaryVariant: 'danger' as const,
                    maxWidth: 'max-w-xl'
                };
            case 'assign_officer':
                return {
                    title: 'Assign Officer',
                    subtitle: 'Workload Management',
                    icon: User,
                    color: 'text-indigo-600',
                    content: <AssignOfficerContent />,
                    primaryAction: 'Confirm Assignment',
                    primaryVariant: 'primary' as const,
                    maxWidth: 'max-w-5xl'
                };
            case 'edit_financials':
                return {
                    title: 'Modify Financial Terms',
                    subtitle: 'Interest & Principal',
                    icon: Banknote,
                    color: 'text-indigo-600',
                    content: <EditInterestContent />,
                    primaryAction: 'Save Proposal',
                    primaryVariant: 'primary' as const,
                    maxWidth: 'max-w-5xl'
                };
            case 'noc_preview':
                return {
                    title: 'Issue NOC',
                    subtitle: 'Completion Certificate',
                    icon: FileText,
                    color: 'text-indigo-600',
                    content: <NOCPreviewContent />,
                    primaryAction: 'Sign & Issue',
                    primaryVariant: 'primary' as const,
                    maxWidth: 'max-w-5xl'
                };
            case 'request_info':
                return {
                    title: 'Request Information',
                    subtitle: 'Borrower Input Required',
                    icon: AlertTriangle,
                    color: 'text-amber-600',
                    content: <RequestInfoContent />,
                    primaryAction: 'Send Request',
                    primaryVariant: 'primary' as const,
                    maxWidth: 'max-w-5xl'
                };
            case 'restructure':
                return {
                    title: 'Restructure Loan',
                    subtitle: 'Modify Terms & Repayment',
                    icon: Settings,
                    color: 'text-indigo-600',
                    content: <RestructureLoanContent />,
                    primaryAction: 'Confirm Restructure',
                    primaryVariant: 'danger' as const,
                    maxWidth: 'max-w-4xl'
                };
            case 'approve_instant':
                return {
                    title: 'Instant Approval',
                    subtitle: loan.referenceId,
                    icon: CheckCircle2,
                    color: 'text-emerald-600',
                    content: <ApproveInstantContent />,
                    primaryAction: 'Confirm & Notify',
                    primaryVariant: 'success' as const,
                    maxWidth: 'max-w-5xl' // Enhanced for sidebar
                };
            case 'approve_schedule':
                return {
                    title: 'Schedule Approval',
                    subtitle: '24-Hour Cooling Period',
                    icon: Clock,
                    color: 'text-blue-600',
                    content: <ApproveScheduleContent />,
                    primaryAction: 'Schedule Activation',
                    primaryVariant: 'secondary' as const
                };
            case 'reject':
                return {
                    title: 'Reject Application',
                    subtitle: 'Irreversible Action',
                    icon: AlertOctagon,
                    color: 'text-red-600',
                    content: <RejectContent />,
                    primaryAction: 'Reject Application',
                    primaryVariant: 'danger' as const
                };
            case 'add_payment':
                return {
                    title: 'Record Payment',
                    subtitle: 'Manual Ledger Entry',
                    icon: Banknote,
                    color: 'text-emerald-600',
                    content: <AddPaymentContent />,
                    primaryAction: 'Post Payment',
                    primaryVariant: 'success' as const,
                    maxWidth: 'max-w-5xl'
                };
            case 'cancel_approval':
                return {
                    title: 'Cancel Approval',
                    subtitle: 'Revoke Scheduled Notification',
                    icon: AlertOctagon,
                    color: 'text-red-600',
                    content: <CancelApprovalContent />,
                    primaryAction: 'Confirm Cancellation',
                    primaryVariant: 'danger' as const
                };
            case 'edit_terms':
                return {
                    title: 'Edit Loan Terms',
                    subtitle: 'Requires Re-Approval',
                    icon: Settings,
                    color: 'text-amber-600',
                    content: <EditTermsContent />,
                    primaryAction: 'Save & Re-queue',
                    primaryVariant: 'primary' as const
                };
            default:
                return null;
        }
    };

    // --- RENDER LOGIC ---

    // Direct WizardModal Returns (Legacy ModalWrapper Bypassed)
    if (activeAction === 'view_document') return <ViewDocumentContent />;
    if (activeAction === 'approve_instant') return <ApproveInstantContent />;
    if (activeAction === 'approve_schedule') return <ApproveScheduleContent />;
    if (activeAction === 'reject') return <RejectContent />;
    if (activeAction === 'request_info') return <RequestInfoContent />;
    if (activeAction === 'add_payment') return <AddPaymentContent />;
    if (activeAction === 'edit_payment') return <EditPaymentContent />;
    if (activeAction === 'reject_payment') return <RejectPaymentContent />;
    if (activeAction === 'close_loan') return <CloseLoanContent />;
    if (activeAction === 'download_pdf') return <DownloadPDFContent />;
    if (activeAction === 'cancel_approval') return <CancelApprovalContent />;
    if (activeAction === 'edit_terms') return <EditTermsContent />;

    // Legacy Standard Modals
    const config = getModalConfig();
    if (!config) return null;

    return (
        <ModalWrapper
            isOpen={!!activeAction}
            onClose={onClose}
            title={config.title}
            subtitle={config.subtitle}
            icon={config.icon}
            colorClass={config.color}
            primaryAction={config.primaryAction}
            onPrimaryAction={() => onConfirm(activeAction!, { scheduleDate, scheduleTime })}
            primaryVariant={config.primaryVariant}
        >
            {config.content}
        </ModalWrapper>
    );
}
