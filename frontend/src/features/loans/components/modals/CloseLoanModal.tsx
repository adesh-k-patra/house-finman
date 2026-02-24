/**
 * Close Loan Modal - Paid/Unpaid closure options
 */

import { useState } from 'react';
import { WizardModal } from '@/components/ui/WizardModal';
import { Button } from '@/components/ui/Button';
import { Loan } from '../../types';
import { cn, formatCurrency } from '@/utils';
import {
    CheckCircle2, XCircle, AlertTriangle, ChevronRight
} from 'lucide-react';

interface CloseLoanModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onSubmit: (data: { closureType: 'paid' | 'unpaid'; amount?: number; reason?: string; generateNOC: boolean }) => void;
}

const steps = [
    { id: 1, label: 'Type', description: 'Select closure type' },
    { id: 2, label: 'Details', description: 'Enter details' },
    { id: 3, label: 'Confirm', description: 'Review & close' }
];

export function CloseLoanModal({ isOpen, onClose, loan, onSubmit }: CloseLoanModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [closureType, setClosureType] = useState<'paid' | 'unpaid'>('paid');
    const [settlementAmount, setSettlementAmount] = useState((loan.financials.outstandingBalance || loan.financials.principalAmount).toString());
    const [writeOffReason, setWriteOffReason] = useState('');
    const [generateNOC, setGenerateNOC] = useState(true);
    const [acknowledged, setAcknowledged] = useState(false);

    const outstanding = loan.financials.outstandingBalance || loan.financials.principalAmount;
    const parsedSettlement = parseFloat(settlementAmount) || 0;

    const handleSubmit = () => {
        onSubmit({ closureType, amount: parsedSettlement, reason: writeOffReason, generateNOC });
        onClose();
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setClosureType('paid')} className={cn("p-6 border text-left", closureType === 'paid' ? "border-emerald-500 bg-emerald-50" : "border-slate-200")}>
                    <CheckCircle2 className={cn("w-8 h-8 mb-3", closureType === 'paid' ? "text-emerald-600" : "text-slate-400")} />
                    <h4 className="text-lg font-bold">Paid Closure</h4>
                    <p className="text-sm text-slate-500 mt-1">Full settlement received</p>
                </button>
                <button onClick={() => setClosureType('unpaid')} className={cn("p-6 border text-left", closureType === 'unpaid' ? "border-red-500 bg-red-50" : "border-slate-200")}>
                    <XCircle className={cn("w-8 h-8 mb-3", closureType === 'unpaid' ? "text-red-600" : "text-slate-400")} />
                    <h4 className="text-lg font-bold">Unpaid Closure</h4>
                    <p className="text-sm text-slate-500 mt-1">Write-off / Bad debt</p>
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            {closureType === 'paid' ? (
                <>
                    <div className="p-4 bg-emerald-50 border border-emerald-200">
                        <div className="flex justify-between py-2"><span>Outstanding</span><span className="font-bold">{formatCurrency(outstanding)}</span></div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Settlement Amount</label>
                        <input type="number" value={settlementAmount} onChange={(e) => setSettlementAmount(e.target.value)} className="w-full px-4 py-3 border border-slate-200 text-lg font-bold" />
                    </div>
                    <label className="flex items-center gap-3 p-4 bg-slate-50 border cursor-pointer">
                        <input type="checkbox" checked={generateNOC} onChange={(e) => setGenerateNOC(e.target.checked)} />
                        <span>Generate NOC Certificate</span>
                    </label>
                </>
            ) : (
                <>
                    <div className="p-4 bg-red-50 border border-red-200 flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <p className="text-sm text-red-600">This will mark the loan as bad debt and report to credit bureaus.</p>
                    </div>
                    <div className="p-4 bg-slate-50 border">
                        <p className="text-xs font-bold text-slate-500">Write-Off Amount</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(outstanding)}</p>
                    </div>
                    <select value={writeOffReason} onChange={(e) => setWriteOffReason(e.target.value)} className="w-full px-4 py-3 border border-slate-200">
                        <option value="">Select reason...</option>
                        <option value="defaulted">Loan Defaulted</option>
                        <option value="bankruptcy">Bankruptcy</option>
                        <option value="deceased">Deceased</option>
                        <option value="fraud">Fraud</option>
                        <option value="settlement">Negotiated Settlement</option>
                    </select>
                </>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className={cn("p-6 text-center border", closureType === 'paid' ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200")}>
                {closureType === 'paid' ? <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" /> : <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />}
                <h3 className={cn("text-xl font-bold", closureType === 'paid' ? "text-emerald-700" : "text-red-700")}>{closureType === 'paid' ? 'Loan Settlement' : 'Loan Write-Off'}</h3>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between p-4 bg-slate-50 border"><span>Borrower</span><span className="font-bold">{loan.borrower.name}</span></div>
                <div className="flex justify-between p-4 bg-slate-50 border"><span>Amount</span><span className={cn("font-bold", closureType === 'paid' ? "text-emerald-600" : "text-red-600")}>{closureType === 'paid' ? formatCurrency(parsedSettlement) : formatCurrency(outstanding)}</span></div>
            </div>
            <label className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 cursor-pointer">
                <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1" />
                <span className="text-sm text-amber-800">I confirm this action and understand it cannot be undone.</span>
            </label>
        </div>
    );

    const footer = (
        <div className="flex justify-between">
            {currentStep > 1 ? <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>Back</Button> : <div />}
            <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                {currentStep < 3 ? (
                    <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)} rightIcon={<ChevronRight className="w-4 h-4" />}>Next</Button>
                ) : (
                    <Button variant={closureType === 'paid' ? 'primary' : 'danger'} onClick={handleSubmit} disabled={!acknowledged}>{closureType === 'paid' ? 'Close Loan' : 'Write Off'}</Button>
                )}
            </div>
        </div>
    );

    return (
        <WizardModal isOpen={isOpen} onClose={onClose} title="Close Loan" subtitle="Loan closure" steps={steps} currentStep={currentStep} onStepClick={(id) => setCurrentStep(Number(id))} contentTitle={steps.find(s => s.id === currentStep)?.label || ''} footer={footer}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
        </WizardModal>
    );
}
