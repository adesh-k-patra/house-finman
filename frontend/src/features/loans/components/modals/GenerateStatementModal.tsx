/**
 * Generate Statement Modal
 * Generate PDF statements with date range
 */

import { useState } from 'react';
import { WizardModal } from '@/components/ui/WizardModal';
import { Button } from '@/components/ui/Button';
import { Loan } from '../../types';
import { cn } from '@/utils';
import { FileText, Download, CheckCircle2, ChevronRight, Mail, Eye } from 'lucide-react';

interface GenerateStatementModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onGenerate: (data: StatementData) => void;
}

interface StatementData {
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel';
    includeTransactions: boolean;
    includeSchedule: boolean;
    sendEmail: boolean;
}

const steps = [
    { id: 1, label: 'Period', description: 'Select date range' },
    { id: 2, label: 'Options', description: 'Configure' },
    { id: 3, label: 'Generate', description: 'Download' }
];

export function GenerateStatementModal({ isOpen, onClose, loan, onGenerate }: GenerateStatementModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [startDate, setStartDate] = useState(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
    const [includeTransactions, setIncludeTransactions] = useState(true);
    const [includeSchedule, setIncludeSchedule] = useState(true);
    const [sendEmail, setSendEmail] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setIsGenerated(true);
            onGenerate({ startDate, endDate, format, includeTransactions, includeSchedule, sendEmail });
        }, 2000);
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            {/* Loan Summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border text-center">
                    <p className="text-xs font-bold text-slate-500">Loan Reference</p>
                    <p className="text-lg font-bold">{loan.referenceId}</p>
                </div>
                <div className="p-4 bg-slate-50 border text-center">
                    <p className="text-xs font-bold text-slate-500">Borrower</p>
                    <p className="text-lg font-bold">{loan.borrower.name}</p>
                </div>
            </div>

            {/* Quick Select */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-3">Quick Select Period</label>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: 'Last 30 Days', days: 30 },
                        { label: 'Last 90 Days', days: 90 },
                        { label: 'Last 6 Months', days: 180 },
                        { label: 'Last Year', days: 365 }
                    ].map(period => (
                        <button
                            key={period.days}
                            onClick={() => {
                                setStartDate(new Date(Date.now() - period.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                                setEndDate(new Date().toISOString().split('T')[0]);
                            }}
                            className="px-3 py-2 text-xs bg-slate-100 border hover:bg-slate-200"
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 border" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border" />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            {/* Format Selection */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-3">Output Format</label>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setFormat('pdf')} className={cn("p-4 border text-center", format === 'pdf' ? "border-primary-500 bg-primary-50" : "border-slate-200")}>
                        <FileText className={cn("w-8 h-8 mx-auto mb-2", format === 'pdf' ? "text-primary-600" : "text-slate-400")} />
                        <p className="font-bold">PDF</p>
                        <p className="text-xs text-slate-500">Printable document</p>
                    </button>
                    <button onClick={() => setFormat('excel')} className={cn("p-4 border text-center", format === 'excel' ? "border-primary-500 bg-primary-50" : "border-slate-200")}>
                        <FileText className={cn("w-8 h-8 mx-auto mb-2", format === 'excel' ? "text-primary-600" : "text-slate-400")} />
                        <p className="font-bold">Excel</p>
                        <p className="text-xs text-slate-500">Spreadsheet format</p>
                    </button>
                </div>
            </div>

            {/* Include Options */}
            <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500">Include in Statement</label>
                <label className="flex items-center gap-3 p-4 bg-slate-50 border cursor-pointer">
                    <input type="checkbox" checked={includeTransactions} onChange={(e) => setIncludeTransactions(e.target.checked)} />
                    <div>
                        <p className="font-medium">Transaction History</p>
                        <p className="text-xs text-slate-500">All payments received</p>
                    </div>
                </label>
                <label className="flex items-center gap-3 p-4 bg-slate-50 border cursor-pointer">
                    <input type="checkbox" checked={includeSchedule} onChange={(e) => setIncludeSchedule(e.target.checked)} />
                    <div>
                        <p className="font-medium">Repayment Schedule</p>
                        <p className="text-xs text-slate-500">EMI amortization table</p>
                    </div>
                </label>
            </div>

            {/* Email Option */}
            <label className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-200 cursor-pointer">
                <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <div>
                        <p className="font-medium">Email to Borrower</p>
                        <p className="text-xs text-slate-500">{loan.borrower.email}</p>
                    </div>
                </div>
            </label>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            {!isGenerated ? (
                <div className="text-center py-8">
                    {isGenerating ? (
                        <>
                            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-lg font-bold">Generating Statement...</p>
                            <p className="text-sm text-slate-500">Please wait</p>
                        </>
                    ) : (
                        <>
                            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-lg font-bold">Ready to Generate</p>
                            <p className="text-sm text-slate-500">Click the button below to create your statement</p>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className="text-center py-8 bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                        <p className="text-lg font-bold text-emerald-700">Statement Generated!</p>
                        <p className="text-sm text-slate-500">Your statement is ready for download</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="primary" className="flex-1" leftIcon={<Download className="w-4 h-4" />}>Download {format.toUpperCase()}</Button>
                        <Button variant="secondary" className="flex-1" leftIcon={<Eye className="w-4 h-4" />}>Preview</Button>
                    </div>
                    {sendEmail && (
                        <p className="text-sm text-emerald-600 text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Email sent to {loan.borrower.email}
                        </p>
                    )}
                </>
            )}

            {/* Summary */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-slate-50 border"><span>Period</span><span className="font-bold">{startDate} to {endDate}</span></div>
                <div className="flex justify-between p-3 bg-slate-50 border"><span>Format</span><span className="font-bold uppercase">{format}</span></div>
            </div>
        </div>
    );

    const footer = (
        <div className="flex justify-between">
            {currentStep > 1 && !isGenerated ? <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>Back</Button> : <div />}
            <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>{isGenerated ? 'Done' : 'Cancel'}</Button>
                {currentStep < 3 ? (
                    <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)} rightIcon={<ChevronRight className="w-4 h-4" />}>Next</Button>
                ) : !isGenerated && (
                    <Button variant="primary" onClick={handleGenerate} disabled={isGenerating} leftIcon={<FileText className="w-4 h-4" />}>Generate Statement</Button>
                )}
            </div>
        </div>
    );

    return (
        <WizardModal isOpen={isOpen} onClose={onClose} title="Generate Statement" subtitle="Loan statement" steps={steps} currentStep={currentStep} onStepClick={(id) => !isGenerated && setCurrentStep(Number(id))} contentTitle={steps.find(s => s.id === currentStep)?.label || ''} footer={footer}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
        </WizardModal>
    );
}
