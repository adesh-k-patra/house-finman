/**
 * Instant Approve Modal
 * Multi-step wizard for instant loan approval with validation
 */

import { useState } from 'react';
import { WizardModal } from '@/components/ui/WizardModal';
import { Button } from '@/components/ui/Button';
import { Loan } from '../../types';
import { cn } from '@/utils';
import {
    CheckCircle2, AlertCircle,
    ChevronRight, AlertTriangle
} from 'lucide-react';

interface InstantApproveModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onApprove: (notes: string) => void;
}

const steps = [
    { id: 1, label: 'Validation', description: 'Review checklist' },
    { id: 2, label: 'Terms', description: 'Confirm terms' },
    { id: 3, label: 'Confirm', description: 'Final approval' }
];

export function InstantApproveModal({ isOpen, onClose, loan, onApprove }: InstantApproveModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [notes, setNotes] = useState('');
    const [acknowledged, setAcknowledged] = useState(false);

    const checklist = [
        { id: 'kyc', label: 'KYC Verification', status: loan.borrower.kycStatus === 'verified', required: true },
        { id: 'income', label: 'Income Verification', status: loan.underwritingChecklist?.incomeVerified ?? true, required: true },
        { id: 'collateral', label: 'Collateral Verification', status: loan.underwritingChecklist?.collateralVerified ?? true, required: true },
        { id: 'credit', label: 'Credit Check (CIBIL ≥ 700)', status: loan.borrower.creditScore >= 700, required: true },
        { id: 'aml', label: 'AML Screening', status: loan.amlStatus === 'pass', required: true },
        { id: 'fraud', label: 'Fraud Check', status: loan.fraudCheck === 'pass', required: true },
        { id: 'documents', label: 'Document Verification', status: loan.underwritingChecklist?.allMandatoryDocsVerified ?? true, required: true },
        { id: 'dti', label: 'DTI Ratio (≤ 50%)', status: (loan.riskAssessment?.dtiRatio || 35) <= 50, required: false },
    ];

    const allRequiredPassed = checklist.filter(c => c.required).every(c => c.status);

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleApprove = () => {
        onApprove(notes);
        onClose();
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            {/* Status Banner */}
            <div className={cn(
                "px-5 py-4 flex items-center gap-3 border",
                allRequiredPassed
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                    : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            )}>
                {allRequiredPassed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                )}
                <div>
                    <p className={cn(
                        "font-bold",
                        allRequiredPassed ? "text-emerald-700" : "text-amber-700"
                    )}>
                        {allRequiredPassed ? 'All Checks Passed' : 'Some Checks Pending'}
                    </p>
                    <p className="text-sm text-slate-600">
                        {checklist.filter(c => c.status).length} of {checklist.length} checks verified
                    </p>
                </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
                {checklist.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "flex items-center justify-between px-4 py-3 border",
                            item.status
                                ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30"
                                : "bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {item.status ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                            {item.required && <span className="text-[9px] uppercase font-bold text-red-500">Required</span>}
                        </div>
                        <span className={cn(
                            "text-xs font-bold uppercase px-2 py-0.5 rounded-sm",
                            item.status ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                            {item.status ? 'Verified' : 'Failed'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            {/* Loan Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-5">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-4">Loan Terms Summary</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Principal Amount</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{(loan.financials.principalAmount / 100000).toFixed(2)}L</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Interest Rate</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{loan.financials.interestRate}%</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Tenure</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{loan.financials.termMonths} months</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">EMI Amount</p>
                        <p className="text-2xl font-bold text-primary-600">₹{loan.financials.emiAmount.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Borrower Info */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-5">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-4">Borrower Details</h4>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-lg font-bold text-primary-600">
                        {loan.borrower.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">{loan.borrower.name}</p>
                        <p className="text-sm text-slate-500">{loan.borrower.email}</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Credit Score</p>
                        <p className="text-xl font-bold text-emerald-600">{loan.borrower.creditScore}</p>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                    Approval Notes (Optional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes for this approval..."
                    className="w-full h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            {/* Final Confirmation */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Ready for Approval</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    You are about to approve loan <strong>{loan.referenceId}</strong> for <strong>₹{(loan.financials.principalAmount / 100000).toFixed(2)}L</strong>
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <p className="text-slate-500 mb-1">Borrower</p>
                    <p className="font-bold text-slate-900 dark:text-white">{loan.borrower.name}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <p className="text-slate-500 mb-1">Loan Type</p>
                    <p className="font-bold text-slate-900 dark:text-white">{loan.type}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <p className="text-slate-500 mb-1">Amount</p>
                    <p className="font-bold text-slate-900 dark:text-white">₹{(loan.financials.principalAmount / 100000).toFixed(2)}L</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <p className="text-slate-500 mb-1">EMI</p>
                    <p className="font-bold text-slate-900 dark:text-white">₹{loan.financials.emiAmount.toLocaleString()}/month</p>
                </div>
            </div>

            {/* Acknowledgement */}
            <label className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 cursor-pointer">
                <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-1"
                />
                <span className="text-sm text-amber-800 dark:text-amber-300">
                    I confirm that I have reviewed all verification checks and loan terms. I authorize this instant approval under my credentials.
                </span>
            </label>
        </div>
    );

    const footer = (
        <div className="flex items-center justify-between">
            {currentStep > 1 ? (
                <Button variant="ghost" onClick={handleBack}>Back</Button>
            ) : (
                <div />
            )}
            <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                {currentStep < 3 ? (
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        disabled={currentStep === 1 && !allRequiredPassed}
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleApprove}
                        disabled={!acknowledged}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                        Approve Now
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Instant Approval"
            subtitle="Approve loan immediately"
            steps={steps}
            currentStep={currentStep}
            onStepClick={(id) => setCurrentStep(Number(id))}
            contentTitle={steps.find(s => s.id === currentStep)?.label || ''}
            footer={footer}
        >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
        </WizardModal>
    );
}
