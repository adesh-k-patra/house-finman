/**
 * Add Payment Modal
 * Record loan payments with allocation preview
 */

import { useState } from 'react';
import { WizardModal } from '@/components/ui/WizardModal';
import { Button } from '@/components/ui/Button';
import { Loan } from '../../types';
import { cn, formatCurrency } from '@/utils';
import {
    CreditCard, Wallet, Building2, Smartphone, Upload, CheckCircle2,
    ChevronRight, FileText
} from 'lucide-react';

interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onSubmit: (payment: PaymentData) => void;
}

interface PaymentData {
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    transactionId: string;
    allocationPriority: string;
    notes: string;
}

const steps = [
    { id: 1, label: 'Amount', description: 'Enter payment details' },
    { id: 2, label: 'Method', description: 'Select payment method' },
    { id: 3, label: 'Review', description: 'Confirm payment' }
];

const paymentMethods = [
    { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2, description: 'NEFT/RTGS/IMPS' },
    { id: 'upi', label: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, etc.' },
    { id: 'cheque', label: 'Cheque', icon: FileText, description: 'Bank cheque deposit' },
    { id: 'cash', label: 'Cash', icon: Wallet, description: 'Cash deposit at branch' },
    { id: 'card', label: 'Card', icon: CreditCard, description: 'Debit/Credit card' },
    { id: 'nach', label: 'NACH/ECS', icon: Building2, description: 'Auto-debit mandate' },
];

export function AddPaymentModal({ isOpen, onClose, loan, onSubmit }: AddPaymentModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [amount, setAmount] = useState(loan.financials.emiAmount.toString());
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [transactionId, setTransactionId] = useState('');
    const [allocationPriority, setAllocationPriority] = useState('standard');
    const [notes, setNotes] = useState('');
    const [proofFile, setProofFile] = useState<File | null>(null);

    const parsedAmount = parseFloat(amount) || 0;
    const emiAmount = loan.financials.emiAmount;
    const outstandingPrincipal = loan.financials.outstandingBalance || loan.financials.principalAmount;

    // Calculate allocation preview
    const calculateAllocation = () => {
        if (allocationPriority === 'standard') {
            const interestComponent = Math.min(parsedAmount, emiAmount * 0.35);
            const principalComponent = parsedAmount - interestComponent;
            return {
                interest: interestComponent,
                principal: Math.max(0, principalComponent),
                penalty: 0,
                fees: 0
            };
        } else if (allocationPriority === 'principal_first') {
            return {
                interest: 0,
                principal: parsedAmount,
                penalty: 0,
                fees: 0
            };
        }
        return { interest: parsedAmount * 0.35, principal: parsedAmount * 0.65, penalty: 0, fees: 0 };
    };

    const allocation = calculateAllocation();

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

    const handleSubmit = () => {
        onSubmit({
            amount: parsedAmount,
            paymentDate,
            paymentMethod,
            transactionId,
            allocationPriority,
            notes
        });
        onClose();
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            {/* Outstanding Info */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">EMI Amount</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(emiAmount)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Outstanding</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(outstandingPrincipal)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Due Date</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{loan.financials.nextDueDate || '15th'}</p>
                </div>
            </div>

            {/* Amount Input */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                    Payment Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-lg font-bold focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => setAmount(emiAmount.toString())}
                        className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-200"
                    >
                        1 EMI
                    </button>
                    <button
                        onClick={() => setAmount((emiAmount * 2).toString())}
                        className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-200"
                    >
                        2 EMIs
                    </button>
                    <button
                        onClick={() => setAmount(outstandingPrincipal.toString())}
                        className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-200"
                    >
                        Full Settlement
                    </button>
                </div>
            </div>

            {/* Payment Date */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                    Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
            </div>

            {/* Allocation Priority */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">
                    Allocation Priority
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setAllocationPriority('standard')}
                        className={cn(
                            "p-4 border text-left transition-all",
                            allocationPriority === 'standard'
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-slate-200 dark:border-white/10"
                        )}
                    >
                        <h4 className="font-bold text-slate-900 dark:text-white">Standard</h4>
                        <p className="text-xs text-slate-500 mt-1">Interest → Principal → Fees</p>
                    </button>
                    <button
                        onClick={() => setAllocationPriority('principal_first')}
                        className={cn(
                            "p-4 border text-left transition-all",
                            allocationPriority === 'principal_first'
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-slate-200 dark:border-white/10"
                        )}
                    >
                        <h4 className="font-bold text-slate-900 dark:text-white">Principal First</h4>
                        <p className="text-xs text-slate-500 mt-1">Principal → Interest → Fees</p>
                    </button>
                </div>
            </div>

            {/* Allocation Preview */}
            {parsedAmount > 0 && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest mb-3">Allocation Preview</h4>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(allocation.principal)}</p>
                            <p className="text-xs text-slate-500">Principal</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(allocation.interest)}</p>
                            <p className="text-xs text-slate-500">Interest</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(allocation.penalty)}</p>
                            <p className="text-xs text-slate-500">Penalty</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(allocation.fees)}</p>
                            <p className="text-xs text-slate-500">Fees</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            {/* Payment Method Selection */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">
                    Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={cn(
                                "p-4 border text-center transition-all",
                                paymentMethod === method.id
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                    : "border-slate-200 dark:border-white/10 hover:border-slate-300"
                            )}
                        >
                            <method.icon className={cn(
                                "w-6 h-6 mx-auto mb-2",
                                paymentMethod === method.id ? "text-primary-600" : "text-slate-400"
                            )} />
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{method.label}</p>
                            <p className="text-xs text-slate-500 mt-1">{method.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Transaction ID */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                    Transaction ID / Reference Number
                </label>
                <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction reference..."
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
            </div>

            {/* Payment Proof Upload */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                    Payment Proof (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-white/10 p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Supports PDF, JPG, PNG (Max 5MB)
                    </p>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        className="hidden"
                    />
                </div>
                {proofFile && (
                    <p className="text-sm text-emerald-600 mt-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {proofFile.name}
                    </p>
                )}
            </div>

            {/* Notes */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                    Notes (Optional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes..."
                    className="w-full h-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            {/* Summary Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Payment Summary</h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(parsedAmount)}</p>
            </div>

            {/* Details */}
            <div className="space-y-3">
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Borrower</span>
                    <span className="font-bold text-slate-900 dark:text-white">{loan.borrower.name}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Loan Reference</span>
                    <span className="font-bold text-slate-900 dark:text-white">{loan.referenceId}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Payment Date</span>
                    <span className="font-bold text-slate-900 dark:text-white">{new Date(paymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Payment Method</span>
                    <span className="font-bold text-slate-900 dark:text-white">{paymentMethods.find(m => m.id === paymentMethod)?.label}</span>
                </div>
                {transactionId && (
                    <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                        <span className="text-slate-500">Transaction ID</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{transactionId}</span>
                    </div>
                )}
            </div>

            {/* Allocation */}
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <h4 className="text-[10px] uppercase font-bold text-primary-600 tracking-widest mb-3">Amount Allocation</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Principal</span>
                        <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(allocation.principal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Interest</span>
                        <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(allocation.interest)}</span>
                    </div>
                </div>
            </div>
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
                        disabled={currentStep === 1 && parsedAmount <= 0}
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                        Record Payment
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Payment"
            subtitle="Record loan payment"
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
