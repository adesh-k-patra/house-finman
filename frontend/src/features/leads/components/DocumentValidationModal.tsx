import { useState } from 'react'
import { WizardModal, Button } from '@/components/ui'
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    Maximize2,
    Download
} from 'lucide-react'
import { cn } from '@/utils'

interface DocumentValidationModalProps {
    isOpen: boolean
    onClose: () => void
    documentName?: string
    documentUrl?: string
    onApprove: () => void
    onReject: (reason: string) => void
}

export function DocumentValidationModal({
    isOpen,
    onClose,
    documentName = "PAN Card.pdf",
    // documentUrl, // In real app, this would be the source
    onApprove,
    onReject
}: DocumentValidationModalProps) {

    // Validation Checklist State
    const [checklist, setChecklist] = useState({
        isClear: true,
        isValidFormat: true,
        matchesDetails: true,
        notExpired: true
    })

    const [rejectReason, setRejectReason] = useState('')
    const isAllChecked = Object.values(checklist).every(Boolean)

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Document Validation"
            subtitle={`Verifying: ${documentName}`}
            currentStep={1}
            steps={[{ id: 1, label: 'Review', description: 'Validate Document' }]}
            contentTitle="Review & Approve"
            footer={
                <div className="flex gap-3 w-full justify-end">
                    <Button
                        variant="secondary"
                        className="rounded-none px-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onReject(rejectReason)}
                        disabled={!rejectReason && isAllChecked} // Require reason if rejecting (conceptually)
                        leftIcon={<XCircle className="w-4 h-4" />}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="primary"
                        className="rounded-none shadow-lg shadow-emerald-500/20 px-8 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
                        onClick={onApprove}
                        disabled={!isAllChecked}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                        Approve Document
                    </Button>
                </div>
            }
        >
            <div className="h-[65vh] flex flex-col lg:flex-row gap-6 animate-fade-in">

                {/* Left Pane: Document Viewer */}
                <div className="flex-1 bg-slate-900 border border-slate-700/50 rounded-lg overflow-hidden flex flex-col relative group">
                    {/* Toolbar */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-mono text-white">PAGE 1 / 1</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 bg-black/50 backdrop-blur-md rounded hover:bg-white/20 text-white transition-colors"><Download className="w-4 h-4" /></button>
                            <button className="p-2 bg-black/50 backdrop-blur-md rounded hover:bg-white/20 text-white transition-colors"><Maximize2 className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* Content Placeholder (Simulating PDF) */}
                    <div className="flex-1 flex items-center justify-center bg-[#525659] p-8 overflow-auto">
                        <div className="w-[80%] aspect-[1.58] bg-white shadow-2xl rounded-sm p-8 flex flex-col gap-6 relative">
                            {/* Mock ID Card Visual */}
                            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center font-serif text-2xl font-bold">G</div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Income Tax Department</h3>
                                        <h1 className="text-lg font-black text-slate-900 uppercase">Govt. of India</h1>
                                    </div>
                                </div>
                                <div className="w-16 h-20 bg-slate-200 border border-slate-300"></div>
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Permanent Account Number</p>
                                    <p className="font-bold text-lg tracking-wider">ABCDE1234F</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Name</p>
                                    <p className="font-bold">VIKRAM S. RATHORE</p>
                                </div>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase">Father's Name</p>
                                        <p className="font-bold">S. RATHORE</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase">DOB</p>
                                        <p className="font-bold">12/05/1985</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-8 w-24 h-12 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 border border-slate-200">
                                Signature
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Pane: Validation Controls */}
                <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">

                    {/* AI Extraction Confidence */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-black text-blue-900 dark:text-blue-100 uppercase tracking-widest flex items-center gap-2">
                                <Search className="w-3 h-3" /> AI Analysis
                            </h4>
                            <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">98% Match</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Name Match</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">Exact</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">DOB Check</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">Verified</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Forgery Detect</span>
                                <span className="font-mono font-bold text-emerald-600">Clean</span>
                            </div>
                        </div>
                    </div>

                    {/* Manual Checklist */}
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Verification Checklist</h4>
                        <div className="space-y-2">
                            {[
                                { key: 'isClear', label: 'Document is clear & readable' },
                                { key: 'isValidFormat', label: 'Valid Government Format' },
                                { key: 'matchesDetails', label: 'Details match Lead Profile' },
                                { key: 'notExpired', label: 'Document is not expired' }
                            ].map((item) => (
                                <div
                                    key={item.key}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                                        checklist[item.key as keyof typeof checklist]
                                            ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/50"
                                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 hover:border-slate-300"
                                    )}
                                    onClick={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof checklist] }))}
                                >
                                    <span className={cn("text-xs font-bold", checklist[item.key as keyof typeof checklist] ? "text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400")}>{item.label}</span>
                                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center transition-colors", checklist[item.key as keyof typeof checklist] ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700")}>
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rejection Reason (Conditional) */}
                    {!isAllChecked && (
                        <div className="animate-slide-up-fade">
                            <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2"><AlertCircle className="w-3 h-3" /> Rejection Reason</h4>
                            <textarea
                                className="w-full text-sm p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-500/20 min-h-[80px] focus:ring-2 focus:ring-red-500/20 outline-none resize-none"
                                placeholder="Please specify why this document is being rejected..."
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                            />
                        </div>
                    )}

                </div>

            </div>
        </WizardModal>
    )
}
