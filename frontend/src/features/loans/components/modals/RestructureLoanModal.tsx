/**
 * Restructure Loan Modal
 * Modify loan terms including tenure, rate, EMI
 */

import { useState } from 'react';
import { WizardModal } from '@/components/ui/WizardModal';
import { Button } from '@/components/ui/Button';
import { Loan } from '../../types';
import { cn, formatCurrency } from '@/utils';
import { RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';

interface RestructureLoanModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onSubmit: (data: RestructureData) => void;
}

interface RestructureData {
    newTenure: number;
    newRate: number;
    reason: string;
}

const steps = [
    { id: 1, label: 'Terms', description: 'Modify terms' },
    { id: 2, label: 'Review', description: 'Compare changes' },
    { id: 3, label: 'Confirm', description: 'Submit' }
];

export function RestructureLoanModal({ isOpen, onClose, loan, onSubmit }: RestructureLoanModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [newTenure, setNewTenure] = useState(loan.financials.termMonths);
    const [newRate, setNewRate] = useState(loan.financials.interestRate);
    const [reason, setReason] = useState('');
    const [acknowledged, setAcknowledged] = useState(false);

    const principal = loan.financials.outstandingBalance || loan.financials.principalAmount;

    // Calculate new EMI
    const calculateEMI = (p: number, r: number, n: number) => {
        const monthlyRate = r / 12 / 100;
        return Math.round((p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
    };

    const oldEMI = loan.financials.emiAmount;
    const newEMI = calculateEMI(principal, newRate, newTenure);
    const emiChange = newEMI - oldEMI;
    const tenureChange = newTenure - loan.financials.termMonths;
    const rateChange = newRate - loan.financials.interestRate;

    const handleSubmit = () => {
        onSubmit({ newTenure, newRate, reason });
        onClose();
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            {/* Current Terms */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border text-center">
                    <p className="text-xs font-bold text-slate-500">Current Tenure</p>
                    <p className="text-xl font-bold">{loan.financials.termMonths} months</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border text-center">
                    <p className="text-xs font-bold text-slate-500">Current Rate</p>
                    <p className="text-xl font-bold">{loan.financials.interestRate}%</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border text-center">
                    <p className="text-xs font-bold text-slate-500">Current EMI</p>
                    <p className="text-xl font-bold">{formatCurrency(oldEMI)}</p>
                </div>
            </div>

            {/* New Tenure */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">New Tenure (months)</label>
                <input
                    type="number"
                    value={newTenure}
                    onChange={(e) => setNewTenure(parseInt(e.target.value) || 0)}
                    min={12}
                    max={360}
                    className="w-full px-4 py-3 border border-slate-200 text-lg font-bold"
                />
                <div className="flex gap-2 mt-2">
                    {[12, 24, 36, 60, 120, 180, 240].map(m => (
                        <button key={m} onClick={() => setNewTenure(m)} className="px-3 py-1 text-xs bg-slate-100 border hover:bg-slate-200">{m}m</button>
                    ))}
                </div>
            </div>

            {/* New Rate */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">New Interest Rate (%)</label>
                <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
                    step={0.25}
                    min={1}
                    max={30}
                    className="w-full px-4 py-3 border border-slate-200 text-lg font-bold"
                />
            </div>

            {/* Reason */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Reason for Restructuring</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 border border-slate-200">
                    <option value="">Select reason...</option>
                    <option value="financial_hardship">Financial Hardship</option>
                    <option value="rate_reduction">Rate Reduction Request</option>
                    <option value="tenure_extension">Tenure Extension</option>
                    <option value="prepayment">Partial Prepayment Adjustment</option>
                    <option value="policy_change">Policy Change</option>
                </select>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-500">Changes Preview</h4>

            {/* Comparison Table */}
            <div className="border border-slate-200">
                <div className="grid grid-cols-3 bg-slate-100 text-xs font-bold text-slate-500 p-3">
                    <span>Parameter</span>
                    <span className="text-center">Current</span>
                    <span className="text-center">New</span>
                </div>
                <div className="divide-y">
                    <div className="grid grid-cols-3 p-4 items-center">
                        <span className="font-medium">Tenure</span>
                        <span className="text-center">{loan.financials.termMonths} mo</span>
                        <span className={cn("text-center font-bold", tenureChange !== 0 && (tenureChange > 0 ? "text-amber-600" : "text-emerald-600"))}>
                            {newTenure} mo {tenureChange !== 0 && `(${tenureChange > 0 ? '+' : ''}${tenureChange})`}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 p-4 items-center">
                        <span className="font-medium">Interest Rate</span>
                        <span className="text-center">{loan.financials.interestRate}%</span>
                        <span className={cn("text-center font-bold", rateChange !== 0 && (rateChange > 0 ? "text-red-600" : "text-emerald-600"))}>
                            {newRate}% {rateChange !== 0 && `(${rateChange > 0 ? '+' : ''}${rateChange.toFixed(2)})`}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 p-4 items-center bg-primary-50">
                        <span className="font-bold">EMI</span>
                        <span className="text-center">{formatCurrency(oldEMI)}</span>
                        <span className={cn("text-center font-bold text-lg", emiChange > 0 ? "text-red-600" : "text-emerald-600")}>
                            {formatCurrency(newEMI)}
                        </span>
                    </div>
                </div>
            </div>

            {/* EMI Impact */}
            <div className={cn("p-4 border flex items-center justify-between", emiChange > 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200")}>
                <span className="font-medium">Monthly EMI Change</span>
                <span className={cn("text-xl font-bold", emiChange > 0 ? "text-red-600" : "text-emerald-600")}>
                    {emiChange > 0 ? '+' : ''}{formatCurrency(Math.abs(emiChange))}
                </span>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="bg-primary-50 border border-primary-200 p-6 text-center">
                <RefreshCw className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary-700">Restructure Confirmation</h3>
                <p className="text-sm text-slate-600 mt-2">Loan {loan.referenceId}</p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between p-4 bg-slate-50 border"><span>New Tenure</span><span className="font-bold">{newTenure} months</span></div>
                <div className="flex justify-between p-4 bg-slate-50 border"><span>New Rate</span><span className="font-bold">{newRate}%</span></div>
                <div className="flex justify-between p-4 bg-slate-50 border"><span>New EMI</span><span className="font-bold text-primary-600">{formatCurrency(newEMI)}</span></div>
            </div>

            <label className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 cursor-pointer">
                <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1" />
                <span className="text-sm text-amber-800">I confirm this restructuring has been approved and the borrower has been notified of the new terms.</span>
            </label>
        </div>
    );

    const footer = (
        <div className="flex justify-between">
            {currentStep > 1 ? <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>Back</Button> : <div />}
            <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                {currentStep < 3 ? (
                    <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)} disabled={!reason} rightIcon={<ChevronRight className="w-4 h-4" />}>Next</Button>
                ) : (
                    <Button variant="primary" onClick={handleSubmit} disabled={!acknowledged} leftIcon={<CheckCircle2 className="w-4 h-4" />}>Restructure Loan</Button>
                )}
            </div>
        </div>
    );

    return (
        <WizardModal isOpen={isOpen} onClose={onClose} title="Restructure Loan" subtitle="Modify terms" steps={steps} currentStep={currentStep} onStepClick={(id) => setCurrentStep(Number(id))} contentTitle={steps.find(s => s.id === currentStep)?.label || ''} footer={footer}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
        </WizardModal>
    );
}
