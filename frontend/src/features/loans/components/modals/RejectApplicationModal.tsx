/**
 * Reject Application Modal
 * Multi-reason rejection with templates and notification options
 */

import { useState } from 'react';
import { WizardModal } from '@/components/ui/WizardModal';
import { Button } from '@/components/ui/Button';
import { Loan } from '../../types';
import { cn } from '@/utils';
import {
    XCircle, FileText, Mail, MessageSquare,
    ChevronRight, Check
} from 'lucide-react';

interface RejectApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onReject: (reason: string, details: string, notifyChannels: string[]) => void;
}

const steps = [
    { id: 1, label: 'Reason', description: 'Select rejection reason' },
    { id: 2, label: 'Details', description: 'Add context' },
    { id: 3, label: 'Confirm', description: 'Review & submit' }
];

const rejectionReasons = [
    { id: 'credit_score', label: 'Low Credit Score', description: 'Credit score below minimum threshold', template: 'Your credit score does not meet our minimum requirements for this loan product.' },
    { id: 'income', label: 'Insufficient Income', description: 'Income verification failed', template: 'Based on our review, the income provided does not meet the requirements for the requested loan amount.' },
    { id: 'dti', label: 'High DTI Ratio', description: 'Debt-to-income ratio exceeded', template: 'Your debt-to-income ratio exceeds our maximum threshold for this loan product.' },
    { id: 'employment', label: 'Employment Issues', description: 'Employment verification failed', template: 'We were unable to verify your employment details as provided in the application.' },
    { id: 'documents', label: 'Incomplete Documents', description: 'Required documents missing', template: 'Your application is missing required documents that are necessary for loan approval.' },
    { id: 'collateral', label: 'Collateral Issues', description: 'Collateral valuation concerns', template: 'The collateral provided does not meet our valuation or legal requirements.' },
    { id: 'aml', label: 'AML/Compliance', description: 'Failed compliance checks', template: 'Your application did not pass our compliance and regulatory requirements.' },
    { id: 'fraud', label: 'Fraud Suspicion', description: 'Fraud indicators detected', template: 'We have identified concerns with the information provided in your application.' },
    { id: 'other', label: 'Other Reason', description: 'Specify custom reason', template: '' }
];

export function RejectApplicationModal({ isOpen, onClose, loan, onReject }: RejectApplicationModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [notifyChannels, setNotifyChannels] = useState<string[]>(['email']);
    const [acknowledged, setAcknowledged] = useState(false);

    const selectedReasonObj = rejectionReasons.find(r => r.id === selectedReason);

    const toggleChannel = (channel: string) => {
        setNotifyChannels(prev =>
            prev.includes(channel)
                ? prev.filter(c => c !== channel)
                : [...prev, channel]
        );
    };

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

    const handleReject = () => {
        const reason = selectedReason === 'other' ? customReason : selectedReasonObj?.label || '';
        const details = additionalDetails || selectedReasonObj?.template || '';
        onReject(reason, details, notifyChannels);
        onClose();
    };

    const renderStep1 = () => (
        <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Select the primary reason for rejecting this loan application
            </p>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {rejectionReasons.map((reason) => (
                    <button
                        key={reason.id}
                        onClick={() => setSelectedReason(reason.id)}
                        className={cn(
                            "w-full p-4 border text-left transition-all flex items-start gap-4",
                            selectedReason === reason.id
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : "border-slate-200 dark:border-white/10 hover:border-slate-300"
                        )}
                    >
                        <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5",
                            selectedReason === reason.id
                                ? "border-red-500 bg-red-500"
                                : "border-slate-300"
                        )}>
                            {selectedReason === reason.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                            <h4 className={cn(
                                "font-bold",
                                selectedReason === reason.id ? "text-red-700 dark:text-red-400" : "text-slate-900 dark:text-white"
                            )}>
                                {reason.label}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1">{reason.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Custom reason input */}
            {selectedReason === 'other' && (
                <div className="mt-4">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                        Custom Reason
                    </label>
                    <input
                        type="text"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                </div>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            {/* Selected Reason Display */}
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-[10px] uppercase font-bold text-red-600 tracking-widest mb-1">Rejection Reason</p>
                <p className="font-bold text-red-700 dark:text-red-400">
                    {selectedReason === 'other' ? customReason : selectedReasonObj?.label}
                </p>
            </div>

            {/* Message Template */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                    Rejection Message
                </label>
                <textarea
                    value={additionalDetails || selectedReasonObj?.template || ''}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Enter rejection message..."
                    className="w-full h-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">This message will be included in the rejection notification</p>
            </div>

            {/* Notification Channels */}
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">
                    Notify Borrower Via
                </label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => toggleChannel('email')}
                        className={cn(
                            "p-4 border text-center transition-all",
                            notifyChannels.includes('email')
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-slate-200 dark:border-white/10"
                        )}
                    >
                        <Mail className={cn(
                            "w-6 h-6 mx-auto mb-2",
                            notifyChannels.includes('email') ? "text-primary-600" : "text-slate-400"
                        )} />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</p>
                    </button>
                    <button
                        onClick={() => toggleChannel('sms')}
                        className={cn(
                            "p-4 border text-center transition-all",
                            notifyChannels.includes('sms')
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-slate-200 dark:border-white/10"
                        )}
                    >
                        <MessageSquare className={cn(
                            "w-6 h-6 mx-auto mb-2",
                            notifyChannels.includes('sms') ? "text-primary-600" : "text-slate-400"
                        )} />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">SMS</p>
                    </button>
                    <button
                        onClick={() => toggleChannel('letter')}
                        className={cn(
                            "p-4 border text-center transition-all",
                            notifyChannels.includes('letter')
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-slate-200 dark:border-white/10"
                        )}
                    >
                        <FileText className={cn(
                            "w-6 h-6 mx-auto mb-2",
                            notifyChannels.includes('letter') ? "text-primary-600" : "text-slate-400"
                        )} />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Letter</p>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            {/* Warning Banner */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center">
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Confirm Rejection</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    You are about to reject loan application <strong>{loan.referenceId}</strong>
                </p>
            </div>

            {/* Summary */}
            <div className="space-y-3">
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Applicant</span>
                    <span className="font-bold text-slate-900 dark:text-white">{loan.borrower.name}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Loan Amount</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{(loan.financials.principalAmount / 100000).toFixed(2)}L</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Rejection Reason</span>
                    <span className="font-bold text-red-600">{selectedReason === 'other' ? customReason : selectedReasonObj?.label}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Notification</span>
                    <span className="font-bold text-slate-900 dark:text-white">{notifyChannels.join(', ').toUpperCase()}</span>
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
                    I confirm that I have reviewed the application and the rejection is in accordance with our lending policies. This action will be logged in the audit trail.
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
                        disabled={!selectedReason || (selectedReason === 'other' && !customReason)}
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="danger"
                        onClick={handleReject}
                        disabled={!acknowledged}
                        leftIcon={<XCircle className="w-4 h-4" />}
                    >
                        Reject Application
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Reject Application"
            subtitle="Decline loan request"
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
